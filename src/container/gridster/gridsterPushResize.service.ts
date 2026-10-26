/**
 * @fileoverview Module `src/container/gridster/gridsterPushResize.service.ts` providing gridster push resize service definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterPushResize.service.ts`，提供网格拖拽布局推入调整尺寸服务相关的定义与实现。
 */

import {Injectable} from '@angular/core';

import {GridsterItem} from './gridsterItem.interface';
import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';
import {GridsterComponentInterface} from './gridster.interface';

/**
 * Injectable Angular service `GridsterPushResize` managing gridster push resize state and operations in `src/container/gridster`.
 * @zh 可注入的 Angular 服务 `GridsterPushResize`，管理 `src/container/gridster` 中的网格拖拽布局推入调整尺寸状态与业务操作。
 */
@Injectable()
export class GridsterPushResize {
  /**
   * Property `fromSouth` (`string`) storing from south.
   * @zh 属性 `fromSouth`（类型：`string`），用于存储或配置从South。
   */
  public fromSouth: string;
  /**
   * Property `fromNorth` (`string`) storing from north.
   * @zh 属性 `fromNorth`（类型：`string`），用于存储或配置从North。
   */
  public fromNorth: string;
  /**
   * Property `fromEast` (`string`) storing from east.
   * @zh 属性 `fromEast`（类型：`string`），用于存储或配置从East。
   */
  public fromEast: string;
  /**
   * Property `fromWest` (`string`) storing from west.
   * @zh 属性 `fromWest`（类型：`string`），用于存储或配置从West。
   */
  public fromWest: string;
  /**
   * Property `pushedItems` (`Array<GridsterItemComponentInterface>`) storing pushed items.
   * @zh 属性 `pushedItems`（类型：`Array<GridsterItemComponentInterface>`），用于存储或配置已推入条目列表。
   */
  private pushedItems: Array<GridsterItemComponentInterface>;
  /**
   * Property `pushedItemsPath` (`Array<Array<GridsterItem>>`) storing pushed items path.
   * @zh 属性 `pushedItemsPath`（类型：`Array<Array<GridsterItem>>`），用于存储或配置已推入条目列表路径。
   */
  private pushedItemsPath: Array<Array<GridsterItem>>;
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
   * Property `tryPattern` (`{ fromEast: Function, fromWest: Function, fromNorth: Function, fromSou...`) storing try pattern.
   * @zh 属性 `tryPattern`（类型：`{ fromEast: Function, fromWest: Function, fromNorth: Function, fromSou...`），用于存储或配置try模式/图案。
   */
  private tryPattern: {
    fromEast: Function,
    fromWest: Function,
    fromNorth: Function,
    fromSouth: Function,
    [key: string]: Function
  };

  /**
   * Creates an instance of `GridsterPushResize` and initializes its dependencies and internal state.
   * @zh 创建 `GridsterPushResize` 实例，并初始化其依赖项与内部状态。
   * @param gridsterItem - Injected or initial gridster item (`GridsterItemComponentInterface`) / 注入或传入的网格拖拽布局条目（`GridsterItemComponentInterface`）
   */
  constructor(gridsterItem: GridsterItemComponentInterface) {
    this.pushedItems = [];
    this.pushedItemsPath = [];
    this.gridsterItem = gridsterItem;
    this.gridster = gridsterItem.gridster;
    this.tryPattern = {
      fromEast: this.tryWest,
      fromWest: this.tryEast,
      fromNorth: this.trySouth,
      fromSouth: this.tryNorth
    };
    this.fromSouth = 'fromSouth';
    this.fromNorth = 'fromNorth';
    this.fromEast = 'fromEast';
    this.fromWest = 'fromWest';
  }

  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   */
  destroy(): void {
    delete this.gridster;
    delete this.gridsterItem;
  }

