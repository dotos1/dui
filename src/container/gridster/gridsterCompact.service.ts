/**
 * @fileoverview Module `src/container/gridster/gridsterCompact.service.ts` providing gridster compact service definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterCompact.service.ts`，提供网格拖拽布局紧凑服务相关的定义与实现。
 */

import {Injectable} from '@angular/core';
import {GridsterComponentInterface} from './gridster.interface';
import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';
import {GridsterItem} from './gridsterItem.interface';
import {CompactType} from './gridsterConfig.interface';

/**
 * Injectable Angular service `GridsterCompact` managing gridster compact state and operations in `src/container/gridster`.
 * @zh 可注入的 Angular 服务 `GridsterCompact`，管理 `src/container/gridster` 中的网格拖拽布局紧凑状态与业务操作。
 */
@Injectable()
export class GridsterCompact {

  /**
   * Creates an instance of `GridsterCompact` and initializes its dependencies and internal state.
   * @zh 创建 `GridsterCompact` 实例，并初始化其依赖项与内部状态。
   * @param gridster - Injected or initial gridster (`GridsterComponentInterface`) / 注入或传入的网格拖拽布局（`GridsterComponentInterface`）
   */
  constructor(private gridster: GridsterComponentInterface) {
  }

  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   */
  destroy(): void {
    delete this.gridster;
  }

  /**
   * Executes `checkCompact` to handle check compact.
   * @zh 执行 `checkCompact`，用于检查紧凑。
   */
  checkCompact(): void {
    if (this.gridster.$options.compactType !== CompactType.None) {
      if (this.gridster.$options.compactType === CompactType.CompactUp) {
        this.checkCompactUp();
      } else if (this.gridster.$options.compactType === CompactType.CompactLeft) {
        this.checkCompactLeft();
      } else if (this.gridster.$options.compactType === CompactType.CompactUpAndLeft) {
        this.checkCompactUp();
        this.checkCompactLeft();
      } else if (this.gridster.$options.compactType === CompactType.CompactLeftAndUp) {
        this.checkCompactLeft();
        this.checkCompactUp();
      } else if (this.gridster.$options.compactType === CompactType.CompactRight) {
        this.checkCompactRight();
      } else if (this.gridster.$options.compactType === CompactType.CompactUpAndRight) {
        this.checkCompactUp();
        this.checkCompactRight();
      } else if (this.gridster.$options.compactType === CompactType.CompactRightAndUp) {
        this.checkCompactRight();
        this.checkCompactUp();
      }
    }
  }

  /**
   * Executes `checkCompactItem` to handle check compact item.
   * @zh 执行 `checkCompactItem`，用于检查紧凑条目。
   * @param item - item parameter (`GridsterItem`) / 条目参数（`GridsterItem`）
   */
  checkCompactItem(item: GridsterItem): void {
    if (this.gridster.$options.compactType !== CompactType.None) {
      if (this.gridster.$options.compactType === CompactType.CompactUp) {
        this.moveUpTillCollision(item);
      } else if (this.gridster.$options.compactType === CompactType.CompactLeft) {
        this.moveLeftTillCollision(item);
      } else if (this.gridster.$options.compactType === CompactType.CompactUpAndLeft) {
        this.moveUpTillCollision(item);
        this.moveLeftTillCollision(item);
      } else if (this.gridster.$options.compactType === CompactType.CompactLeftAndUp) {
        this.moveLeftTillCollision(item);
        this.moveUpTillCollision(item);
      } else if (this.gridster.$options.compactType === CompactType.CompactUpAndRight) {
        this.moveUpTillCollision(item);
        this.moveRightTillCollision(item);
      }
    }
  }

  /**
   * Executes `checkCompactUp` to handle check compact up.
   * @zh 执行 `checkCompactUp`，用于检查紧凑向上。
   */
  checkCompactUp(): void {
    let widgetMovedUp = false, widget: GridsterItemComponentInterface, moved: boolean;
    const l = this.gridster.grid.length;
    for (let i = 0; i < l; i++) {
      widget = this.gridster.grid[i];
      if (widget.$item.compactEnabled === false) {
        continue;
      }
      moved = this.moveUpTillCollision(widget.$item);
      if (moved) {
        widgetMovedUp = true;
        widget.item.y = widget.$item.y;
        widget.itemChanged();
      }
    }
    if (widgetMovedUp) {
      this.checkCompact();
    }
  }

  /**
   * Executes `moveUpTillCollision` to handle move up till collision.
   * @zh 执行 `moveUpTillCollision`，用于移动向上TillCollision。
   * @param item - item parameter (`GridsterItem`) / 条目参数（`GridsterItem`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  moveUpTillCollision(item: GridsterItem): boolean {
    item.y -= 1;
    if (this.gridster.checkCollision(item)) {
      item.y += 1;
      return false;
    } else {
      this.moveUpTillCollision(item);
      return true;
    }
  }

  /**
   * Executes `checkCompactLeft` to handle check compact left.
   * @zh 执行 `checkCompactLeft`，用于检查紧凑左侧位置。
   */
  checkCompactLeft(): void {
    let widgetMovedUp = false, widget: GridsterItemComponentInterface, moved: boolean;
    const l = this.gridster.grid.length;
    for (let i = 0; i < l; i++) {
      widget = this.gridster.grid[i];
      if (widget.$item.compactEnabled === false) {
        continue;
      }
      moved = this.moveLeftTillCollision(widget.$item);
      if (moved) {
        widgetMovedUp = true;
        widget.item.x = widget.$item.x;
        widget.itemChanged();
      }
    }
    if (widgetMovedUp) {
      this.checkCompact();
    }
  }

  /**
   * Executes `checkCompactRight` to handle check compact right.
   * @zh 执行 `checkCompactRight`，用于检查紧凑右侧位置。
   */
  checkCompactRight(): void {
    let widgetMovedUp = false, widget: GridsterItemComponentInterface, moved: boolean;
    const l = this.gridster.grid.length;
    for (let i = 0; i < l; i++) {
      widget = this.gridster.grid[i];
      if (widget.$item.compactEnabled === false) {
        continue;
      }
      moved = this.moveRightTillCollision(widget.$item);
      if (moved) {
        widgetMovedUp = true;
        widget.item.x = widget.$item.x;
        widget.itemChanged();
      }
    }
    if (widgetMovedUp) {
      this.checkCompact();
    }
  }

  /**
   * Executes `moveLeftTillCollision` to handle move left till collision.
   * @zh 执行 `moveLeftTillCollision`，用于移动左侧位置TillCollision。
   * @param item - item parameter (`GridsterItem`) / 条目参数（`GridsterItem`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  moveLeftTillCollision(item: GridsterItem): boolean {
    item.x -= 1;
    if (this.gridster.checkCollision(item)) {
      item.x += 1;
      return false;
    } else {
      this.moveLeftTillCollision(item);
      return true;
    }
  }

  /**
   * Executes `moveRightTillCollision` to handle move right till collision.
   * @zh 执行 `moveRightTillCollision`，用于移动右侧位置TillCollision。
   * @param item - item parameter (`any`) / 条目参数（`any`）
   */
  moveRightTillCollision(item) {
    item.x += 1;
    if (this.gridster.checkCollision(item)) {
      item.x -= 1;
      return false;
    } else {
      this.moveRightTillCollision(item);
      return true;
    }
  }
}
