/**
 * @fileoverview Module `src/common/toastr/portal/dom-portal-host.ts` providing dom portal host definitions and implementation.
 * @zh 模块文件 `src/common/toastr/portal/dom-portal-host.ts`，提供DOM节点传送门容器宿主相关的定义与实现。
 */

import {
  ApplicationRef,
  createComponent,
  ComponentRef,
  EmbeddedViewRef,
} from '@angular/core';
import { BasePortalHost, ComponentPortal } from './portal';


/**
 * Class `DomPortalHost` encapsulating dom portal host data structures and logic in `src/common/toastr/portal`.
 * @zh 类 `DomPortalHost`，封装 `src/common/toastr/portal` 中的DOM节点传送门容器宿主数据结构与处理逻辑。
 */
export class DomPortalHost extends BasePortalHost {
  private _hostDomElement: Element;
  private _appRef: ApplicationRef;

  constructor(_hostDomElement: Element, _appRef: ApplicationRef);
  constructor(_hostDomElement: Element, _legacyResolver: unknown, _appRef: ApplicationRef);
  constructor(
    _hostDomElement: Element,
    arg1: ApplicationRef | unknown,
    arg2?: ApplicationRef,
  ) {
    super();
    this._hostDomElement = _hostDomElement;
    this._appRef = (arg2 !== undefined ? arg2 : arg1) as ApplicationRef;
  }


  /**
   * Executes `attachComponentPortal` to handle attach component portal.
   * @zh 执行 `attachComponentPortal`，用于挂载组件传送门容器。
   * @param portal - portal parameter (`ComponentPortal<T>`) / 传送门容器参数（`ComponentPortal<T>`）
   * @param newestOnTop - newest on top parameter (`boolean`) / newest当顶部位置参数（`boolean`）
   * @returns Result of type `ComponentRef<T>` / 类型为 `ComponentRef<T>` 的返回值
   */
  attachComponentPortal<T>(
    portal: ComponentPortal<T>,
    newestOnTop: boolean,
  ): ComponentRef<T> {
    const componentRef: ComponentRef<T> = createComponent(portal.component, {
      environmentInjector: this._appRef.injector,
      elementInjector: portal.injector,
    });


    this._appRef.attachView(componentRef.hostView);

    this.setDisposeFn(() => {
      this._appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });


    if (newestOnTop) {
      this._hostDomElement.insertBefore(
        this._getComponentRootNode(componentRef),
        this._hostDomElement.firstChild,
      );
    } else {
      this._hostDomElement.appendChild(
        this._getComponentRootNode(componentRef),
      );
    }

    return componentRef;
  }

  /**
   * Gets the root HTMLElement for an instantiated component.
   * @zh 执行 `_getComponentRootNode`，用于获取组件根节点节点。
   */
  private _getComponentRootNode(componentRef): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
  }
}
