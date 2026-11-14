/**
 * @fileoverview Module `src/common/scrollbar/reached-event/reached-dropped-base.ts` providing reached dropped base definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/reached-event/reached-dropped-base.ts`，提供reacheddropped基础相关的定义与实现。
 */

import {
  Directive,
  inject,
  effect,
  runInInjectionContext,
  OnInit,
  OnDestroy,
  NgZone,
  Injector,
  Renderer2,
  EventEmitter,
  PLATFORM_ID,
  InputSignalWithTransform
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { _NgScrollbar, NG_SCROLLBAR } from '../utils/scrollbar-base';


/**
 * Type alias `EventAction` representing event action (`{ emit: () => void; }`).
 * @zh 类型别名 `EventAction`，表示事件动作（`{ emit: () => void; }`）。
 */
type EventAction = {
  /**
   * Property `emit` (`() => void`) storing emit.
   * @zh 属性 `emit`（类型：`() => void`），用于存储或配置发出。
   */
  emit: () => void;
}

/**
 * Angular directive `ReachedDroppedBase` attaching reached dropped base behavior to host DOM elements.
 * @zh Angular 指令 `ReachedDroppedBase`，为宿主 DOM 元素附加ReachedDropped基础行为。
 */
@Directive({ standalone: false })
export abstract class ReachedDroppedBase implements OnInit, OnDestroy {

  /**
   * Property `isBrowser` (`boolean`) storing is browser (default: `isPlatformBrowser(inject(PLATFORM_ID))`).
   * @zh 属性 `isBrowser`（类型：`boolean`），用于存储或配置是否为浏览器（默认值：`isPlatformBrowser(inject(PLATFORM_ID))`）。
   */
  protected readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Property `zone` (`NgZone`) storing zone (default: `inject(NgZone)`).
   * @zh 属性 `zone`（类型：`NgZone`），用于存储或配置区域(NgZone)（默认值：`inject(NgZone)`）。
   */
  protected readonly zone: NgZone = inject(NgZone);

  /**
   * Property `renderer` (`Renderer2`) storing renderer (default: `inject(Renderer2)`).
   * @zh 属性 `renderer`（类型：`Renderer2`），用于存储或配置渲染器（默认值：`inject(Renderer2)`）。
   */
  protected readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Property `injector` (`Injector`) storing injector (default: `inject(Injector)`).
   * @zh 属性 `injector`（类型：`Injector`），用于存储或配置注入器（默认值：`inject(Injector)`）。
   */
  protected readonly injector: Injector = inject(Injector);

  /**
   * Property `scrollbar` (`_NgScrollbar`) storing scrollbar (default: `inject(NG_SCROLLBAR, { self: true })`).
   * @zh 属性 `scrollbar`（类型：`_NgScrollbar`），用于存储或配置滚动条（默认值：`inject(NG_SCROLLBAR, { self: true })`）。
   */
  protected readonly scrollbar: _NgScrollbar = inject(NG_SCROLLBAR, { self: true });

  /**
   * An array that contains all trigger elements  *
   * @zh 属性 `triggerElements`（类型：`HTMLElement[]`），用于存储或配置触发元素列表（默认值：`[]`）。
   */
  protected triggerElements: HTMLElement[] = [];

  /**
   * The intersection observer reference
   * @zh 属性 `intersectionObserver`（类型：`IntersectionObserver`），用于存储或配置intersection观察者。
   */
  protected intersectionObserver: IntersectionObserver;

  /**
   * An array that contains the chosen outputs
   * @zh 属性 `subscribedEvents`（类型：`string[]`），用于存储或配置已订阅事件集合（默认值：`[]`）。
   */
  protected subscribedEvents: string[] = [];

  /**
   * The wrapper element that contains the trigger elements
   * @zh 属性 `triggerElementsWrapper`（类型：`HTMLElement`），用于存储或配置触发元素列表包装器。
   */
  protected triggerElementsWrapper: HTMLElement;

  /**
   * The wrapper element class name
   * @zh 属性 `triggerElementsWrapperClass`（类型：`string`），用于存储或配置触发元素列表包装器类名。
   */
  protected abstract triggerElementsWrapperClass: string;

  /**
   * The trigger element class name
   * @zh 属性 `triggerElementClass`（类型：`string`），用于存储或配置触发元素类名。
   */
  protected abstract triggerElementClass: string;

  /**
   * Property `disabled` (`InputSignalWithTransform<boolean, string | boolean>`) storing disabled.
   * @zh 属性 `disabled`（类型：`InputSignalWithTransform<boolean, string | boolean>`），用于存储或配置已禁用。
   */
  abstract disabled: InputSignalWithTransform<boolean, string | boolean>;

  /**
   * Property `top` (`EventEmitter<void>`) storing top.
   * @zh 属性 `top`（类型：`EventEmitter<void>`），用于存储或配置顶部位置。
   */
  abstract top: EventEmitter<void>;

  /**
   * Property `bottom` (`EventEmitter<void>`) storing bottom.
   * @zh 属性 `bottom`（类型：`EventEmitter<void>`），用于存储或配置底部位置。
   */
  abstract bottom: EventEmitter<void>;

  /**
   * Property `start` (`EventEmitter<void>`) storing start.
   * @zh 属性 `start`（类型：`EventEmitter<void>`），用于存储或配置开始。
   */
  abstract start: EventEmitter<void>;

  /**
   * Property `end` (`EventEmitter<void>`) storing end.
   * @zh 属性 `end`（类型：`EventEmitter<void>`），用于存储或配置结束。
   */
  abstract end: EventEmitter<void>;

  /**
   * Executes `isTriggered` to handle is triggered.
   * @zh 执行 `isTriggered`，用于是否为已触发。
   * @param entry - entry parameter (`IntersectionObserverEntry`) / 条目参数（`IntersectionObserverEntry`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  protected abstract isTriggered(entry: IntersectionObserverEntry): boolean;

  /**
   * A mapper function to ease forwarding the intersected element to its proper output
   * @zh 属性 `eventActions`（类型：`Record<string, EventAction>`），用于存储或配置事件动作列表。
   */
  readonly eventActions: Record<string, EventAction> = {
    top: { emit: (): void => this.scrollbar.isVerticallyScrollable() ? this.top.emit() : null },
    bottom: { emit: (): void => this.scrollbar.isVerticallyScrollable() ? this.bottom.emit() : null },
    start: { emit: (): void => this.scrollbar.isHorizontallyScrollable() ? this.start.emit() : null },
    end: { emit: (): void => this.scrollbar.isHorizontallyScrollable() ? this.end.emit() : null }
  };

  /**
   * Executes `onAction` to handle on action.
   * @zh 执行 `onAction`，用于当动作。
   * @param trigger - trigger parameter (`string`) / 触发参数（`string`）
   */
  private onAction(trigger: string): void {
    if (trigger) {
      this.eventActions[trigger]?.emit();
    }
  }

  /**
   * Executes `setCssVariable` to handle set css variable.
   * @zh 执行 `setCssVariable`，用于集合CSS样式Variable。
   * @param property - property parameter (`string`) / 属性参数（`string`）
   * @param value - value parameter (`number`) / 值参数（`number`）
   */
  protected setCssVariable(property: string, value: number): void {
    if (value) {
      this.scrollbar.nativeElement.style.setProperty(property, `${ value }px`);
    }
  }

  /**
   * Executes `activate` to handle activate.
   * @zh 执行 `activate`，用于激活。
   */
  private activate(): void {
    this.zone.runOutsideAngular(() => {
      // Create the scrollbars element inside the viewport
      this.triggerElementsWrapper = this.renderer.createElement('div');
      this.renderer.addClass(this.triggerElementsWrapper, this.triggerElementsWrapperClass);
      this.renderer.appendChild(this.scrollbar.viewport.contentWrapperElement, this.triggerElementsWrapper);

      // Create a trigger element for each subscribed event
      this.subscribedEvents.forEach((event: string) => {
        const triggerElement: HTMLElement = this.renderer.createElement('div');
        this.renderer.addClass(triggerElement, this.triggerElementClass);
        this.renderer.setAttribute(triggerElement, 'trigger', event);
        this.renderer.appendChild(this.triggerElementsWrapper, triggerElement);
        this.triggerElements.push(triggerElement);
      });

      // The first time the observer is triggered as soon as the element is observed,
      // This flag is used to ignore this first trigger
      let intersectionObserverInit: boolean = false;

      this.intersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        if (intersectionObserverInit) {
          entries.forEach((entry: IntersectionObserverEntry) => {
            if (this.isTriggered(entry)) {
              // Forward the detected trigger element only after the observer is initialized
              // Only observe the trigger elements when scrollable
              this.zone.run(() => this.onAction(entry.target.getAttribute('trigger')));
            }
          });
        } else {
          // Once the initial element is detected set a flag to true
          intersectionObserverInit = true;
        }
      }, {
        root: this.scrollbar.viewport.nativeElement,
      });

      this.triggerElements.forEach((el: HTMLElement) => this.intersectionObserver.observe(el));
    });
  }

  /**
   * Executes `deactivate` to handle deactivate.
   * @zh 执行 `deactivate`，用于deactivate。
   */
  private deactivate(): void {
    this.intersectionObserver?.disconnect();
    this.triggerElementsWrapper?.remove();
    this.triggerElements = [];
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    if (this.top.observed) {
      this.subscribedEvents.push('top');
    }
    if (this.bottom.observed) {
      this.subscribedEvents.push('bottom');
    }
    if (this.start.observed) {
      this.subscribedEvents.push('start');
    }
    if (this.end.observed) {
      this.subscribedEvents.push('end');
    }

    runInInjectionContext(this.injector, () => {
      effect(() => {
        if (this.disabled()) {
          this.deactivate();
        } else {
          if (this.isBrowser) {
            this.activate();
          }
        }
      });
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.deactivate();
  }
}
