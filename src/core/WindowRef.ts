/**
 * @fileoverview Module `src/core/WindowRef.ts` providing window ref definitions and implementation.
 * @zh 模块文件 `src/core/WindowRef.ts`，提供窗口引用相关的定义与实现。
 */

import {Injectable} from '@angular/core';

/**
 * Executes `_window` to handle window.
 * @zh 执行 `_window`，用于窗口。
 * @returns Result of type `any` / 类型为 `any` 的返回值
 */
function _window() {
  return window;
}

/**
 * Injectable Angular service `WindowRef` managing window ref state and operations in `src/core`.
 * @zh 可注入的 Angular 服务 `WindowRef`，管理 `src/core` 中的窗口引用状态与业务操作。
 */
@Injectable()
export class WindowRef {
  /**
   * Gets the current native window (`nativeWindow: any`).
   * @zh 获取当前原生窗口（`nativeWindow: any`）。
   */
  get nativeWindow() {
    return _window();
  }
}
