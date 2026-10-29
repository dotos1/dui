/**
 * @fileoverview Module `src/container/gridster/gridsterPush.service.ts` providing gridster push service definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterPush.service.ts`，提供网格拖拽布局推入服务相关的定义与实现。
 */

import {Injectable} from '@angular/core';

import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';
import {GridsterComponentInterface} from './gridster.interface';

/**
 * Injectable Angular service `GridsterPush` managing gridster push state and operations in `src/container/gridster`.
 * @zh 可注入的 Angular 服务 `GridsterPush`，管理 `src/container/gridster` 中的网格拖拽布局推入状态与业务操作。
 */
@Injectable()
export class GridsterPush {
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
   * Property `pushedItems` (`GridsterItemComponentInterface[]`) storing pushed items.
   * @zh 属性 `pushedItems`（类型：`GridsterItemComponentInterface[]`），用于存储或配置已推入条目列表。
   */
  private pushedItems: Array<GridsterItemComponentInterface>;
  /**
   * Property `pushedItemsTemp` (`GridsterItemComponentInterface[]`) storing pushed items temp.
   * @zh 属性 `pushedItemsTemp`（类型：`GridsterItemComponentInterface[]`），用于存储或配置已推入条目列表临时。
   */
  private pushedItemsTemp: Array<GridsterItemComponentInterface>;
  /**
   * Property `pushedItemsTempPath` (`{ x: number; y: number; }[][]`) storing pushed items temp path.
   * @zh 属性 `pushedItemsTempPath`（类型：`{ x: number; y: number; }[][]`），用于存储或配置已推入条目列表临时路径。
   */
  private pushedItemsTempPath: Array<Array<{ x: number, y: number }>>;
  /**
   * Property `pushedItemsPath` (`{ x: number; y: number; }[][]`) storing pushed items path.
   * @zh 属性 `pushedItemsPath`（类型：`{ x: number; y: number; }[][]`），用于存储或配置已推入条目列表路径。
   */
  private pushedItemsPath: Array<Array<{ x: number, y: number }>>;
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
   * Property `pushedItemsOrder` (`GridsterItemComponentInterface[]`) storing pushed items order.
   * @zh 属性 `pushedItemsOrder`（类型：`GridsterItemComponentInterface[]`），用于存储或配置已推入条目列表顺序。
   */
  private pushedItemsOrder: Array<GridsterItemComponentInterface>;
  /**
   * Property `tryPattern` (`{…}`) storing try pattern.
   * @zh 属性 `tryPattern`（类型：`{…}`），用于存储或配置try模式/图案。
   */
  private tryPattern: {
    fromEast: Array<Function>,
    fromWest: Array<Function>,
    fromNorth: Array<Function>,
    fromSouth: Array<Function>,
    [key: string]: Array<Function>
  };

