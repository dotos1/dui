/**
 * @fileoverview Module `src/common/toastr/portal/portal.ts` providing portal definitions and implementation.
 * @zh 模块文件 `src/common/toastr/portal/portal.ts`，提供传送门容器相关的定义与实现。
 */

import {
  ComponentRef,
  Injector,
  ViewContainerRef
} from '@angular/core';

/**
 * Interface `ComponentType` defining the contract and properties for component type.
 * @zh 接口 `ComponentType`，定义组件类型的数据结构契约与属性规范。
 */
export interface ComponentType<T> {
  new (...args): T;
}

/**
 * Class `ComponentPortal` encapsulating component portal data structures and logic in `src/common/toastr/portal`.
 * @zh 类 `ComponentPortal`，封装 `src/common/toastr/portal` 中的组件传送门容器数据结构与处理逻辑。
 */
export class ComponentPortal<T> {
  /**
   * Property `_attachedHost` (`BasePortalHost`) storing attached host.
   * @zh 属性 `_attachedHost`（类型：`BasePortalHost`），用于存储或配置已附加宿主。
   */
  private _attachedHost?: BasePortalHost;
  /**
   * The type of the component that will be instantiated for attachment.
   * @zh 属性 `component`（类型：`ComponentType<T>`），用于存储或配置组件。
   */
  component: ComponentType<T>;


  /**
   * Property `viewContainerRef` (`ViewContainerRef`) storing view container ref.
   * @zh 属性 `viewContainerRef`（类型：`ViewContainerRef`），用于存储或配置视图容器引用。
   */
  viewContainerRef: ViewContainerRef;

  /**
   * Injector used for the instantiation of the component.
   * @zh 属性 `injector`（类型：`Injector`），用于存储或配置注入器。
   */
  injector: Injector;

  /**
   * Creates an instance of `ComponentPortal` and initializes its dependencies and internal state.
   * @zh 创建 `ComponentPortal` 实例，并初始化其依赖项与内部状态。
   * @param component - Injected or initial component (`ComponentType<T>`) / 注入或传入的组件（`ComponentType<T>`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
  constructor(component: ComponentType<T>, injector: Injector) {
    this.component = component;
    this.injector = injector;
  }

  /**
   * Attach this portal to a host.
   * @zh 执行 `attach`，用于挂载。
   */
  attach(host: BasePortalHost, newestOnTop: boolean) {
    this._attachedHost = host;
    return host.attach(this, newestOnTop);
  }

  /**
   * Detach this portal from its host
   * @zh 执行 `detach`，用于卸载。
   */
  detach() {
    const host = this._attachedHost;
    if (host) {
      this._attachedHost = undefined;
      return host.detach();
    }
  }

  /**
   * Whether this portal is attached to a host.
   * @zh 获取当前是否为已附加（`isAttached: boolean`）。
   */
  get isAttached(): boolean {
    return this._attachedHost != null;
  }

  /**
   * Sets the PortalHost reference without performing `attach()`. This is used directly by
   * the PortalHost when it is performing an `attach()` or `detach()`.

   * @zh 执行 `setAttachedHost`，用于集合已附加宿主。
   */
  setAttachedHost(host?: BasePortalHost) {
    this._attachedHost = host;
  }
}


/**
 * Class `BasePortalHost` encapsulating base portal host data structures and logic in `src/common/toastr/portal`.
 * @zh 类 `BasePortalHost`，封装 `src/common/toastr/portal` 中的基础传送门容器宿主数据结构与处理逻辑。
 */
export abstract class BasePortalHost {
  /**
   * The portal currently attached to the host.
   * @zh 属性 `_attachedPortal`（类型：`ComponentPortal<any>`），用于存储或配置已附加传送门容器。
   */
  private _attachedPortal?;

  /**
   * A function that will permanently dispose this host.
   * @zh 属性 `_disposeFn`（类型：`() => void`），用于存储或配置释放函数。
   */
  private _disposeFn?: () => void;

  /**
   * Executes `attach` to handle attach.
   * @zh 执行 `attach`，用于挂载。
   * @param portal - portal parameter (`ComponentPortal<any>`) / 传送门容器参数（`ComponentPortal<any>`）
   * @param newestOnTop - newest on top parameter (`boolean`) / newest当顶部位置参数（`boolean`）
   */
  attach(portal, newestOnTop: boolean) {
    this._attachedPortal = portal;
    return this.attachComponentPortal(portal, newestOnTop);
  }

  /**
   * Executes `attachComponentPortal` to handle attach component portal.
   * @zh 执行 `attachComponentPortal`，用于挂载组件传送门容器。
   * @param portal - portal parameter (`ComponentPortal<T>`) / 传送门容器参数（`ComponentPortal<T>`）
   * @param newestOnTop - newest on top parameter (`boolean`) / newest当顶部位置参数（`boolean`）
   * @returns Result of type `ComponentRef<T>` / 类型为 `ComponentRef<T>` 的返回值
   */
  abstract attachComponentPortal<T>(portal: ComponentPortal<T>, newestOnTop: boolean): ComponentRef<T>;

  /**
   * Executes `detach` to handle detach.
   * @zh 执行 `detach`，用于卸载。
   */
  detach() {
    if (this._attachedPortal) {
      this._attachedPortal.setAttachedHost();
    }

    this._attachedPortal = undefined;
    if (this._disposeFn) {
      this._disposeFn();
      this._disposeFn = undefined;
    }
  }

  /**
   * Executes `setDisposeFn` to handle set dispose fn.
   * @zh 执行 `setDisposeFn`，用于集合释放函数。
   * @param fn - fn parameter (`() => void`) / 函数参数（`() => void`）
   */
  setDisposeFn(fn: () => void) {
    this._disposeFn = fn;
  }
}
