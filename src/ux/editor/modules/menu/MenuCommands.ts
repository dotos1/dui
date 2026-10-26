/**
 * @fileoverview Module `src/ux/editor/modules/menu/MenuCommands.ts` providing menu commands definitions and implementation.
 * @zh 模块文件 `src/ux/editor/modules/menu/MenuCommands.ts`，提供菜单命令相关的定义与实现。
 */

import * as Commands from '../../commands';

import { InsertCommand, ToggleCommand } from '../../commands/types';

/**
 * Constant/variable `ToggleCommands` defining toggle commands in `src/ux/editor/modules/menu`.
 * @zh 常量/变量 `ToggleCommands`，定义 `src/ux/editor/modules/menu` 中的开关命令。
 */
export const ToggleCommands: Record<string, ToggleCommand> = {
  bold: Commands.STRONG,
  italic: Commands.EM,
  code: Commands.CODE,
  underline: Commands.UNDERLINE,
  strike: Commands.STRIKE,
  blockquote: Commands.BLOCKQUOTE,
  bullet_list: Commands.UL,
  ordered_list: Commands.OL,
  h1: Commands.H1,
  h2: Commands.H2,
  h3: Commands.H3,
  h4: Commands.H4,
  h5: Commands.H5,
  h6: Commands.H6,
  align_left: Commands.ALIGN_LEFT,
  align_center: Commands.ALIGN_CENTER,
  align_right: Commands.ALIGN_RIGHT,
  align_justify: Commands.ALIGN_JUSTIFY,
};

/**
 * Constant/variable `InsertCommands` defining insert commands in `src/ux/editor/modules/menu`.
 * @zh 常量/变量 `InsertCommands`，定义 `src/ux/editor/modules/menu` 中的插入命令。
 */
export const InsertCommands: Record<string, InsertCommand> = {
  horizontal_rule: Commands.HORIZONTAL_RULE,
  format_clear: Commands.FORMAT_CLEAR,
};

/**
 * Constant/variable `Link` defining link in `src/ux/editor/modules/menu`.
 * @zh 常量/变量 `Link`，定义 `src/ux/editor/modules/menu` 中的链接。
 */
export const Link = Commands.LINK;
/**
 * Constant/variable `Image` defining image in `src/ux/editor/modules/menu`.
 * @zh 常量/变量 `Image`，定义 `src/ux/editor/modules/menu` 中的图像。
 */
export const Image = Commands.IMAGE;
/**
 * Constant/variable `TextColor` defining text color in `src/ux/editor/modules/menu`.
 * @zh 常量/变量 `TextColor`，定义 `src/ux/editor/modules/menu` 中的文本颜色。
 */
export const TextColor = Commands.TEXT_COLOR;
/**
 * Constant/variable `TextBackgroundColor` defining text background color in `src/ux/editor/modules/menu`.
 * @zh 常量/变量 `TextBackgroundColor`，定义 `src/ux/editor/modules/menu` 中的文本背景颜色。
 */
export const TextBackgroundColor = Commands.TEXT_BACKGROUND_COLOR;
