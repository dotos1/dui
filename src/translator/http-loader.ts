/**
 * @fileoverview Module `src/translator/http-loader.ts` providing http loader definitions and implementation.
 * @zh 模块文件 `src/translator/http-loader.ts`，提供HTTP加载器相关的定义与实现。
 */

import {HttpClient} from "@angular/common/http";
import {  Injectable } from "@angular/core";
import {Observable} from 'rxjs';
import { TranslateLoader } from "./translate.loader";

/**
 * Injectable Angular service `TranslateHttpLoader` managing translate http loader state and operations in `src/translator`.
 * @zh 可注入的 Angular 服务 `TranslateHttpLoader`，管理 `src/translator` 中的翻译HTTP加载器状态与业务操作。
 */
@Injectable()
export class TranslateHttpLoader implements TranslateLoader {
  /**
   * Property `prefix` (`string`) storing prefix (default: `"/assets/i18n/"`).
   * @zh 属性 `prefix`（类型：`string`），用于存储或配置前缀（默认值：`"/assets/i18n/"`）。
   */
  private prefix: string = "/assets/i18n/";
  /**
   * Property `suffix` (`string`) storing suffix (default: `".json"`).
   * @zh 属性 `suffix`（类型：`string`），用于存储或配置后缀（默认值：`".json"`）。
   */
  private suffix:string=".json";
  /**
   * Creates an instance of `TranslateHttpLoader` and initializes its dependencies and internal state.
   * @zh 创建 `TranslateHttpLoader` 实例，并初始化其依赖项与内部状态。
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   */
  constructor(private http: HttpClient) {}

  /**
   * Executes `getTranslation` to handle get translation.
   * @zh 执行 `getTranslation`，用于获取翻译文本。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @returns Result of type `Observable<Object>` / 类型为 `Observable<Object>` 的返回值
   */
  public getTranslation(lang: string): Observable<Object> {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`);
  }
}
