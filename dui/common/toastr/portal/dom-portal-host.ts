import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
} from '@angular/core';
import { BasePortalHost, ComponentPortal } from './portal';


export class DomPortalHost extends BasePortalHost {
  constructor(
    private _hostDomElement: Element,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
  ) {
    super();
  }


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

  /** Gets the root HTMLElement for an instantiated component. */
  private _getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  }
}
