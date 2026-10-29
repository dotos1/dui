/**
 * @fileoverview Module `src/net/http/interceptors/header.interceptor.ts` providing header interceptor definitions and implementation.
 * @zh 模块文件 `src/net/http/interceptors/header.interceptor.ts`，提供表头拦截器相关的定义与实现。
 */

import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs";

/**
 * Injectable Angular service `HeaderInterceptor` managing header interceptor state and operations in `src/net/http/interceptors`.
 * @zh 可注入的 Angular 服务 `HeaderInterceptor`，管理 `src/net/http/interceptors` 中的表头拦截器状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptor implements HttpInterceptor {
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
    if (req.method == "POST") {
      return next.handle(req);
    }
    const modified = req.clone({ setHeaders: {'Content-Type': 'application/x-www-form-urlencoded'} });
    return next.handle(modified);
  }
}
