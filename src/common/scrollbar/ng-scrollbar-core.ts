/**
 * @fileoverview Module `src/common/scrollbar/ng-scrollbar-core.ts` providing ng scrollbar core definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/ng-scrollbar-core.ts`，提供Angular滚动条核心相关的定义与实现。
 */

import {
  Directive,
  inject,
  signal,
  effect,
  output,
  computed,
  untracked,
  numberAttribute,
  booleanAttribute,
  input,
  NgZone,
  Signal,
  ElementRef,
  InputSignal,
  WritableSignal,
  OutputEmitterRef,
  EffectCleanupRegisterFn,
  InputSignalWithTransform,
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, Subscription } from 'rxjs';
import {
  SmoothScrollElement,
  SmoothScrollManager,
  SmoothScrollToElementOptions,
  SmoothScrollToOptions
} from './smooth-scroll';
import { Scrollbars } from './scrollbars/scrollbars';
import { _NgScrollbar, NG_SCROLLBAR } from './utils/scrollbar-base';
import { ViewportAdapter } from './viewport';
import { ElementDimension, ScrollbarDragging, getThrottledStream } from './utils/common';
import {
  NG_SCROLLBAR_OPTIONS,
  NgScrollbarOptions,
  ScrollbarAppearance,
  ScrollbarOrientation,
  ScrollbarPosition,
  ScrollbarUpdateReason,
  ScrollbarVisibility
} from './ng-scrollbar.model';

/**
 * Interface `ViewportState` defining the contract and properties for viewport state.
 * @zh 接口 `ViewportState`，定义视口状态的数据结构契约与属性规范。
 */
interface ViewportState {
  /**
   * Property `verticalUsed` (`boolean`) storing vertical used.
   * @zh 属性 `verticalUsed`（类型：`boolean`），用于存储或配置垂直已使用。
   */
  verticalUsed: boolean,
  /**
   * Property `horizontalUsed` (`boolean`) storing horizontal used.
   * @zh 属性 `horizontalUsed`（类型：`boolean`），用于存储或配置水平已使用。
   */
  horizontalUsed: boolean,
  /**
   * Property `isVerticallyScrollable` (`boolean`) storing is vertically scrollable.
   * @zh 属性 `isVerticallyScrollable`（类型：`boolean`），用于存储或配置是否为VerticallyScrollable。
   */
  isVerticallyScrollable: boolean,
  /**
   * Property `isHorizontallyScrollable` (`boolean`) storing is horizontally scrollable.
   * @zh 属性 `isHorizontallyScrollable`（类型：`boolean`），用于存储或配置是否为HorizontallyScrollable。
   */
  isHorizontallyScrollable: boolean,
}

/**
 * Angular directive `NgScrollbarCore` attaching ng scrollbar core behavior to host DOM elements.
 * @zh Angular 指令 `NgScrollbarCore`，为宿主 DOM 元素附加Angular滚动条核心行为。
 */
@Directive({
  host: {
    '[class.ng-scrollbar]': 'true',
    '[attr.verticalUsed]': 'verticalUsed()',
    '[attr.horizontalUsed]': 'horizontalUsed()',
    '[attr.isVerticallyScrollable]': 'isVerticallyScrollable()',
    '[attr.isHorizontallyScrollable]': 'isHorizontallyScrollable()',
    '[attr.mobile]': 'isMobile',
    '[attr.dir]': 'direction()',
    '[attr.position]': 'position()',
    '[attr.dragging]': 'dragging()',
    '[attr.appearance]': 'appearance()',
    '[attr.visibility]': 'visibility()',
    '[attr.orientation]': 'orientation()',
    '[attr.disableInteraction]': 'disableInteraction()',
    '[style.--content-height]': 'contentDimension().height',
    '[style.--content-width]': 'contentDimension().width',
    '[style.--viewport-height]': 'viewportDimension().height',
    '[style.--viewport-width]': 'viewportDimension().width'
  },
  providers: [
    { provide: NG_SCROLLBAR, useExisting: NgScrollbarCore }
  ]
})
export abstract class NgScrollbarCore implements _NgScrollbar {

