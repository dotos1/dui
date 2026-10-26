/**
 * @fileoverview Module `src/ux/command-palette/model/command-item-group.ts` providing command item group definitions and implementation.
 * @zh 模块文件 `src/ux/command-palette/model/command-item-group.ts`，提供命令条目分组相关的定义与实现。
 */

import { CommandItem } from './command-item';

/**
 * Type alias `CommandItemGroup` representing command item group (`{ readonly title?: string; readonly items: CommandItem[]; }`).
 * @zh 类型别名 `CommandItemGroup`，表示命令条目分组（`{ readonly title?: string; readonly items: CommandItem[]; }`）。
 */
export type CommandItemGroup = {
  /**
   * Property `title` (`string`) storing title.
   * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
   */
  readonly title?: string;
  /**
   * Property `items` (`CommandItem[]`) storing items.
   * @zh 属性 `items`（类型：`CommandItem[]`），用于存储或配置条目列表。
   */
  readonly items: CommandItem[];
};