  /**
   * Executes `pushItems` to handle push items.
   * @zh 执行 `pushItems`，用于推入条目列表。
   * @param direction - direction parameter (`string`) / 方向参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  pushItems(direction: string): boolean {
    if (this.gridster.$options.pushResizeItems) {
      return this.push(this.gridsterItem, direction);
    } else {
      return false;
    }
  }

  /**
   * Executes `restoreItems` to handle restore items.
   * @zh 执行 `restoreItems`，用于还原条目列表。
   */
  restoreItems(): void {
    let i = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItemComponentInterface;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      pushedItem.$item.x = pushedItem.item.x || 0;
      pushedItem.$item.y = pushedItem.item.y || 0;
      pushedItem.$item.cols = pushedItem.item.cols || 1;
      pushedItem.$item['row'] = pushedItem.item['row'] || 1;
      pushedItem.setSize();
    }
    this.pushedItems = [];
    this.pushedItemsPath = [];
  }

  /**
   * Executes `setPushedItems` to handle set pushed items.
   * @zh 执行 `setPushedItems`，用于集合已推入条目列表。
   */
  setPushedItems() {
    let i = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItemComponentInterface;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      pushedItem.checkItemChanges(pushedItem.$item, pushedItem.item);
    }
    this.pushedItems = [];
    this.pushedItemsPath = [];
  }

  /**
   * Executes `checkPushBack` to handle check push back.
   * @zh 执行 `checkPushBack`，用于检查推入返回。
   */
  checkPushBack(): void {
    let i: number = this.pushedItems.length - 1;
    let change = false;
    for (; i > -1; i--) {
      if (this.checkPushedItem(this.pushedItems[i], i)) {
        change = true;
      }
    }
    if (change) {
      this.checkPushBack();
    }
  }

  /**
   * Executes `push` to handle push.
   * @zh 执行 `push`，用于推入。
   * @param gridsterItem - gridster item parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目参数（`GridsterItemComponentInterface`）
   * @param direction - direction parameter (`string`) / 方向参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private push(gridsterItem: GridsterItemComponentInterface, direction: string): boolean {
    const gridsterItemCollision = this.gridster.checkCollision(gridsterItem.$item);
    if (gridsterItemCollision && gridsterItemCollision !== true &&
      gridsterItemCollision !== this.gridsterItem && gridsterItemCollision.canBeResized()) {
      if (this.tryPattern[direction].call(this, gridsterItemCollision, gridsterItem, direction)) {
        return true;
      }
    } else if (gridsterItemCollision === false) {
      return true;
    }
    return false;
  }

  /**
   * Executes `trySouth` to handle try south.
   * @zh 执行 `trySouth`，用于trySouth。
   * @param gridsterItemCollide - gridster item collide parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目Collide参数（`GridsterItemComponentInterface`）
   * @param gridsterItem - gridster item parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目参数（`GridsterItemComponentInterface`）
   * @param direction - direction parameter (`string`) / 方向参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private trySouth(gridsterItemCollide: GridsterItemComponentInterface, gridsterItem: GridsterItemComponentInterface,
                   direction: string): boolean {
    const backUpY = gridsterItemCollide.$item.y;
    const backUpRows = gridsterItemCollide.$item.rows;
    gridsterItemCollide.$item.y = gridsterItem.$item.y + gridsterItem.$item.rows;
    gridsterItemCollide.$item.rows = backUpRows + backUpY - gridsterItemCollide.$item.y;
    if (!this.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
      && !this.gridster.checkGridCollision(gridsterItemCollide.$item)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.y = backUpY;
      gridsterItemCollide.$item.rows = backUpRows;
    }
    return false;
  }

  /**
   * Executes `tryNorth` to handle try north.
   * @zh 执行 `tryNorth`，用于tryNorth。
   * @param gridsterItemCollide - gridster item collide parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目Collide参数（`GridsterItemComponentInterface`）
   * @param gridsterItem - gridster item parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目参数（`GridsterItemComponentInterface`）
   * @param direction - direction parameter (`string`) / 方向参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private tryNorth(gridsterItemCollide: GridsterItemComponentInterface, gridsterItem: GridsterItemComponentInterface,
                   direction: string): boolean {
    const backUpRows = gridsterItemCollide.$item.rows;
    gridsterItemCollide.$item.rows = gridsterItem.$item.y - gridsterItemCollide.$item.y;
    if (!this.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
      && !this.gridster.checkGridCollision(gridsterItemCollide.$item)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.rows = backUpRows;
    }
    return false;
  }

  /**
   * Executes `tryEast` to handle try east.
   * @zh 执行 `tryEast`，用于tryEast。
   * @param gridsterItemCollide - gridster item collide parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目Collide参数（`GridsterItemComponentInterface`）
   * @param gridsterItem - gridster item parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目参数（`GridsterItemComponentInterface`）
   * @param direction - direction parameter (`string`) / 方向参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private tryEast(gridsterItemCollide: GridsterItemComponentInterface, gridsterItem: GridsterItemComponentInterface,
                  direction: string): boolean {
    const backUpX = gridsterItemCollide.$item.x;
    const backUpCols = gridsterItemCollide.$item.cols;
    gridsterItemCollide.$item.x = gridsterItem.$item.x + gridsterItem.$item.cols;
    gridsterItemCollide.$item.cols = backUpCols + backUpX - gridsterItemCollide.$item.x;
    if (!this.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
      && !this.gridster.checkGridCollision(gridsterItemCollide.$item)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.x = backUpX;
      gridsterItemCollide.$item.cols = backUpCols;
    }
    return false;
  }

  /**
   * Executes `tryWest` to handle try west.
   * @zh 执行 `tryWest`，用于tryWest。
   * @param gridsterItemCollide - gridster item collide parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目Collide参数（`GridsterItemComponentInterface`）
   * @param gridsterItem - gridster item parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目参数（`GridsterItemComponentInterface`）
   * @param direction - direction parameter (`string`) / 方向参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private tryWest(gridsterItemCollide: GridsterItemComponentInterface, gridsterItem: GridsterItemComponentInterface,
                  direction: string): boolean {
    const backUpCols = gridsterItemCollide.$item.cols;
    gridsterItemCollide.$item.cols = gridsterItem.$item.x - gridsterItemCollide.$item.x;
    if (!this.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
      && !this.gridster.checkGridCollision(gridsterItemCollide.$item)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.cols = backUpCols;
    }
    return false;
  }

  /**
   * Executes `addToPushed` to handle add to pushed.
   * @zh 执行 `addToPushed`，用于添加转换为已推入。
   * @param gridsterItem - gridster item parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目参数（`GridsterItemComponentInterface`）
   */
  private addToPushed(gridsterItem: GridsterItemComponentInterface): void {
    if (this.pushedItems.indexOf(gridsterItem) < 0) {
      this.pushedItems.push(gridsterItem);
      this.pushedItemsPath.push([
        {
          x: gridsterItem.item.x || 0,
          y: gridsterItem.item.y || 0,
          cols: gridsterItem.item.cols || 0,
          rows: gridsterItem.item.rows || 0
        },
        {
          x: gridsterItem.$item.x,
          y: gridsterItem.$item.y,
          cols: gridsterItem.$item.cols,
          rows: gridsterItem.$item.rows
        }]);
    } else {
      const i = this.pushedItems.indexOf(gridsterItem);
      this.pushedItemsPath[i].push(
        {
          x: gridsterItem.$item.x,
          y: gridsterItem.$item.y,
          cols: gridsterItem.$item.cols,
          rows: gridsterItem.$item.rows
        });
    }
  }

  /**
   * Executes `removeFromPushed` to handle remove from pushed.
   * @zh 执行 `removeFromPushed`，用于移除从已推入。
   * @param i - i parameter (`number`) / i参数（`number`）
   */
  private removeFromPushed(i: number): void {
    if (i > -1) {
      this.pushedItems.splice(i, 1);
      this.pushedItemsPath.splice(i, 1);
    }
  }

  /**
   * Executes `checkPushedItem` to handle check pushed item.
   * @zh 执行 `checkPushedItem`，用于检查已推入条目。
   * @param pushedItem - pushed item parameter (`GridsterItemComponentInterface`) / 已推入条目参数（`GridsterItemComponentInterface`）
   * @param i - i parameter (`number`) / i参数（`number`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private checkPushedItem(pushedItem: GridsterItemComponentInterface, i: number): boolean {
    const path = this.pushedItemsPath[i];
    let j = path.length - 2;
    let lastPosition: { x: number, y: number, cols: number, rows: number }, x, y, cols, rows;
    for (; j > -1; j--) {
      lastPosition = path[j];
      x = pushedItem.$item.x;
      y = pushedItem.$item.y;
      cols = pushedItem.$item.cols;
      rows = pushedItem.$item.rows;
      pushedItem.$item.x = lastPosition.x;
      pushedItem.$item.y = lastPosition.y;
      pushedItem.$item.cols = lastPosition.cols;
      pushedItem.$item.rows = lastPosition.rows;
      if (!this.gridster.findItemWithItem(pushedItem.$item)) {
        pushedItem.setSize();
        path.splice(j + 1, path.length - 1 - j);
      } else {
        pushedItem.$item.x = x;
        pushedItem.$item.y = y;
        pushedItem.$item.cols = cols;
        pushedItem.$item.rows = rows;
      }
    }
    if (path.length < 2) {
      this.removeFromPushed(i);
      return true;
    }
    return false;
  }
}
