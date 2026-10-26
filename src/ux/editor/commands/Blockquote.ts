/**
 * @fileoverview Module `src/ux/editor/commands/Blockquote.ts` providing blockquote definitions and implementation.
 * @zh 模块文件 `src/ux/editor/commands/Blockquote.ts`，提供Blockquote相关的定义与实现。
 */

import type { NodeType } from 'prosemirror-model';
import type { EditorState, Transaction, Command } from 'prosemirror-state';
import { lift, wrapIn } from 'prosemirror-commands';
import { isNodeActive } from '../helpers/isNodeActive';
import { ToggleCommand } from './types';

/**
 * Class `Blockqote` encapsulating blockqote data structures and logic in `src/ux/editor/commands`.
 * @zh 类 `Blockqote`，封装 `src/ux/editor/commands` 中的Blockqote数据结构与处理逻辑。
 */
class Blockqote implements ToggleCommand {
  /**
   * Executes `toggle` to handle toggle.
   * @zh 执行 `toggle`，用于开关。
   * @returns Result of type `Command` / 类型为 `Command` 的返回值
   */
  toggle(): Command {
    return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
      const { schema } = state;

      const type: NodeType = schema.nodes['blockquote'];
      if (!type) {
        return false;
      }

      if (this.isActive(state)) {
        return lift(state, dispatch);
      }

      return wrapIn(type)(state, dispatch);
    };
  }

  /**
   * Executes `isActive` to handle is active.
   * @zh 执行 `isActive`，用于是否为激活。
   * @param state - state parameter (`EditorState`) / 状态参数（`EditorState`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isActive(state: EditorState): boolean {
    const { schema } = state;

    const type: NodeType = schema.nodes['blockquote'];
    if (!type) {
      return false;
    }

    return isNodeActive(state, type);
  }

  /**
   * Executes `canExecute` to handle can execute.
   * @zh 执行 `canExecute`，用于是否可以执行。
   * @param state - state parameter (`EditorState`) / 状态参数（`EditorState`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  canExecute(state: EditorState): boolean {
    return this.toggle()(state);
  }
}

export default Blockqote;
