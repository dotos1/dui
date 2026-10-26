/**
 * @fileoverview Module `src/ui/context-menu/interfaces.ts` providing interfaces definitions and implementation.
 * @zh 模块文件 `src/ui/context-menu/interfaces.ts`，提供interfaces相关的定义与实现。
 */

/**
 * Interface `ContextmenuOverlayConfig` defining the contract and properties for contextmenu overlay config.
 * @zh 接口 `ContextmenuOverlayConfig`，定义Contextmenu浮层配置的数据结构契约与属性规范。
 */
export interface ContextmenuOverlayConfig {
  /**
   * Property `panelClass` (`string`) storing panel class.
   * @zh 属性 `panelClass`（类型：`string`），用于存储或配置面板类名。
   */
  panelClass?: string;
  /**
   * Property `hasBackdrop` (`boolean`) storing has backdrop.
   * @zh 属性 `hasBackdrop`（类型：`boolean`），用于存储或配置是否包含背景遮罩。
   */
  hasBackdrop?: boolean;
  /**
   * Property `backdropClass` (`string`) storing backdrop class.
   * @zh 属性 `backdropClass`（类型：`string`），用于存储或配置背景遮罩类名。
   */
  backdropClass?: string;
  /**
   * Property `source` (`MouseEvent`) storing source.
   * @zh 属性 `source`（类型：`MouseEvent`），用于存储或配置源。
   */
  source?: MouseEvent;
  /**
   * Property `data` (`any`) storing data.
   * @zh 属性 `data`（类型：`any`），用于存储或配置数据。
   */
  data?;
  /**
   * Property `children` (`any[]`) storing children.
   * @zh 属性 `children`（类型：`any[]`），用于存储或配置子级列表。
   */
  children;
}
