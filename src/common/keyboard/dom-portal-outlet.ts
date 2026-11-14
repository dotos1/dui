/**
 * @fileoverview Module `src/common/keyboard/dom-portal-outlet.ts` providing dom portal outlet definitions and implementation.
 * @zh 模块文件 `src/common/keyboard/dom-portal-outlet.ts`，提供DOM节点传送门容器outlet相关的定义与实现。
 */

import {
    createComponent,
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
     * Element into which the content is projected.
     * @zh 属性 `outletElement`（类型：`Element`），用于存储或配置宿主元素。
     */
    public outletElement: Element;
    private _appRef: ApplicationRef;
    private _defaultInjector: Injector;

    constructor(outletElement: Element, _appRef: ApplicationRef, _defaultInjector: Injector);
    constructor(outletElement: Element, _legacyResolver: unknown, _appRef: ApplicationRef, _defaultInjector: Injector);
    constructor(
        outletElement: Element,
        arg1: ApplicationRef | unknown,
        arg2: Injector | ApplicationRef,
        arg3?: Injector) {
        super();
        this.outletElement = outletElement;
        if (arg3 !== undefined) {
            this._appRef = arg2 as ApplicationRef;
            this._defaultInjector = arg3;
        } else {
            this._appRef = arg1 as ApplicationRef;
            this._defaultInjector = arg2 as Injector;
        }
    }

    /**
     * Executes `attachComponentPortal` to handle attach component portal.
     * @zh 执行 `attachComponentPortal`，用于挂载组件传送门容器。
     * @param portal - portal parameter (`ComponentPortal<T>`) / 传送门容器参数（`ComponentPortal<T>`）
     * @returns Result of type `ComponentRef<T>` / 类型为 `ComponentRef<T>` 的返回值
     */
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
        let componentRef: ComponentRef<T>;

        if (portal.viewContainerRef) {
            componentRef = portal.viewContainerRef.createComponent(
                portal.component,
                {
                    index: portal.viewContainerRef.length,
                    injector: portal.injector || portal.viewContainerRef.injector,
                });

            this.setDisposeFn(() => componentRef.destroy());
        } else {
            componentRef = createComponent(portal.component, {
                environmentInjector: this._appRef.injector,
                elementInjector: portal.injector || this._defaultInjector,
            });
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
     * @param componentRef - component ref parameter (`any`) / 组件引用参数（`any`）
     * @returns Result of type `HTMLElement` / 类型为 `HTMLElement` 的返回值
     */
    private _getComponentRootNode(componentRef): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
    }
}
