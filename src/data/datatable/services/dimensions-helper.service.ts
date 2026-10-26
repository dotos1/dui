/**
 * @fileoverview Module `src/data/datatable/services/dimensions-helper.service.ts` providing dimensions helper service definitions and implementation.
 * @zh 模块文件 `src/data/datatable/services/dimensions-helper.service.ts`，提供维度列表辅助工具服务相关的定义与实现。
 */

import {  Injectable } from '@angular/core';

/**
 * Injectable Angular service `DimensionsHelper` managing dimensions helper state and operations in `src/data/datatable/services`.
 * @zh 可注入的 Angular 服务 `DimensionsHelper`，管理 `src/data/datatable/services` 中的维度列表辅助工具状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class DimensionsHelper {
  /**
   * Executes `getDimensions` to handle get dimensions.
   * @zh 执行 `getDimensions`，用于获取维度列表。
   * @param element - element parameter (`Element`) / 元素参数（`Element`）
   * @returns Result of type `ClientRect` / 类型为 `ClientRect` 的返回值
   */
  getDimensions(element: Element): ClientRect {
    return element.getBoundingClientRect();
  }
}
