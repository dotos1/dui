/**
 * @fileoverview Module `src/ux/editor/commands/Heading.ts` providing heading definitions and implementation.
 * @zh 模块文件 `src/ux/editor/commands/Heading.ts`，提供Heading相关的定义与实现。
 */

import type { NodeType, Node as ProseMirrorNode } from 'prosemirror-model';
import type { EditorState, Transaction, Command } from 'prosemirror-state';
import { setBlockType } from 'prosemirror-commands';
import { getSelectionNodes } from '../helpers/getSelectionNodes';
import { ToggleCommand } from './types';

/**
 * Type alias `HeadingLevels` representing heading levels (`1 | 2 | 3 | 4 | 5 | 6`).
 * @zh 类型别名 `HeadingLevels`，表示Heading层级（`1 | 2 | 3 | 4 | 5 | 6`）。
 */
export type HeadingLevels = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Class `Heading` encapsulating heading data structures and logic in `src/ux/editor/commands`.
 * @zh 类 `Heading`，封装 `src/ux/editor/commands` 中的Heading数据结构与处理逻辑。
 */
class Heading implements ToggleCommand {
  /**
   * Property `level` (`number`) storing level.
   * @zh 属性 `level`（类型：`number`），用于存储或配置层级。
   */
  level: number;

  /**
   * Creates an instance of `Heading` and initializes its dependencies and internal state.
   * @zh 创建 `Heading` 实例，并初始化其依赖项与内部状态。
   * @param level - Injected or initial level (`HeadingLevels`) / 注入或传入的层级（`HeadingLevels`）
   */
  constructor(level: HeadingLevels) {
    this.level = level;
  }

  /**
   * Executes `apply` to handle apply.
   * @zh 执行 `apply`，用于应用。
   * @returns Result of type `Command` / 类型为 `Command` 的返回值
   */
  apply(): Command {
    return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
      const { schema } = state;

      const type: NodeType = schema.nodes['heading'];
      if (!type) {
        return false;
      }

      return setBlockType(type)(state, dispatch);
    };
  }

  /**
   * Executes `toggle` to handle toggle.
   * @zh 执行 `toggle`，用于开关。
   * @returns Result of type `Command` / 类型为 `Command` 的返回值
   */
  toggle(): Command {
    return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
      const { schema, selection, doc } = state;

      const type: NodeType = schema.nodes['heading'];
      if (!type) {
        return false;
      }

      const nodePos = selection.$from.before(1);
      const node = doc.nodeAt(nodePos);

      const attrs = node?.attrs ?? {};

      if (this.isActive(state)) {
        return setBlockType(schema.nodes['paragraph'], attrs)(state, dispatch);
      }

      return setBlockType(type, { ...attrs, level: this.level })(state, dispatch);
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
    const nodesInSelection = getSelectionNodes(state);

    const type: NodeType = schema.nodes['heading'];
    if (!type) {
      return false;
    }

    const supportedNodes = [
      type,
      schema.nodes['text'],
      schema.nodes['blockquote'],
    ];

    const nodes = nodesInSelection.filter((node) => {
      return supportedNodes.includes(node.type);
    });

    const acitveNode = nodes.find((node: ProseMirrorNode) => {
      return node.attrs['level'] === this.level;
    });

    return Boolean(acitveNode);
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

export default Heading;
