/**
 * @fileoverview Module `src/core/meta/models/page-title-positioning.ts` providing page title positioning definitions and implementation.
 * @zh 模块文件 `src/core/meta/models/page-title-positioning.ts`，提供页面标题位置相关的定义与实现。
 */

/**
 * Enumeration `PageTitlePositioning` defining supported page title positioning constants.
 * @zh 枚举 `PageTitlePositioning`，定义支持的页面标题位置常量集合。
 */
export enum PageTitlePositioning {
  /**
   * append page title after application name

   * @zh 枚举项 `PageTitlePositioning.AppendPageTitle` = 0，表示追加页面标题。
   */
  AppendPageTitle = 0,
  /**
   * prepend page title before application name

   * @zh 枚举项 `PageTitlePositioning.PrependPageTitle` = 10，表示前置添加页面标题。
   */
  PrependPageTitle = 10
}
