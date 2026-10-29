/**
 * @fileoverview Module `src/common/keyboard/portal.ts` providing portal definitions and implementation.
 * @zh 模块文件 `src/common/keyboard/portal.ts`，提供传送门容器相关的定义与实现。
 */

import {
    TemplateRef,
    ViewContainerRef,
    ElementRef,
    ComponentRef,
    EmbeddedViewRef,
    Injector,
    ComponentFactoryResolver,
} from '@angular/core';


/**
 * Interface `ComponentType` defining the contract and properties for component type.
 * @zh 接口 `ComponentType`，定义组件类型的数据结构契约与属性规范。
 */
export interface ComponentType<T> {
    new(...args): T;
}


/**
 * Class `Portal` encapsulating portal data structures and logic in `src/common/keyboard`.
 * @zh 类 `Portal`，封装 `src/common/keyboard` 中的传送门容器数据结构与处理逻辑。
 */
export abstract class Portal<T> {
    /**
     * Property `_attachedHost` (`PortalOutlet`) storing attached host.
     * @zh 属性 `_attachedHost`（类型：`PortalOutlet`），用于存储或配置已附加宿主。
     */
    private _attachedHost: PortalOutlet | null;

    /**
     * Attach this portal to a host.
     * @zh 执行 `attach`，用于挂载。
     */
    attach(host: PortalOutlet): T {
        if (host == null) {
            // TODO: add error
            console.error('null portal error');
        }

        if (host.hasAttached()) {
            console.error('portal already attached');
            // throwPortalAlreadyAttachedError();
        }

        this._attachedHost = host;
        return <T>host.attach(this);
    }

