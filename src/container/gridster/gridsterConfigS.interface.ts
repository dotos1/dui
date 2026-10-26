/**
 * @fileoverview Module `src/container/gridster/gridsterConfigS.interface.ts` providing gridster config s interface definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterConfigS.interface.ts`，提供网格拖拽布局配置Sinterface相关的定义与实现。
 */

import {GridsterComponentInterface} from './gridster.interface';
import {compactTypes, dirTypes, displayGrids, gridTypes} from './gridsterConfig.interface';
import {GridsterItem} from './gridsterItem.interface';

/**
 * Interface `GridsterConfigS` defining the contract and properties for gridster config s.
 * @zh 接口 `GridsterConfigS`，定义网格拖拽布局配置S的数据结构契约与属性规范。
 */
export interface GridsterConfigS {
  /**
   * Property `gridType` (`gridTypes`) storing grid type.
   * @zh 属性 `gridType`（类型：`gridTypes`），用于存储或配置网格表格类型。
   */
  gridType: gridTypes;
  /**
   * Property `fixedColWidth` (`number`) storing fixed col width.
   * @zh 属性 `fixedColWidth`（类型：`number`），用于存储或配置固定列宽度。
   */
  fixedColWidth: number;
  /**
   * Property `fixedRowHeight` (`number`) storing fixed row height.
   * @zh 属性 `fixedRowHeight`（类型：`number`），用于存储或配置固定行高度。
   */
  fixedRowHeight: number;
  /**
   * Property `keepFixedHeightInMobile` (`boolean`) storing keep fixed height in mobile.
   * @zh 属性 `keepFixedHeightInMobile`（类型：`boolean`），用于存储或配置keep固定高度在Mobile。
   */
  keepFixedHeightInMobile: boolean;
  /**
   * Property `keepFixedWidthInMobile` (`boolean`) storing keep fixed width in mobile.
   * @zh 属性 `keepFixedWidthInMobile`（类型：`boolean`），用于存储或配置keep固定宽度在Mobile。
   */
  keepFixedWidthInMobile: boolean;
  /**
   * Property `setGridSize` (`boolean`) storing set grid size.
   * @zh 属性 `setGridSize`（类型：`boolean`），用于存储或配置集合网格表格尺寸。
   */
  setGridSize: boolean;
  /**
   * Property `compactType` (`compactTypes`) storing compact type.
   * @zh 属性 `compactType`（类型：`compactTypes`），用于存储或配置紧凑类型。
   */
  compactType: compactTypes;
  /**
   * Property `mobileBreakpoint` (`number`) storing mobile breakpoint.
   * @zh 属性 `mobileBreakpoint`（类型：`number`），用于存储或配置mobileBreakpoint。
   */
  mobileBreakpoint: number;
  /**
   * Property `allowMultiLayer` (`boolean`) storing allow multi layer.
   * @zh 属性 `allowMultiLayer`（类型：`boolean`），用于存储或配置允许多图层。
   */
  allowMultiLayer: boolean;
  /**
   * Property `defaultLayerIndex` (`number`) storing default layer index.
   * @zh 属性 `defaultLayerIndex`（类型：`number`），用于存储或配置默认图层索引。
   */
  defaultLayerIndex: number;
  /**
   * Property `maxLayerIndex` (`number`) storing max layer index.
   * @zh 属性 `maxLayerIndex`（类型：`number`），用于存储或配置最大值图层索引。
   */
  maxLayerIndex: number;
  /**
   * Property `baseLayerIndex` (`number`) storing base layer index.
   * @zh 属性 `baseLayerIndex`（类型：`number`），用于存储或配置基础图层索引。
   */
  baseLayerIndex: number;
  /**
   * Property `minCols` (`number`) storing min cols.
   * @zh 属性 `minCols`（类型：`number`），用于存储或配置最小值列列表。
   */
  minCols: number;
  /**
   * Property `maxCols` (`number`) storing max cols.
   * @zh 属性 `maxCols`（类型：`number`），用于存储或配置最大值列列表。
   */
  maxCols: number;
  /**
   * Property `minRows` (`number`) storing min rows.
   * @zh 属性 `minRows`（类型：`number`），用于存储或配置最小值行列表。
   */
  minRows: number;
  /**
   * Property `maxRows` (`number`) storing max rows.
   * @zh 属性 `maxRows`（类型：`number`），用于存储或配置最大值行列表。
   */
  maxRows: number;
  /**
   * Property `defaultItemCols` (`number`) storing default item cols.
   * @zh 属性 `defaultItemCols`（类型：`number`），用于存储或配置默认条目列列表。
   */
  defaultItemCols: number;
  /**
   * Property `defaultItemRows` (`number`) storing default item rows.
   * @zh 属性 `defaultItemRows`（类型：`number`），用于存储或配置默认条目行列表。
   */
  defaultItemRows: number;
  /**
   * Property `maxItemCols` (`number`) storing max item cols.
   * @zh 属性 `maxItemCols`（类型：`number`），用于存储或配置最大值条目列列表。
   */
  maxItemCols: number;
  /**
   * Property `maxItemRows` (`number`) storing max item rows.
   * @zh 属性 `maxItemRows`（类型：`number`），用于存储或配置最大值条目行列表。
   */
  maxItemRows: number;
  /**
   * Property `minItemCols` (`number`) storing min item cols.
   * @zh 属性 `minItemCols`（类型：`number`），用于存储或配置最小值条目列列表。
   */
  minItemCols: number;
  /**
   * Property `minItemRows` (`number`) storing min item rows.
   * @zh 属性 `minItemRows`（类型：`number`），用于存储或配置最小值条目行列表。
   */
  minItemRows: number;
  /**
   * Property `minItemArea` (`number`) storing min item area.
   * @zh 属性 `minItemArea`（类型：`number`），用于存储或配置最小值条目区域。
   */
  minItemArea: number;
  /**
   * Property `maxItemArea` (`number`) storing max item area.
   * @zh 属性 `maxItemArea`（类型：`number`），用于存储或配置最大值条目区域。
   */
  maxItemArea: number;
  /**
   * Property `margin` (`number`) storing margin.
   * @zh 属性 `margin`（类型：`number`），用于存储或配置外边距。
   */
  margin: number;
  /**
   * Property `outerMargin` (`boolean`) storing outer margin.
   * @zh 属性 `outerMargin`（类型：`boolean`），用于存储或配置外部外边距。
   */
  outerMargin: boolean;
  /**
   * Property `outerMarginTop` (`number | null`) storing outer margin top.
   * @zh 属性 `outerMarginTop`（类型：`number | null`），用于存储或配置外部外边距顶部位置。
   */
  outerMarginTop: number | null;
  /**
   * Property `outerMarginRight` (`number | null`) storing outer margin right.
   * @zh 属性 `outerMarginRight`（类型：`number | null`），用于存储或配置外部外边距右侧位置。
   */
  outerMarginRight: number | null;
  /**
   * Property `outerMarginBottom` (`number | null`) storing outer margin bottom.
   * @zh 属性 `outerMarginBottom`（类型：`number | null`），用于存储或配置外部外边距底部位置。
   */
  outerMarginBottom: number | null;
  /**
   * Property `outerMarginLeft` (`number | null`) storing outer margin left.
   * @zh 属性 `outerMarginLeft`（类型：`number | null`），用于存储或配置外部外边距左侧位置。
   */
  outerMarginLeft: number | null;
  /**
   * Property `useTransformPositioning` (`boolean`) storing use transform positioning.
   * @zh 属性 `useTransformPositioning`（类型：`boolean`），用于存储或配置使用转换位置。
   */
  useTransformPositioning: boolean;
  /**
   * Property `scrollSensitivity` (`number`) storing scroll sensitivity.
   * @zh 属性 `scrollSensitivity`（类型：`number`），用于存储或配置滚动Sensitivity。
   */
  scrollSensitivity: number;
  /**
   * Property `scrollSpeed` (`number`) storing scroll speed.
   * @zh 属性 `scrollSpeed`（类型：`number`），用于存储或配置滚动速度。
   */
  scrollSpeed: number;
  /**
   * Property `draggable` (`Draggable`) storing draggable.
   * @zh 属性 `draggable`（类型：`Draggable`），用于存储或配置是否可拖拽。
   */
  draggable: Draggable;
  /**
   * Property `resizable` (`Resizable`) storing resizable.
   * @zh 属性 `resizable`（类型：`Resizable`），用于存储或配置是否可调尺寸。
   */
  resizable: Resizable;
  /**
   * Property `swap` (`boolean`) storing swap.
   * @zh 属性 `swap`（类型：`boolean`），用于存储或配置swap。
   */
  swap: boolean;
  /**
   * Property `swapWhileDragging` (`boolean`) storing swap while dragging.
   * @zh 属性 `swapWhileDragging`（类型：`boolean`），用于存储或配置swapWhile拖拽中。
   */
  swapWhileDragging: boolean;
  /**
   * Property `pushItems` (`boolean`) storing push items.
   * @zh 属性 `pushItems`（类型：`boolean`），用于存储或配置推入条目列表。
   */
  pushItems: boolean;
  /**
   * Property `disablePushOnDrag` (`boolean`) storing disable push on drag.
   * @zh 属性 `disablePushOnDrag`（类型：`boolean`），用于存储或配置禁用推入当拖拽。
   */
  disablePushOnDrag: boolean;
  /**
   * Property `disablePushOnResize` (`boolean`) storing disable push on resize.
   * @zh 属性 `disablePushOnResize`（类型：`boolean`），用于存储或配置禁用推入当调整尺寸。
   */
  disablePushOnResize: boolean;
  /**
   * Property `disableAutoPositionOnConflict` (`boolean`) storing disable auto position on conflict.
   * @zh 属性 `disableAutoPositionOnConflict`（类型：`boolean`），用于存储或配置禁用自动位置当Conflict。
   */
  disableAutoPositionOnConflict: boolean;
  /**
   * Property `pushDirections` (`PushDirections`) storing push directions.
   * @zh 属性 `pushDirections`（类型：`PushDirections`），用于存储或配置推入方向。
   */
  pushDirections: PushDirections;
  /**
   * Property `pushResizeItems` (`boolean`) storing push resize items.
   * @zh 属性 `pushResizeItems`（类型：`boolean`），用于存储或配置推入调整尺寸条目列表。
   */
  pushResizeItems: boolean;
  /**
   * Property `displayGrid` (`displayGrids`) storing display grid.
   * @zh 属性 `displayGrid`（类型：`displayGrids`），用于存储或配置display网格表格。
   */
  displayGrid: displayGrids;
  /**
   * Property `disableWindowResize` (`boolean`) storing disable window resize.
   * @zh 属性 `disableWindowResize`（类型：`boolean`），用于存储或配置禁用窗口调整尺寸。
   */
  disableWindowResize: boolean;
  /**
   * Property `disableWarnings` (`boolean`) storing disable warnings.
   * @zh 属性 `disableWarnings`（类型：`boolean`），用于存储或配置禁用警告。
   */
  disableWarnings: boolean;
  /**
   * Property `scrollToNewItems` (`boolean`) storing scroll to new items.
   * @zh 属性 `scrollToNewItems`（类型：`boolean`），用于存储或配置滚动转换为新条目列表。
   */
  scrollToNewItems: boolean;
  /**
   * Property `disableScrollHorizontal` (`boolean`) storing disable scroll horizontal.
   * @zh 属性 `disableScrollHorizontal`（类型：`boolean`），用于存储或配置禁用滚动水平。
   */
  disableScrollHorizontal?: boolean;
  /**
   * Property `disableScrollVertical` (`boolean`) storing disable scroll vertical.
   * @zh 属性 `disableScrollVertical`（类型：`boolean`），用于存储或配置禁用滚动垂直。
   */
  disableScrollVertical?: boolean;
  /**
   * Property `enableEmptyCellClick` (`boolean`) storing enable empty cell click.
   * @zh 属性 `enableEmptyCellClick`（类型：`boolean`），用于存储或配置启用空单元格点击。
   */
  enableEmptyCellClick: boolean;
  /**
   * Property `enableEmptyCellContextMenu` (`boolean`) storing enable empty cell context menu.
   * @zh 属性 `enableEmptyCellContextMenu`（类型：`boolean`），用于存储或配置启用空单元格上下文菜单。
   */
  enableEmptyCellContextMenu: boolean;
  /**
   * Property `enableEmptyCellDrop` (`boolean`) storing enable empty cell drop.
   * @zh 属性 `enableEmptyCellDrop`（类型：`boolean`），用于存储或配置启用空单元格放置。
   */
  enableEmptyCellDrop: boolean;
  /**
   * Property `enableEmptyCellDrag` (`boolean`) storing enable empty cell drag.
   * @zh 属性 `enableEmptyCellDrag`（类型：`boolean`），用于存储或配置启用空单元格拖拽。
   */
  enableEmptyCellDrag: boolean;
  /**
   * Property `enableOccupiedCellDrop` (`boolean`) storing enable occupied cell drop.
   * @zh 属性 `enableOccupiedCellDrop`（类型：`boolean`），用于存储或配置启用Occupied单元格放置。
   */
  enableOccupiedCellDrop: boolean;
  /**
   * Property `emptyCellDragMaxCols` (`number`) storing empty cell drag max cols.
   * @zh 属性 `emptyCellDragMaxCols`（类型：`number`），用于存储或配置空单元格拖拽最大值列列表。
   */
  emptyCellDragMaxCols: number;
  /**
   * Property `emptyCellDragMaxRows` (`number`) storing empty cell drag max rows.
   * @zh 属性 `emptyCellDragMaxRows`（类型：`number`），用于存储或配置空单元格拖拽最大值行列表。
   */
  emptyCellDragMaxRows: number;
  /**
   * Property `ignoreMarginInRow` (`boolean`) storing ignore margin in row.
   * @zh 属性 `ignoreMarginInRow`（类型：`boolean`），用于存储或配置忽略外边距在行。
   */
  ignoreMarginInRow: boolean;
  /**
   * Property `dirType` (`dirTypes`) storing dir type.
   * @zh 属性 `dirType`（类型：`dirTypes`），用于存储或配置目录类型。
   */
  dirType: dirTypes;
  /**
   * Property `api` (`{ resize: () => void, optionsChanged: () => void, getNextPossiblePosit...`) storing api.
   * @zh 属性 `api`（类型：`{ resize: () => void, optionsChanged: () => void, getNextPossiblePosit...`），用于存储或配置API接口。
   */
  api: {
    resize: () => void,
    optionsChanged: () => void,
    getNextPossiblePosition: (newItem: GridsterItem) => boolean,
    getFirstPossiblePosition: (item: GridsterItem) => GridsterItem,
    getLastPossiblePosition: (item: GridsterItem) => GridsterItem,
  };

