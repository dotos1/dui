/**
 * @fileoverview Module `src/container/gridster/gridsterEmptyCell.service.ts` providing gridster empty cell service definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterEmptyCell.service.ts`，提供网格拖拽布局空单元格服务相关的定义与实现。
 */

import {Injectable} from '@angular/core';

import {GridsterUtils} from './gridsterUtils.service';
import {GridsterItem} from './gridsterItem.interface';
import {GridsterComponentInterface} from './gridster.interface';

/**
 * Injectable Angular service `GridsterEmptyCell` managing gridster empty cell state and operations in `src/container/gridster`.
 * @zh 可注入的 Angular 服务 `GridsterEmptyCell`，管理 `src/container/gridster` 中的网格拖拽布局空单元格状态与业务操作。
 */
@Injectable()
export class GridsterEmptyCell {
  /**
   * Property `initialItem` (`GridsterItem`) storing initial item.
   * @zh 属性 `initialItem`（类型：`GridsterItem`），用于存储或配置初始条目。
   */
  initialItem: GridsterItem | null;
  /**
   * Property `emptyCellClick` (`Function`) storing empty cell click.
   * @zh 属性 `emptyCellClick`（类型：`Function`），用于存储或配置空单元格点击。
   */
  emptyCellClick: Function | null;
  /**
   * Property `emptyCellClickTouch` (`Function`) storing empty cell click touch.
   * @zh 属性 `emptyCellClickTouch`（类型：`Function`），用于存储或配置空单元格点击触摸。
   */
  emptyCellClickTouch: Function | null;
  /**
   * Property `emptyCellContextMenu` (`Function`) storing empty cell context menu.
   * @zh 属性 `emptyCellContextMenu`（类型：`Function`），用于存储或配置空单元格上下文菜单。
   */
  emptyCellContextMenu: Function | null;
  /**
   * Property `emptyCellDrop` (`Function`) storing empty cell drop.
   * @zh 属性 `emptyCellDrop`（类型：`Function`），用于存储或配置空单元格放置。
   */
  emptyCellDrop: Function | null;
  /**
   * Property `emptyCellDrag` (`Function`) storing empty cell drag.
   * @zh 属性 `emptyCellDrag`（类型：`Function`），用于存储或配置空单元格拖拽。
   */
  emptyCellDrag: Function | null;
  /**
   * Property `emptyCellDragTouch` (`Function`) storing empty cell drag touch.
   * @zh 属性 `emptyCellDragTouch`（类型：`Function`），用于存储或配置空单元格拖拽触摸。
   */
  emptyCellDragTouch: Function | null;
  /**
   * Property `emptyCellMMove` (`Function`) storing empty cell m move.
   * @zh 属性 `emptyCellMMove`（类型：`Function`），用于存储或配置空单元格M移动。
   */
  emptyCellMMove: Function;
  /**
   * Property `emptyCellMMoveTouch` (`Function`) storing empty cell m move touch.
   * @zh 属性 `emptyCellMMoveTouch`（类型：`Function`），用于存储或配置空单元格M移动触摸。
   */
  emptyCellMMoveTouch: Function;
  /**
   * Property `emptyCellUp` (`Function`) storing empty cell up.
   * @zh 属性 `emptyCellUp`（类型：`Function`），用于存储或配置空单元格向上。
   */
  emptyCellUp: Function;
  /**
   * Property `emptyCellUpTouch` (`Function`) storing empty cell up touch.
   * @zh 属性 `emptyCellUpTouch`（类型：`Function`），用于存储或配置空单元格向上触摸。
   */
  emptyCellUpTouch: Function;
  /**
   * Property `emptyCellMove` (`Function`) storing empty cell move.
   * @zh 属性 `emptyCellMove`（类型：`Function`），用于存储或配置空单元格移动。
   */
  emptyCellMove: Function | null;
  /**
   * Property `emptyCellExit` (`Function`) storing empty cell exit.
   * @zh 属性 `emptyCellExit`（类型：`Function`），用于存储或配置空单元格Exit。
   */
  emptyCellExit: Function | null;

  /**
   * Creates an instance of `GridsterEmptyCell` and initializes its dependencies and internal state.
   * @zh 创建 `GridsterEmptyCell` 实例，并初始化其依赖项与内部状态。
   * @param gridster - Injected or initial gridster (`GridsterComponentInterface`) / 注入或传入的网格拖拽布局（`GridsterComponentInterface`）
   */
  constructor(private gridster: GridsterComponentInterface) {
  }

  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   */
  destroy(): void {
    delete this.initialItem;
    delete this.gridster.movingItem;
    if (this.gridster.previewStyle) {
      this.gridster.previewStyle();
    }
    delete this.gridster;
    if (this.emptyCellExit) {
      this.emptyCellExit();
      this.emptyCellExit = null;
    }
  }

