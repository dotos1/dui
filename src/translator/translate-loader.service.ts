/**
 * @fileoverview Module `src/translator/translate-loader.service.ts` providing translate loader service definitions and implementation.
 * @zh 模块文件 `src/translator/translate-loader.service.ts`，提供翻译加载器服务相关的定义与实现。
 */


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, throwError, of } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { TranslateLoader } from './translate.loader';
import { ObjectUtils } from '@dotos/dui/base'
import { ComponentTranslationModel } from './component.model';

/**
 * Injectable Angular service `TranslateLoaderService` managing translate loader service state and operations in `src/translator`.
 * @zh 可注入的 Angular 服务 `TranslateLoaderService`，管理 `src/translator` 中的翻译加载器服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class TranslateLoaderService implements TranslateLoader {

  /**
   * Property `suffix` (`string`) storing suffix (default: `'.json'`).
   * @zh 属性 `suffix`（类型：`string`），用于存储或配置后缀（默认值：`'.json'`）。
   */
  private suffix: string = '.json';
  /**
   * Property `providers` (`ComponentTranslationModel[]`) storing providers (default: `[]`).
   * @zh 属性 `providers`（类型：`ComponentTranslationModel[]`），用于存储或配置提供者列表（默认值：`[]`）。
   */
  private providers: ComponentTranslationModel[] = [];
  /**
   * Property `queue` (`string[][]`) storing queue (default: `[]`).
   * @zh 属性 `queue`（类型：`string[][]`），用于存储或配置队列（默认值：`[]`）。
   */
  private queue: string[][] = [];
  /**
   * Property `defaultLang` (`string`) storing default lang (default: `'en_US'`).
   * @zh 属性 `defaultLang`（类型：`string`），用于存储或配置默认语言（默认值：`'en_US'`）。
   */
  private defaultLang: string = 'en_US';
  /**
   * Property `retriedOnce` (`Set`) storing retried once (default: `new Set<string>()`).
   * @zh 属性 `retriedOnce`（类型：`Set`），用于存储或配置retriedOnce（默认值：`new Set<string>()`）。
   */
  private retriedOnce = new Set<string>();

  /**
   * Creates an instance of `TranslateLoaderService` and initializes its dependencies and internal state.
   * @zh 创建 `TranslateLoaderService` 实例，并初始化其依赖项与内部状态。
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   */
  constructor(public http: HttpClient) {
  }

  /**
   * Executes `setDefaultLang` to handle set default lang.
   * @zh 执行 `setDefaultLang`，用于集合默认语言。
   * @param value - value parameter (`string`) / 值参数（`string`）
   */
  setDefaultLang(value: string) {
    this.defaultLang = value || 'zh_CN';
  }

  /**
   * Executes `registerProvider` to handle register provider.
   * @zh 执行 `registerProvider`，用于注册提供者。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @param path - path parameter (`string`) / 路径参数（`string`）
   */
  registerProvider(name: string, path: string) {
    const registered = this.providers.find((provider) => provider.name === name);
    if (registered) {
      registered.path = path;
    } else {
      this.providers.push(new ComponentTranslationModel({ name: name, path: path }));
    }
  }

  /**
   * Executes `providerRegistered` to handle provider registered.
   * @zh 执行 `providerRegistered`，用于提供者已注册。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  providerRegistered(name: string): boolean {
    return this.providers.find((x) => x.name === name) ? true : false;
  }

  /**
   * Executes `fetchLanguageFile` to handle fetch language file.
   * @zh 执行 `fetchLanguageFile`，用于获取语言文件。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @param component - component parameter (`ComponentTranslationModel`) / 组件参数（`ComponentTranslationModel`）
   * @param fallbackUrl - fallback url parameter (`string`) / fallback链接地址参数（`string`）
   * @returns Result of type `Observable<void>` / 类型为 `Observable<void>` 的返回值
   */
  fetchLanguageFile(lang: string, component: ComponentTranslationModel, fallbackUrl?: string): Observable<void> {
    const basePath = component.name ? `${component.path}/${component.name}` : `${component.path}`;
    const translationUrl = fallbackUrl || `${basePath}/${lang}${this.suffix}?v=${Date.now()}`;

    return this.http.get(translationUrl).pipe(
      map((res) => {
        component.json[lang] = res;
      }),
      retry(3),
      catchError((error) => {
        // 只认 `-`(b8c5e5c 复核)。本系统的语言码是 zh_CN / en_US 这种下划线
        // 写法,并没有 zh.json、en.json 这类短码文件;连 `_` 一起认,每个组件
        // 加载失败都会再多发一个必然 404 的短码请求。
        if (!fallbackUrl && lang.includes('-')) {
          const [langId] = lang.split('-');

          if (langId && langId !== this.defaultLang) {
            const url = `${basePath}/${langId}${this.suffix}?v=${Date.now()}`;

            return this.fetchLanguageFile(lang, component, url);
          }
        }
        this.releaseForRetry(lang, component.name, error);
        return throwError(`Failed to load ${translationUrl}`);
      })
    );
  }

  /**
   * 加载失败的组件默认**留在** queue 里,同一语言不再重新请求(b8c5e5c 复核)。
   * 那次提交在失败时把它从 queue 删掉,结果之后每次 getTranslation(每次切语言、
   * 每个懒加载模块注册 provider)都重试一遍,每次都弹一遍 404 的错误提示。
   * 只有网络断开(status 0)或服务端 5xx 这类可能自愈的失败,才放行**一次**重试。

   * @zh 加载失败的组件默认**留在** queue 里,同一语言不再重新请求(b8c5e5c 复核)。
   */
  private releaseForRetry(lang: string, name: string, error) {
    const status = error?.status;
    const transient = status === 0 || (typeof status === 'number' && status >= 500);
    const key = `${lang}|${name}`;
    if (!transient || this.retriedOnce.has(key)) {
      return;
    }
    this.retriedOnce.add(key);
    const idx = (this.queue[lang] || []).indexOf(name);
    if (idx > -1) {
      this.queue[lang].splice(idx, 1);
    }
  }

  /**
   * Executes `getComponentToFetch` to handle get component to fetch.
   * @zh 执行 `getComponentToFetch`，用于获取组件转换为获取。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @returns Result of type `Array<Observable<any>>` / 类型为 `Array<Observable<any>>` 的返回值
   */
  getComponentToFetch(lang: string) {
    const observableBatch = [];
    if (!this.queue[lang]) {
      this.queue[lang] = [];
    }
    this.providers.forEach((component) => {
      if (!this.isComponentInQueue(lang, component.name)) {
        this.queue[lang].push(component.name);

        observableBatch.push(
          this.fetchLanguageFile(lang, component)
        );
      }
    });

    return observableBatch;
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   */
  init(lang: string) {
    if (this.queue[lang] === undefined) {
      this.queue[lang] = [];
    }
  }

  /**
   * Executes `isComponentInQueue` to handle is component in queue.
   * @zh 执行 `isComponentInQueue`，用于是否为组件在队列。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @param name - name parameter (`string`) / 名称参数（`string`）
   */
  isComponentInQueue(lang: string, name: string) {
    //return (this.queue[lang] || []).find((x) => x === name) ? true : false;

    return (this.queue[lang] || []).find((x) => x === name) != undefined;
  }

  /**
   * Executes `getFullTranslationJSON` to handle get full translation json.
   * @zh 执行 `getFullTranslationJSON`，用于获取完整翻译文本JSON。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  getFullTranslationJSON(lang: string) {
    let result: Record<string, unknown> = {};
    this.providers
      .slice(0)
      .sort((a, b) => {
        if (a.name === 'app') {
          return 1;
        }
        if (b.name === 'app') {
          return -1;
        }
        return a.name.localeCompare(b.name);
      })
      .forEach((model) => {
        if (model.json && model.json[lang]) {
          result = ObjectUtils.merge(result, model.json[lang]);
        }
      });

    return result;
  }

  /**
   * Executes `getTranslation` to handle get translation.
   * @zh 执行 `getTranslation`，用于获取翻译文本。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @returns Result of type `Observable<any>` / 类型为 `Observable<any>` 的返回值
   */
  getTranslation(lang: string) {
    let hasFailures = false;
    const batch = [
      ...this.getComponentToFetch(lang).map((observable) => {
        return observable.pipe(
          catchError((error) => {
            // console.warn(error);
            hasFailures = true;
            return of(error);
          })
        );
      })
    ];

    return new Observable((observer) => {
      if (batch.length > 0) {
        forkJoin(batch).subscribe(
          () => {
            const fullTranslation = this.getFullTranslationJSON(lang);
            if (fullTranslation) {
              observer.next(fullTranslation);
            }
            if (hasFailures) {
              observer.error('Failed to load some resources');
            } else {
              observer.complete();
            }
          },
          () => {
            observer.error('Failed to load some resources');
          });
      } else {
        const fullTranslation = this.getFullTranslationJSON(lang);
          if (fullTranslation) {
          observer.next(fullTranslation);
          observer.complete();
        }
      }
    });
  }
}
