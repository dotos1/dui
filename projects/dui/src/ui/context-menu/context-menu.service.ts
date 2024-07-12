
import { Injectable, Injector, ComponentRef, Inject } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Directionality } from '@angular/cdk/bidi';
import { ComponentPortal } from '@angular/cdk/portal';

import { ContextMenuOverlayRef } from './context-menu-overlay';
import { ContextMenuComponent } from './context-menu.component';
import { ContextmenuOverlayConfig } from './interfaces';
import { CONTEXT_MENU_DIRECTION } from './direction.token';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {
  constructor(
    private injector: Injector,
    private overlay: Overlay,
    @Inject(CONTEXT_MENU_DIRECTION) public direction: Directionality
  ) {
  }

  open(config: ContextmenuOverlayConfig): ContextMenuOverlayRef {
    const overlay = this.createOverlay(config);
    const overlayRef = new ContextMenuOverlayRef(overlay);
    let contextMenu = this.attachDialogContainer(overlay, overlayRef);
    contextMenu.children = config.children;
    return overlayRef;
  }

  private createOverlay(config: ContextmenuOverlayConfig): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(
    overlay: OverlayRef,
    contextmenuOverlayRef: ContextMenuOverlayRef,
  ): ContextMenuComponent {
    const injector = this.createInjector(contextmenuOverlayRef);
    const containerPortal = new ComponentPortal(ContextMenuComponent, null, injector);
    const containerRef: ComponentRef<ContextMenuComponent> = overlay.attach(containerPortal);
    return containerRef.instance;
  }

  private createInjector(
    contextmenuOverlayRef: ContextMenuOverlayRef
  ): Injector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(ContextMenuOverlayRef, contextmenuOverlayRef);
    injectionTokens.set(CONTEXT_MENU_DIRECTION, this.direction);

    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ContextMenuOverlayRef, useValue: contextmenuOverlayRef },
        { provide: CONTEXT_MENU_DIRECTION, useValue: this.direction }
      ]
    });
  }

  private getOverlayConfig(config: ContextmenuOverlayConfig): OverlayConfig {

    const { x, y } = config.source;
    let x1=Math.round(x);
    let y1=Math.round(y);

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo({x:x1, y:y1,clientLeft:x1,clientTop:y1})
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition()
      .withPositions([
        {
          originX: "start",
          originY: "bottom",
          overlayX: "start",
          overlayY: "top"
        },
        {
          originX: "start",
          originY: "top",
          overlayX: "start",
          overlayY: "bottom"
        },
        {
          originX: "end",
          originY: "bottom",
          overlayX: "end",
          overlayY: "top"
        },
        {
          originX: "end",
          originY: "top",
          overlayX: "end",
          overlayY: "bottom"
        }
      ]);

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy,
      direction: this.direction
    });

    return overlayConfig;
  }
}
