/**
 * @fileoverview Module `src/ux/editor/commands/applyMark.ts` providing apply mark definitions and implementation.
 * @zh 模块文件 `src/ux/editor/commands/applyMark.ts`，提供应用标记相关的定义与实现。
 */

import { MarkType, Attrs } from 'prosemirror-model';
import { EditorState, TextSelection, Transaction, type Command } from 'prosemirror-state';
import { markApplies } from '../helpers/markApplies';

/**
 * Constant/variable `applyMark` defining apply mark in `src/ux/editor/commands`.
 * @zh 常量/变量 `applyMark`，定义 `src/ux/editor/commands` 中的应用标记。
 */
export const applyMark = (type: MarkType, attrs: Attrs = {}): Command => {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { tr, selection } = state;
    const { empty, ranges, $from, $to } = selection;

    if (empty && selection instanceof TextSelection) {
      const { $cursor } = selection;

      if (!$cursor || !markApplies(state.doc, ranges, type)) {
        return false;
      }

      tr.addStoredMark(type.create(attrs));
      if (!tr.storedMarksSet) {
        return false;
      }

      dispatch?.(tr);
    } else {
      tr.addMark($from.pos, $to.pos, type.create(attrs));

      if (!tr.docChanged) {
        return false;
      }

      dispatch?.(tr.scrollIntoView());
    }

    return true;
  };
};
