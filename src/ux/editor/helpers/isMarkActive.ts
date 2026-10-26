/**
 * @fileoverview Module `src/ux/editor/helpers/isMarkActive.ts` providing is mark active definitions and implementation.
 * @zh 模块文件 `src/ux/editor/helpers/isMarkActive.ts`，提供是否为标记激活相关的定义与实现。
 */

import { EditorState } from 'prosemirror-state';
import { MarkType } from 'prosemirror-model';

/**
 * Constant/variable `isMarkActive` defining is mark active in `src/ux/editor/helpers`.
 * @zh 常量/变量 `isMarkActive`，定义 `src/ux/editor/helpers` 中的是否为标记激活。
 */
export const isMarkActive = (state: EditorState, type: MarkType): boolean => {
  const { from, $from, to, empty } = state.selection;
  if (empty) {
    return Boolean(type.isInSet(state.storedMarks || $from.marks()));
  }
  return state.doc.rangeHasMark(from, to, type);
};

export default isMarkActive;
