/**
 * @fileoverview Module `src/net/components/http-loader.component.ts` providing http loader component definitions and implementation.
 * @zh 模块文件 `src/net/components/http-loader.component.ts`，提供HTTP加载器组件相关的定义与实现。
 */


import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, merge, Observable, Subscription, timer } from 'rxjs';
import { debounce, distinctUntilChanged, partition, switchMap, tap } from 'rxjs/operators';
import { PendingRequestsInterceptor } from '../services/pending-requests-interceptor.service';
import { SpinnerVisibilityService } from '../services/spinner-visibility.service';

/**
 * Angular component `HttpLoaderComponent` (selector: 'http-loader') providing http loader component presentation and interaction in `src/net/components`.
 * @zh Angular 组件 `HttpLoaderComponent`（selector: 'http-loader'），提供HTTP加载器组件的视图渲染与交互逻辑（位于 `src/net/components`）。
 */
@Component({
  selector: 'http-loader',
  templateUrl: './http-loader.component.html',
  styleUrls: ['./http-loader.component.scss'],
  host: {
    hostID: 'dui-http-loader' + Math.random().toString(36).substring(2, 15),
  }
})
export class HttpLoaderComponent implements OnDestroy, OnInit {

  /**
   * Property `_isVisible$` (`BehaviorSubject<boolean>`) storing is visible (default: `new BehaviorSubject<boolean>(false)`).
   * @zh 属性 `_isVisible$`（类型：`BehaviorSubject<boolean>`），用于存储或配置是否为可见（默认值：`new BehaviorSubject<boolean>(false)`）。
   */
  private _isVisible$ = new BehaviorSubject<boolean>(false);
  /**
   * Property `_isVisibleObservable$` (`Observable<boolean>`) storing is visible observable (default: `this._isVisible$.asObservable()`).
   * @zh 属性 `_isVisibleObservable$`（类型：`Observable<boolean>`），用于存储或配置是否为可见可观察流（默认值：`this._isVisible$.asObservable()`）。
   */
  private readonly _isVisibleObservable$ = this._isVisible$.asObservable();
  /**
   * Property `addedUrlRegexes` (`RegExp[]`) storing added url regexes (default: `[]`).
   * @zh 属性 `addedUrlRegexes`（类型：`RegExp[]`），用于存储或配置已添加链接地址正则表达式（默认值：`[]`）。
   */
  private addedUrlRegexes: RegExp[] = [];
  /**
   * Property `subscriptions` (`Subscription`) storing subscriptions.
   * @zh 属性 `subscriptions`（类型：`Subscription`），用于存储或配置订阅集合。
   */
  private subscriptions: Subscription;
  /**
   * Property `visibleUntil` (`number`) storing visible until (default: `Date.now()`).
   * @zh 属性 `visibleUntil`（类型：`number`），用于存储或配置可见直到（默认值：`Date.now()`）。
   */
  private visibleUntil = Date.now();

  /**
   * Input property `backdrop` (`boolean`) configuring backdrop (default: `true`).
   * @zh 输入属性 `backdrop`（类型：`boolean`），用于配置背景遮罩（默认值：`true`）。
   */
  @Input() public backdrop = true;
  /**
   * Input property `backgroundColor` (`string`) configuring background color.
   * @zh 输入属性 `backgroundColor`（类型：`string`），用于配置背景颜色。
   */
  @Input() public backgroundColor: string;
  /**
   * Input property `debounceDelay` (`number`) configuring debounce delay (default: `0`).
   * @zh 输入属性 `debounceDelay`（类型：`number`），用于配置防抖延迟（默认值：`0`）。
   */
  @Input() public debounceDelay = 0;
  /**
   * Input property `entryComponent` (`unknown`) configuring entry component (default: `null`).
   * @zh 输入属性 `entryComponent`（类型：`unknown`），用于配置条目组件（默认值：`null`）。
   */
  @Input() public entryComponent: unknown = null;
  /**
   * Input property `extraDuration` (`number`) configuring extra duration (default: `0`).
   * @zh 输入属性 `extraDuration`（类型：`number`），用于配置extra持续时间（默认值：`0`）。
   */
  @Input() public extraDuration = 0;
  /**
   * Input property `filteredHeaders` (`string[]`) configuring filtered headers (default: `[]`).
   * @zh 输入属性 `filteredHeaders`（类型：`string[]`），用于配置已过滤请求头（默认值：`[]`）。
   */
  @Input() public filteredHeaders: string[] = [];
  /**
   * Input property `filteredMethods` (`string[]`) configuring filtered methods (default: `[]`).
   * @zh 输入属性 `filteredMethods`（类型：`string[]`），用于配置已过滤方法（默认值：`[]`）。
   */
  @Input() public filteredMethods: string[] = [];
  /**
   * Input property `filteredUrlPatterns` (`string[]`) configuring filtered url patterns (default: `[]`).
   * @zh 输入属性 `filteredUrlPatterns`（类型：`string[]`），用于配置已过滤链接地址模式/图案（默认值：`[]`）。
   */
  @Input() public filteredUrlPatterns: string[] = [];
  /**
   * Input property `minDuration` (`number`) configuring min duration (default: `0`).
   * @zh 输入属性 `minDuration`（类型：`number`），用于配置最小值持续时间（默认值：`0`）。
   */
  @Input() public minDuration = 0;
  /**
   * Input property `opacity` (`string`) configuring opacity (default: `'.7'`).
   * @zh 输入属性 `opacity`（类型：`string`），用于配置不透明度（默认值：`'.7'`）。
   */
  @Input() public opacity = '.7';


