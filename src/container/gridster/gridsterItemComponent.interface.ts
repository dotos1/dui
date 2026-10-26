/**
 * @fileoverview Module `src/container/gridster/gridsterItemComponent.interface.ts` providing gridster item component interface definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterItemComponent.interface.ts`，提供网格拖拽布局条目组件interface相关的定义与实现。
 */

import {GridsterItem} from './gridsterItem.interface';
import {GridsterDraggable} from './gridsterDraggable.service';
import {Renderer2} from '@angular/core';
import {GridsterResizable} from './gridsterResizable.service';
import {GridsterComponentInterface} from './gridster.interface';

/**
 * Class `GridsterItemComponentInterface` encapsulating gridster item component interface data structures and logic in `src/container/gridster`.
 * @zh 类 `GridsterItemComponentInterface`，封装 `src/container/gridster` 中的网格拖拽布局条目组件Interface数据结构与处理逻辑。
 */
export abstract class GridsterItemComponentInterface {
  /**
   * Property `item` (`GridsterItem`) storing item.
   * @zh 属性 `item`（类型：`GridsterItem`），用于存储或配置条目。
   */
  item: GridsterItem;
  /**
   * Property `$item` (`GridsterItem`) storing item.
   * @zh 属性 `$item`（类型：`GridsterItem`），用于存储或配置条目。
   */
  $item: GridsterItem;
  /**
   * Property `top` (`number`) storing top.
   * @zh 属性 `top`（类型：`number`），用于存储或配置顶部位置。
   */
  top: number;
  /**
   * Property `left` (`number`) storing left.
   * @zh 属性 `left`（类型：`number`），用于存储或配置左侧位置。
   */
  left: number;
  /**
   * Property `width` (`number`) storing width.
   * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
   */
  width: number;
  /**
   * Property `height` (`number`) storing height.
   * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
   */
  height: number;
  /**
   * Property `drag` (`GridsterDraggable`) storing drag.
   * @zh 属性 `drag`（类型：`GridsterDraggable`），用于存储或配置拖拽。
   */
  drag: GridsterDraggable;
  /**
   * Property `resize` (`GridsterResizable`) storing resize.
   * @zh 属性 `resize`（类型：`GridsterResizable`），用于存储或配置调整尺寸。
   */
  resize: GridsterResizable;
  /**
   * Property `notPlaced` (`boolean`) storing not placed.
   * @zh 属性 `notPlaced`（类型：`boolean`），用于存储或配置notPlaced。
   */
  notPlaced: boolean;
  /**
   * Property `updateOptions` (`() => void`) storing update options.
   * @zh 属性 `updateOptions`（类型：`() => void`），用于存储或配置更新配置选项。
   */
  updateOptions: () => void;
  /**
   * Property `itemChanged` (`() => void`) storing item changed.
   * @zh 属性 `itemChanged`（类型：`() => void`），用于存储或配置条目已变更。
   */
  itemChanged: () => void;
  /**
   * Property `setSize` (`() => void`) storing set size.
   * @zh 属性 `setSize`（类型：`() => void`），用于存储或配置集合尺寸。
   */
  setSize: () => void;
  /**
   * Property `checkItemChanges` (`(newValue: GridsterItem, oldValue: GridsterItem) => void`) storing check item changes.
   * @zh 属性 `checkItemChanges`（类型：`(newValue: GridsterItem, oldValue: GridsterItem) => void`），用于存储或配置检查条目变更集合。
   */
  checkItemChanges: (newValue: GridsterItem, oldValue: GridsterItem) => void;
  /**
   * Property `canBeDragged` (`() => boolean`) storing can be dragged.
   * @zh 属性 `canBeDragged`（类型：`() => boolean`），用于存储或配置是否可以BeDragged。
   */
  canBeDragged: () => boolean;
  /**
   * Property `canBeResized` (`() => boolean`) storing can be resized.
   * @zh 属性 `canBeResized`（类型：`() => boolean`），用于存储或配置是否可以Be已调整尺寸。
   */
  canBeResized: () => boolean;
  /**
   * Property `bringToFront` (`(offset: number) => void`) storing bring to front.
   * @zh 属性 `bringToFront`（类型：`(offset: number) => void`），用于存储或配置bring转换为Front。
   */
  bringToFront: (offset: number) => void;
  /**
   * Property `sendToBack` (`(v: number) => void`) storing send to back.
   * @zh 属性 `sendToBack`（类型：`(v: number) => void`），用于存储或配置发送转换为返回。
   */
  sendToBack: (v: number) => void ;
  /**
   * Property `el` (`any`) storing el.
   * @zh 属性 `el`（类型：`any`），用于存储或配置DOM元素。
   */
  el;
  /**
   * Property `gridster` (`GridsterComponentInterface`) storing gridster.
   * @zh 属性 `gridster`（类型：`GridsterComponentInterface`），用于存储或配置网格拖拽布局。
   */
  gridster: GridsterComponentInterface;
  /**
   * Property `renderer` (`Renderer2`) storing renderer.
   * @zh 属性 `renderer`（类型：`Renderer2`），用于存储或配置渲染器。
   */
  renderer: Renderer2;
}
