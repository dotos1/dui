/**
 * @fileoverview Module `src/ui/context-menu/context-menu-overlay.ts` providing context menu overlay definitions and implementation.
 * @zh 模块文件 `src/ui/context-menu/context-menu-overlay.ts`，提供上下文菜单浮层相关的定义与实现。
 */


import { OverlayRef } from '@angular/cdk/overlay';
/**
 * Class `ContextMenuOverlayRef` encapsulating context menu overlay ref data structures and logic in `src/ui/context-menu`.
 * @zh 类 `ContextMenuOverlayRef`，封装 `src/ui/context-menu` 中的上下文菜单浮层引用数据结构与处理逻辑。
 */
export class ContextMenuOverlayRef {
  /**
   * Creates an instance of `ContextMenuOverlayRef` and initializes its dependencies and internal state.
   * @zh 创建 `ContextMenuOverlayRef` 实例，并初始化其依赖项与内部状态。
   * @param overlayRef - Injected or initial overlay ref (`OverlayRef`) / 注入或传入的浮层引用（`OverlayRef`）
   */
  constructor(public overlayRef: OverlayRef) { }
  /**
   * Executes `close` to handle close.
   * @zh 执行 `close`，用于关闭。
   */
  close(): void {
    this.overlayRef.dispose();
  }
}
