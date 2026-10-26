/**
 * @fileoverview Module `src/ux/command-palette/model/command-item.ts` providing command item definitions and implementation.
 * @zh 模块文件 `src/ux/command-palette/model/command-item.ts`，提供命令条目相关的定义与实现。
 */

/**
 * Type alias `CommandItem` representing command item (`{ readonly text: string; readonly iconClass?: string; readonly callbac...`).
 * @zh 类型别名 `CommandItem`，表示命令条目（`{ readonly text: string; readonly iconClass?: string; readonly callbac...`）。
 */
export type CommandItem = {
  /**
   * Property `text` (`string`) storing text.
   * @zh 属性 `text`（类型：`string`），用于存储或配置文本。
   */
  readonly text: string;
  /**
   * Property `iconClass` (`string`) storing icon class.
   * @zh 属性 `iconClass`（类型：`string`），用于存储或配置图标类名。
   */
  readonly iconClass?: string;
  /**
   * Property `callback` (`() => void`) storing callback.
   * @zh 属性 `callback`（类型：`() => void`），用于存储或配置回调函数。
   */
  readonly callback?: () => void;
  /**
   * Property `href` (`string`) storing href.
   * @zh 属性 `href`（类型：`string`），用于存储或配置href。
   */
  readonly href?: string;
};
