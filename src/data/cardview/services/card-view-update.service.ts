/**
 * @fileoverview Module `src/data/cardview/services/card-view-update.service.ts` providing card view update service definitions and implementation.
 * @zh 模块文件 `src/data/cardview/services/card-view-update.service.ts`，提供卡片视图更新服务相关的定义与实现。
 */


import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CardViewBaseItemModel } from '../models';

/**
 * Interface `UpdateNotification` defining the contract and properties for update notification.
 * @zh 接口 `UpdateNotification`，定义更新通知的数据结构契约与属性规范。
 */
export interface UpdateNotification {
  /**
   * Property `target` (`any`) storing target.
   * @zh 属性 `target`（类型：`any`），用于存储或配置目标。
   */
  target;
  /**
   * Property `changed` (`any`) storing changed.
   * @zh 属性 `changed`（类型：`any`），用于存储或配置已变更。
   */
  changed;
}

/**
 * Interface `ClickNotification` defining the contract and properties for click notification.
 * @zh 接口 `ClickNotification`，定义点击通知的数据结构契约与属性规范。
 */
export interface ClickNotification {
  /**
   * Property `target` (`any`) storing target.
   * @zh 属性 `target`（类型：`any`），用于存储或配置目标。
   */
  target;
}

/**
 * Executes `transformKeyToObject` to handle transform key to object.
 * @zh 执行 `transformKeyToObject`，用于转换键转换为对象。
 * @param key - key parameter (`string`) / 键参数（`string`）
 * @param value - value parameter (`any`) / 值参数（`any`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function transformKeyToObject(key: string, value): Object {
  const objectLevels: string[] = key.split('.').reverse();

  return objectLevels.reduce<{}>((previousValue, currentValue) => {
    return { [currentValue]: previousValue };
  }, value);
}

/**
 * Injectable Angular service `CardViewUpdateService` managing card view update service state and operations in `src/data/cardview/services`.
 * @zh 可注入的 Angular 服务 `CardViewUpdateService`，管理 `src/data/cardview/services` 中的卡片视图更新服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class CardViewUpdateService {

  /**
   * Property `itemUpdated$` (`Subject`) storing item updated (default: `new Subject<UpdateNotification>()`).
   * @zh 属性 `itemUpdated$`（类型：`Subject`），用于存储或配置条目已更新（默认值：`new Subject<UpdateNotification>()`）。
   */
  itemUpdated$ = new Subject<UpdateNotification>();
  /**
   * Property `itemClicked$` (`Subject`) storing item clicked (default: `new Subject<ClickNotification>()`).
   * @zh 属性 `itemClicked$`（类型：`Subject`），用于存储或配置条目点击（默认值：`new Subject<ClickNotification>()`）。
   */
  itemClicked$ = new Subject<ClickNotification>();
  /**
   * Property `updateItem$` (`Subject`) storing update item (default: `new Subject<CardViewBaseItemModel>()`).
   * @zh 属性 `updateItem$`（类型：`Subject`），用于存储或配置更新条目（默认值：`new Subject<CardViewBaseItemModel>()`）。
   */
  updateItem$ = new Subject<CardViewBaseItemModel>();

  /**
   * Executes `update` to handle update.
   * @zh 执行 `update`，用于更新。
   * @param property - property parameter (`CardViewBaseItemModel`) / 属性参数（`CardViewBaseItemModel`）
   * @param newValue - new value parameter (`any`) / 新值参数（`any`）
   */
  update(property: CardViewBaseItemModel, newValue) {
    this.itemUpdated$.next({
      target: property,
      changed: transformKeyToObject(property.key, newValue)
    });
  }

  /**
   * Executes `clicked` to handle clicked.
   * @zh 执行 `clicked`，用于点击。
   * @param property - property parameter (`CardViewBaseItemModel`) / 属性参数（`CardViewBaseItemModel`）
   */
  clicked(property: CardViewBaseItemModel) {
    this.itemClicked$.next({
      target: property
    });
  }

  /**
   * Executes `updateElement` to handle update element.
   * @zh 执行 `updateElement`，用于更新元素。
   * @param notification - notification parameter (`CardViewBaseItemModel`) / 通知参数（`CardViewBaseItemModel`）
   */
  updateElement(notification: CardViewBaseItemModel) {
    this.updateItem$.next(notification);
  }

}