  /**
   * Global options
   * @zh 属性 `options`（类型：`NgScrollbarOptions`），用于存储或配置配置选项（默认值：`inject(NG_SCROLLBAR_OPTIONS)`）。
   */
  private readonly options: NgScrollbarOptions = inject(NG_SCROLLBAR_OPTIONS);

  /**
   * Property `sharedResizeObserver` (`SharedResizeObserver`) storing shared resize observer (default: `inject(SharedResizeObserver)`).
   * @zh 属性 `sharedResizeObserver`（类型：`SharedResizeObserver`），用于存储或配置共享调整尺寸观察者（默认值：`inject(SharedResizeObserver)`）。
   */
  private readonly sharedResizeObserver: SharedResizeObserver = inject(SharedResizeObserver);

  /**
   * Property `zone` (`NgZone`) storing zone (default: `inject(NgZone)`).
   * @zh 属性 `zone`（类型：`NgZone`），用于存储或配置区域(NgZone)（默认值：`inject(NgZone)`）。
   */
  private readonly zone: NgZone = inject(NgZone);

  /**
   * Property `platform` (`Platform`) storing platform (default: `inject(Platform)`).
   * @zh 属性 `platform`（类型：`Platform`），用于存储或配置platform（默认值：`inject(Platform)`）。
   */
  private readonly platform: Platform = inject(Platform);

  /**
   * A flag that indicates if the platform is mobile
   * @zh 属性 `isMobile`（类型：`boolean`），用于存储或配置是否为Mobile。
   */
  readonly isMobile: boolean = this.platform.IOS || this.platform.ANDROID;

  /**
   * Property `dir` (`Directionality`) storing dir (default: `inject(Directionality)`).
   * @zh 属性 `dir`（类型：`Directionality`），用于存储或配置目录（默认值：`inject(Directionality)`）。
   */
  readonly dir: Directionality = inject(Directionality);

  /**
   * Property `smoothScroll` (`SmoothScrollManager`) storing smooth scroll (default: `inject(SmoothScrollManager)`).
   * @zh 属性 `smoothScroll`（类型：`SmoothScrollManager`），用于存储或配置smooth滚动（默认值：`inject(SmoothScrollManager)`）。
   */
  readonly smoothScroll: SmoothScrollManager = inject(SmoothScrollManager);

  /**
   * Viewport adapter instance
   * @zh 属性 `viewport`（类型：`ViewportAdapter`），用于存储或配置视口（默认值：`inject(ViewportAdapter, { self: true })`）。
   */
  readonly viewport: ViewportAdapter = inject(ViewportAdapter, { self: true });

  /**
   * Property `nativeElement` (`HTMLElement`) storing native element.
   * @zh 属性 `nativeElement`（类型：`HTMLElement`），用于存储或配置原生元素。
   */
  readonly nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  /**
   * Indicates if the direction is 'ltr' or 'rtl'

   * @zh 属性 `direction`（类型：`Signal<Direction>`），用于存储或配置方向。
   */
  direction: Signal<Direction> = toSignal<Direction, Direction>(this.dir.change, { initialValue: this.dir.value });

  /**
   * Indicates when scrollbar thumb is being dragged

   * @zh 属性 `dragging`（类型：`WritableSignal<ScrollbarDragging>`），用于存储或配置拖拽中（默认值：`signal('none')`）。
   */
  dragging: WritableSignal<ScrollbarDragging> = signal('none');

  /**
   * Sets the supported scroll track of the viewport, there are 3 options:
   *
   * - `vertical` Use both vertical and horizontal scrollbar
   * - `horizontal` Use both vertical and horizontal scrollbar
   * - `auto` Use both vertical and horizontal scrollbar

   * @zh 属性 `orientation`（类型：`InputSignal<ScrollbarOrientation>`），用于存储或配置方向。
   */
  orientation: InputSignal<ScrollbarOrientation> = input<ScrollbarOrientation>(this.options.orientation);

