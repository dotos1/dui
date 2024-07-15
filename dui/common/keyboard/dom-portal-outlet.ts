import {
    ComponentFactoryResolver,
    ComponentRef,
    EmbeddedViewRef,
    ApplicationRef,
    Injector,
} from '@angular/core';
import {BasePortalOutlet, ComponentPortal, TemplatePortal} from './portal';



export class DomPortalOutlet extends BasePortalOutlet {
    constructor(
        /** Element into which the content is projected. */
        public outletElement: Element,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _appRef: ApplicationRef,
        private _defaultInjector: Injector) {
        super();
    }

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

    override dispose(): void {
        super.dispose();
        if (this.outletElement.parentNode != null) {
            this.outletElement.parentNode.removeChild(this.outletElement);
        }
    }

    private _getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }
}
