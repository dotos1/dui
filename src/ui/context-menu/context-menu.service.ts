/**
 * @fileoverview Module `src/ui/context-menu/context-menu.service.ts` providing context menu service definitions and implementation.
 * @zh 模块文件 `src/ui/context-menu/context-menu.service.ts`，提供上下文菜单服务相关的定义与实现。
 */


import { Injectable, Injector, ComponentRef, Inject } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Directionality } from '@angular/cdk/bidi';
import { ComponentPortal } from '@angular/cdk/portal';

import { ContextMenuOverlayRef } from './context-menu-overlay';
import { ContextMenuComponent } from './context-menu.component';
import { ContextmenuOverlayConfig } from './interfaces';
import { CONTEXT_MENU_DIRECTION } from './direction.token';

/**
 * Injectable Angular service `ContextMenuService` managing context menu service state and operations in `src/ui/context-menu`.
 * @zh 可注入的 Angular 服务 `ContextMenuService`，管理 `src/ui/context-menu` 中的上下文菜单服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {
  /**
   * Creates an instance of `ContextMenuService` and initializes its dependencies and internal state.
   * @zh 创建 `ContextMenuService` 实例，并初始化其依赖项与内部状态。
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param overlay - Injected or initial overlay (`Overlay`) / 注入或传入的浮层（`Overlay`）
   * @param direction - Injected or initial direction (`Directionality`) / 注入或传入的方向（`Directionality`）
   */
  constructor(
    private injector: Injector,
    private overlay: Overlay,
    @Inject(CONTEXT_MENU_DIRECTION) public direction: Directionality
  ) {
  }

  /**
   * Executes `open` to handle open.
   * @zh 执行 `open`，用于打开。
   * @param config - config parameter (`ContextmenuOverlayConfig`) / 配置参数（`ContextmenuOverlayConfig`）
   * @returns Result of type `ContextMenuOverlayRef` / 类型为 `ContextMenuOverlayRef` 的返回值
   */
  open(config: ContextmenuOverlayConfig): ContextMenuOverlayRef {
    const overlay = this.createOverlay(config);
    const overlayRef = new ContextMenuOverlayRef(overlay);
    let contextMenu = this.attachDialogContainer(overlay, overlayRef);
    contextMenu.children = config.children;
    return overlayRef;
  }

  /**
   * Executes `createOverlay` to handle create overlay.
   * @zh 执行 `createOverlay`，用于创建浮层。
   * @param config - config parameter (`ContextmenuOverlayConfig`) / 配置参数（`ContextmenuOverlayConfig`）
   * @returns Result of type `OverlayRef` / 类型为 `OverlayRef` 的返回值
   */
  private createOverlay(config: ContextmenuOverlayConfig): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  /**
   * Executes `attachDialogContainer` to handle attach dialog container.
   * @zh 执行 `attachDialogContainer`，用于挂载对话框容器。
   * @param overlay - overlay parameter (`OverlayRef`) / 浮层参数（`OverlayRef`）
   * @param contextmenuOverlayRef - contextmenu overlay ref parameter (`ContextMenuOverlayRef`) / contextmenu浮层引用参数（`ContextMenuOverlayRef`）
   * @returns Result of type `ContextMenuComponent` / 类型为 `ContextMenuComponent` 的返回值
   */
  private attachDialogContainer(
    overlay: OverlayRef,
    contextmenuOverlayRef: ContextMenuOverlayRef,
  ): ContextMenuComponent {
    const injector = this.createInjector(contextmenuOverlayRef);
    const containerPortal = new ComponentPortal(ContextMenuComponent, null, injector);
    const containerRef: ComponentRef<ContextMenuComponent> = overlay.attach(containerPortal);
    return containerRef.instance;
  }

  /**
   * Executes `createInjector` to handle create injector.
   * @zh 执行 `createInjector`，用于创建注入器。
   * @param contextmenuOverlayRef - contextmenu overlay ref parameter (`ContextMenuOverlayRef`) / contextmenu浮层引用参数（`ContextMenuOverlayRef`）
   * @returns Result of type `Injector` / 类型为 `Injector` 的返回值
   */
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

  /**
   * Executes `getOverlayConfig` to handle get overlay config.
   * @zh 执行 `getOverlayConfig`，用于获取浮层配置。
   * @param config - config parameter (`ContextmenuOverlayConfig`) / 配置参数（`ContextmenuOverlayConfig`）
   * @returns Result of type `OverlayConfig` / 类型为 `OverlayConfig` 的返回值
   */
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
