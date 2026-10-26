/**
 * @fileoverview Module `src/ux/editor/pipes/sanitize/sanitize-html.pipe.ts` providing sanitize html pipe definitions and implementation.
 * @zh 模块文件 `src/ux/editor/pipes/sanitize/sanitize-html.pipe.ts`，提供sanitizeHTML内容管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Angular pipe `SanitizeHtmlPipe` (name: 'sanitizeHtml') transforming values for sanitize html pipe display in templates.
 * @zh Angular 管道 `SanitizeHtmlPipe`（name: 'sanitizeHtml'），在模板中转换数据以用于SanitizeHTML内容管道展示。
 */
@Pipe({
  name: 'sanitizeHtml',
})

export class SanitizeHtmlPipe implements PipeTransform {
  /**
   * Creates an instance of `SanitizeHtmlPipe` and initializes its dependencies and internal state.
   * @zh 创建 `SanitizeHtmlPipe` 实例，并初始化其依赖项与内部状态。
   * @param sanitizer - Injected or initial sanitizer (`DomSanitizer`) / 注入或传入的安全清理器（`DomSanitizer`）
   */
  constructor(private sanitizer: DomSanitizer) { }

  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param value - value parameter (`string`) / 值参数（`string`）
   * @returns Result of type `SafeHtml` / 类型为 `SafeHtml` 的返回值
   */
  transform(value: string): SafeHtml {
    if (!value) {
      return '';
    }
    const cleaned = String(value)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/\s(href|xlink:href|src)\s*=\s*(['"]?)\s*(?:javascript|vbscript):[^>\s'"]*\2/gi, '');
    return this.sanitizer.bypassSecurityTrustHtml(cleaned);
  }
}
