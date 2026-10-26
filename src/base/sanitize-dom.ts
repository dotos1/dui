/**
 * @fileoverview Module `src/base/sanitize-dom.ts` providing sanitize dom definitions and implementation.
 * @zh 模块文件 `src/base/sanitize-dom.ts`，提供sanitizeDOM节点相关的定义与实现。
 */

/*
 * HTML / SVG 片段的 DOM 级净化 —— `SanitizeHtmlPipe`(idos Jupyter 的 markdown 与
 * 输出都走它)和 inline-svg 的 `SVGCacheService` 共用。
 *
 * b8c5e5c 复核:那次提交用正则改字符串,两个毛病:
 *   1. 误伤正文。`\son\w+\s*=` 不知道自己在标签里还是在文本里,
 *      `set onset = 5 ms` 被删成 `set ms`;属性值里出现 ` onx=` 也会被切开,
 *      剩下半截引号把后面的属性全吞掉。
 *   2. 拦不全。`java\tscript:`、`&#106;avascript:`、`<svg><set attributeName=href
 *      to="javascript:…">` 都能绕过去;SVG 那边又是先 innerHTML 再净化,
 *      插进活文档那一刻 `<img onerror>` 已经执行了。
 * 所以改成:在 DOMParser 解析出来的**惰性文档**里改 DOM(不执行脚本、不加载
 * 资源),属性值已经过实体解码,比较的是浏览器最终会用的那个值。
 *
 * 这不是 DOMPurify 那样的白名单净化器,只拦下面列出的几类;style 属性与
 * <style> 元素按约定保留(Jupyter 的 DataFrame 输出、图标配色都靠它)。
 */

/**
 * Constant/variable `FORBIDDEN_TAGS` defining forbidden tags in `src/base`.
 * 整个删除的元素(连同子树)。
 * @zh 整个删除的元素(连同子树)。
 */
const FORBIDDEN_TAGS = [
  'script', 'iframe', 'object', 'embed',
  // 惰性文档按「脚本关闭」解析 noscript/noembed/noframes,里面当标记;插回活文档
  // (脚本开启)时它们的内容按原始文本解析 —— 两次解析结果不同,
  // `<noscript><p title="</noscript><img onerror=…>">` 就是这样复活的(mXSS)。
  'noscript', 'noembed', 'noframes',
];

/**
 * 图标 SVG 里额外删除的元素。foreignObject 可以嵌任意 HTML,图标用不到。
 * @zh 图标 SVG 里额外删除的元素。foreignObject 可以嵌任意 HTML,图标用不到。
 */
const SVG_FORBIDDEN_TAGS = ['foreignObject'];

/**
 * 值会被当成 URL 打开 / 提交的属性。
 * @zh 值会被当成 URL 打开 / 提交的属性。
 */
const URL_ATTRS = ['href', 'src', 'xlink:href', 'action', 'formaction'];

/**
 * 能在运行时改写别的属性的 SVG 动画元素。
 * @zh 能在运行时改写别的属性的 SVG 动画元素。
 */
const SVG_ANIMATION_TAGS = ['animate', 'set', 'animatemotion', 'animatetransform'];

// 浏览器解析 URL 前会剔掉的空白与控制字符:`java\tscript:`、`\u0001javascript:`
// 在浏览器眼里都是 javascript:。
// eslint-disable-next-line no-control-regex
/**
 * Constant/variable `URL_IGNORED_CHARS` defining url ignored chars in `src/base`.
 * @zh 常量/变量 `URL_IGNORED_CHARS`，定义 `src/base` 中的链接地址已忽略字符。
 */
const URL_IGNORED_CHARS = /[\u0000-\u0020\u007f-\u00a0\u1680\u180e\u2000-\u200f\u2028\u2029\u205f\u3000\ufeff]/g;

/**
 * 去掉空白与控制字符后,是否是 `javascript:` / `vbscript:` 这类可执行的 URL。
 * @zh 去掉空白与控制字符后,是否是 `javascript:` / `vbscript:` 这类可执行的 URL。
 */
export function isScriptUrl(value: string | null | undefined): boolean {
  if (value == null) {
    return false;
  }
  const v = String(value).replace(URL_IGNORED_CHARS, '').toLowerCase();
  return v.startsWith('javascript:') || v.startsWith('vbscript:');
}

/**
 * Executes `removeAll` to handle remove all.
 * @zh 执行 `removeAll`，用于移除全部。
 * @param root - root parameter (`ParentNode`) / 根节点参数（`ParentNode`）
 * @param selector - selector parameter (`string`) / 选择器参数（`string`）
 */
