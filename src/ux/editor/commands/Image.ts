/**
 * @fileoverview Module `src/ux/editor/commands/Image.ts` providing image definitions and implementation.
 * @zh 模块文件 `src/ux/editor/commands/Image.ts`，提供图像相关的定义与实现。
 */

import { type EditorState, NodeSelection, type Command } from 'prosemirror-state';

import { Dispatch } from './types';

/**
 * Interface `ImageAttrs` defining the contract and properties for image attrs.
 * @zh 接口 `ImageAttrs`，定义图像属性集合的数据结构契约与属性规范。
 */
export interface ImageAttrs {
  /**
   * Property `alt` (`string`) storing alt.
   * @zh 属性 `alt`（类型：`string`），用于存储或配置alt。
   */
  alt?: string;
  /**
   * Property `title` (`string`) storing title.
   * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
   */
  title?: string;
  /**
   * Property `width` (`string`) storing width.
   * @zh 属性 `width`（类型：`string`），用于存储或配置宽度。
   */
  width?: string;
}

/**
 * Class `Image` encapsulating image data structures and logic in `src/ux/editor/commands`.
 * @zh 类 `Image`，封装 `src/ux/editor/commands` 中的图像数据结构与处理逻辑。
 */
class Image {
  /**
   * Executes `insert` to handle insert.
   * @zh 执行 `insert`，用于插入。
   * @param src - src parameter (`string`) / 源路径参数（`string`）
   * @param attrs - attrs parameter (`ImageAttrs`) / 属性集合参数（`ImageAttrs`）
   * @returns Result of type `Command` / 类型为 `Command` 的返回值
   */
  insert(src: string, attrs: ImageAttrs): Command {
    return (state: EditorState, dispatch?: Dispatch): boolean => {
      const { schema, tr, selection } = state;

      const type = schema.nodes['image'];
      if (!type) {
        return false;
      }

      const imageAttrs = {
        width: null,
        src,
        ...attrs,
      };

      if (!imageAttrs.width && selection instanceof NodeSelection && selection.node.type === type) {
        imageAttrs.width = selection.node.attrs['width'];
      }

      tr.replaceSelectionWith(type.createAndFill(imageAttrs));

      const resolvedPos = tr.doc.resolve(
        tr.selection.anchor - tr.selection.$anchor.nodeBefore.nodeSize,
      );

      tr
        .setSelection(new NodeSelection(resolvedPos))
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
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isActive(state: EditorState): boolean {
    const { selection } = state;
    if (selection instanceof NodeSelection) {
      return selection.node.type.name === 'image';
    }
    return false;
  }
}

export default Image;
