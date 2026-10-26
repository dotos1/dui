/**
 * @fileoverview Module `src/ux/editor/commands/types.ts` providing types definitions and implementation.
 * @zh 模块文件 `src/ux/editor/commands/types.ts`，提供类型列表相关的定义与实现。
 */

import type { EditorState, Transaction, Command } from 'prosemirror-state';

/**
 * Type alias `Dispatch` representing dispatch (`(tr: Transaction) => void | null`).
 * @zh 类型别名 `Dispatch`，表示派发（`(tr: Transaction) => void | null`）。
 */
export type Dispatch = (tr: Transaction) => void | null;

/**
 * Interface `BaseCommand` defining the contract and properties for base command.
 * @zh 接口 `BaseCommand`，定义基础命令的数据结构契约与属性规范。
 */
interface BaseCommand {
  /**
   * Property `canExecute` (`(state: EditorState) => boolean`) storing can execute.
   * @zh 属性 `canExecute`（类型：`(state: EditorState) => boolean`），用于存储或配置是否可以执行。
   */
  canExecute: (state: EditorState) => boolean;
}

/**
 * Interface `ToggleCommand` defining the contract and properties for toggle command.
 * @zh 接口 `ToggleCommand`，定义开关命令的数据结构契约与属性规范。
 */
export interface ToggleCommand extends BaseCommand {
  /**
   * Property `toggle` (`() => Command`) storing toggle.
   * @zh 属性 `toggle`（类型：`() => Command`），用于存储或配置开关。
   */
  toggle: () => Command;
  /**
   * Property `isActive` (`(state: EditorState) => boolean`) storing is active.
   * @zh 属性 `isActive`（类型：`(state: EditorState) => boolean`），用于存储或配置是否为激活。
   */
  isActive: (state: EditorState) => boolean;
}

/**
 * Interface `InsertCommand` defining the contract and properties for insert command.
 * @zh 接口 `InsertCommand`，定义插入命令的数据结构契约与属性规范。
 */
export interface InsertCommand extends BaseCommand {
  /**
   * Property `insert` (`() => Command`) storing insert.
   * @zh 属性 `insert`（类型：`() => Command`），用于存储或配置插入。
   */
  insert: () => Command;
}
