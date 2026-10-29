/**
 * @fileoverview Module `src/ux/editor/commands/ListItem.ts` providing list item definitions and implementation.
 * @zh 模块文件 `src/ux/editor/commands/ListItem.ts`，提供列表条目相关的定义与实现。
 */

import type { NodeType, Schema } from 'prosemirror-model';
import type { EditorState, Transaction, Command } from 'prosemirror-state';
import { liftListItem, wrapInList } from 'prosemirror-schema-list';
import { isNodeActive } from '../helpers/isNodeActive';
import { ToggleCommand } from './types';

/**
 * Class `ListItem` encapsulating list item data structures and logic in `src/ux/editor/commands`.
 * @zh 类 `ListItem`，封装 `src/ux/editor/commands` 中的列表条目数据结构与处理逻辑。
 */
class ListItem implements ToggleCommand {
  /**
   * Property `isBulletList` (`boolean`) storing is bullet list (default: `false`).
   * @zh 属性 `isBulletList`（类型：`boolean`），用于存储或配置是否为Bullet列表（默认值：`false`）。
   */
  isBulletList = false;

  /**
   * Creates an instance of `ListItem` and initializes its dependencies and internal state.
   * @zh 创建 `ListItem` 实例，并初始化其依赖项与内部状态。
   * @param isBulletList - Injected or initial is bullet list (`boolean`) / 注入或传入的是否为Bullet列表（`boolean`）
   */
  constructor(isBulletList = false) {
    this.isBulletList = isBulletList;
  }

  /**
   * Executes `getType` to handle get type.
   * @zh 执行 `getType`，用于获取类型。
   * @param schema - schema parameter (`Schema<any, any>`) / 结构定义参数（`Schema<any, any>`）
   * @returns Result of type `NodeType` / 类型为 `NodeType` 的返回值
   */
  getType(schema: Schema): NodeType {
    return this.isBulletList ? schema.nodes['bullet_list'] : schema.nodes['ordered_list'];
  }

  /**
   * Executes `toggle` to handle toggle.
   * @zh 执行 `toggle`，用于开关。
   * @returns Result of type `Command` / 类型为 `Command` 的返回值
   */
  toggle(): Command {
    return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
      const { schema } = state;

      const type = this.getType(schema);
      if (!type) {
        return false;
      }

      if (this.isActive(state)) {
        return liftListItem(schema.nodes['list_item'])(state, dispatch);
      }

      return wrapInList(type)(state, dispatch);
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

    const type = this.getType(schema);
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

export default ListItem;
