/**
 * @fileoverview Module `src/ux/editor/parsers.ts` providing parsers definitions and implementation.
 * @zh 模块文件 `src/ux/editor/parsers.ts`，提供解析器相关的定义与实现。
 */

import { DOMSerializer, Schema, DOMParser, Node as ProseMirrorNode } from 'prosemirror-model';

import { schema as defaultSchema} from './schema';

/**
 * Constant/variable `emptyDoc` defining empty doc in `src/ux/editor`.
 * @zh 常量/变量 `emptyDoc`，定义 `src/ux/editor` 中的空文档。
 */
export const emptyDoc = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
    },
  ],
};

// https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
/**
 * Constant/variable `toHTML` defining to html in `src/ux/editor`.
 * @zh 常量/变量 `toHTML`，定义 `src/ux/editor` 中的转换为HTML内容。
 */
export const toHTML = (json, inputSchema?: Schema): string => {
  const schema = inputSchema ?? defaultSchema;

  const contentNode = schema.nodeFromJSON(json);
  const html = DOMSerializer.fromSchema(schema).serializeFragment(contentNode.content);

  const div = document.createElement('div');
  div.appendChild(html);
  return div.innerHTML;
};

/**
 * Constant/variable `toDoc` defining to doc in `src/ux/editor`.
 * @zh 常量/变量 `toDoc`，定义 `src/ux/editor` 中的转换为文档。
 */
export const toDoc = (html: string, inputSchema?: Schema) => {
  const schema = inputSchema ?? defaultSchema;

  const doc = new window.DOMParser().parseFromString(html ?? '', 'text/html');

  return DOMParser.fromSchema(schema).parse(doc.body).toJSON();
};

/**
 * Constant/variable `parseContent` defining parse content in `src/ux/editor`.
 * @zh 常量/变量 `parseContent`，定义 `src/ux/editor` 中的解析内容。
 */
export const parseContent = (value, schema: Schema): ProseMirrorNode => {
  if (!value) {
    return schema.nodeFromJSON(emptyDoc);
  }

  if (typeof value !== 'string') {
    return schema.nodeFromJSON(value);
  }

  const docJson = toDoc(value, schema);
  return schema.nodeFromJSON(docJson);
};
