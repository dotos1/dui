import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ComponentFactoryResolver, inject, Injectable } from '@angular/core';

import { DomPortalHost } from '../portal/dom-portal-host';
import { ToastContainerDirective } from '../toastr/toast.directive';
import { OverlayContainer } from './overlay-container';
import { OverlayRef } from './overlay-ref';


@Injectable({ providedIn: 'root' })
export class Overlay {
  private _overlayContainer = inject(OverlayContainer);
  private _componentFactoryResolver = inject(ComponentFactoryResolver);
  private _appRef = inject(ApplicationRef);
  private _document = inject(DOCUMENT);

  // Namespace panes by overlay container
  private _paneElements: Map<ToastContainerDirective, Record<string, HTMLElement>> = new Map();


  create(positionClass?: string, overlayContainer?: ToastContainerDirective): OverlayRef {

    return this._createOverlayRef(this.getPaneElement(positionClass, overlayContainer));
  }

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


  private _createPortalHost(pane: HTMLElement): DomPortalHost {
    return new DomPortalHost(pane, this._componentFactoryResolver, this._appRef);
  }


  private _createOverlayRef(pane: HTMLElement): OverlayRef {
    return new OverlayRef(this._createPortalHost(pane));
  }
}
