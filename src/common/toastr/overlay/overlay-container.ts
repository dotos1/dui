/**
 * @fileoverview Module `src/common/toastr/overlay/overlay-container.ts` providing overlay container definitions and implementation.
 * @zh 模块文件 `src/common/toastr/overlay/overlay-container.ts`，提供浮层容器相关的定义与实现。
 */

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';


/**
 * Injectable Angular service `OverlayContainer` managing overlay container state and operations in `src/common/toastr/overlay`.
 * @zh 可注入的 Angular 服务 `OverlayContainer`，管理 `src/common/toastr/overlay` 中的浮层容器状态与业务操作。
 */
@Injectable({ providedIn: 'root' })
export class OverlayContainer implements OnDestroy {
  /**
   * Property `_containerElement` (`HTMLElement`) storing container element.
   * @zh 属性 `_containerElement`（类型：`HTMLElement`），用于存储或配置容器元素。
   */
  protected _containerElement: HTMLElement;

  /**
   * Creates an instance of `OverlayContainer` and initializes its dependencies and internal state.
   * @zh 创建 `OverlayContainer` 实例，并初始化其依赖项与内部状态。
   * @param _document - Injected or initial document (`any`) / 注入或传入的文档对象（`any`）
   */
  constructor(@Inject(DOCUMENT) protected _document) {}

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    if (this._containerElement && this._containerElement.parentNode) {
      this._containerElement.parentNode.removeChild(this._containerElement);
    }
  }


  /**
   * Returns (creating if necessary) the shared overlay container element appended to `document.body`.
   * @zh 返回（必要时创建）附加到 `document.body` 的共享覆盖层容器元素。
   */
  getContainerElement(): HTMLElement {
    if (!this._containerElement) {
      this._createContainer();
    }
    return this._containerElement;
  }


  /**
   * Executes `_createContainer` to handle create container.
   * @zh 执行 `_createContainer`，用于创建容器。
   */
  protected _createContainer(): void {
    const container = this._document.createElement('div');
    container.classList.add('overlay-container');
    this._document.body.appendChild(container);
    this._containerElement = container;
  }
}
