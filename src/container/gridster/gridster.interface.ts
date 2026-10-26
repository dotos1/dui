/**
 * @fileoverview Module `src/container/gridster/gridster.interface.ts` providing gridster interface definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridster.interface.ts`，提供网格拖拽布局interface相关的定义与实现。
 */

import {GridsterConfigS} from './gridsterConfigS.interface';
import {ChangeDetectorRef, NgZone, Renderer2} from '@angular/core';
import {GridsterEmptyCell} from './gridsterEmptyCell.service';
import {GridsterCompact} from './gridsterCompact.service';
import {GridsterConfig} from './gridsterConfig.interface';
import {GridsterItem} from './gridsterItem.interface';
import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';
import {GridsterRenderer} from './gridsterRenderer.service';

/**
 * Class `GridsterComponentInterface` encapsulating gridster component interface data structures and logic in `src/container/gridster`.
 * @zh 类 `GridsterComponentInterface`，封装 `src/container/gridster` 中的网格拖拽布局组件Interface数据结构与处理逻辑。
 */
export abstract class GridsterComponentInterface {
  /**
   * Property `$options` (`GridsterConfigS`) storing options.
   * @zh 属性 `$options`（类型：`GridsterConfigS`），用于存储或配置配置选项。
   */
  $options: GridsterConfigS;
  /**
   * Property `grid` (`Array<GridsterItemComponentInterface>`) storing grid.
   * @zh 属性 `grid`（类型：`Array<GridsterItemComponentInterface>`），用于存储或配置网格表格。
   */
  grid: Array<GridsterItemComponentInterface>;
  /**
   * Property `checkCollision` (`(item: GridsterItem) => GridsterItemComponentInterface | boolean`) storing check collision.
   * @zh 属性 `checkCollision`（类型：`(item: GridsterItem) => GridsterItemComponentInterface | boolean`），用于存储或配置检查Collision。
   */
  checkCollision: (item: GridsterItem) => GridsterItemComponentInterface | boolean;
  /**
   * Property `checkCollisionForSwaping` (`(item: GridsterItem) => GridsterItemComponentInterface | boolean`) storing check collision for swaping.
   * @zh 属性 `checkCollisionForSwaping`（类型：`(item: GridsterItem) => GridsterItemComponentInterface | boolean`），用于存储或配置检查Collision用于Swaping。
   */
  checkCollisionForSwaping: (item: GridsterItem) => GridsterItemComponentInterface | boolean;
  /**
   * Property `positionXToPixels` (`(x: number) => number`) storing position x to pixels.
   * @zh 属性 `positionXToPixels`（类型：`(x: number) => number`），用于存储或配置位置X坐标转换为像素。
   */
  positionXToPixels: (x: number) => number;
  /**
   * Property `pixelsToPositionX` (`(x: number, roundingMethod: (x: number) => number, noLimit?: boolean)...`) storing pixels to position x.
   * @zh 属性 `pixelsToPositionX`（类型：`(x: number, roundingMethod: (x: number) => number, noLimit?: boolean)...`），用于存储或配置像素转换为位置X坐标。
   */
  pixelsToPositionX: (x: number, roundingMethod: (x: number) => number, noLimit?: boolean) => number;
  /**
   * Property `positionYToPixels` (`(y: number) => number`) storing position y to pixels.
   * @zh 属性 `positionYToPixels`（类型：`(y: number) => number`），用于存储或配置位置Y坐标转换为像素。
   */
  positionYToPixels: (y: number) => number;
  /**
   * Property `pixelsToPositionY` (`(y: number, roundingMethod: (x: number) => number, noLimit?: boolean)...`) storing pixels to position y.
   * @zh 属性 `pixelsToPositionY`（类型：`(y: number, roundingMethod: (x: number) => number, noLimit?: boolean)...`），用于存储或配置像素转换为位置Y坐标。
   */
  pixelsToPositionY: (y: number, roundingMethod: (x: number) => number, noLimit?: boolean) => number;
  /**
   * Property `findItemWithItem` (`(item: GridsterItem) => GridsterItemComponentInterface | boolean`) storing find item with item.
   * @zh 属性 `findItemWithItem`（类型：`(item: GridsterItem) => GridsterItemComponentInterface | boolean`），用于存储或配置查找条目带有条目。
   */
  findItemWithItem: (item: GridsterItem) => GridsterItemComponentInterface | boolean;
  /**
   * Property `findItemsWithItem` (`(item: GridsterItem) => Array<GridsterItemComponentInterface>`) storing find items with item.
   * @zh 属性 `findItemsWithItem`（类型：`(item: GridsterItem) => Array<GridsterItemComponentInterface>`），用于存储或配置查找条目列表带有条目。
   */
  findItemsWithItem: (item: GridsterItem) => Array<GridsterItemComponentInterface>;
  /**
   * Property `checkGridCollision` (`(item: GridsterItem) => boolean`) storing check grid collision.
   * @zh 属性 `checkGridCollision`（类型：`(item: GridsterItem) => boolean`），用于存储或配置检查网格表格Collision。
   */
  checkGridCollision: (item: GridsterItem) => boolean;
  /**
   * Property `checkCollisionTwoItems` (`(item: GridsterItem, item2: GridsterItem) => boolean`) storing check collision two items.
   * @zh 属性 `checkCollisionTwoItems`（类型：`(item: GridsterItem, item2: GridsterItem) => boolean`），用于存储或配置检查CollisionTwo条目列表。
   */
  checkCollisionTwoItems: (item: GridsterItem, item2: GridsterItem) => boolean;
  /**
   * Property `el` (`any`) storing el.
   * @zh 属性 `el`（类型：`any`），用于存储或配置DOM元素。
   */
  el;
  /**
   * Property `renderer` (`Renderer2`) storing renderer.
   * @zh 属性 `renderer`（类型：`Renderer2`），用于存储或配置渲染器。
   */
  renderer: Renderer2;
  /**
   * Property `gridRenderer` (`GridsterRenderer`) storing grid renderer.
   * @zh 属性 `gridRenderer`（类型：`GridsterRenderer`），用于存储或配置网格表格渲染器。
   */
  gridRenderer: GridsterRenderer;
  /**
   * Property `cdRef` (`ChangeDetectorRef`) storing cd ref.
   * @zh 属性 `cdRef`（类型：`ChangeDetectorRef`），用于存储或配置cd引用。
   */
  cdRef: ChangeDetectorRef;
  /**
   * Property `options` (`GridsterConfig`) storing options.
   * @zh 属性 `options`（类型：`GridsterConfig`），用于存储或配置配置选项。
   */
  options: GridsterConfig;
  /**
   * Property `calculateLayoutDebounce` (`() => void`) storing calculate layout debounce.
   * @zh 属性 `calculateLayoutDebounce`（类型：`() => void`），用于存储或配置计算布局防抖。
   */
  calculateLayoutDebounce: () => void;
  /**
   * Property `updateGrid` (`() => void`) storing update grid.
   * @zh 属性 `updateGrid`（类型：`() => void`），用于存储或配置更新网格表格。
   */
  updateGrid: () => void;
  /**
   * Property `movingItem` (`GridsterItem | null`) storing moving item.
   * @zh 属性 `movingItem`（类型：`GridsterItem | null`），用于存储或配置移动条目。
   */
  movingItem: GridsterItem | null;
  /**
   * Property `addItem` (`(item: GridsterItemComponentInterface) => void`) storing add item.
   * @zh 属性 `addItem`（类型：`(item: GridsterItemComponentInterface) => void`），用于存储或配置添加条目。
   */
  addItem: (item: GridsterItemComponentInterface) => void;
  /**
   * Property `removeItem` (`(item: GridsterItemComponentInterface) => void`) storing remove item.
   * @zh 属性 `removeItem`（类型：`(item: GridsterItemComponentInterface) => void`），用于存储或配置移除条目。
   */
  removeItem: (item: GridsterItemComponentInterface) => void;
  /**
   * Property `previewStyle` (`(drag?: boolean) => void`) storing preview style.
   * @zh 属性 `previewStyle`（类型：`(drag?: boolean) => void`），用于存储或配置预览样式。
   */
  previewStyle: (drag?: boolean) => void;
  /**
   * Property `mobile` (`boolean`) storing mobile.
   * @zh 属性 `mobile`（类型：`boolean`），用于存储或配置mobile。
   */
  mobile: boolean;
  /**
   * Property `curWidth` (`number`) storing cur width.
   * @zh 属性 `curWidth`（类型：`number`），用于存储或配置当前宽度。
   */
  curWidth: number;
  /**
   * Property `curHeight` (`number`) storing cur height.
   * @zh 属性 `curHeight`（类型：`number`），用于存储或配置当前高度。
   */
  curHeight: number;
  /**
   * Property `columns` (`number`) storing columns.
   * @zh 属性 `columns`（类型：`number`），用于存储或配置列集合。
   */
  columns: number;
  /**
   * Property `rows` (`number`) storing rows.
   * @zh 属性 `rows`（类型：`number`），用于存储或配置行列表。
   */
  rows: number;
  /**
   * Property `curColWidth` (`number`) storing cur col width.
   * @zh 属性 `curColWidth`（类型：`number`），用于存储或配置当前列宽度。
   */
  curColWidth: number;
  /**
   * Property `curRowHeight` (`number`) storing cur row height.
   * @zh 属性 `curRowHeight`（类型：`number`），用于存储或配置当前行高度。
   */
  curRowHeight: number;
  /**
   * Property `windowResize` (`(() => void) | null`) storing window resize.
   * @zh 属性 `windowResize`（类型：`(() => void) | null`），用于存储或配置窗口调整尺寸。
   */
  windowResize: (() => void) | null;
  /**
   * Property `setGridDimensions` (`(() => void)`) storing set grid dimensions.
   * @zh 属性 `setGridDimensions`（类型：`(() => void)`），用于存储或配置集合网格表格维度列表。
   */
  setGridDimensions: (() => void);
  /**
   * Property `dragInProgress` (`boolean`) storing drag in progress.
   * @zh 属性 `dragInProgress`（类型：`boolean`），用于存储或配置拖拽在进度条。
   */
  dragInProgress: boolean;
  /**
   * Property `emptyCell` (`GridsterEmptyCell`) storing empty cell.
   * @zh 属性 `emptyCell`（类型：`GridsterEmptyCell`），用于存储或配置空单元格。
   */
  emptyCell: GridsterEmptyCell;
  /**
   * Property `compact` (`GridsterCompact`) storing compact.
   * @zh 属性 `compact`（类型：`GridsterCompact`），用于存储或配置紧凑。
   */
  compact: GridsterCompact;
  /**
   * Property `zone` (`NgZone`) storing zone.
   * @zh 属性 `zone`（类型：`NgZone`），用于存储或配置区域(NgZone)。
   */
  zone: NgZone;
  /**
   * Property `gridRows` (`Array<number>`) storing grid rows.
   * @zh 属性 `gridRows`（类型：`Array<number>`），用于存储或配置网格表格行列表。
   */
  gridRows: Array<number>;
  /**
   * Property `gridColumns` (`Array<number>`) storing grid columns.
   * @zh 属性 `gridColumns`（类型：`Array<number>`），用于存储或配置网格表格列集合。
   */
  gridColumns: Array<number>;
}
