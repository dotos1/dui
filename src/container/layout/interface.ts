/**
 * @fileoverview Module `src/container/layout/interface.ts` providing interface definitions and implementation.
 * @zh 模块文件 `src/container/layout/interface.ts`，提供interface相关的定义与实现。
 */

import { DuiPanelComponent } from './component/panel.component';
import { SplitAreaDirective } from './directive/split-area.directive'

/**
 * Interface `IPoint` defining the contract and properties for i point.
 * @zh 接口 `IPoint`，定义I坐标点的数据结构契约与属性规范。
 */
export interface IPoint {
  /**
   * Property `x` (`number`) storing x.
   * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标。
   */
  x: number
  /**
   * Property `y` (`number`) storing y.
   * @zh 属性 `y`（类型：`number`），用于存储或配置Y坐标。
   */
  y: number
}

/**
 * Interface `IArea` defining the contract and properties for i area.
 * @zh 接口 `IArea`，定义I区域的数据结构契约与属性规范。
 */
export interface IArea {
  /**
   * Property `component` (`SplitAreaDirective|DuiPanelComponent`) storing component.
   * @zh 属性 `component`（类型：`SplitAreaDirective|DuiPanelComponent`），用于存储或配置组件。
   */
  component: SplitAreaDirective|DuiPanelComponent
  /**
   * Property `order` (`number`) storing order.
   * @zh 属性 `order`（类型：`number`），用于存储或配置顺序。
   */
  order: number
  /**
   * Property `size` (`number | null`) storing size.
   * @zh 属性 `size`（类型：`number | null`），用于存储或配置尺寸。
   */
  size: number | null
  /**
   * Property `minSize` (`number | null`) storing min size.
   * @zh 属性 `minSize`（类型：`number | null`），用于存储或配置最小值尺寸。
   */
  minSize: number | null
  /**
   * Property `maxSize` (`number | null`) storing max size.
   * @zh 属性 `maxSize`（类型：`number | null`），用于存储或配置最大值尺寸。
   */
  maxSize: number | null
  /**
   * Property `sizeBeforeCollapse` (`number | null`) storing size before collapse.
   * @zh 属性 `sizeBeforeCollapse`（类型：`number | null`），用于存储或配置尺寸之前折叠。
   */
  sizeBeforeCollapse: number | null
  /**
   * Property `gutterBeforeCollapse` (`number`) storing gutter before collapse.
   * @zh 属性 `gutterBeforeCollapse`（类型：`number`），用于存储或配置分隔槽之前折叠。
   */
  gutterBeforeCollapse: number
}

// CREATED ON DRAG START

/**
 * Interface `ISplitSnapshot` defining the contract and properties for i split snapshot.
 * @zh 接口 `ISplitSnapshot`，定义I分割面板Snapshot的数据结构契约与属性规范。
 */
export interface ISplitSnapshot {
  /**
   * Property `gutterNum` (`number`) storing gutter num.
   * @zh 属性 `gutterNum`（类型：`number`），用于存储或配置分隔槽数值。
   */
  gutterNum: number
  /**
   * Property `allAreasSizePixel` (`number`) storing all areas size pixel.
   * @zh 属性 `allAreasSizePixel`（类型：`number`），用于存储或配置全部区域集合尺寸像素。
   */
  allAreasSizePixel: number
  /**
   * Property `allInvolvedAreasSizePercent` (`number`) storing all involved areas size percent.
   * @zh 属性 `allInvolvedAreasSizePercent`（类型：`number`），用于存储或配置全部Involved区域集合尺寸百分比。
   */
  allInvolvedAreasSizePercent: number
  /**
   * Property `lastSteppedOffset` (`number`) storing last stepped offset.
   * @zh 属性 `lastSteppedOffset`（类型：`number`），用于存储或配置末尾Stepped偏移量。
   */
  lastSteppedOffset: number
  /**
   * Property `areasBeforeGutter` (`Array<IAreaSnapshot>`) storing areas before gutter.
   * @zh 属性 `areasBeforeGutter`（类型：`Array<IAreaSnapshot>`），用于存储或配置区域集合之前分隔槽。
   */
  areasBeforeGutter: Array<IAreaSnapshot>
  /**
   * Property `areasAfterGutter` (`Array<IAreaSnapshot>`) storing areas after gutter.
   * @zh 属性 `areasAfterGutter`（类型：`Array<IAreaSnapshot>`），用于存储或配置区域集合之后分隔槽。
   */
  areasAfterGutter: Array<IAreaSnapshot>
}

