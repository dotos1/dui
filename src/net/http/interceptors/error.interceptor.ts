/**
 * @fileoverview Module `src/net/http/interceptors/error.interceptor.ts` providing error interceptor definitions and implementation.
 * @zh 模块文件 `src/net/http/interceptors/error.interceptor.ts`，提供错误拦截器相关的定义与实现。
 */

import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastrService } from "@dotos/dui/common/toastr";

/**
 * Injectable Angular service `ErrorInterceptor` managing error interceptor state and operations in `src/net/http/interceptors`.
 * @zh 可注入的 Angular 服务 `ErrorInterceptor`，管理 `src/net/http/interceptors` 中的错误拦截器状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  /**
   * Creates an instance of `ErrorInterceptor` and initializes its dependencies and internal state.
   * @zh 创建 `ErrorInterceptor` 实例，并初始化其依赖项与内部状态。
   * @param toastr - Injected or initial toastr (`ToastrService`) / 注入或传入的轻提示（`ToastrService`）
   */
  constructor(
    private toastr: ToastrService,

  ) { }
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
    if (req.url.indexOf('timeout') !== -1) {
      return next.handle(req);
    } else {
      const isIdempotent = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
      let retried = false;
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (!retried && isIdempotent && !(error.status >= 400 && error.status < 500)) {
            retried = true;
            return next.handle(req);
          }
          return throwError(error);
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status !== 401) {
            this.toastr.error(error.message);
          }
          return throwError(error);
        })
      );
    }
  }
}
