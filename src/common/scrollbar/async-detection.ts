/**
 * @fileoverview Module `src/common/scrollbar/async-detection.ts` providing async detection definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/async-detection.ts`，提供async变更检测相关的定义与实现。
 */

import {
  Directive,
  inject,
  effect,
  untracked,
  input,
  NgZone,
  InputSignal,
  EffectCleanupRegisterFn
} from '@angular/core';
import { ContentObserver } from '@angular/cdk/observers';
import { Subscription, throttleTime } from 'rxjs';
import { NgScrollbarExt } from './ng-scrollbar-ext';

/**
 * Companion directive for `ng-scrollbar[externalViewport]` that watches the content for
 * DOM mutations (via `ContentObserver`) and re-triggers scrollbar layout updates.
 * @zh 用于 `ng-scrollbar[externalViewport]` 的配套指令，通过 `ContentObserver` 监听内容的
 * DOM 变化，并重新触发滚动条布局更新。
 */
@Directive({
  standalone: true,
  selector: 'ng-scrollbar[externalViewport][asyncDetection]'
})
export class AsyncDetection {

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
   * Property `contentObserver` (`ContentObserver`) storing content observer (default: `inject(ContentObserver)`).
   * @zh 属性 `contentObserver`（类型：`ContentObserver`），用于存储或配置内容观察者（默认值：`inject(ContentObserver)`）。
   */
  private readonly contentObserver: ContentObserver = inject(ContentObserver);

  /**
   * `'auto'` to keep watching for viewport/content-wrapper/spacer element changes indefinitely,
   * or `''` (default) to stop watching once found once.
   * @zh `'auto'` 表示持续监听视口/内容包裹层/占位符元素的变化，`''`（默认）表示找到一次后即停止监听。
   */
  asyncDetection: InputSignal<'auto' | ''> = input();

  /**
   * Creates an instance of `AsyncDetection` and initializes its dependencies and internal state.
   * @zh 创建 `AsyncDetection` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    this.scrollbar.skipInit = true;
    let sub$: Subscription;

    effect((onCleanup: EffectCleanupRegisterFn) => {
      const init: boolean = this.scrollbar.viewport.initialized();
      const externalViewport: string = this.scrollbar.externalViewport();
      const externalContentWrapper: string = this.scrollbar.externalContentWrapper();
      const externalSpacer: string = this.scrollbar.externalSpacer();
      const asyncDetection: 'auto' | '' = this.asyncDetection();

      untracked(() => {
        let viewportElement: HTMLElement;
        let contentWrapperElement: HTMLElement;

        this.zone.runOutsideAngular(() => {
          // The content observer should not be throttled using the same function we use for ResizeObserver,
          // It should detect the content change asap to attach the scrollbar
          sub$ = this.contentObserver.observe(this.scrollbar.nativeElement).pipe(
            throttleTime(100, null, {
              leading: true,
              trailing: true
            })
          ).subscribe(() => {
            // Search for external viewport
            viewportElement = this.scrollbar.nativeElement.querySelector(externalViewport);

            // Search for external content wrapper
            contentWrapperElement = this.scrollbar.nativeElement.querySelector(externalContentWrapper);

            this.zone.run(() => {
              if (!init && viewportElement && contentWrapperElement) {
                // If an external spacer selector is provided, search for it
                let spacerElement: HTMLElement;
                if (externalSpacer) {
                  spacerElement = this.scrollbar.nativeElement.querySelector(externalSpacer);
                }

                this.scrollbar.skipInit = false;
                this.scrollbar.altViewport.set(viewportElement);
                this.scrollbar.altContentWrapper.set(contentWrapperElement);
                this.scrollbar.altSpacer.set(spacerElement);
              } else if (!viewportElement || !contentWrapperElement) {
                this.scrollbar.viewport.reset();
              }
            });

            if (asyncDetection !== 'auto') {
              sub$.unsubscribe();
            }
          });
        });

        onCleanup(() => sub$?.unsubscribe());
      });
    });
  }
}
