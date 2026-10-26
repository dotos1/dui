/**
 * @fileoverview Module `src/data/datatable/body/scroller.component.ts` providing scroller component definitions and implementation.
 * @zh 模块文件 `src/data/datatable/body/scroller.component.ts`，提供滚动容器组件相关的定义与实现。
 */

import {
  Component, Input, ElementRef, Output, EventEmitter, Renderer2, NgZone,
  OnInit, OnDestroy, HostBinding, ChangeDetectionStrategy
} from '@angular/core';


/**
 * Angular component `ScrollerComponent` (selector: 'datatable-scroller') providing scroller component presentation and interaction in `src/data/datatable/body`.
 * @zh Angular 组件 `ScrollerComponent`（selector: 'datatable-scroller'），提供滚动容器组件的视图渲染与交互逻辑（位于 `src/data/datatable/body`）。
 */
@Component({
  selector: 'datatable-scroller',
  template: `
    <ng-content></ng-content>
  `,
  host: {
    class: 'datatable-scroll'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollerComponent implements OnInit, OnDestroy {
  /**
   * Input property `scrollbarV` (`boolean`) configuring scrollbar v (default: `false`).
   * @zh 输入属性 `scrollbarV`（类型：`boolean`），用于配置滚动条V（默认值：`false`）。
   */
  @Input() scrollbarV: boolean = false;
  /**
   * Input property `scrollbarH` (`boolean`) configuring scrollbar h (default: `false`).
   * @zh 输入属性 `scrollbarH`（类型：`boolean`），用于配置滚动条H（默认值：`false`）。
   */
  @Input() scrollbarH: boolean = false;

  /**
   * Input property `scrollHeight` (`number`) configuring scroll height.
   * @zh 输入属性 `scrollHeight`（类型：`number`），用于配置滚动高度。
   */
  @HostBinding('style.height.px')
  @Input()
  scrollHeight: number;

  /**
   * Input property `scrollWidth` (`number`) configuring scroll width.
   * @zh 输入属性 `scrollWidth`（类型：`number`），用于配置滚动宽度。
   */
  @HostBinding('style.width.px')
  @Input()
  scrollWidth: number;

  /**
   * Output event emitter `scroll` (`EventEmitter<any>`) firing when scroll occurs.
   * @zh 输出事件 `scroll`（类型：`EventEmitter<any>`），当触发滚动时向外发出事件。
   */
  @Output() scroll = new EventEmitter();

  /**
   * Property `scrollYPos` (`number`) storing scroll y pos (default: `0`).
   * @zh 属性 `scrollYPos`（类型：`number`），用于存储或配置滚动Y坐标位置（默认值：`0`）。
   */
  scrollYPos: number = 0;
  /**
   * Property `scrollXPos` (`number`) storing scroll x pos (default: `0`).
   * @zh 属性 `scrollXPos`（类型：`number`），用于存储或配置滚动X坐标位置（默认值：`0`）。
   */
  scrollXPos: number = 0;
  /**
   * Property `prevScrollYPos` (`number`) storing prev scroll y pos (default: `0`).
   * @zh 属性 `prevScrollYPos`（类型：`number`），用于存储或配置前一个滚动Y坐标位置（默认值：`0`）。
   */
  prevScrollYPos: number = 0;
  /**
   * Property `prevScrollXPos` (`number`) storing prev scroll x pos (default: `0`).
   * @zh 属性 `prevScrollXPos`（类型：`number`），用于存储或配置前一个滚动X坐标位置（默认值：`0`）。
   */
  prevScrollXPos: number = 0;
  /**
   * Property `element` (`any`) storing element.
   * @zh 属性 `element`（类型：`any`），用于存储或配置元素。
   */
  element;
  /**
   * Property `parentElement` (`any`) storing parent element.
   * @zh 属性 `parentElement`（类型：`any`），用于存储或配置父级元素。
   */
  parentElement;
  /**
   * Property `onScrollListener` (`any`) storing on scroll listener.
   * @zh 属性 `onScrollListener`（类型：`any`），用于存储或配置当滚动监听器。
   */
  onScrollListener;

  /**
   * Property `_scrollEventListener` (`any`) storing scroll event listener (default: `null`).
   * @zh 属性 `_scrollEventListener`（类型：`any`），用于存储或配置滚动事件监听器（默认值：`null`）。
   */
  private _scrollEventListener = null;

  /**
   * Creates an instance of `ScrollerComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ScrollerComponent` 实例，并初始化其依赖项与内部状态。
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   * @param element - Injected or initial element (`ElementRef`) / 注入或传入的元素（`ElementRef`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   */
  constructor(private ngZone: NgZone, element: ElementRef, private renderer: Renderer2) {
    this.element = element.nativeElement;
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    // manual bind so we don't always listen
    if (this.scrollbarV || this.scrollbarH) {
      const renderer = this.renderer;
      this.parentElement = renderer.parentNode(renderer.parentNode(this.element));
      this._scrollEventListener = this.onScrolled.bind(this);
      this.parentElement.addEventListener('scroll', this._scrollEventListener);
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    if (this._scrollEventListener) {
      this.parentElement.removeEventListener('scroll', this._scrollEventListener);
      this._scrollEventListener = null;
    }
  }

  /**
   * Executes `setOffset` to handle set offset.
   * @zh 执行 `setOffset`，用于集合偏移量。
   * @param offsetY - offset y parameter (`number`) / 偏移量Y坐标参数（`number`）
   */
  setOffset(offsetY: number): void {
    if (this.parentElement) {
      this.parentElement.scrollTop = offsetY;
    }
  }

  /**
   * Executes `onScrolled` to handle on scrolled.
   * @zh 执行 `onScrolled`，用于当已滚动。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  onScrolled(event: MouseEvent): void {
    const dom: Element = <Element>event.currentTarget;
    requestAnimationFrame(() => {
      this.scrollYPos = dom.scrollTop;
      this.scrollXPos = dom.scrollLeft;
      this.updateOffset();
    });
  }

  /**
   * Executes `updateOffset` to handle update offset.
   * @zh 执行 `updateOffset`，用于更新偏移量。
   */
  updateOffset(): void {
    let direction: string;
    if (this.scrollYPos < this.prevScrollYPos) {
      direction = 'down';
    } else if (this.scrollYPos > this.prevScrollYPos) {
      direction = 'up';
    }

    this.scroll.emit({
      direction,
      scrollYPos: this.scrollYPos,
      scrollXPos: this.scrollXPos
    });

    this.prevScrollYPos = this.scrollYPos;
    this.prevScrollXPos = this.scrollXPos;
  }
}