/**
 * Interface `IAreaSnapshot` defining the contract and properties for i area snapshot.
 * @zh 接口 `IAreaSnapshot`，定义I区域Snapshot的数据结构契约与属性规范。
 */
export interface IAreaSnapshot {
  /**
   * Property `area` (`IArea`) storing area.
   * @zh 属性 `area`（类型：`IArea`），用于存储或配置区域。
   */
  area: IArea
  /**
   * Property `sizePixelAtStart` (`number`) storing size pixel at start.
   * @zh 属性 `sizePixelAtStart`（类型：`number`），用于存储或配置尺寸像素位于开始。
   */
  sizePixelAtStart: number
  /**
   * Property `sizePercentAtStart` (`number`) storing size percent at start.
   * @zh 属性 `sizePercentAtStart`（类型：`number`），用于存储或配置尺寸百分比位于开始。
   */
  sizePercentAtStart: number
}

/**
 * Interface `ISplitSideAbsorptionCapacity` defining the contract and properties for i split side absorption capacity.
 * @zh 接口 `ISplitSideAbsorptionCapacity`，定义I分割面板SideAbsorptionCapacity的数据结构契约与属性规范。
 */
export interface ISplitSideAbsorptionCapacity {
  /**
   * Property `remain` (`number`) storing remain.
   * @zh 属性 `remain`（类型：`number`），用于存储或配置remain。
   */
  remain: number
  /**
   * Property `list` (`Array<IAreaAbsorptionCapacity>`) storing list.
   * @zh 属性 `list`（类型：`Array<IAreaAbsorptionCapacity>`），用于存储或配置列表。
   */
  list: Array<IAreaAbsorptionCapacity>
}

/**
 * Interface `IAreaAbsorptionCapacity` defining the contract and properties for i area absorption capacity.
 * @zh 接口 `IAreaAbsorptionCapacity`，定义I区域AbsorptionCapacity的数据结构契约与属性规范。
 */
export interface IAreaAbsorptionCapacity {
  /**
   * Property `areaSnapshot` (`IAreaSnapshot`) storing area snapshot.
   * @zh 属性 `areaSnapshot`（类型：`IAreaSnapshot`），用于存储或配置区域Snapshot。
   */
  areaSnapshot: IAreaSnapshot
  /**
   * Property `pixelAbsorb` (`number`) storing pixel absorb.
   * @zh 属性 `pixelAbsorb`（类型：`number`），用于存储或配置像素Absorb。
   */
  pixelAbsorb: number
  /**
   * Property `percentAfterAbsorption` (`number`) storing percent after absorption.
   * @zh 属性 `percentAfterAbsorption`（类型：`number`），用于存储或配置百分比之后Absorption。
   */
  percentAfterAbsorption: number
  /**
   * Property `pixelRemain` (`number`) storing pixel remain.
   * @zh 属性 `pixelRemain`（类型：`number`），用于存储或配置像素Remain。
   */
  pixelRemain: number
}

// CREATED TO SEND OUTSIDE

/**
 * Interface `IOutputData` defining the contract and properties for i output data.
 * @zh 接口 `IOutputData`，定义I输出事件数据的数据结构契约与属性规范。
 */
export interface IOutputData {
  /**
   * Property `gutterNum` (`number`) storing gutter num.
   * @zh 属性 `gutterNum`（类型：`number`），用于存储或配置分隔槽数值。
   */
  gutterNum: number
  /**
   * Property `sizes` (`IOutputAreaSizes`) storing sizes.
   * @zh 属性 `sizes`（类型：`IOutputAreaSizes`），用于存储或配置尺寸列表。
   */
  sizes: IOutputAreaSizes
}

/**
 * Interface `IOutputAreaSizes` defining the contract and properties for i output area sizes.
 * @zh 接口 `IOutputAreaSizes`，定义I输出事件区域尺寸列表的数据结构契约与属性规范。
 */
export interface IOutputAreaSizes extends Array<number | '*'> {}
