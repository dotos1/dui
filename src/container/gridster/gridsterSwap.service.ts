/**
 * @fileoverview Module `src/container/gridster/gridsterSwap.service.ts` providing gridster swap service definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterSwap.service.ts`，提供网格拖拽布局Swap服务相关的定义与实现。
 */

import {Injectable} from '@angular/core';

import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';
import {GridsterComponentInterface} from './gridster.interface';

/**
 * Injectable Angular service `GridsterSwap` managing gridster swap state and operations in `src/container/gridster`.
 * @zh 可注入的 Angular 服务 `GridsterSwap`，管理 `src/container/gridster` 中的网格拖拽布局Swap状态与业务操作。
 */
@Injectable()
export class GridsterSwap {
  /**
   * Property `swapedItem` (`GridsterItemComponentInterface`) storing swaped item.
   * @zh 属性 `swapedItem`（类型：`GridsterItemComponentInterface`），用于存储或配置swaped条目。
   */
  private swapedItem: GridsterItemComponentInterface | undefined;
  /**
   * Property `gridsterItem` (`GridsterItemComponentInterface`) storing gridster item.
   * @zh 属性 `gridsterItem`（类型：`GridsterItemComponentInterface`），用于存储或配置网格拖拽布局条目。
   */
  private gridsterItem: GridsterItemComponentInterface;
  /**
   * Property `gridster` (`GridsterComponentInterface`) storing gridster.
   * @zh 属性 `gridster`（类型：`GridsterComponentInterface`），用于存储或配置网格拖拽布局。
   */
  private gridster: GridsterComponentInterface;

  /**
   * Creates an instance of `GridsterSwap` and initializes its dependencies and internal state.
   * @zh 创建 `GridsterSwap` 实例，并初始化其依赖项与内部状态。
   * @param gridsterItem - Injected or initial gridster item (`GridsterItemComponentInterface`) / 注入或传入的网格拖拽布局条目（`GridsterItemComponentInterface`）
   */
  constructor(gridsterItem: GridsterItemComponentInterface) {
    this.gridsterItem = gridsterItem;
    this.gridster = gridsterItem.gridster;
  }

  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   */
  destroy(): void {
    delete this.gridster;
    delete this.gridsterItem;
    delete this.swapedItem;
  }

  /**
   * Executes `swapItems` to handle swap items.
   * @zh 执行 `swapItems`，用于swap条目列表。
   */
  swapItems(): void {
    if (this.gridster.$options.swap) {
      this.checkSwapBack();
      this.checkSwap(this.gridsterItem);
    }
  }

  /**
   * Executes `checkSwapBack` to handle check swap back.
   * @zh 执行 `checkSwapBack`，用于检查Swap返回。
   */
  checkSwapBack(): void {
    if (this.swapedItem) {
      const x: number = this.swapedItem.$item.x;
      const y: number = this.swapedItem.$item.y;
      this.swapedItem.$item.x = this.swapedItem.item.x || 0;
      this.swapedItem.$item.y = this.swapedItem.item.y || 0;
      if (this.gridster.checkCollision(this.swapedItem.$item)) {
        this.swapedItem.$item.x = x;
        this.swapedItem.$item.y = y;
      } else {
        this.swapedItem.setSize();
        this.gridsterItem.$item.x = this.gridsterItem.item.x || 0;
        this.gridsterItem.$item.y = this.gridsterItem.item.y || 0;
        this.swapedItem = undefined;
      }

    }
  }

  /**
   * Executes `restoreSwapItem` to handle restore swap item.
   * @zh 执行 `restoreSwapItem`，用于还原Swap条目。
   */
  restoreSwapItem(): void {
    if (this.swapedItem) {
      this.swapedItem.$item.x = this.swapedItem.item.x || 0;
      this.swapedItem.$item.y = this.swapedItem.item.y || 0;
      this.swapedItem.setSize();
      this.swapedItem = undefined;
    }
  }

  /**
   * Executes `setSwapItem` to handle set swap item.
   * @zh 执行 `setSwapItem`，用于集合Swap条目。
   */
  setSwapItem(): void {
    if (this.swapedItem) {
      this.swapedItem.checkItemChanges(this.swapedItem.$item, this.swapedItem.item);
      this.swapedItem = undefined;
    }
  }

  /**
   * Executes `checkSwap` to handle check swap.
   * @zh 执行 `checkSwap`，用于检查Swap。
   * @param pushedBy - pushed by parameter (`GridsterItemComponentInterface`) / 已推入按参数（`GridsterItemComponentInterface`）
   */
  checkSwap(pushedBy: GridsterItemComponentInterface): void {
    let gridsterItemCollision;
    if (this.gridster.$options.swapWhileDragging) {
      gridsterItemCollision = this.gridster.checkCollisionForSwaping(pushedBy.$item);
    }else{
      gridsterItemCollision = this.gridster.checkCollision(pushedBy.$item);
    }
    if (gridsterItemCollision && gridsterItemCollision !== true && gridsterItemCollision.canBeDragged()) {
      const gridsterItemCollide: GridsterItemComponentInterface = gridsterItemCollision;
      const copyCollisionX = gridsterItemCollide.$item.x;
      const copyCollisionY = gridsterItemCollide.$item.y;
      const copyX = pushedBy.$item.x;
      const copyY = pushedBy.$item.y;
      gridsterItemCollide.$item.x = pushedBy.item.x || 0;
      gridsterItemCollide.$item.y = pushedBy.item.y || 0;
      pushedBy.$item.x = gridsterItemCollide.item.x || 0;
      pushedBy.$item.y = gridsterItemCollide.item.y || 0;
      if (this.gridster.checkCollision(gridsterItemCollide.$item) || this.gridster.checkCollision(pushedBy.$item)) {
        pushedBy.$item.x = copyX;
        pushedBy.$item.y = copyY;
        gridsterItemCollide.$item.x = copyCollisionX;
        gridsterItemCollide.$item.y = copyCollisionY;
      } else {
        gridsterItemCollide.setSize();
        this.swapedItem = gridsterItemCollide;
        if (this.gridster.$options.swapWhileDragging) {
          this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.gridsterItem.item);
          this.setSwapItem();
        }
      }
    }
  }
}
