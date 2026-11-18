/**
 * @fileoverview Module `src/util/pipes/custom-html.pipe.ts` providing custom html pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/custom-html.pipe.ts`，提供自定义HTML内容管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { sanitizeHtmlString } from '@dotos1/dui/base';

/**
 * Angular pipe `SanitizeHtmlPipe` (name: 'sanitizeHtml') transforming values for sanitize html pipe display in templates.
 * @zh Angular 管道 `SanitizeHtmlPipe`（name: 'sanitizeHtml'），在模板中转换数据以用于SanitizeHTML内容管道展示。
 */
@Pipe({ name: 'sanitizeHtml', standalone: false })
export class SanitizeHtmlPipe implements PipeTransform {
  /**
   * Creates an instance of `SanitizeHtmlPipe` and initializes its dependencies and internal state.
   * @zh 创建 `SanitizeHtmlPipe` 实例，并初始化其依赖项与内部状态。
   * @param _sanitizer - Injected or initial sanitizer (`DomSanitizer`) / 注入或传入的安全清理器（`DomSanitizer`）
   */
  constructor(private _sanitizer: DomSanitizer) {
  }
  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param v - v parameter (`string`) / v参数（`string`）
   * @returns Result of type `SafeHtml` / 类型为 `SafeHtml` 的返回值
   */
  transform(v: string): SafeHtml {
    if (!v) {
      return '';
    }
    // 在 DOM 上净化,不用正则(b8c5e5c 复核,原因见 sanitize-dom.ts):
    // 正则会把正文里的 `onset = 5` 当成事件属性删掉,也拦不住带空白/实体的
    // javascript: 链接。style 保留 —— 这里放行的是可信的富文本,不走 Angular
    // 的默认净化正是为了留住 style。
    return this._sanitizer.bypassSecurityTrustHtml(sanitizeHtmlString(String(v)));
  }
}