  /**
   * When to show the scrollbar, and there are 3 options:
   *
   * - `native` (default) Scrollbar will be visible when viewport is scrollable like with native scrollbar
   * - `hover` Scrollbars are hidden by default, only visible on scrolling or hovering
   * - `always` Scrollbars are always shown even if the viewport is not scrollable

   * @zh 属性 `visibility`（类型：`InputSignal<ScrollbarVisibility>`），用于存储或配置visibility。
   */
  visibility: InputSignal<ScrollbarVisibility> = input<ScrollbarVisibility>(this.options.visibility);

  /**
   * Show scrollbar buttons
   * @zh 属性 `buttons`（类型：`InputSignalWithTransform<boolean, string | boolean>`），用于存储或配置按钮。
   */
  buttons: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.buttons, {
    transform: booleanAttribute
  });

  /**
   * Disables scrollbar interaction like dragging thumb and jumping by track click
   * @zh 属性 `disableInteraction`（类型：`InputSignalWithTransform<boolean, string | boolean>`），用于存储或配置禁用Interaction。
   */
  disableInteraction: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.disableInteraction, {
    transform: booleanAttribute
  });

  /**
   * Whether ResizeObserver is disabled
   * @zh 属性 `disableSensor`（类型：`InputSignalWithTransform<boolean, string | boolean>`），用于存储或配置禁用Sensor。
   */
  disableSensor: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.disableSensor, {
    transform: booleanAttribute
  });

  /**
   * Throttle interval for detecting changes via ResizeObserver
   * @zh 属性 `sensorThrottleTime`（类型：`InputSignal<number>`），用于存储或配置sensor节流时间。
   */
  sensorThrottleTime: InputSignal<number> = input<number, number>(this.options.sensorThrottleTime, {
    transform: numberAttribute
  });

  /**
   * A flag used to activate hover effect on the offset area around the scrollbar
   * @zh 属性 `hoverOffset`（类型：`InputSignalWithTransform<boolean, string | boolean>`），用于存储或配置hover偏移量。
   */
  hoverOffset: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(this.options.hoverOffset, {
    transform: booleanAttribute
  });

  /**
   * Viewport dimension
   * @zh 属性 `viewportDimension`（类型：`WritableSignal<ElementDimension>`），用于存储或配置视口维度。
   */
  viewportDimension: WritableSignal<ElementDimension> = signal<ElementDimension>({ width: 0, height: 0 });

  /**
   * Content dimension
   * @zh 属性 `contentDimension`（类型：`WritableSignal<ElementDimension>`），用于存储或配置内容维度。
   */
  contentDimension: WritableSignal<ElementDimension> = signal<ElementDimension>({ width: 0, height: 0 });

  /**
   * Property `state` (`Signal<ViewportState>`) storing state.
   * @zh 属性 `state`（类型：`Signal<ViewportState>`），用于存储或配置状态。
   */
  private state: Signal<ViewportState> = computed(() => {
    let verticalUsed: boolean = false;
    let horizontalUsed: boolean = false;
    let isVerticallyScrollable: boolean = false;
    let isHorizontallyScrollable: boolean = false;

    const orientation: ScrollbarOrientation = this.orientation();
    const visibility: ScrollbarVisibility = this.visibility();

    const viewportDimensions: ElementDimension = this.viewportDimension();
    const contentDimensions: ElementDimension = this.contentDimension();

    // Check if vertical scrollbar should be displayed
    if (orientation === 'auto' || orientation === 'vertical') {
      isVerticallyScrollable = contentDimensions.height > viewportDimensions.height;
      verticalUsed = visibility === 'visible' || isVerticallyScrollable;
    }
    // Check if horizontal scrollbar should be displayed
    if (orientation === 'auto' || orientation === 'horizontal') {
      isHorizontallyScrollable = contentDimensions.width > viewportDimensions.width;
      horizontalUsed = visibility === 'visible' || isHorizontallyScrollable;
    }

    return {
      verticalUsed,
      horizontalUsed,
      isVerticallyScrollable,
      isHorizontallyScrollable,
    };
  });

  /**
   * Property `isVerticallyScrollable` (`Signal<boolean>`) storing is vertically scrollable.
   * @zh 属性 `isVerticallyScrollable`（类型：`Signal<boolean>`），用于存储或配置是否为VerticallyScrollable。
   */
  isVerticallyScrollable: Signal<boolean> = computed(() => this.state().isVerticallyScrollable);
  /**
   * Property `isHorizontallyScrollable` (`Signal<boolean>`) storing is horizontally scrollable.
   * @zh 属性 `isHorizontallyScrollable`（类型：`Signal<boolean>`），用于存储或配置是否为HorizontallyScrollable。
   */
  isHorizontallyScrollable: Signal<boolean> = computed(() => this.state().isHorizontallyScrollable);
  /**
   * Property `verticalUsed` (`Signal<boolean>`) storing vertical used.
   * @zh 属性 `verticalUsed`（类型：`Signal<boolean>`），用于存储或配置垂直已使用。
   */
  verticalUsed: Signal<boolean> = computed(() => this.state().verticalUsed);
  /**
   * Property `horizontalUsed` (`Signal<boolean>`) storing horizontal used.
   * @zh 属性 `horizontalUsed`（类型：`Signal<boolean>`），用于存储或配置水平已使用。
   */
  horizontalUsed: Signal<boolean> = computed(() => this.state().horizontalUsed);

  /**
   * Scroll duration when the scroll track is clicked
   * @zh 属性 `trackScrollDuration`（类型：`InputSignalWithTransform<number, string | number>`），用于存储或配置track滚动持续时间。
   */
  trackScrollDuration: InputSignalWithTransform<number, string | number> = input<number, string | number>(this.options.trackScrollDuration, {
    transform: numberAttribute
  });

  /**
   *  Sets the appearance of the scrollbar, there are 2 options:
   *
   * - `native` (default) scrollbar space will be reserved just like with native scrollbar.
   * - `compact` scrollbar doesn't reserve any space, they are placed over the viewport.

   * @zh 属性 `appearance`（类型：`InputSignal<ScrollbarAppearance>`），用于存储或配置appearance。
   */
  appearance: InputSignal<ScrollbarAppearance> = input<ScrollbarAppearance>(this.options.appearance);
  /**
   * Sets the position of each scrollbar, there are 4 options:
   *
   * - `native` (Default) Use the default position like in native scrollbar.
   * - `invertY` Inverts vertical scrollbar position
   * - `invertX` Inverts Horizontal scrollbar position
   * - `invertAll` Inverts both scrollbar positions

   * @zh 属性 `position`（类型：`InputSignal<ScrollbarPosition>`），用于存储或配置位置。
   */
  position: InputSignal<ScrollbarPosition> = input<ScrollbarPosition>(this.options.position);

  /**
   * A class forwarded to the scrollbar track element
   * @zh 属性 `trackClass`（类型：`InputSignal<string>`），用于存储或配置track类名（默认值：`input<string>(this.options.trackClass)`）。
   */
  trackClass: InputSignal<string> = input<string>(this.options.trackClass);
  /**
   * A class forwarded to the scrollbar thumb element
   * @zh 属性 `thumbClass`（类型：`InputSignal<string>`），用于存储或配置thumb类名（默认值：`input<string>(this.options.thumbClass)`）。
   */
  thumbClass: InputSignal<string> = input<string>(this.options.thumbClass);
  /**
   * A class forwarded to the scrollbar button element
   * @zh 属性 `buttonClass`（类型：`InputSignal<string>`），用于存储或配置按钮类名（默认值：`input<string>(this.options.thumbClass)`）。
   */
  buttonClass: InputSignal<string> = input<string>(this.options.thumbClass);

  /**
   * Steam that emits when scrollbar is initialized
   * @zh 属性 `afterInit`（类型：`OutputEmitterRef<void>`），用于存储或配置之后初始化（默认值：`output<void>()`）。
   */
  afterInit: OutputEmitterRef<void> = output<void>();

  /**
   * Steam that emits when scrollbar is updated
   * @zh 属性 `afterUpdate`（类型：`OutputEmitterRef<void>`），用于存储或配置之后更新（默认值：`output<void>()`）。
   */
  afterUpdate: OutputEmitterRef<void> = output<void>();

  /**
   * The scrollbars component instance used for testing purpose
   * @zh 属性 `_scrollbars`（类型：`Signal<Scrollbars>`），用于存储或配置滚动条。
   */
  abstract _scrollbars: Signal<Scrollbars>;

  /**
   * Creates an instance of `NgScrollbarCore` and initializes its dependencies and internal state.
   * @zh 创建 `NgScrollbarCore` 实例，并初始化其依赖项与内部状态。
   */
  protected constructor() {
    let resizeSub$: Subscription;
    let hasInitialized: boolean;

    effect((onCleanup: EffectCleanupRegisterFn) => {
      const disableSensor: boolean = this.disableSensor();
      const throttleDuration: number = this.sensorThrottleTime();
      const viewportInit: boolean = this.viewport.initialized();

      untracked(() => {
        if (viewportInit) {
          // If resize sensor is disabled, update manually the first time
          if (disableSensor) {
            requestAnimationFrame(() => this.update(ScrollbarUpdateReason.AfterInit));
          } else {
            // Observe size changes for viewport and content wrapper
            this.zone.runOutsideAngular(() => {
              resizeSub$ = getThrottledStream(
                combineLatest([
                  this.sharedResizeObserver.observe(this.viewport.nativeElement),
                  this.sharedResizeObserver.observe(this.viewport.contentWrapperElement)
                ]),
                throttleDuration
              ).subscribe(() => {
                // After deep investigation, it appears that setting the dimension directly from the element properties
                // is much faster than to set them from resize callback values
                this.zone.run(() => {
                  this.updateDimensions();

                  if (hasInitialized) {
                    this.afterUpdate.emit();
                  } else {
                    this.afterInit.emit();
                  }
                  hasInitialized = true;
                });
              });
            });
          }
        }

        onCleanup(() => resizeSub$?.unsubscribe());
      });
    });
  }

  /**
   * Manual update

   * @zh 执行 `update`，用于更新。
   */
  update(reason?: ScrollbarUpdateReason): void {
    this.updateDimensions();

    if (reason === ScrollbarUpdateReason.AfterInit) {
      this.afterInit.emit();
    } else {
      this.afterUpdate.emit();
    }
  }

  /**
   * Smooth scroll functions

   * @zh 执行 `scrollTo`，用于滚动转换为。
   */
  scrollTo(options: SmoothScrollToOptions): Promise<void> {
    return this.smoothScroll.scrollTo(this.viewport.nativeElement, options);
  }

  /**
   * Scroll to element by reference or selector

   * @zh 执行 `scrollToElement`，用于滚动转换为元素。
   */
  scrollToElement(target: SmoothScrollElement, options?: SmoothScrollToElementOptions): Promise<void> {
    return this.smoothScroll.scrollToElement(this.viewport.nativeElement, target, options);
  }

  /**
   * Executes `updateDimensions` to handle update dimensions.
   * @zh 执行 `updateDimensions`，用于更新维度列表。
   */
  private updateDimensions(): void {
    this.viewportDimension.set({ width: this.viewport.offsetWidth, height: this.viewport.offsetHeight });
    this.contentDimension.set({ width: this.viewport.contentWidth, height: this.viewport.contentHeight });
  }
}
