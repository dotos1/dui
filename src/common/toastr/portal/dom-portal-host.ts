/**
 * @fileoverview Module `src/common/toastr/portal/dom-portal-host.ts` providing dom portal host definitions and implementation.
 * @zh 模块文件 `src/common/toastr/portal/dom-portal-host.ts`，提供DOM节点传送门容器宿主相关的定义与实现。
 */

import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
} from '@angular/core';
import { BasePortalHost, ComponentPortal } from './portal';


/**
 * Class `DomPortalHost` encapsulating dom portal host data structures and logic in `src/common/toastr/portal`.
 * @zh 类 `DomPortalHost`，封装 `src/common/toastr/portal` 中的DOM节点传送门容器宿主数据结构与处理逻辑。
 */
export class DomPortalHost extends BasePortalHost {
  /**
   * Creates an instance of `DomPortalHost` and initializes its dependencies and internal state.
   * @zh 创建 `DomPortalHost` 实例，并初始化其依赖项与内部状态。
   * @param _hostDomElement - Injected or initial host dom element (`Element`) / 注入或传入的宿主DOM节点元素（`Element`）
   * @param _componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   * @param _appRef - Injected or initial app ref (`ApplicationRef`) / 注入或传入的app引用（`ApplicationRef`）
   */
  constructor(
    private _hostDomElement: Element,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
  ) {
    super();
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
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
      portal.component,
    );
    let componentRef: ComponentRef<T>;


    componentRef = componentFactory.create(portal.injector);


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
