/**
 * @fileoverview Module `src/ux/editor/helpers/canInsertNode.ts` providing can insert node definitions and implementation.
 * @zh 模块文件 `src/ux/editor/helpers/canInsertNode.ts`，提供是否可以插入节点相关的定义与实现。
 */

import type { EditorState } from 'prosemirror-state';
import type { NodeType } from 'prosemirror-model';

/**
 * Constant/variable `canInsert` defining can insert in `src/ux/editor/helpers`.
 * @zh 常量/变量 `canInsert`，定义 `src/ux/editor/helpers` 中的是否可以插入。
 */
export const canInsert = (state: EditorState, nodeType: NodeType) => {
  const { $from } = state.selection;
  for (let d = $from.depth; d >= 0; d -= 1) {
    const index = $from.index(d);
    if ($from.node(d).canReplaceWith(index, index, nodeType)) {
      return true;
    }
  }

  return false;
};

export default canInsert;
