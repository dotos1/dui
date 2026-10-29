/**
 * @fileoverview Module `src/ux/editor/helpers/isNodeActive.ts` providing is node active definitions and implementation.
 * @zh 模块文件 `src/ux/editor/helpers/isNodeActive.ts`，提供是否为节点激活相关的定义与实现。
 */

import { EditorState } from 'prosemirror-state';
import { NodeType, ResolvedPos, Attrs } from 'prosemirror-model';

/**
 * Constant/variable `findNodeType` defining find node type in `src/ux/editor/helpers`.
 * @zh 常量/变量 `findNodeType`，定义 `src/ux/editor/helpers` 中的查找节点类型。
 */
const findNodeType = (type: NodeType, $from: ResolvedPos): NodeType | null => {
  for (let i = $from.depth; i > 0; i -= 1) {
    if ($from.node(i).type === type) {
      return $from.node(i).type;
    }
  }
  return null;
};

/**
 * Constant/variable `isNodeActive` defining is node active in `src/ux/editor/helpers`.
 * @zh 常量/变量 `isNodeActive`，定义 `src/ux/editor/helpers` 中的是否为节点激活。
 */
export const isNodeActive = (state: EditorState, type: NodeType, attrs: Attrs = {}): boolean => {
  const { selection } = state;
  const { $from, to } = selection;
  const node: NodeType | null = findNodeType(type, $from);
  if (!Object.entries(attrs).length || !node) {
    return Boolean(node);
  }
  return to <= $from.end() && $from.parent.hasMarkup(type, attrs);
};

export default isNodeActive;