function removeAll(root: ParentNode, selector: string) {
  const found = root.querySelectorAll(selector);
  for (let i = 0; i < found.length; i++) {
    found[i].parentNode?.removeChild(found[i]);
  }
}

/**
 * Executes `cleanAttributes` to handle clean attributes.
 * @zh 执行 `cleanAttributes`，用于clean属性列表。
 * @param el - el parameter (`Element`) / DOM元素参数（`Element`）
 */
function cleanAttributes(el: Element) {
  const names: string[] = [];
  for (let i = 0; i < el.attributes.length; i++) {
    names.push(el.attributes[i].name);
  }
  for (const name of names) {
    const lower = name.toLowerCase();
    if (lower.startsWith('on')) {
      el.removeAttribute(name);
    } else if (URL_ATTRS.indexOf(lower) > -1 && isScriptUrl(el.getAttribute(name))) {
      el.removeAttribute(name);
    }
  }
}

/**
 * 在 root(元素、文档或 DocumentFragment)上就地净化。
 * template 的内容在单独的 DocumentFragment 里,querySelectorAll 看不到,递归进去。

 * @zh 在 root(元素、文档或 DocumentFragment)上就地净化。
 */
export function sanitizeDomTree(root: Element | Document | DocumentFragment, svg = false): void {
  const tags = svg ? FORBIDDEN_TAGS.concat(SVG_FORBIDDEN_TAGS) : FORBIDDEN_TAGS;
  for (const tag of tags) {
    removeAll(root, tag);
  }
  // HTML 里不删 foreignObject:mermaid 这类图的文字标签靠它;它里面的内容照样
  // 被下面逐个元素检查。内嵌在 HTML 里的 <svg> 动画元素也照样检查。
  const all: Element[] = Array.from(root.querySelectorAll('*'));
  if ((root as Element).attributes) {
    all.unshift(root as Element);
  }
  for (const el of all) {
    const local = (el.localName || '').toLowerCase();
    if (SVG_ANIMATION_TAGS.indexOf(local) > -1) {
      // <set attributeName="href" to="javascript:…"> 在点击时改写链接,静态属性检查看不到。
      const target = (el.getAttribute('attributeName') || '').replace(URL_IGNORED_CHARS, '').toLowerCase();
      if (target === 'href' || target === 'xlink:href') {
        el.parentNode?.removeChild(el);
        continue;
      }
    }
    cleanAttributes(el);
    if (local === 'template' && (el as HTMLTemplateElement).content) {
      sanitizeDomTree((el as HTMLTemplateElement).content, svg);
    }
  }
}

/**
 * 净化一段 HTML 字符串,返回净化后的 HTML。
 * 前面补一个 `<body>`:否则开头的 <style>/<meta>/<link> 会被解析器放进 <head>,
 * 序列化 body.innerHTML 时就丢了。

 * @zh 净化一段 HTML 字符串,返回净化后的 HTML。
 */
export function sanitizeHtmlString(html: string): string {
  if (html == null || html === '') {
    return '';
  }
  const doc = new DOMParser().parseFromString('<body>' + String(html), 'text/html');
  sanitizeDomTree(doc.body);
  return doc.body.innerHTML;
}

/**
 * Constant/variable `SVG_NS` defining svg ns in `src/base`.
 * @zh 常量/变量 `SVG_NS`，定义 `src/base` 中的SVG矢量图NS。
 */
const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * 把 SVG 文本解析成净化过的 <svg> 元素(已导入当前 document,可直接插入)。
 * 先按 image/svg+xml 严格解析;不是良构 XML,或根元素不在 SVG 命名空间
 * (缺 xmlns 的片段)时,退回到 text/html 解析 —— 原来的 innerHTML 写法对这两种
 * 都宽容,图标库里有这样的文件。两种解析都在惰性文档里进行。

 * @zh 把 SVG 文本解析成净化过的 <svg> 元素(已导入当前 document,可直接插入)。
 */
export function parseSanitizedSvg(str: string, targetDoc: Document = document): SVGElement | null {
  const parser = new DOMParser();
  let svg: Element | null = null;
  const xml = parser.parseFromString(String(str ?? ''), 'image/svg+xml');
  const rootEl = xml.documentElement;
  if (rootEl && rootEl.namespaceURI === SVG_NS && rootEl.localName === 'svg'
    && xml.getElementsByTagName('parsererror').length === 0) {
    svg = rootEl;
  } else {
    const html = parser.parseFromString('<body>' + String(str ?? ''), 'text/html');
    svg = html.body.querySelector('svg');
  }
  if (!svg) {
    return null;
  }
  sanitizeDomTree(svg, true);
  return targetDoc.importNode(svg, true) as unknown as SVGElement;
}