  /**
   * Executes `updateOptions` to handle update options.
   * @zh 执行 `updateOptions`，用于更新配置选项。
   */
  updateOptions(): void {
    if (this.gridster.$options.enableEmptyCellClick && !this.emptyCellClick && this.gridster.options.emptyCellClickCallback) {
      this.emptyCellClick = this.gridster.renderer.listen(this.gridster.el, 'click', this.emptyCellClickCb.bind(this));
      this.emptyCellClickTouch = this.gridster.renderer.listen(this.gridster.el, 'touchend', this.emptyCellClickCb.bind(this));
    } else if (!this.gridster.$options.enableEmptyCellClick && this.emptyCellClick && this.emptyCellClickTouch) {
      this.emptyCellClick();
      this.emptyCellClickTouch();
      this.emptyCellClick = null;
      this.emptyCellClickTouch = null;
    }
    if (this.gridster.$options.enableEmptyCellContextMenu && !this.emptyCellContextMenu &&
      this.gridster.options.emptyCellContextMenuCallback) {
      this.emptyCellContextMenu = this.gridster.renderer.listen(this.gridster.el, 'contextmenu', this.emptyCellContextMenuCb.bind(this));
    } else if (!this.gridster.$options.enableEmptyCellContextMenu && this.emptyCellContextMenu) {
      this.emptyCellContextMenu();
      this.emptyCellContextMenu = null;
    }
    if (this.gridster.$options.enableEmptyCellDrop && !this.emptyCellDrop && this.gridster.options.emptyCellDropCallback) {
      this.emptyCellDrop = this.gridster.renderer.listen(this.gridster.el, 'drop', this.emptyCellDragDrop.bind(this));
      this.gridster.zone.runOutsideAngular(() => {
        this.emptyCellMove = this.gridster.renderer.listen(this.gridster.el, 'dragover', this.emptyCellDragOver.bind(this));
      });
      this.emptyCellExit = this.gridster.renderer.listen('document', 'dragend', () => {
        this.gridster.movingItem = null;
        this.gridster.previewStyle();
      });
    } else if (!this.gridster.$options.enableEmptyCellDrop && this.emptyCellDrop && this.emptyCellMove && this.emptyCellExit) {
      this.emptyCellDrop();
      this.emptyCellMove();
      this.emptyCellExit();
      this.emptyCellMove = null;
      this.emptyCellDrop = null;
      this.emptyCellExit = null;
    }
    if (this.gridster.$options.enableEmptyCellDrag && !this.emptyCellDrag && this.gridster.options.emptyCellDragCallback) {
      this.emptyCellDrag = this.gridster.renderer.listen(this.gridster.el, 'mousedown', this.emptyCellMouseDown.bind(this));
      this.emptyCellDragTouch = this.gridster.renderer.listen(this.gridster.el, 'touchstart', this.emptyCellMouseDown.bind(this));
    } else if (!this.gridster.$options.enableEmptyCellDrag && this.emptyCellDrag && this.emptyCellDragTouch) {
      this.emptyCellDrag();
      this.emptyCellDragTouch();
      this.emptyCellDrag = null;
      this.emptyCellDragTouch = null;
    }
  }

