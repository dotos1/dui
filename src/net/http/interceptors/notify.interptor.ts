/**
 * @fileoverview Module `src/net/http/interceptors/notify.interptor.ts` providing notify interptor definitions and implementation.
 * @zh 模块文件 `src/net/http/interceptors/notify.interptor.ts`，提供通知interptor相关的定义与实现。
 */

import { Injectable,Injector } from "@angular/core";
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse } from "@angular/common/http";
import { Observable} from "rxjs";
import { ToastrService } from "@dotos/dui/common/toastr";
import { TranslationService } from '@dotos/dui/translator';
import { tap } from 'rxjs/operators';

/**
 * Executes `tapOnce` to handle tap once.
 * @zh 执行 `tapOnce`，用于tapOnce。
 * @param fn - fn parameter (`(v: T) => any`) / 函数参数（`(v: T) => any`）
 */
export function tapOnce<T>(fn: (v: T) => unknown) {
  return (source$: Observable<T>) => {
    let isFirst = true;
    return source$.pipe(
      tap(v => {
        if (isFirst) {
          fn(v);
          isFirst = false;
        }
      })
    );
  };
}

/**
 * Injectable Angular service `NotifyInterceptor` managing notify interceptor state and operations in `src/net/http/interceptors`.
 * @zh 可注入的 Angular 服务 `NotifyInterceptor`，管理 `src/net/http/interceptors` 中的通知拦截器状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class NotifyInterceptor implements HttpInterceptor {

  /**
   * Creates an instance of `NotifyInterceptor` and initializes its dependencies and internal state.
   * @zh 创建 `NotifyInterceptor` 实例，并初始化其依赖项与内部状态。
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
  constructor(
    private injector: Injector,
    ) {
    
  }
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
   if (req.method == "GET") {
      return next.handle(req);
    }
    return next.handle(req).pipe(
        tap((event: HttpEvent<{ success?: boolean }>) => {
        if (event instanceof HttpResponse) {
          if (!(event.body instanceof Blob) && !(event.body instanceof ArrayBuffer)) {
            if (event.status === 200) {
              if (event.body && event.body.success) {
                let type = req.params.get('type');
                const toastr = this.injector.get(ToastrService);
                const translateService = this.injector.get(TranslationService);

                if (type == 'updatesave') {
                  toastr.success(translateService.instant("FORM.UPDATESUCCESS"));
                } else if (type == 'delete') {
                  toastr.success(translateService.instant("FORM.DELETESUCCESS"));
                } else if (type == 'save') {
                  toastr.success(translateService.instant("FORM.SAVESUCCESS"));
                }
              }
            }
          }
        }
      })
    );
  }
}
