/**
 * @fileoverview Module `src/ux/editor/schema/marks.ts` providing marks definitions and implementation.
 * @zh 模块文件 `src/ux/editor/schema/marks.ts`，提供标记相关的定义与实现。
 */

import { DOMOutputSpec, Mark, MarkSpec } from 'prosemirror-model';


/**
 * Constant/variable `sanitizeLinkHref` defining sanitize link href in `src/ux/editor/schema`.
 * @zh 常量/变量 `sanitizeLinkHref`，定义 `src/ux/editor/schema` 中的sanitize链接Href。
 */
const sanitizeLinkHref = (href: string | null | undefined): string | null => {
  if (!href) {
    return null;
  }
  const trimmed = String(href).trim();
  if (/^\s*(javascript|data|vbscript):/i.test(trimmed)) {
    return '#';
  }
  return trimmed;
};

/**
 * Constant/variable `link` defining link in `src/ux/editor/schema`.
 * @zh 常量/变量 `link`，定义 `src/ux/editor/schema` 中的链接。
 */
const link: MarkSpec = {
  attrs: {
    href: {},
    title: { default: null },
    target: { default: '_blank' },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]',
      //@ts-ignore
      getAttrs(dom: HTMLElement) {
        return {
          href: sanitizeLinkHref(dom.getAttribute('href')),
          title: dom.getAttribute('title'),
          target: dom.getAttribute('target'),
        };
      },
    },
  ],
  toDOM(node): DOMOutputSpec {
    const { href, title, target } = node.attrs;
    return ['a', { href: sanitizeLinkHref(href), title, target }, 0];
  },
};

// :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
// Has parse rules that also match `<i>` and `font-style: italic`.
/**
 * Constant/variable `em` defining em in `src/ux/editor/schema`.
 * @zh 常量/变量 `em`，定义 `src/ux/editor/schema` 中的em。
 */
const em: MarkSpec = {
  parseDOM: [
    { tag: 'i' },
    { tag: 'em' },
    { style: 'font-style=italic' },
  ],
  toDOM(): DOMOutputSpec {
    return ['em', 0];
  },
};

// :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
// also match `<b>` and `font-weight: bold`.
/**
 * Constant/variable `strong` defining strong in `src/ux/editor/schema`.
 * @zh 常量/变量 `strong`，定义 `src/ux/editor/schema` 中的strong。
 */
const strong: MarkSpec = {
  parseDOM: [
    { tag: 'strong' },
    // This works around a Google Docs misbehavior where
    // pasted content will be inexplicably wrapped in `<b>`
    // tags with a font-weight normal.
    {
      tag: 'b',
      //@ts-ignore
      getAttrs: (dom: HTMLElement) => {
        return dom.style.fontWeight !== 'normal' && null;
      },
    },
    {
      style: 'font-weight',
      //@ts-ignore
      getAttrs: (value: string) => {
        return (/^(?:bold(?:er)?|[5-9]\d{2,})$/).test(value) && null;
      },
    },
  ],
  toDOM(): DOMOutputSpec {
    return ['strong', 0];
  },
};

// :: MarkSpec Code font mark. Represented as a `<code>` element.
/**
 * Constant/variable `code` defining code in `src/ux/editor/schema`.
 * @zh 常量/变量 `code`，定义 `src/ux/editor/schema` 中的编码。
 */
const code: MarkSpec = {
  parseDOM: [
    { tag: 'code' },
  ],
  toDOM(): DOMOutputSpec {
    return ['code', 0];
  },
};

// :: MarkSpec An underline mark. Rendered as an `<u>` element.
// Has parse rules that also match `text-decoration: underline`.
/**
 * Constant/variable `u` defining u in `src/ux/editor/schema`.
 * @zh 常量/变量 `u`，定义 `src/ux/editor/schema` 中的u。
 */
const u: MarkSpec = {
  parseDOM: [
    { tag: 'u' },
    {
      style: 'text-decoration=underline',
      consuming: false,
    },
  ],
  toDOM(): DOMOutputSpec {
    return ['u', 0];
  },
};

// :: MarkSpec An underline mark. Rendered as an `<s>` element.
// Has parse rules that also match `strike`, `del` tag and css property `text-decoration: line-through`.
/**
 * Constant/variable `s` defining s in `src/ux/editor/schema`.
 * @zh 常量/变量 `s`，定义 `src/ux/editor/schema` 中的s。
 */
const s: MarkSpec = {
  parseDOM: [
    { tag: 's' },
    { tag: 'strike' },
    { style: 'text-decoration=line-through' },
  ],
  toDOM(): DOMOutputSpec {
    return ['s', 0];
  },
};

/**
 * Constant/variable `textColor` defining text color in `src/ux/editor/schema`.
 * @zh 常量/变量 `textColor`，定义 `src/ux/editor/schema` 中的文本颜色。
 */
const textColor: MarkSpec = {
  attrs: {
    color: {
      default: null,
    },
  },
  parseDOM: [
    {
      style: 'color',
      //@ts-ignore
      getAttrs: (value: string) => {
        return { color: value };
      },
    },
  ],
  toDOM(mark: Mark): DOMOutputSpec {
    const { color } = mark.attrs;
    return ['span', { style: `color:${color};` }, 0];
  },
};

/**
 * Constant/variable `textBackgroundColor` defining text background color in `src/ux/editor/schema`.
 * @zh 常量/变量 `textBackgroundColor`，定义 `src/ux/editor/schema` 中的文本背景颜色。
 */
const textBackgroundColor: MarkSpec = {
  attrs: {
    backgroundColor: {
      default: null,
    },
  },
  parseDOM: [
    {
      style: 'background-color',
      //@ts-ignore
      getAttrs: (value: string) => {
        return { backgroundColor: value };
      },
    },
  ],
  toDOM(mark: Mark): DOMOutputSpec {
    const { backgroundColor } = mark.attrs;
    return ['span', { style: `background-color:${backgroundColor};` }, 0];
  },
};

/**
 * Constant/variable `marks` defining marks in `src/ux/editor/schema`.
 * @zh 常量/变量 `marks`，定义 `src/ux/editor/schema` 中的标记。
 */
export const marks = {
  link,
  em,
  strong,
  code,
  u,
  s,
  text_color: textColor,
  text_background_color: textBackgroundColor,
};

