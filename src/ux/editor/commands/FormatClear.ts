/**
 * @fileoverview Module `src/ux/editor/commands/FormatClear.ts` providing format clear definitions and implementation.
 * @zh 模块文件 `src/ux/editor/commands/FormatClear.ts`，提供格式化清空相关的定义与实现。
 */

import type { EditorState, Transaction, Command } from 'prosemirror-state';
import { InsertCommand } from './types';

/**
 * Constant/variable `SAFE_MARKS` defining safe marks in `src/ux/editor/commands`.
 * @zh 常量/变量 `SAFE_MARKS`，定义 `src/ux/editor/commands` 中的安全标记。
 */
const SAFE_MARKS = ['link'];

/**
 * Class `FormatClear` encapsulating format clear data structures and logic in `src/ux/editor/commands`.
 * @zh 类 `FormatClear`，封装 `src/ux/editor/commands` 中的格式化清空数据结构与处理逻辑。
 */
class FormatClear implements InsertCommand {
  /**
   * Executes `insert` to handle insert.
   * @zh 执行 `insert`，用于插入。
   * @returns Result of type `Command` / 类型为 `Command` 的返回值
   */
  insert(): Command {
    return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
      const { tr } = state;
      const { ranges, empty } = tr.selection;

      if (empty) {
        return true;
      }

      Object.entries(state.schema.marks).forEach(([markType, mark]) => {
        if (SAFE_MARKS.includes(markType)) {
          return;
        }

        ranges.forEach((range) => {
          tr.removeMark(range.$from.pos, range.$to.pos, mark as never);
        });
      });

      dispatch(tr);
      return true;
    };
  }

  /**
   * Executes `canExecute` to handle can execute.
   * @zh 执行 `canExecute`，用于是否可以执行。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  canExecute(): boolean {
    return true;
  }
}

export default FormatClear;
