/**
 * @fileoverview Module `src/ux/editor/commands/TextAlign.ts` providing text align definitions and implementation.
 * @zh 模块文件 `src/ux/editor/commands/TextAlign.ts`，提供文本对齐相关的定义与实现。
 */

import type { EditorState, Transaction, Command } from 'prosemirror-state';
import type { Node } from 'prosemirror-model';
import { getSelectionNodes } from '../helpers/getSelectionNodes';
import { ToggleCommand } from './types';

/**
 * Type alias `Align` representing align (`'left' | 'center' | 'right' | 'justify'`).
 * @zh 类型别名 `Align`，表示对齐（`'left' | 'center' | 'right' | 'justify'`）。
 */
export type Align = 'left' | 'center' | 'right' | 'justify';

/**
 * Class `TextAlign` encapsulating text align data structures and logic in `src/ux/editor/commands`.
 * @zh 类 `TextAlign`，封装 `src/ux/editor/commands` 中的文本对齐数据结构与处理逻辑。
 */
class TextAlign implements ToggleCommand {
  /**
   * Property `align` (`string`) storing align.
   * @zh 属性 `align`（类型：`string`），用于存储或配置对齐。
   */
  align: string;

  /**
   * Creates an instance of `TextAlign` and initializes its dependencies and internal state.
   * @zh 创建 `TextAlign` 实例，并初始化其依赖项与内部状态。
   * @param align - Injected or initial align (`Align`) / 注入或传入的对齐（`Align`）
   */
  constructor(align: Align) {
    this.align = align;
  }

  /**
   * Executes `toggle` to handle toggle.
   * @zh 执行 `toggle`，用于开关。
   * @returns Result of type `Command` / 类型为 `Command` 的返回值
   */
  toggle(): Command {
    return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
      const { doc, selection, tr, schema } = state;
      const { from, to } = selection;

      let applicable = false;

      doc.nodesBetween(from, to, (node, pos) => {
        const nodeType = node.type;
        if ([schema.nodes['paragraph'], schema.nodes['heading']].includes(nodeType)) {
          applicable = true;
          tr.setNodeMarkup(pos, nodeType, { ...node.attrs, align: this.align });
        }
        return true;
      });

      if (!applicable) {
        return false;
      }

      if (tr.docChanged) {
        dispatch?.(tr);
      }

      return true;
    };
  }

  /**
   * Executes `isActive` to handle is active.
   * @zh 执行 `isActive`，用于是否为激活。
   * @param state - state parameter (`EditorState`) / 状态参数（`EditorState`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isActive(state: EditorState): boolean {
    const nodes = getSelectionNodes(state);

    const active = nodes.find((node: Node) => {
      return node.attrs['align'] === this.align;
    });

    return Boolean(active);
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

export default TextAlign;
