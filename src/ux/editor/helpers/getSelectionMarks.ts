/**
 * @fileoverview Module `src/ux/editor/helpers/getSelectionMarks.ts` providing get selection marks definitions and implementation.
 * @zh 模块文件 `src/ux/editor/helpers/getSelectionMarks.ts`，提供获取Selection标记相关的定义与实现。
 */

import { EditorState } from 'prosemirror-state';
import { Mark } from 'prosemirror-model';

/**
 * Constant/variable `getSelectionMarks` defining get selection marks in `src/ux/editor/helpers`.
 * @zh 常量/变量 `getSelectionMarks`，定义 `src/ux/editor/helpers` 中的获取Selection标记。
 */
export const getSelectionMarks = (state: EditorState): readonly Mark[] => {
  let marks: readonly Mark[] = [];
  const { selection, storedMarks } = state;
  const { from, to, empty, $from } = selection;
  if (empty) {
    marks = storedMarks || $from.marks();
  } else {
    state.doc.nodesBetween(from, to, (node) => {
      marks = [...marks, ...node.marks];
    });
  }
  return marks;
};

export default getSelectionMarks;
