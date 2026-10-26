/**
 * @fileoverview Module `src/util/activity/activity.interceptor.ts` providing activity interceptor definitions and implementation.
 * @zh 模块文件 `src/util/activity/activity.interceptor.ts`，提供activity拦截器相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ActivityService } from './activity.service';

/**
 * Injectable Angular service `ActivityInterceptor` managing activity interceptor state and operations in `src/util/activity`.
 * @zh 可注入的 Angular 服务 `ActivityInterceptor`，管理 `src/util/activity` 中的Activity拦截器状态与业务操作。
 */
@Injectable({ providedIn: 'root' })
export class ActivityInterceptor implements HttpInterceptor {
  /**
   * Creates an instance of `ActivityInterceptor` and initializes its dependencies and internal state.
   * @zh 创建 `ActivityInterceptor` 实例，并初始化其依赖项与内部状态。
   * @param activityService - Injected or initial activity service (`ActivityService`) / 注入或传入的activity服务（`ActivityService`）
   */
  constructor(private activityService: ActivityService) {}

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
    const activity = req.headers.get('activityInterceptor');
    if (activity) {
      const actReq = req.clone({
        headers: req.headers.delete('activityInterceptor')
      });
      if (activity === 'false') {
        return next.handle(actReq);
      }
    }

    const id = this.activityService.register();

    return next.handle(req).pipe(
      finalize(() => {
        this.activityService.unregister(id);
      })
    );
  }
}
