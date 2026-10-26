/**
 * @fileoverview Module `src/ux/editor/helpers/getSelectionNodes.ts` providing get selection nodes definitions and implementation.
 * @zh 模块文件 `src/ux/editor/helpers/getSelectionNodes.ts`，提供获取Selection节点列表相关的定义与实现。
 */

import { EditorState } from 'prosemirror-state';
import { Node } from 'prosemirror-model';

/**
 * Constant/variable `getSelectionNodes` defining get selection nodes in `src/ux/editor/helpers`.
 * @zh 常量/变量 `getSelectionNodes`，定义 `src/ux/editor/helpers` 中的获取Selection节点列表。
 */
export const getSelectionNodes = (state: EditorState): Node[] => {
  const nodes: Node[] = [];
  const { selection: { from, to } } = state;
  state.doc.nodesBetween(from, to, (node) => {
    nodes.push(node);
  });
  return nodes;
};

export default getSelectionNodes;
