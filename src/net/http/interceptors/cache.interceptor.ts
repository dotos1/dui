/**
 * @fileoverview Module `src/net/http/interceptors/cache.interceptor.ts` providing cache interceptor definitions and implementation.
 * @zh 模块文件 `src/net/http/interceptors/cache.interceptor.ts`，提供缓存拦截器相关的定义与实现。
 */

import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

/**
 * Injectable Angular service `CacheInterceptor` managing cache interceptor state and operations in `src/net/http/interceptors`.
 * @zh 可注入的 Angular 服务 `CacheInterceptor`，管理 `src/net/http/interceptors` 中的缓存拦截器状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class CacheInterceptor implements HttpInterceptor {
  /**
   * Property `cache` (`Map`) storing cache.
   * @zh 属性 `cache`（类型：`Map`），用于存储或配置缓存。
   */
  private cache = new Map<string, { response: HttpResponse<unknown>; expiry: number }>();
  /**
   * Property `maxEntries` (`number`) storing max entries (default: `200`).
   * @zh 属性 `maxEntries`（类型：`number`），用于存储或配置最大值条目集合（默认值：`200`）。
   */
  private readonly maxEntries = 200;
  /**
   * Property `ttlMs` (`any`) storing ttl ms (default: `5 * 60 * 1000`).
   * @zh 属性 `ttlMs`（类型：`any`），用于存储或配置ttl毫秒（默认值：`5 * 60 * 1000`）。
   */
  private readonly ttlMs = 5 * 60 * 1000;

  /**
   * Executes `intercept` to handle intercept.
   * @zh 执行 `intercept`，用于intercept。
   * @param req - req parameter (`HttpRequest<any>`) / 请求参数（`HttpRequest<any>`）
   * @param next - next parameter (`HttpHandler`) / 下一个参数（`HttpHandler`）
   * @returns Result of type `Observable<HttpEvent<any>>` / 类型为 `Observable<HttpEvent<any>>` 的返回值
   */
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (req.method !== "GET") {
      return next.handle(req);
    }
    const cacheKey = req.urlWithParams;
    const cachedResponse = this.getFromCache(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.setInCache(cacheKey, event);
        }
      })
    );
  }

  /**
   * Executes `getFromCache` to handle get from cache.
   * @zh 执行 `getFromCache`，用于获取从缓存。
   * @param url - url parameter (`string`) / 链接地址参数（`string`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  private getFromCache(url: string): HttpResponse<unknown> | undefined {
    const entry = this.cache.get(url);
    if (!entry) {
      return undefined;
    }
    if (Date.now() > entry.expiry) {
      this.cache.delete(url);
      return undefined;
    }
    return entry.response;
  }

  /**
   * Executes `setInCache` to handle set in cache.
   * @zh 执行 `setInCache`，用于集合在缓存。
   * @param url - url parameter (`string`) / 链接地址参数（`string`）
   * @param response - response parameter (`any`) / 响应参数（`any`）
   */
  private setInCache(url: string, response: HttpResponse<unknown>): void {
    if (this.cache.size >= this.maxEntries) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(url, { response, expiry: Date.now() + this.ttlMs });
  }
}