  [propName: string]: unknown;
}

/**
 * Interface `DragBase` defining the contract and properties for drag base.
 * @zh 接口 `DragBase`，定义拖拽基础的数据结构契约与属性规范。
 */
export interface DragBase {
  /**
   * Property `enabled` (`boolean`) storing enabled.
   * @zh 属性 `enabled`（类型：`boolean`），用于存储或配置已启用。
   */
  enabled: boolean;
  /**
   * Property `delayStart` (`number`) storing delay start.
   * @zh 属性 `delayStart`（类型：`number`），用于存储或配置延迟开始。
   */
  delayStart: number;

  [propName: string]: unknown;
}

/**
 * Interface `Draggable` defining the contract and properties for draggable.
 * @zh 接口 `Draggable`，定义是否可拖拽的数据结构契约与属性规范。
 */
export interface Draggable extends DragBase {
  /**
   * Property `ignoreContentClass` (`string`) storing ignore content class.
   * @zh 属性 `ignoreContentClass`（类型：`string`），用于存储或配置忽略内容类名。
   */
  ignoreContentClass: string;
  /**
   * Property `ignoreContent` (`boolean`) storing ignore content.
   * @zh 属性 `ignoreContent`（类型：`boolean`），用于存储或配置忽略内容。
   */
  ignoreContent: boolean;
  /**
   * Property `dragHandleClass` (`string`) storing drag handle class.
   * @zh 属性 `dragHandleClass`（类型：`string`），用于存储或配置拖拽连接手柄类名。
   */
  dragHandleClass: string;
  /**
   * Property `dropOverItems` (`boolean`) storing drop over items.
   * @zh 属性 `dropOverItems`（类型：`boolean`），用于存储或配置放置越过条目列表。
   */
  dropOverItems: boolean;
  /**
   * Property `dropOverItemsCallback` (`(source: GridsterItem, target: GridsterItem, grid?: GridsterComponentI...`) storing drop over items callback.
   * @zh 属性 `dropOverItemsCallback`（类型：`(source: GridsterItem, target: GridsterItem, grid?: GridsterComponentI...`），用于存储或配置放置越过条目列表回调函数。
   */
  dropOverItemsCallback: (source: GridsterItem, target: GridsterItem, grid?: GridsterComponentInterface) => void;
}

