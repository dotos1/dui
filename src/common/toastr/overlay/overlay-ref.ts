/**
 * @fileoverview Module `src/common/toastr/overlay/overlay-ref.ts` providing overlay ref definitions and implementation.
 * @zh 模块文件 `src/common/toastr/overlay/overlay-ref.ts`，提供浮层引用相关的定义与实现。
 */

import { ComponentRef } from '@angular/core';
import { BasePortalHost, ComponentPortal } from '../portal/portal';


/**
 * Class `OverlayRef` encapsulating overlay ref data structures and logic in `src/common/toastr/overlay`.
 * @zh 类 `OverlayRef`，封装 `src/common/toastr/overlay` 中的浮层引用数据结构与处理逻辑。
 */
export class OverlayRef {
  /**
   * Creates an instance of `OverlayRef` and initializes its dependencies and internal state.
   * @zh 创建 `OverlayRef` 实例，并初始化其依赖项与内部状态。
   * @param _portalHost - Injected or initial portal host (`BasePortalHost`) / 注入或传入的传送门容器宿主（`BasePortalHost`）
   */
  constructor(private _portalHost: BasePortalHost) {}

  /**
   * Executes `attach` to handle attach.
   * @zh 执行 `attach`，用于挂载。
   * @param portal - portal parameter (`ComponentPortal<any>`) / 传送门容器参数（`ComponentPortal<any>`）
   * @param newestOnTop - newest on top parameter (`boolean`) / newest当顶部位置参数（`boolean`）
   * @returns Result of type `ComponentRef<any>` / 类型为 `ComponentRef<any>` 的返回值
   */
  attach(
    portal,
    newestOnTop: boolean = true,
  ) {
    return this._portalHost.attach(portal, newestOnTop);
  }


  /**
   * Executes `detach` to handle detach.
   * @zh 执行 `detach`，用于卸载。
   */
  detach() {
    return this._portalHost.detach();
  }
}