  /**
   * Creates an instance of `GridsterPush` and initializes its dependencies and internal state.
   * @zh 创建 `GridsterPush` 实例，并初始化其依赖项与内部状态。
   * @param gridsterItem - Injected or initial gridster item (`GridsterItemComponentInterface`) / 注入或传入的网格拖拽布局条目（`GridsterItemComponentInterface`）
   */
  constructor(gridsterItem: GridsterItemComponentInterface) {
    this.pushedItems = [];
    this.pushedItemsTemp = [];
    this.pushedItemsTempPath = [];
    this.pushedItemsPath = [];
    gridsterItem['id'] = this.generateTempRandomId();
    this.gridsterItem = gridsterItem;
    this.gridster = gridsterItem.gridster;
    this.tryPattern = {
      fromEast: [this.tryWest, this.trySouth, this.tryNorth, this.tryEast],
      fromWest: [this.tryEast, this.trySouth, this.tryNorth, this.tryWest],
      fromNorth: [this.trySouth, this.tryEast, this.tryWest, this.tryNorth],
      fromSouth: [this.tryNorth, this.tryEast, this.tryWest, this.trySouth]
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
   * @param disable - disable parameter (`boolean`) / 禁用参数（`boolean`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  pushItems(direction: string, disable?: boolean): boolean {
    if (this.gridster.$options.pushItems && !disable) {
      this.pushedItemsOrder = [];
      const pushed = this.push(this.gridsterItem, direction);
      if (!pushed) {
        this.restoreTempItems();
      }
      this.pushedItemsOrder = [];
      this.pushedItemsTemp = [];
      this.pushedItemsTempPath = [];
      this.cleanTempIds();
      return pushed;
    } else {
      return false;
    }
  }

  /**
   * Executes `restoreTempItems` to handle restore temp items.
   * @zh 执行 `restoreTempItems`，用于还原临时条目列表。
   */
  restoreTempItems(): void {
    let i = this.pushedItemsTemp.length - 1;
    for (; i > -1; i--) {
      this.removeFromTempPushed(this.pushedItemsTemp[i]);
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
   * Executes `generateTempRandomId` to handle generate temp random id.
   * @zh 执行 `generateTempRandomId`，用于生成临时随机唯一标识。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private generateTempRandomId() : string {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
  }

  /**
   * Executes `cleanTempIds` to handle clean temp ids.
   * @zh 执行 `cleanTempIds`，用于清理临时标识列表。
   */
  private cleanTempIds(){
    const allItemsWithIds = this.gridster.grid.filter((el:GridsterItemComponentInterface) => el['id']);
    allItemsWithIds.forEach((el: GridsterItemComponentInterface) => delete el['id']);
  }

  /**
   * Executes `push` to handle push.
   * @zh 执行 `push`，用于推入。
   * @param gridsterItem - gridster item parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目参数（`GridsterItemComponentInterface`）
   * @param direction - direction parameter (`string`) / 方向参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private push(gridsterItem: GridsterItemComponentInterface, direction: string): boolean {
    if (this.gridster.checkGridCollision(gridsterItem.$item)) {
      return false;
    }
    if (direction === '') {
      return false;
    }
    const a: Array<GridsterItemComponentInterface> = this.gridster.findItemsWithItem(gridsterItem.$item);
    let i = a.length - 1, itemCollision: GridsterItemComponentInterface;
    let makePush = true;
    const b: Array<GridsterItemComponentInterface> = [];
    for (; i > -1; i--) {
      itemCollision = a[i];
      if (!itemCollision['id']) {
        itemCollision['id'] = this.generateTempRandomId();
      }
      if (itemCollision === this.gridsterItem) {
        makePush = false;
        break;
      }
      if (!itemCollision.canBeDragged()) {
        makePush = false;
        break;
      }
      const compare = this.pushedItemsTemp.find((el: GridsterItemComponentInterface) => {
        return el['id'] === itemCollision['id'];
      });
      if (compare) {
        makePush = false;
        break;
      }
      if (this.tryPattern[direction][0].call(this, itemCollision, gridsterItem)) {
        this.pushedItemsOrder.push(itemCollision);
        b.push(itemCollision);
      } else if (this.tryPattern[direction][1].call(this, itemCollision, gridsterItem)) {
        this.pushedItemsOrder.push(itemCollision);
        b.push(itemCollision);
      } else if (this.tryPattern[direction][2].call(this, itemCollision, gridsterItem)) {
        this.pushedItemsOrder.push(itemCollision);
        b.push(itemCollision);
      } else if (this.tryPattern[direction][3].call(this, itemCollision, gridsterItem)) {
        this.pushedItemsOrder.push(itemCollision);
        b.push(itemCollision);
      } else {
        makePush = false;
        break;
      }
    }
    if (!makePush) {
      i = this.pushedItemsOrder.lastIndexOf(b[0]);
      if (i > -1) {
        let j = this.pushedItemsOrder.length - 1;
        for (; j >= i; j--) {
          itemCollision = this.pushedItemsOrder[j];
          this.pushedItemsOrder.pop();
          this.removeFromTempPushed(itemCollision);
          this.removeFromPushedItem(itemCollision);
        }
      }
    }
    return makePush;
  }

  /**
   * Executes `trySouth` to handle try south.
   * @zh 执行 `trySouth`，用于trySouth。
   * @param gridsterItemCollide - gridster item collide parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目Collide参数（`GridsterItemComponentInterface`）
   * @param gridsterItem - gridster item parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目参数（`GridsterItemComponentInterface`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private trySouth(gridsterItemCollide: GridsterItemComponentInterface, gridsterItem: GridsterItemComponentInterface): boolean {
    if (!this.gridster.$options.pushDirections.south) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    gridsterItemCollide.$item.y = gridsterItem.$item.y + gridsterItem.$item.rows;
    if (this.push(gridsterItemCollide, this.fromNorth)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      this.removeFromTempPushed(gridsterItemCollide);
    }
    return false;
  }

  /**
   * Executes `tryNorth` to handle try north.
   * @zh 执行 `tryNorth`，用于tryNorth。
   * @param gridsterItemCollide - gridster item collide parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目Collide参数（`GridsterItemComponentInterface`）
   * @param gridsterItem - gridster item parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目参数（`GridsterItemComponentInterface`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private tryNorth(gridsterItemCollide: GridsterItemComponentInterface, gridsterItem: GridsterItemComponentInterface): boolean {
    if (!this.gridster.$options.pushDirections.north) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    gridsterItemCollide.$item.y = gridsterItem.$item.y - gridsterItemCollide.$item.rows;
    if (this.push(gridsterItemCollide, this.fromSouth)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      this.removeFromTempPushed(gridsterItemCollide);
    }
    return false;
  }

  /**
   * Executes `tryEast` to handle try east.
   * @zh 执行 `tryEast`，用于tryEast。
   * @param gridsterItemCollide - gridster item collide parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目Collide参数（`GridsterItemComponentInterface`）
   * @param gridsterItem - gridster item parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目参数（`GridsterItemComponentInterface`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private tryEast(gridsterItemCollide: GridsterItemComponentInterface, gridsterItem: GridsterItemComponentInterface): boolean {
    if (!this.gridster.$options.pushDirections.east) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    gridsterItemCollide.$item.x = gridsterItem.$item.x + gridsterItem.$item.cols;
    if (this.push(gridsterItemCollide, this.fromWest)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      this.removeFromTempPushed(gridsterItemCollide);
    }
    return false;
  }

  /**
   * Executes `tryWest` to handle try west.
   * @zh 执行 `tryWest`，用于tryWest。
   * @param gridsterItemCollide - gridster item collide parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目Collide参数（`GridsterItemComponentInterface`）
   * @param gridsterItem - gridster item parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目参数（`GridsterItemComponentInterface`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private tryWest(gridsterItemCollide: GridsterItemComponentInterface, gridsterItem: GridsterItemComponentInterface): boolean {
    if (!this.gridster.$options.pushDirections.west) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    gridsterItemCollide.$item.x = gridsterItem.$item.x - gridsterItemCollide.$item.cols;
    if (this.push(gridsterItemCollide, this.fromEast)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      this.removeFromTempPushed(gridsterItemCollide);
    }
    return false;
  }

  /**
   * Executes `addToTempPushed` to handle add to temp pushed.
   * @zh 执行 `addToTempPushed`，用于添加转换为临时已推入。
   * @param gridsterItem - gridster item parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目参数（`GridsterItemComponentInterface`）
   */
  private addToTempPushed(gridsterItem: GridsterItemComponentInterface): void {
    let i = this.pushedItemsTemp.indexOf(gridsterItem);
    if (i === -1) {
      i = this.pushedItemsTemp.push(gridsterItem) - 1;
      this.pushedItemsTempPath[i] = [];
    }
    this.pushedItemsTempPath[i].push({x: gridsterItem.$item.x, y: gridsterItem.$item.y});
  }

  /**
   * Executes `removeFromTempPushed` to handle remove from temp pushed.
   * @zh 执行 `removeFromTempPushed`，用于移除从临时已推入。
   * @param gridsterItem - gridster item parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目参数（`GridsterItemComponentInterface`）
   */
  private removeFromTempPushed(gridsterItem: GridsterItemComponentInterface): void {
    const i = this.pushedItemsTemp.indexOf(gridsterItem);
    const tempPosition = this.pushedItemsTempPath[i].pop();
    if (!tempPosition) {
      return;
    }
    gridsterItem.$item.x = tempPosition.x;
    gridsterItem.$item.y = tempPosition.y;
    gridsterItem.setSize();
    if (!this.pushedItemsTempPath[i].length) {
      this.pushedItemsTemp.splice(i, 1);
      this.pushedItemsTempPath.splice(i, 1);
    }
  }

  /**
   * Executes `addToPushed` to handle add to pushed.
   * @zh 执行 `addToPushed`，用于添加转换为已推入。
   * @param gridsterItem - gridster item parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目参数（`GridsterItemComponentInterface`）
   */
  private addToPushed(gridsterItem: GridsterItemComponentInterface): void {
    if (this.pushedItems.indexOf(gridsterItem) < 0) {
      this.pushedItems.push(gridsterItem);
      this.pushedItemsPath.push([{x: gridsterItem.item.x || 0, y: gridsterItem.item.y || 0},
        {x: gridsterItem.$item.x, y: gridsterItem.$item.y}]);
    } else {
      const i = this.pushedItems.indexOf(gridsterItem);
      this.pushedItemsPath[i].push({x: gridsterItem.$item.x, y: gridsterItem.$item.y});
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
   * Executes `removeFromPushedItem` to handle remove from pushed item.
   * @zh 执行 `removeFromPushedItem`，用于移除从已推入条目。
   * @param gridsterItem - gridster item parameter (`GridsterItemComponentInterface`) / 网格拖拽布局条目参数（`GridsterItemComponentInterface`）
   */
  private removeFromPushedItem(gridsterItem: GridsterItemComponentInterface): void {
    const i = this.pushedItems.indexOf(gridsterItem);
    if (i > -1) {
      this.pushedItemsPath[i].pop();
      if (!this.pushedItemsPath.length) {
        this.pushedItems.splice(i, 1);
        this.pushedItemsPath.splice(i, 1);
      }
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
    let lastPosition, x, y;
    let change = false;
    for (; j > -1; j--) {
      lastPosition = path[j];
      x = pushedItem.$item.x;
      y = pushedItem.$item.y;
      pushedItem.$item.x = lastPosition.x;
      pushedItem.$item.y = lastPosition.y;
      if (!this.gridster.findItemWithItem(pushedItem.$item)) {
        pushedItem.setSize();
        path.splice(j + 1, path.length - j - 1);
        change = true;
      } else {
        pushedItem.$item.x = x;
        pushedItem.$item.y = y;
      }
    }
    if (path.length < 2) {
      this.removeFromPushed(i);
    }
    return change;
  }
}
