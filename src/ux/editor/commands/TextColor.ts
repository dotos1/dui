/**
 * @fileoverview Module `src/ux/editor/commands/TextColor.ts` providing text color definitions and implementation.
 * @zh 模块文件 `src/ux/editor/commands/TextColor.ts`，提供文本颜色相关的定义与实现。
 */

import type { MarkType } from 'prosemirror-model';
import type { EditorState, Command } from 'prosemirror-state';
import { getSelectionMarks, isMarkActive } from '../helpers/public-api';
import { applyMark, removeMark } from '../commands/public-api';
import type { Dispatch } from './types';

/**
 * Type alias `Name` representing name (`'text_color' | 'text_background_color'`).
 * @zh 类型别名 `Name`，表示名称（`'text_color' | 'text_background_color'`）。
 */
type Name = 'text_color' | 'text_background_color';
/**
 * Type alias `AttrName` representing attr name (`'color' | 'backgroundColor'`).
 * @zh 类型别名 `AttrName`，表示特性名称（`'color' | 'backgroundColor'`）。
 */
type AttrName = 'color' | 'backgroundColor';

/**
 * Interface `ColorAttrs` defining the contract and properties for color attrs.
 * @zh 接口 `ColorAttrs`，定义颜色属性集合的数据结构契约与属性规范。
 */
interface ColorAttrs {
  /**
   * Property `color` (`string`) storing color.
   * @zh 属性 `color`（类型：`string`），用于存储或配置颜色。
   */
  color: string;
}

/**
 * Interface `BackgroundColorAttrs` defining the contract and properties for background color attrs.
 * @zh 接口 `BackgroundColorAttrs`，定义背景颜色属性集合的数据结构契约与属性规范。
 */
interface BackgroundColorAttrs {
  /**
   * Property `backgroundColor` (`string`) storing background color.
   * @zh 属性 `backgroundColor`（类型：`string`），用于存储或配置背景颜色。
   */
  backgroundColor: string;
}

/**
 * Class `TextColor` encapsulating text color data structures and logic in `src/ux/editor/commands`.
 * @zh 类 `TextColor`，封装 `src/ux/editor/commands` 中的文本颜色数据结构与处理逻辑。
 */
class TextColor {
  /**
   * Property `name` (`Name`) storing name.
   * @zh 属性 `name`（类型：`Name`），用于存储或配置名称。
   */
  name: Name;
  /**
   * Property `attrName` (`AttrName`) storing attr name.
   * @zh 属性 `attrName`（类型：`AttrName`），用于存储或配置特性名称。
   */
  attrName: AttrName;

  /**
   * Creates an instance of `TextColor` and initializes its dependencies and internal state.
   * @zh 创建 `TextColor` 实例，并初始化其依赖项与内部状态。
   * @param name - Injected or initial name (`Name`) / 注入或传入的名称（`Name`）
   * @param attrName - Injected or initial attr name (`AttrName`) / 注入或传入的特性名称（`AttrName`）
   */
  constructor(name: Name, attrName: AttrName = 'color') {
    this.name = name;
    this.attrName = attrName;
  }

  /**
   * Executes `apply` to handle apply.
   * @zh 执行 `apply`，用于应用。
   * @param attrs - attrs parameter (`ColorAttrs | BackgroundColorAttrs`) / 属性集合参数（`ColorAttrs | BackgroundColorAttrs`）
   * @returns Result of type `Command` / 类型为 `Command` 的返回值
   */
  apply(attrs: ColorAttrs | BackgroundColorAttrs): Command {
    return (state: EditorState, dispatch?: Dispatch): boolean => {
      const { schema, selection, doc } = state;

      const type: MarkType = schema.marks[this.name];
      if (!type) {
        return false;
      }

      const { from, to, empty } = selection;

      if (!empty && (from + 1 === to)) {
        const node = doc.nodeAt(from);
        if (node?.isAtom && !node.isText && node.isLeaf) {
          // An atomic node (e.g. Image) is selected.
          return false;
        }
      }

      return applyMark(type, attrs)(state, dispatch);
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
   * Executes `getActiveColors` to handle get active colors.
   * @zh 执行 `getActiveColors`，用于获取激活颜色列表。
   * @param state - state parameter (`EditorState`) / 状态参数（`EditorState`）
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  getActiveColors(state: EditorState): string[] {
    if (!this.isActive(state)) {
      return [];
    }

    const { schema } = state;
    const marks = getSelectionMarks(state);

    const colors = marks
      .filter((mark) => mark.type === schema.marks[this.name])
      .map((mark) => {
        return mark.attrs[this.attrName];
      })
      .filter(Boolean);

    return colors;
  }

  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   * @returns Result of type `Command` / 类型为 `Command` 的返回值
   */
  remove(): Command {
    return (state: EditorState, dispatch?: Dispatch): boolean => {
      const { schema } = state;

      const type = schema.marks[this.name];
      if (!type) {
        return false;
      }

      return removeMark(type)(state, dispatch);
    };
  }

  /**
   * Executes `canExecute` to handle can execute.
   * @zh 执行 `canExecute`，用于是否可以执行。
   * @param state - state parameter (`EditorState`) / 状态参数（`EditorState`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  canExecute(state: EditorState): boolean {
    const attrs = this.name === 'text_color' ? { color: '' } : { backgroundColor: '' };
    return this.apply(attrs)(state);
  }
}

export default TextColor;
