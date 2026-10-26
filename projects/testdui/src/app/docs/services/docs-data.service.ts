/**
 * @fileoverview Module `projects/testdui/src/app/docs/services/docs-data.service.ts` providing docs data service definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/services/docs-data.service.ts`，提供文档数据服务相关的定义与实现。
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

import { DocsManifest } from '../models/docs-manifest.model';
import { ModuleApiFile } from '../models/api-record.model';

/**
 * Constant/variable `EMPTY_MANIFEST` defining empty manifest in `projects/testdui/src/app/docs/services`.
 * @zh 常量/变量 `EMPTY_MANIFEST`，定义 `projects/testdui/src/app/docs/services` 中的空MANIFEST。
 */
const EMPTY_MANIFEST: DocsManifest = { generatedAt: '', categories: [] };

/**
 * Injectable Angular service `DocsDataService` managing docs data service state and operations in `projects/testdui/src/app/docs/services`.
 * @zh 可注入的 Angular 服务 `DocsDataService`，管理 `projects/testdui/src/app/docs/services` 中的文档数据服务状态与业务操作。
 */
@Injectable({ providedIn: 'root' })
export class DocsDataService {
  /**
   * Property `manifest$` (`Observable<DocsManifest>`) storing manifest.
   * @zh 属性 `manifest$`（类型：`Observable<DocsManifest>`），用于存储或配置manifest。
   */
  private manifest$?: Observable<DocsManifest>;

  /**
   * Creates an instance of `DocsDataService` and initializes its dependencies and internal state.
   * @zh 创建 `DocsDataService` 实例，并初始化其依赖项与内部状态。
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   */
  constructor(private http: HttpClient) {}

  /**
   * Executes `getManifest` to handle get manifest.
   * @zh 执行 `getManifest`，用于获取Manifest。
   * @returns Result of type `Observable<DocsManifest>` / 类型为 `Observable<DocsManifest>` 的返回值
   */
  getManifest(): Observable<DocsManifest> {
    if (!this.manifest$) {
      this.manifest$ = this.http.get<DocsManifest>('assets/docs-data/manifest.json').pipe(
        catchError(() => of(EMPTY_MANIFEST)),
        shareReplay(1)
      );
    }
    return this.manifest$;
  }

  /**
   * Executes `getModuleApi` to handle get module api.
   * @zh 执行 `getModuleApi`，用于获取模块API接口。
   * @param category - category parameter (`string`) / 分类参数（`string`）
   * @param moduleId - module id parameter (`string`) / 模块唯一标识参数（`string`）
   * @returns Result of type `Observable<ModuleApiFile | null>` / 类型为 `Observable<ModuleApiFile | null>` 的返回值
   */
  getModuleApi(category: string, moduleId: string): Observable<ModuleApiFile | null> {
    return this.http
      .get<ModuleApiFile>(`assets/docs-data/${category}/${moduleId}.json`)
      .pipe(catchError(() => of(null)));
  }

  /**
   * Executes `getCategoryMarkdown` to handle get category markdown.
   * @zh 执行 `getCategoryMarkdown`，用于获取分类Markdown文档。
   * @param category - category parameter (`string`) / 分类参数（`string`）
   * @returns Result of type `Observable<string>` / 类型为 `Observable<string>` 的返回值
   */
  getCategoryMarkdown(category: string): Observable<string> {
    return this.http
      .get(`assets/docs-content/${category}.md`, { responseType: 'text' })
      .pipe(catchError(() => of('')));
  }
}