    /**
     * Detach this portal from its host
     * @zh 执行 `detach`，用于卸载。
     */
    detach(): void {
        const host = this._attachedHost;

        if (host == null) {
            console.error('no portal attached!');
            // throwNoPortalAttachedError();
        } else {
            this._attachedHost = null;
            host.detach();
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
     * Sets the PortalOutlet reference without performing `attach()`. This is used directly by
     * the PortalOutlet when it is performing an `attach()` or `detach()`.

     * @zh 执行 `setAttachedHost`，用于集合已附加宿主。
     */
    setAttachedHost(host: PortalOutlet | null) {
        this._attachedHost = host;
    }
}


/**
 * Class `ComponentPortal` encapsulating component portal data structures and logic in `src/common/keyboard`.
 * @zh 类 `ComponentPortal`，封装 `src/common/keyboard` 中的组件传送门容器数据结构与处理逻辑。
 */
export class ComponentPortal<T> extends Portal<ComponentRef<T>> {
    /**
     * The type of the component that will be instantiated for attachment.
     * @zh 属性 `component`（类型：`ComponentType<T>`），用于存储或配置组件。
     */
    component: ComponentType<T>;

    /**
     * [Optional] Where the attached component should live in Angular's *logical* component tree.
     * This is different from where the component *renders*, which is determined by the PortalOutlet.
     * The origin is necessary when the host is outside of the Angular application context.

     * @zh 属性 `viewContainerRef`（类型：`ViewContainerRef`），用于存储或配置视图容器引用。
     */
    viewContainerRef?: ViewContainerRef | null;

    /**
     * [Optional] Injector used for the instantiation of the component.
     * @zh 属性 `injector`（类型：`Injector`），用于存储或配置注入器。
     */
    injector?: Injector | null;

    /**
     * Alternate `ComponentFactoryResolver` to use when resolving the associated component.
     * Defaults to using the resolver from the outlet that the portal is attached to.

     * @zh 属性 `componentFactoryResolver`（类型：`ComponentFactoryResolver`），用于存储或配置组件工厂解析器。
     */
    componentFactoryResolver?: ComponentFactoryResolver | null;

    /**
     * Creates an instance of `ComponentPortal` and initializes its dependencies and internal state.
     * @zh 创建 `ComponentPortal` 实例，并初始化其依赖项与内部状态。
     * @param component - Injected or initial component (`ComponentType<T>`) / 注入或传入的组件（`ComponentType<T>`）
     * @param viewContainerRef - Injected or initial view container ref (`ViewContainerRef`) / 注入或传入的视图容器引用（`ViewContainerRef`）
     * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
     */
    constructor(
        component: ComponentType<T>,
        viewContainerRef?: ViewContainerRef | null,
        injector?: Injector | null,
        componentFactoryResolver?: ComponentFactoryResolver | null) {
        super();
        this.component = component;
        this.viewContainerRef = viewContainerRef;
        this.injector = injector;
        this.componentFactoryResolver = componentFactoryResolver;
    }
}


/**
 * Class `TemplatePortal` encapsulating template portal data structures and logic in `src/common/keyboard`.
 * @zh 类 `TemplatePortal`，封装 `src/common/keyboard` 中的模板传送门容器数据结构与处理逻辑。
 */
export class TemplatePortal<C = unknown> extends Portal<C> {
    /**
     * The embedded template that will be used to instantiate an embedded View in the host.
     * @zh 属性 `templateRef`（类型：`TemplateRef<C>`），用于存储或配置模板引用。
     */
    templateRef: TemplateRef<C>;

    /**
     * Reference to the ViewContainer into which the template will be stamped out.
     * @zh 属性 `viewContainerRef`（类型：`ViewContainerRef`），用于存储或配置视图容器引用。
     */
    viewContainerRef: ViewContainerRef;

    /**
     * Contextual data to be passed in to the embedded view.
     * @zh 属性 `context`（类型：`C`），用于存储或配置上下文。
     */
    context: C | undefined;

    /**
     * Creates an instance of `TemplatePortal` and initializes its dependencies and internal state.
     * @zh 创建 `TemplatePortal` 实例，并初始化其依赖项与内部状态。
     * @param template - Injected or initial template (`TemplateRef<C>`) / 注入或传入的模板（`TemplateRef<C>`）
     * @param viewContainerRef - Injected or initial view container ref (`ViewContainerRef`) / 注入或传入的视图容器引用（`ViewContainerRef`）
     * @param context - Injected or initial context (`C`) / 注入或传入的上下文（`C`）
     */
    constructor(template: TemplateRef<C>, viewContainerRef: ViewContainerRef, context?: C) {
        super();
        this.templateRef = template;
        this.viewContainerRef = viewContainerRef;
        this.context = context;
    }

    /**
     * Gets the current origin (`origin: ElementRef`).
     * @zh 获取当前origin（`origin: ElementRef`）。
     */
    get origin(): ElementRef {
        return this.templateRef.elementRef;
    }

    /**
     * Attach the portal to the provided `PortalOutlet`.
     * When a context is provided it will override the `context` property of the `TemplatePortal`
     * instance.

     * @zh 执行 `attach`，用于挂载。
     */
    override attach(host: PortalOutlet, context: C | undefined = this.context): C {
        this.context = context;
        return super.attach(host);
    }

    /**
     * Executes `detach` to handle detach.
     * @zh 执行 `detach`，用于卸载。
     */
    override detach(): void {
        this.context = undefined;
        return super.detach();
    }
}


/**
 * @ignore
 * A `PortalOutlet` is an space that can contain a single `Portal`.

 * @zh 接口 `PortalOutlet`，定义传送门容器Outlet的数据结构契约与属性规范。
 */
export interface PortalOutlet {
    /**
     * Attaches a portal to this outlet.
     * @zh 执行 `attach`，用于挂载。
     */
    attach(portal);

    /**
     * Detaches the currently attached portal from this outlet.
     * @zh 执行 `detach`，用于卸载。
     */
    detach();

    /**
     * Performs cleanup before the outlet is destroyed.
     * @zh 执行 `dispose`，用于释放。
     */
    dispose(): void;

    /**
     * Whether there is currently a portal attached to this outlet.
     * @zh 执行 `hasAttached`，用于是否包含已附加。
     */
    hasAttached(): boolean;
}


/**
 * @ignore
 * Partial implementation of PortalOutlet that handles attaching
 * ComponentPortal and TemplatePortal.

 * @zh 类 `BasePortalOutlet`，封装 `src/common/keyboard` 中的基础传送门容器Outlet数据结构与处理逻辑。
 */
export abstract class BasePortalOutlet implements PortalOutlet {
    /**
     * The portal currently attached to the host.
     * @zh 属性 `_attachedPortal`（类型：`any`），用于存储或配置已附加传送门容器。
     */
    protected _attachedPortal;

    /**
     * A function that will permanently dispose this host.
     * @zh 属性 `_disposeFn`（类型：`() => void`），用于存储或配置释放函数。
     */
    private _disposeFn: (() => void) | null;

    /**
     * Whether this host has already been permanently disposed.
     * @zh 属性 `_isDisposed`（类型：`boolean`），用于存储或配置是否为已释放（默认值：`false`）。
     */
    private _isDisposed = false;

    /**
     * Whether this host has an attached portal.
     * @zh 执行 `hasAttached`，用于是否包含已附加。
     */
    hasAttached(): boolean {
        return !!this._attachedPortal;
    }

    // attach<T>(portal: ComponentPortal<T>): ComponentRef<T>;

    // attach<T>(portal: TemplatePortal<T>): EmbeddedViewRef<T>;

    // attach(portal: any): any;

    /**
     * Attaches a portal.
     * @zh 执行 `attach`，用于挂载。
     */
    attach(portal) {
        if (!portal) {
            console.error('null portal!');
            // throwNullPortalError();
        }

        if (this.hasAttached()) {
            console.error('portal already attached');
            // throwPortalAlreadyAttachedError();
        }

        if (this._isDisposed) {
            console.error('portal out already disposed');
            // throwPortalOutletAlreadyDisposedError();
        }

        if (portal instanceof ComponentPortal) {
            this._attachedPortal = portal;
            return this.attachComponentPortal(portal);
        } else if (portal instanceof TemplatePortal) {
            this._attachedPortal = portal;
            return this.attachTemplatePortal(portal);
        }
        return undefined;
        console.error('unknown portal type');
        // throwUnknownPortalTypeError();
    }

    /**
     * Executes `attachComponentPortal` to handle attach component portal.
     * @zh 执行 `attachComponentPortal`，用于挂载组件传送门容器。
     * @param portal - portal parameter (`ComponentPortal<T>`) / 传送门容器参数（`ComponentPortal<T>`）
     * @returns Result of type `ComponentRef<T>` / 类型为 `ComponentRef<T>` 的返回值
     */
    abstract attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;

    /**
     * Executes `attachTemplatePortal` to handle attach template portal.
     * @zh 执行 `attachTemplatePortal`，用于挂载模板传送门容器。
     * @param portal - portal parameter (`TemplatePortal<C>`) / 传送门容器参数（`TemplatePortal<C>`）
     * @returns Result of type `EmbeddedViewRef<C>` / 类型为 `EmbeddedViewRef<C>` 的返回值
     */
    abstract attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C>;

    /**
     * Detaches a previously attached portal.
     * @zh 执行 `detach`，用于卸载。
     */
    detach(): void {
        if (this._attachedPortal) {
            this._attachedPortal.setAttachedHost(null);
            this._attachedPortal = null;
        }

        this._invokeDisposeFn();
    }

    /**
     * Permanently dispose of this portal host.
     * @zh 执行 `dispose`，用于释放。
     */
    dispose(): void {
        if (this.hasAttached()) {
            this.detach();
        }

        this._invokeDisposeFn();
        this._isDisposed = true;
    }

    /**
     * @docs-private
     * @zh 执行 `setDisposeFn`，用于集合释放函数。
     */
    setDisposeFn(fn: () => void) {
        this._disposeFn = fn;
    }

    /**
     * Executes `_invokeDisposeFn` to handle invoke dispose fn.
     * @zh 执行 `_invokeDisposeFn`，用于调用释放函数。
     */
    private _invokeDisposeFn() {
        if (this._disposeFn) {
            this._disposeFn();
            this._disposeFn = null;
        }
    }
}
