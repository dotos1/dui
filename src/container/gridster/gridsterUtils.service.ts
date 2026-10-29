/**
 * @fileoverview Module `src/container/gridster/gridsterUtils.service.ts` providing gridster utils service definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterUtils.service.ts`，提供网格拖拽布局工具集服务相关的定义与实现。
 */

import {Injectable} from '@angular/core';
import {GridsterComponentInterface} from './gridster.interface';

/**
 * Injectable Angular service `GridsterUtils` managing gridster utils state and operations in `src/container/gridster`.
 * @zh 可注入的 Angular 服务 `GridsterUtils`，管理 `src/container/gridster` 中的网格拖拽布局工具集状态与业务操作。
 */
@Injectable()
export class GridsterUtils {

  /**
   * Executes `merge` to handle merge.
   * @zh 执行 `merge`，用于合并。
   * @param obj1 - obj1 parameter (`any`) / obj1参数（`any`）
   * @param obj2 - obj2 parameter (`any`) / obj2参数（`any`）
   * @param properties - properties parameter (`any`) / 属性列表参数（`any`）
   */
  static merge(obj1, obj2, properties) {
    for (const p in obj2) {
      if (obj2[p] !== void 0 && properties.hasOwnProperty(p)) {
        if (typeof obj2[p] === 'object') {
          obj1[p] = GridsterUtils.merge(obj1[p], obj2[p], properties[p]);
        } else {
          obj1[p] = obj2[p];
        }
      }
    }

    return obj1;
  }

  /**
   * Executes `debounce` to handle debounce.
   * @zh 执行 `debounce`，用于防抖。
   * @param func - func parameter (`Function`) / func参数（`Function`）
   * @param wait - wait parameter (`number`) / wait参数（`number`）
   * @returns Result of type `() => void` / 类型为 `() => void` 的返回值
   */
  static debounce(func: Function, wait: number): () => void {
    let timeout;
    return function () {
      const  args = arguments;
      const later = function () {
        timeout = null;
        //@ts-ignore
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Executes `checkTouchEvent` to handle check touch event.
   * @zh 执行 `checkTouchEvent`，用于检查触摸事件。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  static checkTouchEvent(e): void {
    if (e.clientX === undefined && e.touches) {
      if (e.touches && e.touches.length) {
        e.clientX = e.touches[0].clientX;
        e.clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length) {
        e.clientX = e.changedTouches[0].clientX;
        e.clientY = e.changedTouches[0].clientY;
      }
    }
  }

  /**
   * Executes `checkContentClassForEvent` to handle check content class for event.
   * @zh 执行 `checkContentClassForEvent`，用于检查内容类名用于事件。
   * @param gridster - gridster parameter (`GridsterComponentInterface`) / 网格拖拽布局参数（`GridsterComponentInterface`）
   * @param e - e parameter (`any`) / e参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  static checkContentClassForEvent(gridster: GridsterComponentInterface, e): boolean {
    if (gridster.$options.draggable.ignoreContent) {
      if (!GridsterUtils.checkDragHandleClass(e.target, e.currentTarget, gridster.$options.draggable.dragHandleClass, gridster.$options.draggable.ignoreContentClass)) {
        return true;
      }
    } else {
      if (GridsterUtils.checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.ignoreContentClass)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Executes `checkContentClassForEmptyCellClickEvent` to handle check content class for empty cell click event.
   * @zh 执行 `checkContentClassForEmptyCellClickEvent`，用于检查内容类名用于空单元格点击事件。
   * @param gridster - gridster parameter (`GridsterComponentInterface`) / 网格拖拽布局参数（`GridsterComponentInterface`）
   * @param e - e parameter (`any`) / e参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  static checkContentClassForEmptyCellClickEvent(gridster: GridsterComponentInterface, e): boolean {
    return GridsterUtils.checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.ignoreContentClass)
      || GridsterUtils.checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.dragHandleClass);
  }

  /**
   * Executes `checkDragHandleClass` to handle check drag handle class.
   * @zh 执行 `checkDragHandleClass`，用于检查拖拽连接手柄类名。
   * @param target - target parameter (`any`) / 目标参数（`any`）
   * @param current - current parameter (`any`) / 当前参数（`any`）
   * @param dragHandleClass - drag handle class parameter (`string`) / 拖拽连接手柄类名参数（`string`）
   * @param ignoreContentClass - ignore content class parameter (`any`) / 忽略内容类名参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  static checkDragHandleClass(target, current, dragHandleClass: string, ignoreContentClass): boolean {
    if (!target || target === current) {
      return false;
    }
    if (target.hasAttribute('class') ) {
      const classnames = target.getAttribute('class').split(' ');
      if (classnames.indexOf(dragHandleClass) > -1) {
        return true;
      }
      if (classnames.indexOf(ignoreContentClass) > -1) {
        return false;
      }
    }
    return GridsterUtils.checkDragHandleClass(target.parentNode, current, dragHandleClass, ignoreContentClass);
  }
  /**
   * Executes `checkContentClass` to handle check content class.
   * @zh 执行 `checkContentClass`，用于检查内容类名。
   * @param target - target parameter (`any`) / 目标参数（`any`）
   * @param current - current parameter (`any`) / 当前参数（`any`）
   * @param contentClass - content class parameter (`string`) / 内容类名参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  static checkContentClass(target, current, contentClass: string): boolean {
    if (!target || target === current) {
      return false;
    }
    if (target.hasAttribute('class') && target.getAttribute('class').split(' ').indexOf(contentClass) > -1) {
      return true;
    } else {
      return GridsterUtils.checkContentClass(target.parentNode, current, contentClass);
    }
  }

  /**
   * Executes `compareItems` to handle compare items.
   * @zh 执行 `compareItems`，用于比较条目列表。
   * @param a - a parameter (`{ x: number; y: number; }`) / a参数（`{ x: number; y: number; }`）
   * @param b - b parameter (`{ x: number; y: number; }`) / b参数（`{ x: number; y: number; }`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  static compareItems(a: { x: number, y: number }, b: { x: number, y: number }): number {
    if (a.y > b.y) {
      return -1;
    } else if (a.y < b.y) {
      return 1;
    } else if (a.x > b.x) {
      return -1;
    } else {
      return 1;
    }
  }
}
