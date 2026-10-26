/**
 * @fileoverview Module `src/data/datatable/services/scrollbar-helper.service.ts` providing scrollbar helper service definitions and implementation.
 * @zh 模块文件 `src/data/datatable/services/scrollbar-helper.service.ts`，提供滚动条辅助工具服务相关的定义与实现。
 */

import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from "@angular/common";

/**
 * Injectable Angular service `ScrollbarHelper` managing scrollbar helper state and operations in `src/data/datatable/services`.
 * @zh 可注入的 Angular 服务 `ScrollbarHelper`，管理 `src/data/datatable/services` 中的滚动条辅助工具状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class ScrollbarHelper {
  /**
   * Property `width` (`number`) storing width (default: `this.getWidth()`).
   * @zh 属性 `width`（类型：`number`），用于存储或配置宽度（默认值：`this.getWidth()`）。
   */
  width: number = this.getWidth();

  /**
   * Creates an instance of `ScrollbarHelper` and initializes its dependencies and internal state.
   * @zh 创建 `ScrollbarHelper` 实例，并初始化其依赖项与内部状态。
   * @param document - Injected or initial document (`any`) / 注入或传入的文档对象（`any`）
   */
  constructor(@Inject(DOCUMENT) private document) {}

  /**
   * Executes `getWidth` to handle get width.
   * @zh 执行 `getWidth`，用于获取宽度。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getWidth(): number {
    const outer = this.document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar';
    this.document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';

    const inner = this.document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    const widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  }
}
