/**
 * @fileoverview Module `src/common/keyboard/dom-portal-outlet.ts` providing dom portal outlet definitions and implementation.
 * @zh 模块文件 `src/common/keyboard/dom-portal-outlet.ts`，提供DOM节点传送门容器outlet相关的定义与实现。
 */

import {
    ComponentFactoryResolver,
    ComponentRef,
    EmbeddedViewRef,
    ApplicationRef,
    Injector,
} from '@angular/core';
import {BasePortalOutlet, ComponentPortal, TemplatePortal} from './portal';



/**
 * Class `DomPortalOutlet` encapsulating dom portal outlet data structures and logic in `src/common/keyboard`.
 * @zh 类 `DomPortalOutlet`，封装 `src/common/keyboard` 中的DOM节点传送门容器Outlet数据结构与处理逻辑。
 */
export class DomPortalOutlet extends BasePortalOutlet {
    /**
     * Creates an instance of `DomPortalOutlet` and initializes its dependencies and internal state.
     * @zh 创建 `DomPortalOutlet` 实例，并初始化其依赖项与内部状态。
     * @param outletElement - Injected or initial outlet element (`Element`) / 注入或传入的outlet元素（`Element`）
     * @param _componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
     * @param _appRef - Injected or initial app ref (`ApplicationRef`) / 注入或传入的app引用（`ApplicationRef`）
     * @param _defaultInjector - Injected or initial default injector (`Injector`) / 注入或传入的默认注入器（`Injector`）
     */
    constructor(
        /** Element into which the content is projected. */
        public outletElement: Element,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _appRef: ApplicationRef,
        private _defaultInjector: Injector) {
        super();
    }

    /**
     * Executes `attachComponentPortal` to handle attach component portal.
     * @zh 执行 `attachComponentPortal`，用于挂载组件传送门容器。
     * @param portal - portal parameter (`ComponentPortal<T>`) / 传送门容器参数（`ComponentPortal<T>`）
     * @returns Result of type `ComponentRef<T>` / 类型为 `ComponentRef<T>` 的返回值
     */
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
        const resolver = portal.componentFactoryResolver || this._componentFactoryResolver;
        const componentFactory = resolver.resolveComponentFactory(portal.component);
        let componentRef: ComponentRef<T>;

        if (portal.viewContainerRef) {
            componentRef = portal.viewContainerRef.createComponent(
                componentFactory,
                portal.viewContainerRef.length,
                portal.injector || portal.viewContainerRef.injector);

            this.setDisposeFn(() => componentRef.destroy());
        } else {
            componentRef = componentFactory.create(portal.injector || this._defaultInjector);
            this._appRef.attachView(componentRef.hostView);
            this.setDisposeFn(() => {
                this._appRef.detachView(componentRef.hostView);
                componentRef.destroy();
            });
        }
        this.outletElement.appendChild(this._getComponentRootNode(componentRef));
        return componentRef;
    }

    /**
     * Executes `attachTemplatePortal` to handle attach template portal.
     * @zh 执行 `attachTemplatePortal`，用于挂载模板传送门容器。
     * @param portal - portal parameter (`TemplatePortal<C>`) / 传送门容器参数（`TemplatePortal<C>`）
     * @returns Result of type `EmbeddedViewRef<C>` / 类型为 `EmbeddedViewRef<C>` 的返回值
     */
    attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
        const viewContainer = portal.viewContainerRef;
        const viewRef = viewContainer.createEmbeddedView(portal.templateRef, portal.context);
        viewRef.detectChanges();

        viewRef.rootNodes.forEach(rootNode => this.outletElement.appendChild(rootNode));

        this.setDisposeFn((() => {
            const index = viewContainer.indexOf(viewRef);
            if (index !== -1) {
                viewContainer.remove(index);
            }
        }));

        return viewRef;
    }

    /**
     * Executes `dispose` to handle dispose.
     * @zh 执行 `dispose`，用于释放。
     */
    override dispose(): void {
        super.dispose();
        if (this.outletElement.parentNode != null) {
            this.outletElement.parentNode.removeChild(this.outletElement);
        }
    }

    /**
     * Executes `_getComponentRootNode` to handle get component root node.
     * @zh 执行 `_getComponentRootNode`，用于获取组件根节点节点。
     * @param componentRef - component ref parameter (`ComponentRef<any>`) / 组件引用参数（`ComponentRef<any>`）
     * @returns Result of type `HTMLElement` / 类型为 `HTMLElement` 的返回值
     */
    private _getComponentRootNode(componentRef): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
    }
}
