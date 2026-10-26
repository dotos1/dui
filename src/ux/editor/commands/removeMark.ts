/**
 * @fileoverview Module `src/ux/editor/commands/removeMark.ts` providing remove mark definitions and implementation.
 * @zh 模块文件 `src/ux/editor/commands/removeMark.ts`，提供移除标记相关的定义与实现。
 */

import { MarkType } from 'prosemirror-model';
import { EditorState, TextSelection, Transaction, type Command } from 'prosemirror-state';
import { markApplies } from '../helpers/markApplies';

/**
 * Constant/variable `removeMark` defining remove mark in `src/ux/editor/commands`.
 * @zh 常量/变量 `removeMark`，定义 `src/ux/editor/commands` 中的移除标记。
 */
export const removeMark = (type: MarkType): Command => {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { tr, selection, storedMarks, doc } = state;
    const { empty, ranges } = selection;

    if (empty && selection instanceof TextSelection) {
      const { $cursor } = selection;

      if (!$cursor || !markApplies(state.doc, ranges, type)) {
        return false;
      }

      if (type.isInSet(storedMarks || $cursor.marks())) {
        tr.removeStoredMark(type);
        dispatch?.(tr);
        return true;
      }
    } else {
      for (const range of ranges) {
        const { $from, $to } = range;
        const hasMark = doc.rangeHasMark($from.pos, $to.pos, type);

        if (hasMark) {
          tr.removeMark($from.pos, $to.pos, type);
        }
      }

      if (!tr.docChanged) {
        return false;
      }

      dispatch?.(tr.scrollIntoView());
    }

    return false;
  };
};
