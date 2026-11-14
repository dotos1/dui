/**
 * @fileoverview Module `src/common/scrollbar/utils/pointer-events-adapter.ts` providing pointer events adapter definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/utils/pointer-events-adapter.ts`，提供指针事件集合适配器相关的定义与实现。
 */

import { Directive, effect, inject, untracked, ElementRef, NgZone, EffectCleanupRegisterFn } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { _NgScrollbar, NG_SCROLLBAR } from '../utils/scrollbar-base';
import { SCROLLBAR_CONTROL, ScrollbarAdapter } from '../scrollbar/scrollbar-adapter';

/**
 * Angular directive `PointerEventsAdapter` attaching pointer events adapter behavior to host DOM elements.
 * @zh Angular 指令 `PointerEventsAdapter`，为宿主 DOM 元素附加指针事件集合适配器行为。
 */
@Directive({ standalone: false })
export abstract class PointerEventsAdapter {

  // Reference to the NgScrollbar component
  /**
   * Property `cmp` (`_NgScrollbar`) storing cmp (default: `inject(NG_SCROLLBAR)`).
   * @zh 属性 `cmp`（类型：`_NgScrollbar`），用于存储或配置cmp（默认值：`inject(NG_SCROLLBAR)`）。
   */
  protected readonly cmp: _NgScrollbar = inject(NG_SCROLLBAR);

  // Reference to the Scrollbar control component
  /**
   * Property `control` (`ScrollbarAdapter`) storing control (default: `inject(SCROLLBAR_CONTROL)`).
   * @zh 属性 `control`（类型：`ScrollbarAdapter`），用于存储或配置表单控件（默认值：`inject(SCROLLBAR_CONTROL)`）。
   */
  protected readonly control: ScrollbarAdapter = inject(SCROLLBAR_CONTROL);

  // Reference to the Document element
  /**
   * Property `document` (`Document`) storing document (default: `inject(DOCUMENT)`).
   * @zh 属性 `document`（类型：`Document`），用于存储或配置文档对象（默认值：`inject(DOCUMENT)`）。
   */
  protected readonly document: Document = inject(DOCUMENT);

  // Reference to angular zone
  /**
   * Property `zone` (`NgZone`) storing zone (default: `inject(NgZone)`).
   * @zh 属性 `zone`（类型：`NgZone`），用于存储或配置区域(NgZone)（默认值：`inject(NgZone)`）。
   */
  protected readonly zone: NgZone = inject(NgZone);

  // The native element of the directive
  /**
   * Property `nativeElement` (`HTMLElement`) storing native element.
   * @zh 属性 `nativeElement`（类型：`HTMLElement`），用于存储或配置原生元素。
   */
  readonly nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  // Pointer events subscription (made public for testing purpose)
  /**
   * Property `_pointerEventsSub` (`Subscription`) storing pointer events sub.
   * @zh 属性 `_pointerEventsSub`（类型：`Subscription`），用于存储或配置指针事件集合子。
   */
  _pointerEventsSub: Subscription;

  /**
   * Gets the current pointer events (`pointerEvents: Observable<PointerEvent>`).
   * @zh 获取当前指针事件集合（`pointerEvents: Observable<PointerEvent>`）。
   */
  abstract get pointerEvents(): Observable<PointerEvent>;

  /**
   * Creates an instance of `PointerEventsAdapter` and initializes its dependencies and internal state.
   * @zh 创建 `PointerEventsAdapter` 实例，并初始化其依赖项与内部状态。
   */
  protected constructor() {
    effect((onCleanup: EffectCleanupRegisterFn) => {
      const disableInteraction: boolean = this.cmp.disableInteraction();

      untracked(() => {
        if (!disableInteraction) {
          this.zone.runOutsideAngular(() => {
            this._pointerEventsSub = this.pointerEvents.subscribe();
          });
        }

        onCleanup(() => this._pointerEventsSub?.unsubscribe());
      });
    });
  }
}
