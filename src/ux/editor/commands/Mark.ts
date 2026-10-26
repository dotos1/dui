/**
 * @fileoverview Module `src/ux/editor/commands/Mark.ts` providing mark definitions and implementation.
 * @zh 模块文件 `src/ux/editor/commands/Mark.ts`，提供标记相关的定义与实现。
 */

import type { MarkType } from 'prosemirror-model';
import type { EditorState, Transaction, Command } from 'prosemirror-state';
import { toggleMark } from 'prosemirror-commands';
import { isMarkActive } from '../helpers/isMarkActive';
import { applyMark } from './applyMark';
import { ToggleCommand } from './types';

/**
 * Class `Mark` encapsulating mark data structures and logic in `src/ux/editor/commands`.
 * @zh 类 `Mark`，封装 `src/ux/editor/commands` 中的标记数据结构与处理逻辑。
 */
class Mark implements ToggleCommand {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;

  /**
   * Creates an instance of `Mark` and initializes its dependencies and internal state.
   * @zh 创建 `Mark` 实例，并初始化其依赖项与内部状态。
   * @param name - Injected or initial name (`string`) / 注入或传入的名称（`string`）
   */
  constructor(name: string) {
    this.name = name;
  }

  /**
   * Executes `apply` to handle apply.
   * @zh 执行 `apply`，用于应用。
   * @returns Result of type `Command` / 类型为 `Command` 的返回值
   */
  apply(): Command {
    return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
      const { schema } = state;

      const type: MarkType = schema.marks[this.name];
      if (!type) {
        return false;
      }

      return applyMark(type)(state, dispatch);
    };
  }

  /**
   * Executes `toggle` to handle toggle.
   * @zh 执行 `toggle`，用于开关。
   * @returns Result of type `Command` / 类型为 `Command` 的返回值
   */
  toggle(): Command {
    return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
      const { schema } = state;

      const type: MarkType = schema.marks[this.name];
      if (!type) {
        return false;
      }

      return toggleMark(type)(state, dispatch);
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

    const type: MarkType = schema.marks[this.name];

    if (!type) {
      return false;
    }

    return isMarkActive(state, type);
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

export default Mark;
