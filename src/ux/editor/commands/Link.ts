/**
 * @fileoverview Module `src/ux/editor/commands/Link.ts` providing link definitions and implementation.
 * @zh 模块文件 `src/ux/editor/commands/Link.ts`，提供链接相关的定义与实现。
 */

import type { MarkType } from 'prosemirror-model';
import type { EditorState, Command } from 'prosemirror-state';
import { toggleMark } from 'prosemirror-commands';
import { isMarkActive } from '../helpers/isMarkActive';
import { removeLink } from './removeLink';
import type { Dispatch } from './types';

/**
 * Constant/variable `defaultOptions` defining default options in `src/ux/editor/commands`.
 * @zh 常量/变量 `defaultOptions`，定义 `src/ux/editor/commands` 中的默认配置选项。
 */
const defaultOptions = {
  strict: true,
};

/**
 * Interface `LinkAttrs` defining the contract and properties for link attrs.
 * @zh 接口 `LinkAttrs`，定义链接属性集合的数据结构契约与属性规范。
 */
export interface LinkAttrs {
  /**
   * Property `href` (`string`) storing href.
   * @zh 属性 `href`（类型：`string`），用于存储或配置href。
   */
  href: string;
  /**
   * Property `title` (`string`) storing title.
   * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
   */
  title?: string;
  /**
   * Property `target` (`string`) storing target.
   * @zh 属性 `target`（类型：`string`），用于存储或配置目标。
   */
  target?: string;
}

/**
 * Class `Link` encapsulating link data structures and logic in `src/ux/editor/commands`.
 * @zh 类 `Link`，封装 `src/ux/editor/commands` 中的链接数据结构与处理逻辑。
 */
class Link {
  /**
   * Executes `update` to handle update.
   * @zh 执行 `update`，用于更新。
   * @param attrs - attrs parameter (`LinkAttrs`) / 属性集合参数（`LinkAttrs`）
   * @returns Result of type `Command` / 类型为 `Command` 的返回值
   */
  update(attrs: LinkAttrs): Command {
    return (state: EditorState, dispatch?: Dispatch): boolean => {
      const { schema, selection } = state;

      const type: MarkType = schema.marks['link'];
      if (!type) {
        return false;
      }

      if (selection.empty) {
        return false;
      }

      return toggleMark(type, attrs)(state, dispatch);
    };
  }

  /**
   * Executes `insert` to handle insert.
   * @zh 执行 `insert`，用于插入。
   * @param text - text parameter (`string`) / 文本参数（`string`）
   * @param attrs - attrs parameter (`LinkAttrs`) / 属性集合参数（`LinkAttrs`）
   * @returns Result of type `Command` / 类型为 `Command` 的返回值
   */
  insert(text: string, attrs: LinkAttrs): Command {
    return (state: EditorState, dispatch?: Dispatch): boolean => {
      const { schema, tr } = state;

      const type: MarkType = schema.marks['link'];
      if (!type) {
        return false;
      }

      const linkAttrs: LinkAttrs = {
        href: attrs.href,
        title: attrs.title ?? text,
        target: attrs.target ?? '_blank',
      };

      const node = schema.text(text, [schema.marks['link'].create(linkAttrs)]);

      tr.replaceSelectionWith(node, false)
        .scrollIntoView();

      if (tr.docChanged) {
        dispatch?.(tr);
        return true;
      }

      return false;
    };
  }

  /**
   * Executes `isActive` to handle is active.
   * @zh 执行 `isActive`，用于是否为激活。
   * @param state - state parameter (`EditorState`) / 状态参数（`EditorState`）
   * @param options - options parameter (`{ strict: boolean; }`) / 配置选项参数（`{ strict: boolean; }`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isActive(state: EditorState, options = defaultOptions): boolean {
    if (options.strict) {
      return true;
    }

    const { schema } = state;
    const type = schema.marks['link'];

    if (!type) {
      return false;
    }

    return isMarkActive(state, type);
  }

  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   * @param state - state parameter (`EditorState`) / 状态参数（`EditorState`）
   * @param dispatch - dispatch parameter (`Dispatch`) / 派发参数（`Dispatch`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  remove(state: EditorState, dispatch?: Dispatch): boolean {
    return removeLink()(state, dispatch);
  }

  /**
   * Executes `canExecute` to handle can execute.
   * @zh 执行 `canExecute`，用于是否可以执行。
   * @param state - state parameter (`EditorState`) / 状态参数（`EditorState`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  canExecute(state: EditorState): boolean {
    const testAttrs: LinkAttrs = {
      href: '',
    };

    return this.insert('Exec', testAttrs)(state) || this.update(testAttrs)(state);
  }
}

export default Link;
