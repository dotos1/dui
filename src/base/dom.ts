/**
 * DOM 工具。
 *
 * <p>自研,替代 EJ2 衍生的那份(264 行)。见 duix 的
 * `lib/PEEL-CLEANUP-PLAN.md` §P6。
 *
 * <p>只保留全仓库真正被 import 的七个:`createElement` / `addClass` /
 * `removeClass` / `closest` / `attributes` / `classList` / `setStyleAttribute`。
 * 旧那份还有 `select` / `selectAll` / `detach` / `remove` / `append` /
 * `prepend` / `siblings` / `isVisible` / `matches` / `getAttributeOrDefault` …
 * —— 逐个按 import 路径 grep 过,<b>全部零使用者</b>,不重建。
 */

const SVG_REG = /^svg|^path|^g/;

/**
 * 建元素。
 *
 * <p>`svg` / `path` / `g` 走 `createElementNS` —— 用 `createElement` 建出来的
 * SVG 标签在文档里是 HTMLUnknownElement,不渲染。这条判断是旧实现的,保留。
 */
export function createElement(
  tagName: string,
  properties?: { id?: string; className?: string; innerHTML?: string; styles?: string; attrs?: { [key: string]: string } },
): HTMLElement {
  const element: Element = SVG_REG.test(tagName)
    ? document.createElementNS('http://www.w3.org/2000/svg', tagName)
    : document.createElement(tagName);

  if (properties === undefined) { return element as HTMLElement; }

  // 旧实现无条件写一次 innerHTML(没给就写空串),照做 —— 有调用方靠它清空。
  element.innerHTML = properties.innerHTML ? properties.innerHTML : '';
  if (properties.className !== undefined) { element.className = properties.className; }
  if (properties.id !== undefined) { element.id = properties.id; }
  if (properties.styles !== undefined) { element.setAttribute('style', properties.styles); }
  if (properties.attrs !== undefined) { attributes(element, properties.attrs); }
  return element as HTMLElement;
}

function 类名表(classes: string | string[]): string[] {
  return (typeof classes === 'string' ? classes.split(' ') : classes).filter((c) => !!c);
}

export function addClass(elements: Element[] | NodeList, classes: string | string[]): Element[] | NodeList {
  const list = 类名表(classes);
  for (const ele of elements as Element[]) {
    for (const c of list) { ele.classList.add(c); }
  }
  return elements;
}

export function removeClass(elements: Element[] | NodeList, classes: string | string[]): Element[] | NodeList {
  const list = 类名表(classes);
  for (const ele of elements as Element[]) {
    for (const c of list) { ele.classList.remove(c); }
  }
  return elements;
}

/** 一次加一批、去一批。 */
export function classList(element: Element, addClasses: string[], removeClasses: string[]): void {
  addClass([element], addClasses);
  removeClass([element], removeClasses);
}

export function attributes(element: Element | Node, attrs: { [key: string]: string }): Element {
  const ele = element as Element;
  for (const key of Object.keys(attrs)) { ele.setAttribute(key, attrs[key]); }
  return ele;
}

/**
 * 往上找最近的匹配祖先(含自身)。
 *
 * <p>旧实现还带一段 `Element.closest` 不存在时的手写回退 ——
 * 那是给 IE 用的。Angular 18 不支持 IE,直接用原生。
 */
export function closest(element: Element | Node, selector: string): Element | null {
  const el = element as Element;
  return el && typeof el.closest === 'function' ? el.closest(selector) : null;
}

/** 逐键写 `style`。键是 JS 的驼峰写法(`backgroundColor`),不是 CSS 属性名。 */
export function setStyleAttribute(element: HTMLElement, attrs?: { [key: string]: unknown }): void {
  if (attrs === undefined) { return; }
  for (const key of Object.keys(attrs)) {
    (element.style as unknown as Record<string, unknown>)[key] = attrs[key];
  }
}
