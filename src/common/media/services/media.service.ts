/**
 * @fileoverview Module `src/common/media/services/media.service.ts` providing media service definitions and implementation.
 * @zh 模块文件 `src/common/media/services/media.service.ts`，提供媒体服务相关的定义与实现。
 */

import { Injectable, NgZone, SkipSelf, Optional, Provider } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, fromEvent } from 'rxjs';

/**
 * Registers and evaluates `matchMedia` queries (plus a set of built-in breakpoint aliases
 * like `xs`/`gt-sm`/`landscape`), broadcasting changes on window resize.
 * @zh 注册并求值 `matchMedia` 媒体查询（内置一组断点别名，如 `xs`/`gt-sm`/`landscape`），
 * 并在窗口尺寸变化时广播结果变化。
 */
@Injectable({
  providedIn: 'root'
})
export class MediaService {

  /**
   * Property `_resizing` (`boolean`) storing resizing (default: `false`).
   * @zh 属性 `_resizing`（类型：`boolean`），用于存储或配置调整尺寸中（默认值：`false`）。
   */
  private _resizing: boolean = false;
  /**
   * Property `_globalSubscription` (`Subscription`) storing global subscription.
   * @zh 属性 `_globalSubscription`（类型：`Subscription`），用于存储或配置全局订阅对象。
   */
  private _globalSubscription: Subscription;
  /**
   * Property `_queryMap` (`Map<string, string>`) storing query map (default: `new Map<string, string>()`).
   * @zh 属性 `_queryMap`（类型：`Map<string, string>`），用于存储或配置查询映射表（默认值：`new Map<string, string>()`）。
   */
  private _queryMap: Map<string, string> = new Map<string, string>();
  /**
   * Property `_querySources` (`{ [key: string]: BehaviorSubject<boolean>}`) storing query sources (default: `{}`).
   * @zh 属性 `_querySources`（类型：`{ [key: string]: BehaviorSubject<boolean>}`），用于存储或配置查询源（默认值：`{}`）。
   */
  private _querySources: { [key: string]: BehaviorSubject<boolean>} = {};
  /**
   * Property `_queryObservables` (`{[key: string]: Observable<boolean>}`) storing query observables (default: `{}`).
   * @zh 属性 `_queryObservables`（类型：`{[key: string]: Observable<boolean>}`），用于存储或配置查询可观察流（默认值：`{}`）。
   */
  private _queryObservables: {[key: string]: Observable<boolean>} = {};

  /**
   * Creates an instance of `MediaService` and initializes its dependencies and internal state.
   * @zh 创建 `MediaService` 实例，并初始化其依赖项与内部状态。
   * @param _ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   */
  constructor(private _ngZone: NgZone) {
    this._queryMap.set('xs', '(max-width: 599px)');
    this._queryMap.set('gt-xs', '(min-width: 600px)');
    this._queryMap.set('sm', '(min-width: 600px) and (max-width: 959px)');
    this._queryMap.set('gt-sm', '(min-width: 960px)');
    this._queryMap.set('md', '(min-width: 960px) and (max-width: 1279px)');
    this._queryMap.set('gt-md', '(min-width: 1280px)');
    this._queryMap.set('lg', '(min-width: 1280px) and (max-width: 1919px)');
    this._queryMap.set('gt-lg', '(min-width: 1920px)');
    this._queryMap.set('xl', '(min-width: 1920px)');
    this._queryMap.set('landscape', '(orientation: landscape)');
    this._queryMap.set('portrait', '(orientation: portrait)');
    this._queryMap.set('print', 'print');

    this._resizing = false;
    // we make sure that the resize checking happend outside of Angular since it happens often
    this._globalSubscription = this._ngZone.runOutsideAngular(() => {
      return fromEvent(window, 'resize').subscribe(() => {
        // way to prevent the resize event from triggering the match media if there is already one event running already.
        if (!this._resizing) {
          this._resizing = true;
          setTimeout(() => {
            this._onResize();
            this._resizing = false;
          }, 100);
        }
      });
    });
  }

  /**
   * Deregisters a query so its stops being notified or used.

   * @zh 执行 `deregisterQuery`，用于deregister查询。
   */
  deregisterQuery(query: string): void {
    if (this._queryMap.get(query.toLowerCase())) {
      query = this._queryMap.get(query.toLowerCase());
    }
    this._querySources[query].unsubscribe();
    delete this._querySources[query];
    delete this._queryObservables[query];
  }

  /**
   * Used to evaluate whether a given media query is true or false given the current device's screen / window size.

   * @zh 执行 `query`，用于查询。
   */
  public query(query: string): boolean {
    if (this._queryMap.get(query.toLowerCase())) {
      query = this._queryMap.get(query.toLowerCase());
    }
    return this._ngZone.run(() => {
      return matchMedia(query).matches;
    });
  }

  /**
   * Registers a media query and returns an [Observable] that will re-evaluate and
   * return if the given media query matches on window resize.
   * Note: don't forget to unsubscribe from [Observable] when finished watching.

   * @zh 执行 `registerQuery`，用于注册查询。
   */
  public registerQuery(query: string): Observable<boolean> {
    if (this._queryMap.get(query.toLowerCase())) {
      query = this._queryMap.get(query.toLowerCase());
    }
    if (!this._querySources[query]) {
      this._querySources[query] = new BehaviorSubject<boolean>(matchMedia(query).matches);
      this._queryObservables[query] = this._querySources[query].asObservable();
    }
    return this._queryObservables[query];
  }

  /**
   * Trigger a match media event on all subscribed observables.

   * @zh 执行 `broadcast`，用于广播。
   */
  public broadcast(): void {
    this._onResize();
  }

  /**
   * Executes `_onResize` to handle on resize.
   * @zh 执行 `_onResize`，用于当调整尺寸。
   */
  private _onResize(): void {
    for (let query in this._querySources) {
      this._ngZone.run(() => {
        this._matchMediaTrigger(query);
      });
    }
  }

  /**
   * Executes `_matchMediaTrigger` to handle match media trigger.
   * @zh 执行 `_matchMediaTrigger`，用于匹配媒体触发。
   * @param query - query parameter (`string`) / 查询参数（`string`）
   */
  private _matchMediaTrigger(query: string): void {
    this._querySources[query].next(matchMedia(query).matches);
  }
}

/**
 * Executes `MEDIA_PROVIDER_FACTORY` to handle media provider factory.
 * @zh 执行 `MEDIA_PROVIDER_FACTORY`，用于媒体提供者工厂。
 * @param parent - parent parameter (`MediaService`) / 父级参数（`MediaService`）
 * @param ngZone - ng zone parameter (`NgZone`) / Angular区域(NgZone)参数（`NgZone`）
 * @returns Result of type `MediaService` / 类型为 `MediaService` 的返回值
 */
export function MEDIA_PROVIDER_FACTORY(
    parent: MediaService, ngZone: NgZone): MediaService {
  return parent || new MediaService(ngZone);
}

/**
 * Constant/variable `MEDIA_PROVIDER` defining media provider in `src/common/media/services`.
 * @zh 常量/变量 `MEDIA_PROVIDER`，定义 `src/common/media/services` 中的媒体提供者。
 */
export const MEDIA_PROVIDER: Provider = {
  // If there is already a service available, use that. Otherwise, provide a new one.
  provide: MediaService,
  deps: [[new Optional(), new SkipSelf(), MediaService], NgZone],
  useFactory: MEDIA_PROVIDER_FACTORY,
};
