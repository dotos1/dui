/**
 * @fileoverview Module `src/core/position/position.store.ts` providing position store definitions and implementation.
 * @zh 模块文件 `src/core/position/position.store.ts`，提供位置状态仓库相关的定义与实现。
 */

import {
  ISize,
  IPositionState,
  IRectangle,
} from './position.common';
import { Injectable } from "@angular/core";

/**
 * Constant/variable `defaultGrid` defining default grid in `src/core/position`.
 * @zh 常量/变量 `defaultGrid`，定义 `src/core/position` 中的默认网格表格。
 */
export const defaultGrid: ISize = {
  width: 1,
  height: 1
};

/**
 * Constant/variable `defaultBound` defining default bound in `src/core/position`.
 * @zh 常量/变量 `defaultBound`，定义 `src/core/position` 中的默认已绑定。
 */
export const defaultBound: IRectangle = {
  x: -Infinity,
  y: -Infinity,
  width: Infinity,
  height: Infinity
};

/**
 * Injectable Angular service `PositionStore` managing position store state and operations in `src/core/position`.
 * @zh 可注入的 Angular 服务 `PositionStore`，管理 `src/core/position` 中的位置状态仓库状态与业务操作。
 */
@Injectable()
export class PositionStore {
  /**
   * Property `state` (`IPositionState`) storing state.
   * @zh 属性 `state`（类型：`IPositionState`），用于存储或配置状态。
   */
  state: IPositionState = {
    currentSize: { width: 0, height: 0 },
    startSize: { width: 0, height: 0 },
    currentPosition: { x: 0, y: 0 },
    startPosition: { x: 0, y: 0 },
    isResizing: false,
    isMoving: false,
    direction: null
  };

  /**
   * Property `reducers` (`any[]`) storing reducers (default: `[]`).
   * @zh 属性 `reducers`（类型：`any[]`），用于存储或配置归约器（默认值：`[]`）。
   */
  private reducers = [];

  /**
   * Executes `addReducer` to handle add reducer.
   * @zh 执行 `addReducer`，用于添加归约器。
   * @param reducer - reducer parameter (`any`) / 归约器参数（`any`）
   */
  addReducer(reducer) {
    this.reducers.push(reducer);
  }

  /**
   * Executes `emitAction` to handle emit action.
   * @zh 执行 `emitAction`，用于发出动作。
   * @param action - action parameter (`any`) / 动作参数（`any`）
   * @param params - params parameter (`any[]`) / 参数集合参数（`any[]`）
   */
  emitAction(action, ...params) {
    this.state = this.reducers.reduce((p: IPositionState, c: { apply? }) => {
      // eslint-disable-next-line prefer-spread
      return c.apply(null, [p, action].concat(params));
    }, this.state);
  }
}
