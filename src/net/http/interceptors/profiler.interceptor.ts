/**
 * @fileoverview Module `src/net/http/interceptors/profiler.interceptor.ts` providing profiler interceptor definitions and implementation.
 * @zh 模块文件 `src/net/http/interceptors/profiler.interceptor.ts`，提供profiler拦截器相关的定义与实现。
 */

import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap, finalize } from "rxjs/operators";
import { sanitizeUrl } from "../error/platform-error";

/**
 * Injectable Angular service `ProfilerInterceptor` managing profiler interceptor state and operations in `src/net/http/interceptors`.
 * @zh 可注入的 Angular 服务 `ProfilerInterceptor`，管理 `src/net/http/interceptors` 中的Profiler拦截器状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class ProfilerInterceptor implements HttpInterceptor {
  /**
   * Creates an instance of `ProfilerInterceptor` and initializes its dependencies and internal state.
   * @zh 创建 `ProfilerInterceptor` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {}
  /**
   * Executes `intercept` to handle intercept.
   * @zh 执行 `intercept`，用于拦截。
   * @param req - req parameter (`HttpRequest<unknown>`) / 请求参数（`HttpRequest<unknown>`）
   * @param next - next parameter (`HttpHandler`) / 下一个参数（`HttpHandler`）
   * @returns Result of type `Observable<HttpEvent<unknown>>` / 类型为 `Observable<HttpEvent<unknown>>` 的返回值
   */
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const started = Date.now();
    let ok: string;
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<unknown>) => {
          if (event instanceof HttpResponse) {
            ok = "succeeded";
          }
        },
        () => (ok = "failed")
      ),
      finalize(() => {
        const elapsed = Date.now() - started;
        const msg = `${req.method} "${sanitizeUrl(req.urlWithParams)}"  ${ok} in ${elapsed} ms.`;
        console.log(msg);
      })
    );
  }
}