/**
 * Interface `Resizable` defining the contract and properties for resizable.
 * @zh 接口 `Resizable`，定义是否可调尺寸的数据结构契约与属性规范。
 */
export interface Resizable extends DragBase {
  /**
   * Property `handles` (`{ s: boolean, e: boolean, n: boolean, w: boolean, se: boolean, ne: boo...`) storing handles.
   * @zh 属性 `handles`（类型：`{ s: boolean, e: boolean, n: boolean, w: boolean, se: boolean, ne: boo...`），用于存储或配置手柄列表。
   */
  handles: {
    s: boolean,
    e: boolean,
    n: boolean,
    w: boolean,
    se: boolean,
    ne: boolean,
    sw: boolean,
    nw: boolean
  };
}

/**
 * Interface `PushDirections` defining the contract and properties for push directions.
 * @zh 接口 `PushDirections`，定义推入方向的数据结构契约与属性规范。
 */
export interface PushDirections {
  /**
   * Property `north` (`boolean`) storing north.
   * @zh 属性 `north`（类型：`boolean`），用于存储或配置north。
   */
  north: boolean;
  /**
   * Property `east` (`boolean`) storing east.
   * @zh 属性 `east`（类型：`boolean`），用于存储或配置east。
   */
  east: boolean;
  /**
   * Property `south` (`boolean`) storing south.
   * @zh 属性 `south`（类型：`boolean`），用于存储或配置south。
   */
  south: boolean;
  /**
   * Property `west` (`boolean`) storing west.
   * @zh 属性 `west`（类型：`boolean`），用于存储或配置west。
   */
  west: boolean;
}
