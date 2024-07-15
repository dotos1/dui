import { ComponentRef } from '@angular/core';
import { BasePortalHost, ComponentPortal } from '../portal/portal';


export class OverlayRef {
  constructor(private _portalHost: BasePortalHost) {}

  attach(
    portal: ComponentPortal<any>,
    newestOnTop: boolean = true,
  ): ComponentRef<any> {
    return this._portalHost.attach(portal, newestOnTop);
  }


  detach() {
    return this._portalHost.detach();
  }
}