  /**
   * Creates an instance of `HttpLoaderComponent` and initializes its dependencies and internal state.
   * @zh 创建 `HttpLoaderComponent` 实例，并初始化其依赖项与内部状态。
   * @param pendingRequestsInterceptor - Injected or initial pending requests interceptor (`PendingRequestsInterceptor`) / 注入或传入的等待中请求拦截器（`PendingRequestsInterceptor`）
   * @param spinnerVisibility - Injected or initial spinner visibility (`SpinnerVisibilityService`) / 注入或传入的加载指示器Visibility（`SpinnerVisibilityService`）
   */
  constructor(private pendingRequestsInterceptor: PendingRequestsInterceptor, private spinnerVisibility: SpinnerVisibilityService) {
    const [showSpinner$, hideSpinner$] = partition((h: boolean) => h)(this.pendingRequestsInterceptor.pendingRequestsStatus$);

    this.subscriptions = merge(
      this.pendingRequestsInterceptor.pendingRequestsStatus$.pipe(
        switchMap(() => showSpinner$.pipe(debounce(() => timer(this.debounceDelay))))
      ),
      showSpinner$.pipe(
        switchMap(() => hideSpinner$.pipe(debounce(() => this.getVisibilityTimer$())))
      ),
      this.spinnerVisibility.visibility$,
    )
      .pipe(
        distinctUntilChanged(),
        tap(h => this.updateExpirationDelay(h))
      )
      .subscribe(h => this._isVisible$.next(h));
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  public ngOnInit(): void {

    this.initFilters();
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.addedUrlRegexes.length) {
      const patterns = this.pendingRequestsInterceptor.filteredUrlPatterns;
      for (const regex of this.addedUrlRegexes) {
        const idx = patterns.indexOf(regex);
        if (idx !== -1) {
          patterns.splice(idx, 1);
        }
      }
      this.addedUrlRegexes = [];
    }
  }

  /**
   * Gets the current is visible (`isVisible$: Observable<boolean>`).
   * @zh 获取当前是否为可见（`isVisible$: Observable<boolean>`）。
   */
  get isVisible$(): Observable<boolean> {
    return this._isVisibleObservable$;
  }


  /**
   * Executes `initFilters` to handle init filters.
   * @zh 执行 `initFilters`，用于初始化过滤器列表。
   */
  private initFilters(): void {
    this.initFilteredUrlPatterns();
    this.initFilteredMethods();
    this.initFilteredHeaders();
  }

  /**
   * Executes `initFilteredUrlPatterns` to handle init filtered url patterns.
   * @zh 执行 `initFilteredUrlPatterns`，用于初始化已过滤链接地址模式/图案。
   */
  private initFilteredUrlPatterns(): void {
    if (!(this.filteredUrlPatterns instanceof Array)) {
      throw new TypeError('`filteredUrlPatterns` must be an array.');
    }

    if (this.filteredUrlPatterns.length) {
      this.filteredUrlPatterns.forEach(e => {
        const regex = new RegExp(e);
        this.addedUrlRegexes.push(regex);
        this.pendingRequestsInterceptor.filteredUrlPatterns.push(regex);
      });
    }
  }

  /**
   * Executes `initFilteredMethods` to handle init filtered methods.
   * @zh 执行 `initFilteredMethods`，用于初始化已过滤方法。
   */
  private initFilteredMethods(): void {
    if (!(this.filteredMethods instanceof Array)) {
      throw new TypeError('`filteredMethods` must be an array.');
    }
    this.pendingRequestsInterceptor.filteredMethods = this.filteredMethods;
  }

  /**
   * Executes `initFilteredHeaders` to handle init filtered headers.
   * @zh 执行 `initFilteredHeaders`，用于初始化已过滤请求头。
   */
  private initFilteredHeaders(): void {
    if (!(this.filteredHeaders instanceof Array)) {
      throw new TypeError('`filteredHeaders` must be an array.');
    }
    this.pendingRequestsInterceptor.filteredHeaders = this.filteredHeaders;
  }

  /**
   * Executes `updateExpirationDelay` to handle update expiration delay.
   * @zh 执行 `updateExpirationDelay`，用于更新Expiration延迟。
   * @param showSpinner - show spinner parameter (`boolean`) / 显示加载指示器参数（`boolean`）
   */
  private updateExpirationDelay(showSpinner: boolean): void {
    if (showSpinner) {
      this.visibleUntil = Date.now() + this.minDuration;
    }
  }

  /**
   * Executes `getVisibilityTimer$` to handle get visibility timer.
   * @zh 执行 `getVisibilityTimer$`，用于获取Visibility定时器。
   * @returns Result of type `Observable<number>` / 类型为 `Observable<number>` 的返回值
   */
  private getVisibilityTimer$(): Observable<number> {
    return timer(Math.max(this.extraDuration, this.visibleUntil - Date.now()));
  }
}
