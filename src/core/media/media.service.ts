/**
 * @fileoverview Module `src/core/media/media.service.ts` providing media service definitions and implementation.
 * @zh 模块文件 `src/core/media/media.service.ts`，提供媒体服务相关的定义与实现。
 */

import { Injectable, OnDestroy } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Media, MediaOrientation } from './media.enum';

/**
 * Injectable Angular service `MediaService` managing media service state and operations in `src/core/media`.
 * @zh 可注入的 Angular 服务 `MediaService`，管理 `src/core/media` 中的媒体服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class MediaService implements OnDestroy {
  /**
   * Property `media$` (`BehaviorSubject`) storing media (default: `new BehaviorSubject<Media>(undefined)`).
   * @zh 属性 `media$`（类型：`BehaviorSubject`），用于存储或配置媒体（默认值：`new BehaviorSubject<Media>(undefined)`）。
   */
  public media$ = new BehaviorSubject<Media>(undefined);
  /**
   * Property `orientation$` (`BehaviorSubject`) storing orientation.
   * @zh 属性 `orientation$`（类型：`BehaviorSubject`），用于存储或配置方向。
   */
  public orientation$ = new BehaviorSubject<MediaOrientation>(undefined);
  /**
   * Property `subscriptions` (`Subscription`) storing subscriptions (default: `new Subscription()`).
   * @zh 属性 `subscriptions`（类型：`Subscription`），用于存储或配置订阅集合（默认值：`new Subscription()`）。
   */
  private subscriptions = new Subscription();

  /**
   * Creates an instance of `MediaService` and initializes its dependencies and internal state.
   * @zh 创建 `MediaService` 实例，并初始化其依赖项与内部状态。
   * @param breakpointObserver - Injected or initial breakpoint observer (`BreakpointObserver`) / 注入或传入的breakpoint观察者（`BreakpointObserver`）
   */
  constructor(breakpointObserver: BreakpointObserver) {
    this.subscriptions.add(
      breakpointObserver
        .observe([Breakpoints.HandsetLandscape])
        .subscribe(res => {
          if (res.matches) {
            this.media$.next(Media.Mobile);
            this.orientation$.next(MediaOrientation.Landscape);
          }
        })
    );

    this.subscriptions.add(
      breakpointObserver.observe([Breakpoints.HandsetPortrait]).subscribe(res => {
        if (res.matches) {
          this.media$.next(Media.Mobile);
          this.orientation$.next(MediaOrientation.Portrait);
        }
      })
    );

    this.subscriptions.add(
      breakpointObserver.observe([Breakpoints.TabletLandscape]).subscribe(res => {
        if (res.matches) {
          this.media$.next(Media.Tablet);
          this.orientation$.next(MediaOrientation.Landscape);
        }
      })
    );

    this.subscriptions.add(
      breakpointObserver.observe([Breakpoints.TabletPortrait]).subscribe(res => {
        if (res.matches) {
          this.media$.next(Media.Tablet);
          this.orientation$.next(MediaOrientation.Portrait);
        }
      })
    );

    this.subscriptions.add(
      breakpointObserver.observe([Breakpoints.WebLandscape]).subscribe(res => {
        if (res.matches) {
          this.media$.next(Media.Desktop);
          this.orientation$.next(MediaOrientation.Landscape);
        }
      })
    );

    this.subscriptions.add(
      breakpointObserver.observe([Breakpoints.WebPortrait]).subscribe(res => {
        if (res.matches) {
          this.media$.next(Media.Desktop);
          this.orientation$.next(MediaOrientation.Portrait);
        }
      })
    );
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Executes `getMedia` to handle get media.
   * @zh 执行 `getMedia`，用于获取媒体。
   * @returns Result of type `Media` / 类型为 `Media` 的返回值
   */
  getMedia(): Media {
    return this.media$.value;
  }

  /**
   * Executes `getOrientation` to handle get orientation.
   * @zh 执行 `getOrientation`，用于获取方向。
   * @returns Result of type `MediaOrientation` / 类型为 `MediaOrientation` 的返回值
   */
  getOrientation(): MediaOrientation {
    return this.orientation$.value;
  }
}
