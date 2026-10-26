/**
 * @fileoverview Module `src/common/toastr/overlay/overlay.ts` providing overlay definitions and implementation.
 * @zh 模块文件 `src/common/toastr/overlay/overlay.ts`，提供浮层相关的定义与实现。
 */

import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ComponentFactoryResolver, inject, Injectable } from '@angular/core';

import { DomPortalHost } from '../portal/dom-portal-host';
import { ToastContainerDirective } from '../toastr/toast.directive';
import { OverlayContainer } from './overlay-container';
import { OverlayRef } from './overlay-ref';


/**
 * Injectable Angular service `Overlay` managing overlay state and operations in `src/common/toastr/overlay`.
 * @zh 可注入的 Angular 服务 `Overlay`，管理 `src/common/toastr/overlay` 中的浮层状态与业务操作。
 */
@Injectable({ providedIn: 'root' })
export class Overlay {
  /**
   * Property `_overlayContainer` (`any`) storing overlay container (default: `inject(OverlayContainer)`).
   * @zh 属性 `_overlayContainer`（类型：`any`），用于存储或配置浮层容器（默认值：`inject(OverlayContainer)`）。
   */
  private _overlayContainer = inject(OverlayContainer);
  /**
   * Property `_componentFactoryResolver` (`any`) storing component factory resolver (default: `inject(ComponentFactoryResolver)`).
   * @zh 属性 `_componentFactoryResolver`（类型：`any`），用于存储或配置组件工厂解析器（默认值：`inject(ComponentFactoryResolver)`）。
   */
  private _componentFactoryResolver = inject(ComponentFactoryResolver);
  /**
   * Property `_appRef` (`any`) storing app ref (default: `inject(ApplicationRef)`).
   * @zh 属性 `_appRef`（类型：`any`），用于存储或配置app引用（默认值：`inject(ApplicationRef)`）。
   */
  private _appRef = inject(ApplicationRef);
  /**
   * Property `_document` (`any`) storing document (default: `inject(DOCUMENT)`).
   * @zh 属性 `_document`（类型：`any`），用于存储或配置文档对象（默认值：`inject(DOCUMENT)`）。
   */
  private _document = inject(DOCUMENT);

  // Namespace panes by overlay container
  /**
   * Property `_paneElements` (`Map<ToastContainerDirective, Record<string, HTMLElement>>`) storing pane elements (default: `new Map()`).
   * @zh 属性 `_paneElements`（类型：`Map<ToastContainerDirective, Record<string, HTMLElement>>`），用于存储或配置窗格元素列表（默认值：`new Map()`）。
   */
  private _paneElements: Map<ToastContainerDirective, Record<string, HTMLElement>> = new Map();


  /**
   * Creates a new `OverlayRef` backed by the pane element for the given position class
   * (and optional custom container).
   * @zh 为给定的定位样式类（及可选的自定义容器）创建一个新的、以对应面板元素为载体的 `OverlayRef`。
   */
  create(positionClass?: string, overlayContainer?: ToastContainerDirective): OverlayRef {

    return this._createOverlayRef(this.getPaneElement(positionClass, overlayContainer));
  }

  /**
   * Returns (creating if necessary) the pane element for the given position class within
   * the given (or default) overlay container.
   * @zh 返回（必要时创建）给定定位样式类在指定（或默认）覆盖层容器内的面板元素。
   */
  getPaneElement(
    positionClass: string = '',
    overlayContainer?: ToastContainerDirective,
  ): HTMLElement {
    if (!this._paneElements.get(overlayContainer as ToastContainerDirective)) {
      this._paneElements.set(overlayContainer as ToastContainerDirective, {});
    }

    if (!this._paneElements.get(overlayContainer as ToastContainerDirective)![positionClass]) {
      this._paneElements.get(overlayContainer as ToastContainerDirective)![
        positionClass
      ] = this._createPaneElement(positionClass, overlayContainer);
    }

    return this._paneElements.get(overlayContainer as ToastContainerDirective)![positionClass];
  }

  /**
   * Creates the DOM element for an overlay and appends it to the overlay container.
   * @returns Newly-created pane element

   * @zh 执行 `_createPaneElement`，用于创建窗格元素。
   */
  private _createPaneElement(
    positionClass: string,
    overlayContainer?: ToastContainerDirective,
  ): HTMLElement {
    const pane = this._document.createElement('div');

    pane.id = 'toast-container';
    pane.classList.add(positionClass);
    pane.classList.add('toast-container');

    if (!overlayContainer) {
      this._overlayContainer.getContainerElement().appendChild(pane);
    } else {
      overlayContainer.getContainerElement().appendChild(pane);
    }

    return pane;
  }


  /**
   * Executes `_createPortalHost` to handle create portal host.
   * @zh 执行 `_createPortalHost`，用于创建传送门容器宿主。
   * @param pane - pane parameter (`HTMLElement`) / 窗格参数（`HTMLElement`）
   * @returns Result of type `DomPortalHost` / 类型为 `DomPortalHost` 的返回值
   */
  private _createPortalHost(pane: HTMLElement): DomPortalHost {
    return new DomPortalHost(pane, this._componentFactoryResolver, this._appRef);
  }


  /**
   * Executes `_createOverlayRef` to handle create overlay ref.
   * @zh 执行 `_createOverlayRef`，用于创建浮层引用。
   * @param pane - pane parameter (`HTMLElement`) / 窗格参数（`HTMLElement`）
   * @returns Result of type `OverlayRef` / 类型为 `OverlayRef` 的返回值
   */
  private _createOverlayRef(pane: HTMLElement): OverlayRef {
    return new OverlayRef(this._createPortalHost(pane));
  }
}
