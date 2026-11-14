/**
 * @fileoverview Module `src/container/gridster/gridsterItem.component.ts` providing gridster item component definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterItem.component.ts`，提供网格拖拽布局条目组件相关的定义与实现。
 */

import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
  Inject,
  HostBinding
} from '@angular/core';

import {GridsterItem} from './gridsterItem.interface';
import {GridsterDraggable} from './gridsterDraggable.service';
import {GridsterResizable} from './gridsterResizable.service';
import {GridsterUtils} from './gridsterUtils.service';
import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';
import {GridsterComponent} from './gridster.component';

/**
 * Angular component `GridsterItemComponent` (selector: 'gridster-item') providing gridster item component presentation and interaction in `src/container/gridster`.
 * @zh Angular 组件 `GridsterItemComponent`（selector: 'gridster-item'），提供网格拖拽布局条目组件的视图渲染与交互逻辑（位于 `src/container/gridster`）。
 */
@Component({
  selector: 'gridster-item',
  templateUrl: './gridsterItem.html',
  styleUrls: ['./gridsterItem.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    hostID: 'dui-gridster-item' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false
})
export class GridsterItemComponent implements OnInit, OnDestroy, GridsterItemComponentInterface {
  /**
   * Input property `item` (`GridsterItem`) configuring item.
   * @zh 输入属性 `item`（类型：`GridsterItem`），用于配置条目。
   */
  @Input() item: GridsterItem;
  /**
   * Property `$item` (`GridsterItem`) storing item.
   * @zh 属性 `$item`（类型：`GridsterItem`），用于存储或配置条目。
   */
  $item: GridsterItem;
  /**
   * Property `el` (`any`) storing el.
   * @zh 属性 `el`（类型：`any`），用于存储或配置DOM元素。
   */
  el;
  /**
   * Property `gridster` (`GridsterComponent`) storing gridster.
   * @zh 属性 `gridster`（类型：`GridsterComponent`），用于存储或配置网格拖拽布局。
   */
  gridster: GridsterComponent;
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
   * Property `init` (`boolean`) storing init.
   * @zh 属性 `init`（类型：`boolean`），用于存储或配置初始化。
   */
  init: boolean;

  /**
   * Host-bound getter `zIndex` (`number`) computing z index.
   * @zh 宿主绑定读取器 `zIndex`（绑定至 `style.z-index`），计算并返回Z坐标索引。
   */
  @HostBinding('style.z-index')
  get zIndex(): number {
    return this.getLayerIndex() + this.gridster.$options.baseLayerIndex;
  }

  /**
   * Creates an instance of `GridsterItemComponent` and initializes its dependencies and internal state.
   * @zh 创建 `GridsterItemComponent` 实例，并初始化其依赖项与内部状态。
   * @param el - Injected or initial el (`ElementRef<any>`) / 注入或传入的DOM元素（`ElementRef<any>`）
   * @param gridster - Injected or initial gridster (`GridsterComponent`) / 注入或传入的网格拖拽布局（`GridsterComponent`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param zone - Injected or initial zone (`NgZone`) / 注入或传入的区域(NgZone)（`NgZone`）
   */
  constructor(@Inject(ElementRef) el: ElementRef,  gridster: GridsterComponent, @Inject(Renderer2) public renderer: Renderer2, @Inject(NgZone) private zone: NgZone) {
    this.el = el.nativeElement;
    this.$item = {
      cols: -1,
      rows: -1,
      x: -1,
      y: -1,
    };
    this.gridster = gridster;
    this.drag = new GridsterDraggable(this, gridster, this.zone);
    this.resize = new GridsterResizable(this, gridster, this.zone);
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.updateOptions();
    this.gridster.addItem(this);
  }

  /**
   * Executes `updateOptions` to handle update options.
   * @zh 执行 `updateOptions`，用于更新配置选项。
   */
  updateOptions(): void {
    this.$item = GridsterUtils.merge(this.$item, this.item, {
      cols: undefined,
      rows: undefined,
      x: undefined,
      y: undefined,
      layerIndex: undefined,
      dragEnabled: undefined,
      resizeEnabled: undefined,
      compactEnabled: undefined,
      maxItemRows: undefined,
      minItemRows: undefined,
      maxItemCols: undefined,
      minItemCols: undefined,
      maxItemArea: undefined,
      minItemArea: undefined,
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.gridster.removeItem(this);
    delete this.gridster;
    this.drag.destroy();
    delete this.drag;
    this.resize.destroy();
    delete this.resize;
  }

  /**
   * Executes `setSize` to handle set size.
   * @zh 执行 `setSize`，用于集合尺寸。
   */
  setSize(): void {
    this.renderer.setStyle(this.el, 'display', this.notPlaced ? '' : 'block');
    this.gridster.gridRenderer.updateItem(this.el, this.$item, this.renderer);
    this.updateItemSize();
  }

  /**
   * Executes `updateItemSize` to handle update item size.
   * @zh 执行 `updateItemSize`，用于更新条目尺寸。
   */
  updateItemSize() {
    const top = this.$item.y * this.gridster.curRowHeight;
    const left = this.$item.x * this.gridster.curColWidth;
    const width = this.$item.cols * this.gridster.curColWidth - this.gridster.$options.margin;
    const height = this.$item.rows * this.gridster.curRowHeight - this.gridster.$options.margin;

    if (!this.init && width > 0 && height > 0) {
      this.init = true;
      if (this.item.initCallback) {
        this.item.initCallback(this.item, this);
      }
      if (this.gridster.options.itemInitCallback) {
        this.gridster.options.itemInitCallback(this.item, this);
      }
      if (this.gridster.$options.scrollToNewItems) {
        this.el.scrollIntoView(false);
      }
    }
    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;
      if (this.gridster.options.itemResizeCallback) {
        this.gridster.options.itemResizeCallback(this.item, this);
      }
    }
    this.top = top;
    this.left = left;
  }

  /**
   * Executes `itemChanged` to handle item changed.
   * @zh 执行 `itemChanged`，用于条目已变更。
   */
  itemChanged(): void {
    if (this.gridster.options.itemChangeCallback) {
      this.gridster.options.itemChangeCallback(this.item, this);
    }
  }

  /**
   * Executes `checkItemChanges` to handle check item changes.
   * @zh 执行 `checkItemChanges`，用于检查条目变更集合。
   * @param newValue - new value parameter (`GridsterItem`) / 新值参数（`GridsterItem`）
   * @param oldValue - old value parameter (`GridsterItem`) / 旧值参数（`GridsterItem`）
   */
  checkItemChanges(newValue: GridsterItem, oldValue: GridsterItem): void {
    if (newValue.rows === oldValue.rows && newValue.cols === oldValue.cols && newValue.x === oldValue.x && newValue.y === oldValue.y) {
      return;
    }
    if (this.gridster.checkCollision(this.$item)) {
      this.$item.x = oldValue.x || 0;
      this.$item.y = oldValue.y || 0;
      this.$item.cols = oldValue.cols || 1;
      this.$item.rows = oldValue.rows || 1;
      this.setSize();
    } else {
      this.item.cols = this.$item.cols;
      this.item.rows = this.$item.rows;
      this.item.x = this.$item.x;
      this.item.y = this.$item.y;
      this.gridster.calculateLayoutDebounce();
      this.itemChanged();
    }
  }

  /**
   * Executes `canBeDragged` to handle can be dragged.
   * @zh 执行 `canBeDragged`，用于是否可以BeDragged。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  canBeDragged(): boolean {
    return !this.gridster.mobile &&
      (this.$item.dragEnabled === undefined ? this.gridster.$options.draggable.enabled : this.$item.dragEnabled);
  }

  /**
   * Executes `canBeResized` to handle can be resized.
   * @zh 执行 `canBeResized`，用于是否可以Be已调整尺寸。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  canBeResized(): boolean {
    return !this.gridster.mobile &&
      (this.$item.resizeEnabled === undefined ? this.gridster.$options.resizable.enabled : this.$item.resizeEnabled);
  }

  /**
   * Executes `bringToFront` to handle bring to front.
   * @zh 执行 `bringToFront`，用于bring转换为Front。
   * @param offset - offset parameter (`number`) / 偏移量参数（`number`）
   */
  bringToFront(offset: number): void {
    if (offset && offset <= 0) {
      return;
    }
    const layerIndex = this.getLayerIndex();
    const topIndex = this.gridster.$options.maxLayerIndex;
    if (layerIndex < topIndex) {
      const targetIndex = offset ? layerIndex + offset : topIndex;
      this.item.layerIndex = this.$item.layerIndex = targetIndex > topIndex ? topIndex : targetIndex;
    }
  }
  /**
   * Executes `sendToBack` to handle send to back.
   * @zh 执行 `sendToBack`，用于发送转换为返回。
   * @param offset - offset parameter (`number`) / 偏移量参数（`number`）
   */
  sendToBack(offset: number): void {
    if (offset && offset <= 0) {
      return;
    }
    const layerIndex = this.getLayerIndex();
    if (layerIndex > 0) {
      const targetIndex = offset ? layerIndex - offset : 0;
      this.item.layerIndex = this.$item.layerIndex = targetIndex < 0 ? 0 : targetIndex;
    }
  }

  /**
   * Executes `getLayerIndex` to handle get layer index.
   * @zh 执行 `getLayerIndex`，用于获取图层索引。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  private getLayerIndex(): number {
    if (this.item.layerIndex !== undefined) {
      return this.item.layerIndex;
    }
    if (this.gridster.$options.defaultLayerIndex !== undefined) {
      return this.gridster.$options.defaultLayerIndex;
    }
    return 0;
  }

}
