/**
 * @fileoverview Module `src/common/scrollbar/sync-spacer.ts` providing sync spacer definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/sync-spacer.ts`，提供同步spacer相关的定义与实现。
 */

import {
  Directive,
  inject,
  signal,
  effect,
  untracked,
  NgZone,
  WritableSignal,
  EffectCleanupRegisterFn
} from '@angular/core';
import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { Subscription, map } from 'rxjs';
import { NgScrollbarExt } from './ng-scrollbar-ext';
import { filterResizeEntries } from './ng-scrollbar.model';
import { ElementDimension, getThrottledStream } from './utils/common';

/**
 * Companion directive for `ng-scrollbar[externalViewport]` that syncs a spacer element's
 * CSS custom properties (`--spacer-width`/`--spacer-height`) to the viewport's content size.
 * @zh 用于 `ng-scrollbar[externalViewport]` 的配套指令，将占位元素的 CSS 自定义属性
 * （`--spacer-width`/`--spacer-height`）与视口内容尺寸保持同步。
 */
@Directive({
  standalone: true,
  selector: 'ng-scrollbar[externalViewport][syncSpacer]',
  host: {
    '[style.--spacer-width]': 'spacerDimension().width',
    '[style.--spacer-height]': 'spacerDimension().height'
  }
})
export class SyncSpacer {

  /**
   * Property `sharedResizeObserver` (`SharedResizeObserver`) storing shared resize observer (default: `inject(SharedResizeObserver)`).
   * @zh 属性 `sharedResizeObserver`（类型：`SharedResizeObserver`），用于存储或配置共享调整尺寸观察者（默认值：`inject(SharedResizeObserver)`）。
   */
  private readonly sharedResizeObserver: SharedResizeObserver = inject(SharedResizeObserver);

  /**
   * Property `scrollbar` (`NgScrollbarExt`) storing scrollbar (default: `inject(NgScrollbarExt, { self: true })`).
   * @zh 属性 `scrollbar`（类型：`NgScrollbarExt`），用于存储或配置滚动条（默认值：`inject(NgScrollbarExt, { self: true })`）。
   */
  private readonly scrollbar: NgScrollbarExt = inject(NgScrollbarExt, { self: true });

  /**
   * Property `zone` (`NgZone`) storing zone (default: `inject(NgZone)`).
   * @zh 属性 `zone`（类型：`NgZone`），用于存储或配置区域(NgZone)（默认值：`inject(NgZone)`）。
   */
  private readonly zone: NgZone = inject(NgZone);

  /**
   * A signal used to sync spacer dimension when content dimension changes

   * @zh 属性 `spacerDimension`（类型：`WritableSignal<ElementDimension>`），用于存储或配置spacer维度（默认值：`signal({})`）。
   */
  spacerDimension: WritableSignal<ElementDimension> = signal({});

  /**
   * Creates an instance of `SyncSpacer` and initializes its dependencies and internal state.
   * @zh 创建 `SyncSpacer` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    let sub$: Subscription;

    effect((onCleanup: EffectCleanupRegisterFn) => {
      const spacerElement: HTMLElement = this.scrollbar.spacerElement();
      const contentWrapperElement: HTMLElement = this.scrollbar.contentWrapperElement();
      const throttleDuration: number = this.scrollbar.sensorThrottleTime();
      const disableSensor: boolean = this.scrollbar.disableSensor();

      untracked(() => {
        if (!disableSensor && contentWrapperElement && spacerElement) {
          // Sync spacer dimension with content wrapper dimensions to allow both scrollbars to be displayed
          this.zone.runOutsideAngular(() => {
            sub$ = getThrottledStream(this.sharedResizeObserver.observe(contentWrapperElement), throttleDuration).pipe(
              map((entries: ResizeObserverEntry[]) => filterResizeEntries(entries, contentWrapperElement)),
            ).subscribe(() => {
              this.zone.run(() => {
                // Use animation frame to avoid "ResizeObserver loop completed with undelivered notifications." error
                requestAnimationFrame(() => {
                  this.spacerDimension.set({
                    width: contentWrapperElement.offsetWidth,
                    height: contentWrapperElement.offsetHeight
                  });
                });
              });
            });
          });
        }
        onCleanup(() => sub$?.unsubscribe());
      });
    });
  }
}
