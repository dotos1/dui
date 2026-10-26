/**
 * @fileoverview Module `src/ux/editor/schema/nodes.ts` providing nodes definitions and implementation.
 * @zh 模块文件 `src/ux/editor/schema/nodes.ts`，提供节点列表相关的定义与实现。
 */

import { DOMOutputSpec, Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';
import * as sl from 'prosemirror-schema-list';
import toStyleString from '../utils/toStyleString';

/**
 * Constant/variable `doc` defining doc in `src/ux/editor/schema`.
 * @zh 常量/变量 `doc`，定义 `src/ux/editor/schema` 中的文档。
 */
const doc: NodeSpec = {
  content: 'block+',
};

// :: NodeSpec The text node.
/**
 * Constant/variable `text` defining text in `src/ux/editor/schema`.
 * @zh 常量/变量 `text`，定义 `src/ux/editor/schema` 中的文本。
 */
const text: NodeSpec = {
  group: 'inline',
};

// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.
/**
 * Constant/variable `paragraph` defining paragraph in `src/ux/editor/schema`.
 * @zh 常量/变量 `paragraph`，定义 `src/ux/editor/schema` 中的paragraph。
 */
const paragraph: NodeSpec = {
  content: 'inline*',
  group: 'block',
  attrs: {
    align: {
      default: null,
    },
  },
  parseDOM: [
    {
      tag: 'p',
        //@ts-ignore
      getAttrs(dom: HTMLElement) {
        const { textAlign } = dom.style;
        const align = dom.getAttribute('align') || textAlign || null;

        return {
          align,
        };
      },
    },
  ],
  toDOM(node): DOMOutputSpec {
    const { align } = node.attrs;

    const styles: Partial<CSSStyleDeclaration> = {
      textAlign: align !== 'left' ? align : null,
    };
    const style = toStyleString(styles) || null;
    return ['p', { style }, 0];
  },
};

// :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
/**
 * Constant/variable `blockquote` defining blockquote in `src/ux/editor/schema`.
 * @zh 常量/变量 `blockquote`，定义 `src/ux/editor/schema` 中的blockquote。
 */
const blockquote: NodeSpec = {
  content: 'block+',
  group: 'block',
  defining: true,
  parseDOM: [{ tag: 'blockquote' }],
  toDOM(): DOMOutputSpec {
    return ['blockquote', 0];
  },
};

// :: NodeSpec A horizontal rule (`<hr>`).
/**
 * Constant/variable `horizontalRule` defining horizontal rule in `src/ux/editor/schema`.
 * @zh 常量/变量 `horizontalRule`，定义 `src/ux/editor/schema` 中的水平规则。
 */
const horizontalRule: NodeSpec = {
  group: 'block',
  parseDOM: [{ tag: 'hr' }],
  toDOM(): DOMOutputSpec {
    return ['hr'];
  },
};

// :: NodeSpec A heading textblock, with a `level` attribute that
// should hold the number 1 to 6. Parsed and serialized as `<h1>` to
// `<h6>` elements.
/**
 * Constant/variable `heading` defining heading in `src/ux/editor/schema`.
 * @zh 常量/变量 `heading`，定义 `src/ux/editor/schema` 中的heading。
 */
const heading: NodeSpec = {
  attrs: {
    level: {
      default: 1,
    },
    align: {
      default: null,
    },
  },
  content: 'inline*',
  group: 'block',
  defining: true,
  parseDOM: [
    {
      tag: 'h1',
        //@ts-ignore
      getAttrs(dom: HTMLElement) {
        const { textAlign } = dom.style;
        const align = dom.getAttribute('align') || textAlign || null;
        return {
          level: 1,
          align,
        };
      },
    },
    {
      tag: 'h2',
        //@ts-ignore
      getAttrs(dom: HTMLElement) {
        const { textAlign } = dom.style;
        const align = dom.getAttribute('align') || textAlign || null;
        return {
          level: 2,
          align,
        };
      },
    },
    {
      tag: 'h3',
        //@ts-ignore
      getAttrs(dom: HTMLElement) {
        const { textAlign } = dom.style;
        const align = dom.getAttribute('align') || textAlign || null;
        return {
          level: 3,
          align,
        };
      },
    },
    {
      tag: 'h4',
        //@ts-ignore
      getAttrs(dom: HTMLElement) {
        const { textAlign } = dom.style;
        const align = dom.getAttribute('align') || textAlign || null;
        return {
          level: 4,
          align,
        };
      },
    },
    {
      tag: 'h5',
        //@ts-ignore
      getAttrs(dom: HTMLElement) {
        const { textAlign } = dom.style;
        const align = dom.getAttribute('align') || textAlign || null;
        return {
          level: 5,
          align,
        };
      },
    },
    {
      tag: 'h6',
        //@ts-ignore
      getAttrs(dom: HTMLElement) {
        const { textAlign } = dom.style;
        const align = dom.getAttribute('align') || textAlign || null;
        return {
          level: 6,
          align,
        };
      },
    },
  ],
  toDOM(node): DOMOutputSpec {
    const { level, align } = node.attrs;

    const styles: Partial<CSSStyleDeclaration> = {
      textAlign: align !== 'left' ? align : null,
    };
    const style = toStyleString(styles) || null;

    return [`h${level}`, { style }, 0];
  },
};

// :: NodeSpec A code listing. Disallows marks or non-text inline
// nodes by default. Represented as a `<pre>` element with a
// `<code>` element inside of it.
/**
 * Constant/variable `codeBlock` defining code block in `src/ux/editor/schema`.
 * @zh 常量/变量 `codeBlock`，定义 `src/ux/editor/schema` 中的编码块。
 */
const codeBlock: NodeSpec = {
  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,
  parseDOM: [
    {
      tag: 'pre',
      preserveWhitespace: 'full',
    },
  ],
  toDOM(): DOMOutputSpec {
    return ['pre', ['code', 0]];
  },
};

// :: NodeSpec A hard line break, represented in the DOM as `<br>`.
/**
 * Constant/variable `hardBreak` defining hard break in `src/ux/editor/schema`.
 * @zh 常量/变量 `hardBreak`，定义 `src/ux/editor/schema` 中的hardBreak。
 */
const hardBreak: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  parseDOM: [{ tag: 'br' }],
  toDOM(): DOMOutputSpec {
    return ['br'];
  },
};