  /**
   * Executes `emptyCellClickCb` to handle empty cell click cb.
   * @zh 执行 `emptyCellClickCb`，用于空单元格点击Cb。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  emptyCellClickCb(e): void {
    if (this.gridster.movingItem || GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
      return;
    }
    const item = this.getValidItemFromEvent(e);
    if (!item) {
      return;
    }
    if (this.gridster.options.emptyCellClickCallback) {
      this.gridster.options.emptyCellClickCallback(e, item);
    }
    this.gridster.cdRef.markForCheck();
  }

  /**
   * Executes `emptyCellContextMenuCb` to handle empty cell context menu cb.
   * @zh 执行 `emptyCellContextMenuCb`，用于空单元格上下文菜单Cb。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  emptyCellContextMenuCb(e): void {
    if (this.gridster.movingItem || GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const item = this.getValidItemFromEvent(e);
    if (!item) {
      return;
    }
    if (this.gridster.options.emptyCellContextMenuCallback) {
      this.gridster.options.emptyCellContextMenuCallback(e, item);
    }
    this.gridster.cdRef.markForCheck();
  }

  /**
   * Executes `emptyCellDragDrop` to handle empty cell drag drop.
   * @zh 执行 `emptyCellDragDrop`，用于空单元格拖拽放置。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  emptyCellDragDrop(e): void {
    const item = this.getValidItemFromEvent(e);
    if (!item) {
      return;
    }
    if (this.gridster.options.emptyCellDropCallback) {
      this.gridster.options.emptyCellDropCallback(e, item);
    }
    this.gridster.cdRef.markForCheck();
  }

  /**
   * Executes `emptyCellDragOver` to handle empty cell drag over.
   * @zh 执行 `emptyCellDragOver`，用于空单元格拖拽越过。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  emptyCellDragOver(e): void {
    e.preventDefault();
    e.stopPropagation();
    const item = this.getValidItemFromEvent(e);
    if (item) {
      e.dataTransfer.dropEffect = 'move';
      this.gridster.movingItem = item;
    } else {
      e.dataTransfer.dropEffect = 'none';
      this.gridster.movingItem = null;
    }
    this.gridster.previewStyle();
  }

  /**
   * Executes `emptyCellMouseDown` to handle empty cell mouse down.
   * @zh 执行 `emptyCellMouseDown`，用于空单元格鼠标向下。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  emptyCellMouseDown(e): void {
    if (GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const item = this.getValidItemFromEvent(e);
    const leftMouseButtonCode = 1;
    if (!item || e.buttons !== leftMouseButtonCode) {
      return;
    }
    this.initialItem = item;
    this.gridster.movingItem = item;
    this.gridster.previewStyle();
    this.gridster.zone.runOutsideAngular(() => {
      this.emptyCellMMove = this.gridster.renderer.listen('window', 'mousemove', this.emptyCellMouseMove.bind(this));
      this.emptyCellMMoveTouch = this.gridster.renderer.listen('window', 'touchmove', this.emptyCellMouseMove.bind(this));
    });
    this.emptyCellUp = this.gridster.renderer.listen('window', 'mouseup', this.emptyCellMouseUp.bind(this));
    this.emptyCellUpTouch = this.gridster.renderer.listen('window', 'touchend', this.emptyCellMouseUp.bind(this));
  }

  /**
   * Executes `emptyCellMouseMove` to handle empty cell mouse move.
   * @zh 执行 `emptyCellMouseMove`，用于空单元格鼠标移动。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  emptyCellMouseMove(e): void {
    e.preventDefault();
    e.stopPropagation();
    const item = this.getValidItemFromEvent(e, this.initialItem);
    if (!item) {
      return;
    }

    this.gridster.movingItem = item;
    this.gridster.previewStyle();
  }

  /**
   * Executes `emptyCellMouseUp` to handle empty cell mouse up.
   * @zh 执行 `emptyCellMouseUp`，用于空单元格鼠标向上。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  emptyCellMouseUp(e): void {
    this.emptyCellMMove();
    this.emptyCellMMoveTouch();
    this.emptyCellUp();
    this.emptyCellUpTouch();
    const item = this.getValidItemFromEvent(e, this.initialItem);
    if (item) {
      this.gridster.movingItem = item;
    }
    if (this.gridster.options.emptyCellDragCallback && this.gridster.movingItem) {
      this.gridster.options.emptyCellDragCallback(e, this.gridster.movingItem);
    }
    setTimeout(() => {
      this.initialItem = null;
      if (this.gridster) {
        this.gridster.movingItem = null;
        this.gridster.previewStyle();
      }
    });
    this.gridster.cdRef.markForCheck();
  }

  /**
   * Executes `getValidItemFromEvent` to handle get valid item from event.
   * @zh 执行 `getValidItemFromEvent`，用于获取有效条目从事件。
   * @param e - e parameter (`any`) / e参数（`any`）
   * @param oldItem - old item parameter (`GridsterItem`) / 旧条目参数（`GridsterItem`）
   * @returns Result of type `GridsterItem` / 类型为 `GridsterItem` 的返回值
   */
  getValidItemFromEvent(e, oldItem?: GridsterItem | null): GridsterItem | undefined {
    e.preventDefault();
    e.stopPropagation();
    GridsterUtils.checkTouchEvent(e);
    const rect = this.gridster.el.getBoundingClientRect();
    const x = e.clientX + this.gridster.el.scrollLeft - rect.left - this.gridster.gridRenderer.getLeftMargin();
    const y = e.clientY + this.gridster.el.scrollTop - rect.top - this.gridster.gridRenderer.getTopMargin();
    const item: GridsterItem = {
      x: this.gridster.pixelsToPositionX(x, Math.floor, true),
      y: this.gridster.pixelsToPositionY(y, Math.floor, true),
      cols: this.gridster.$options.defaultItemCols,
      rows: this.gridster.$options.defaultItemRows
    };
    if (oldItem) {
      item.cols = Math.min(Math.abs(oldItem.x - item.x) + 1, this.gridster.$options.emptyCellDragMaxCols);
      item.rows = Math.min(Math.abs(oldItem.y - item.y) + 1, this.gridster.$options.emptyCellDragMaxRows);
      if (oldItem.x < item.x) {
        item.x = oldItem.x;
      } else if (oldItem.x - item.x > this.gridster.$options.emptyCellDragMaxCols - 1) {
        item.x = this.gridster.movingItem ? this.gridster.movingItem.x : 0;
      }
      if (oldItem.y < item.y) {
        item.y = oldItem.y;
      } else if (oldItem.y - item.y > this.gridster.$options.emptyCellDragMaxRows - 1) {
        item.y = this.gridster.movingItem ? this.gridster.movingItem.y : 0;
      }
    }
    if (!this.gridster.$options.enableOccupiedCellDrop && this.gridster.checkCollision(item)) {
      return undefined;
    }
    return item;
  }
}
