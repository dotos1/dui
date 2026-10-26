/**
 * @fileoverview Module `src/ux/editor/commands/removeLink.ts` providing remove link definitions and implementation.
 * @zh 模块文件 `src/ux/editor/commands/removeLink.ts`，提供移除链接相关的定义与实现。
 */

import { EditorState, Transaction, type Command } from 'prosemirror-state';

/**
 * Constant/variable `removeLink` defining remove link in `src/ux/editor/commands`.
 * @zh 常量/变量 `removeLink`，定义 `src/ux/editor/commands` 中的移除链接。
 */
export const removeLink = (): Command => {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { doc, selection, tr } = state;
    const { $head: { pos }, from, to } = selection;
    if (from === to) {
      const $pos = doc.resolve(pos);
      const linkStart = pos - $pos.textOffset;
      const linkEnd = linkStart + $pos.parent.child($pos.index()).nodeSize;

      tr.removeMark(linkStart, linkEnd);
    } else {
      tr.removeMark(from, to);
    }

    if (!tr.docChanged) {
      return false;
    }

    dispatch?.(tr);
    return true;
  };
};

export default removeLink;