// :: NodeSpec An inline image (`<img>`) node. Supports `src`,
// `alt`, and `href` attributes. The latter two default to the empty
// string.
/**
 * Constant/variable `image` defining image in `src/ux/editor/schema`.
 * @zh 常量/变量 `image`，定义 `src/ux/editor/schema` 中的图像。
 */
export const image: NodeSpec = {
  inline: true,
  attrs: {
    src: {},
    alt: { default: null },
    title: { default: null },
    width: { default: null },
  },
  group: 'inline',
  draggable: true,
  parseDOM: [
    {
      tag: 'img[src]',
      //@ts-ignore
      getAttrs(dom: HTMLElement) {
        return {
          src: dom.getAttribute('src'),
          title: dom.getAttribute('title'),
          alt: dom.getAttribute('alt'),
          width: dom.getAttribute('width'),
        };
      },
    },
  ],
  toDOM(node: ProseMirrorNode): DOMOutputSpec {
    const { src, alt, title, width } = node.attrs;
    return ['img', { src, alt, title, width }];
  },
};

/**
 * Constant/variable `listItem` defining list item in `src/ux/editor/schema`.
 * @zh 常量/变量 `listItem`，定义 `src/ux/editor/schema` 中的列表条目。
 */
const listItem = {
  ...sl.listItem,
  content: 'paragraph block*',
};

/**
 * Constant/variable `orderedList` defining ordered list in `src/ux/editor/schema`.
 * @zh 常量/变量 `orderedList`，定义 `src/ux/editor/schema` 中的已顺序列表。
 */
const orderedList = {
  ...sl.orderedList,
  content: 'list_item+',
  group: 'block',
};

/**
 * Constant/variable `bulletList` defining bullet list in `src/ux/editor/schema`.
 * @zh 常量/变量 `bulletList`，定义 `src/ux/editor/schema` 中的bullet列表。
 */
const bulletList = {
  ...sl.bulletList,
  content: 'list_item+',
  group: 'block',
};

/**
 * Constant/variable `nodes` defining nodes in `src/ux/editor/schema`.
 * @zh 常量/变量 `nodes`，定义 `src/ux/editor/schema` 中的节点列表。
 */
export const nodes = {
  doc,
  text,
  paragraph,
  blockquote,
  horizontal_rule: horizontalRule,
  heading,
  hard_break: hardBreak,
  code_block: codeBlock,
  image,
  list_item: listItem,
  ordered_list: orderedList,
  bullet_list: bulletList,
};

