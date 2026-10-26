/**
 * @fileoverview Module `src/ux/editor/commands/HorizontalRule.ts` providing horizontal rule definitions and implementation.
 * @zh 模块文件 `src/ux/editor/commands/HorizontalRule.ts`，提供水平规则相关的定义与实现。
 */

import type { NodeType } from 'prosemirror-model';
import type { EditorState, Transaction, Command } from 'prosemirror-state';
import { canInsert } from '../helpers/canInsertNode';
import { InsertCommand } from './types';

/**
 * Class `HorizontalRule` encapsulating horizontal rule data structures and logic in `src/ux/editor/commands`.
 * @zh 类 `HorizontalRule`，封装 `src/ux/editor/commands` 中的水平规则数据结构与处理逻辑。
 */
class HorizontalRule implements InsertCommand {
  /**
   * Executes `insert` to handle insert.
   * @zh 执行 `insert`，用于插入。
   * @returns Result of type `Command` / 类型为 `Command` 的返回值
   */
  insert(): Command {
    return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
      const { schema, tr } = state;

      const type: NodeType = schema.nodes['horizontal_rule'];

      if (!type) {
        return false;
      }

      dispatch(tr.replaceSelectionWith(type.create()).scrollIntoView());
      return true;
    };
  }

  /**
   * Executes `canExecute` to handle can execute.
   * @zh 执行 `canExecute`，用于是否可以执行。
   * @param state - state parameter (`EditorState`) / 状态参数（`EditorState`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  canExecute(state: EditorState): boolean {
    return canInsert(state, state.schema.nodes['horizontal_rule']);
  }
}

export default HorizontalRule;
