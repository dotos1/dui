/**
 * @fileoverview Module `src/core/window.service.ts` providing window service definitions and implementation.
 * @zh 模块文件 `src/core/window.service.ts`，提供窗口服务相关的定义与实现。
 */

// module
import { Window } from './models/window';
import { Injectable } from "@angular/core";

/**
 * Injectable Angular service `WindowService` managing window service state and operations in `src/core`.
 * @zh 可注入的 Angular 服务 `WindowService`，管理 `src/core` 中的窗口服务状态与业务操作。
 */
@Injectable()
export class WindowService implements Window {
  /**
   * Property `navigator` (`any`) storing navigator (default: `{}`).
   * @zh 属性 `navigator`（类型：`any`），用于存储或配置navigator（默认值：`{}`）。
   */
  navigator = {};
  /**
   * Property `location` (`any`) storing location (default: `{}`).
   * @zh 属性 `location`（类型：`any`），用于存储或配置location（默认值：`{}`）。
   */
  location = {};

  /**
   * Executes `alert` to handle alert.
   * @zh 执行 `alert`，用于警告框。
   * @param msg - msg parameter (`string`) / msg参数（`string`）
   */
  alert(msg: string): void {
    return;
  }

  /**
   * Executes `confirm` to handle confirm.
   * @zh 执行 `confirm`，用于confirm。
   * @param msg - msg parameter (`string`) / msg参数（`string`）
   */
  confirm(msg: string): void {
    return;
  }
}
