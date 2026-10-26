/**
 * @fileoverview Module `src/ux/markdown/loader/markdown-loader.service.ts` providing markdown loader service definitions and implementation.
 * @zh 模块文件 `src/ux/markdown/loader/markdown-loader.service.ts`，提供Markdown文档加载器服务相关的定义与实现。
 */

import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { isGithubHref, rawGithubHref } from '../markdown-utils/markdown-utils';

/**
 * Injectable Angular service `MarkdownLoaderService` managing markdown loader service state and operations in `src/ux/markdown/loader`.
 * @zh 可注入的 Angular 服务 `MarkdownLoaderService`，管理 `src/ux/markdown/loader` 中的Markdown文档加载器服务状态与业务操作。
 */
@Injectable()
export class MarkdownLoaderService {
  /**
   * Creates an instance of `MarkdownLoaderService` and initializes its dependencies and internal state.
   * @zh 创建 `MarkdownLoaderService` 实例，并初始化其依赖项与内部状态。
   * @param _http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   * @param _sanitizer - Injected or initial sanitizer (`DomSanitizer`) / 注入或传入的安全清理器（`DomSanitizer`）
   */
  constructor(private _http: HttpClient, private _sanitizer: DomSanitizer) {}

  /**
   * Executes `load` to handle load.
   * @zh 执行 `load`，用于加载。
   * @param url - url parameter (`string`) / 链接地址参数（`string`）
   * @param httpOptions - http options parameter (`object`) / HTTP配置选项参数（`object`）
   * @returns Result of type `Promise<string>` / 类型为 `Promise<string>` 的返回值
   */
  async load(url: string, httpOptions: object = {}): Promise<string> {
    const sanitizedUrl: string =
      this._sanitizer.sanitize(SecurityContext.URL, url) ?? '';
    let urlToGet: string = sanitizedUrl;
    if (isGithubHref(sanitizedUrl)) {
      urlToGet = rawGithubHref(sanitizedUrl);
    }

    const response: HttpResponse<string> | undefined = await this._http
      .get(urlToGet, {
        ...httpOptions,
        responseType: 'text',
        observe: 'response',
      })
      .toPromise();
    const contentType: string = response?.headers.get('Content-Type') ?? '';
    if (
      contentType.includes('text/plain') ||
      contentType.includes('text/markdown')
    ) {
      return response?.body ?? '';
    } else {
      throw Error(`${contentType} is not a handled content type`);
    }
  }
}
