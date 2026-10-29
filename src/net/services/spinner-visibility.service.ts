/**
 * @fileoverview Module `src/net/services/spinner-visibility.service.ts` providing spinner visibility service definitions and implementation.
 * @zh 模块文件 `src/net/services/spinner-visibility.service.ts`，提供加载指示器visibility服务相关的定义与实现。
 */


import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { PendingRequestsInterceptor } from './pending-requests-interceptor.service';

/**
 * Injectable Angular service `SpinnerVisibilityService` managing spinner visibility service state and operations in `src/net/services`.
 * @zh 可注入的 Angular 服务 `SpinnerVisibilityService`，管理 `src/net/services` 中的加载指示器Visibility服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class SpinnerVisibilityService {
  /**
   * Property `_visibility$` (`ReplaySubject<boolean>`) storing visibility (default: `new ReplaySubject<boolean>(1)`).
   * @zh 属性 `_visibility$`（类型：`ReplaySubject<boolean>`），用于存储或配置visibility（默认值：`new ReplaySubject<boolean>(1)`）。
   */
  private _visibility$ = new ReplaySubject<boolean>(1);
  /**
   * Property `_visibilityObservable$` (`Observable<boolean>`) storing visibility observable (default: `this._visibility$.asObservable()`).
   * @zh 属性 `_visibilityObservable$`（类型：`Observable<boolean>`），用于存储或配置visibility可观察流（默认值：`this._visibility$.asObservable()`）。
   */
  private readonly _visibilityObservable$ = this._visibility$.asObservable();

  /**
   * Creates an instance of `SpinnerVisibilityService` and initializes its dependencies and internal state.
   * @zh 创建 `SpinnerVisibilityService` 实例，并初始化其依赖项与内部状态。
   * @param pendingRequestsInterceptor - Injected or initial pending requests interceptor (`PendingRequestsInterceptor`) / 注入或传入的等待中请求拦截器（`PendingRequestsInterceptor`）
   */
  constructor(private pendingRequestsInterceptor: PendingRequestsInterceptor) {
  }

  /**
   * Gets the current visibility (`visibility$: Observable<boolean>`).
   * @zh 获取当前visibility（`visibility$: Observable<boolean>`）。
   */
  get visibility$(): Observable<boolean> {
    return this._visibilityObservable$;
  }

  /**
   * Executes `show` to handle show.
   * @zh 执行 `show`，用于显示。
   */
  public show(): void {
    this.pendingRequestsInterceptor.forceByPass = true;
    this._visibility$.next(true);
  }

  /**
   * Executes `hide` to handle hide.
   * @zh 执行 `hide`，用于隐藏。
   */
  public hide(): void {
    this._visibility$.next(false);
    this.pendingRequestsInterceptor.forceByPass = false;
  }
}
