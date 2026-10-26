/**
 * @fileoverview Module `src/ux/multi-window/providers/window.provider.ts` providing window provider definitions and implementation.
 * @zh 模块文件 `src/ux/multi-window/providers/window.provider.ts`，提供窗口提供者相关的定义与实现。
 */

import { Injectable } from '@angular/core';

/**
 * Executes `_window` to handle window.
 * @zh 执行 `_window`，用于窗口。
 */
function _window(){
  return window;
};

/**
 * Injectable Angular service `MultiWindowRef` managing multi window ref state and operations in `src/ux/multi-window/providers`.
 * @zh 可注入的 Angular 服务 `MultiWindowRef`，管理 `src/ux/multi-window/providers` 中的多窗口引用状态与业务操作。
 */
@Injectable()
export class MultiWindowRef {
  /**
   * Gets the current native window (`nativeWindow: any`).
   * @zh 获取当前原生窗口（`nativeWindow: any`）。
   */
  get nativeWindow() {
    return _window();
  }
}
