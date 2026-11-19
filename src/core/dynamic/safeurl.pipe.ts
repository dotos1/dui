/**
 * @fileoverview Module `src/core/dynamic/safeurl.pipe.ts` providing safeurl pipe definitions and implementation.
 * @zh 模块文件 `src/core/dynamic/safeurl.pipe.ts`，提供safeurl管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';
// eslint-disable-next-line no-control-regex
const DANGEROUS_URL_CHARS = /[\u0000-\u0020\u007f-\u00a0\u1680\u180e\u2000-\u200f\u2028\u2029\u205f\u3000\ufeff]/g;

/**
 * Checks whether a candidate URL string uses an executable or HTML-bearing scheme (`javascript:`, `vbscript:`, `data:text/html`).
 * @zh 检查候选 URL 是否包含可执行脚本或 HTML 载荷协议（`javascript:`、`vbscript:`、`data:text/html`）。
 * @param rawValue - rawValue parameter (`unknown`) / 待检查的原始值（`unknown`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
function isDangerousUrlValue(rawValue: unknown): boolean {
  if (rawValue === null || rawValue === undefined) {
    return false;
  }
  const normalized = String(rawValue).replace(DANGEROUS_URL_CHARS, '').toLowerCase();
  return (
    normalized.startsWith('javascript:') ||
    normalized.startsWith('vbscript:') ||
    normalized.startsWith('data:text/html')
  );
}

/**
 * Angular pipe `SafeurlPipe` (name: 'safeurl') transforming values for safeurl pipe display in templates.
 * @zh Angular 管道 `SafeurlPipe`（name: 'safeurl'），在模板中转换数据以用于Safeurl管道展示。
 */
@Pipe({
  name: 'safeurl',
  standalone: false
})
export class SafeurlPipe implements PipeTransform {
  /**
   * Creates an instance of `SafeurlPipe` and initializes its dependencies and internal state.
   * @zh 创建 `SafeurlPipe` 实例，并初始化其依赖项与内部状态。
   * @param sanitizer - Injected or initial sanitizer (`DomSanitizer`) / 注入或传入的安全清理器（`DomSanitizer`）
   */
  constructor(protected sanitizer: DomSanitizer) { }
  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param type - type parameter (`string`) / 类型参数（`string`）
   * @returns Result of type `SafeStyle | SafeResourceUrl | SafeHtml | SafeUrl | SafeScript` / 类型为 `SafeStyle | SafeResourceUrl | SafeHtml | SafeUrl | SafeScript` 的返回值
   */
  public transform(value, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script':
        throw new Error('Unsafe type "script" is forbidden in SafeurlPipe');
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(isDangerousUrlValue(value) ? '' : String(value ?? ''));
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(isDangerousUrlValue(value) ? '' : String(value ?? ''));
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}
