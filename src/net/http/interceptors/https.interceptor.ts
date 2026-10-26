/**
 * @fileoverview Module `src/net/http/interceptors/https.interceptor.ts` providing https interceptor definitions and implementation.
 * @zh 模块文件 `src/net/http/interceptors/https.interceptor.ts`，提供HTTP拦截器相关的定义与实现。
 */

import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";

/**
 * Injectable Angular service `HttpsInterceptor` managing https interceptor state and operations in `src/net/http/interceptors`.
 * @zh 可注入的 Angular 服务 `HttpsInterceptor`，管理 `src/net/http/interceptors` 中的HTTP拦截器状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class HttpsInterceptor implements HttpInterceptor {
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
    const httpsReq = req.clone({
      url: req.url.replace("http://", "https://")
    });
    return next.handle(httpsReq);
  }
}
