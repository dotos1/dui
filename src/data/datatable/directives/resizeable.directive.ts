/**
 * @fileoverview Module `src/data/datatable/directives/resizeable.directive.ts` providing resizeable directive definitions and implementation.
 * @zh 模块文件 `src/data/datatable/directives/resizeable.directive.ts`，提供resizeable指令相关的定义与实现。
 */

import {
  Directive, ElementRef, HostListener, Input, Output, EventEmitter, OnDestroy, AfterViewInit, Renderer2
} from '@angular/core';
import {  Subscription, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Angular directive `ResizeableDirective` (selector: '[resizeable]') attaching resizeable directive behavior to host DOM elements.
 * @zh Angular 指令 `ResizeableDirective`（selector: '[resizeable]'），为宿主 DOM 元素附加Resizeable指令行为。
 */
@Directive({
  selector: '[resizeable]',
  host: {
    '[class.resizeable]': 'resizeEnabled'
  }
})
export class ResizeableDirective implements OnDestroy, AfterViewInit {
  /**
   * Input property `resizeEnabled` (`boolean`) configuring resize enabled (default: `true`).
   * @zh 输入属性 `resizeEnabled`（类型：`boolean`），用于配置调整尺寸已启用（默认值：`true`）。
   */
  @Input() resizeEnabled: boolean = true;
  /**
   * Input property `minWidth` (`number`) configuring min width.
   * @zh 输入属性 `minWidth`（类型：`number`），用于配置最小值宽度。
   */
  @Input() minWidth: number;
  /**
   * Input property `maxWidth` (`number`) configuring max width.
   * @zh 输入属性 `maxWidth`（类型：`number`），用于配置最大值宽度。
   */
  @Input() maxWidth: number;

  /**
   * Output event emitter `resize` (`EventEmitter<any>`) firing when resize occurs.
   * @zh 输出事件 `resize`（类型：`EventEmitter<any>`），当触发调整尺寸时向外发出事件。
   */
  @Output() resize = new EventEmitter();

  /**
   * Property `element` (`HTMLElement`) storing element.
   * @zh 属性 `element`（类型：`HTMLElement`），用于存储或配置元素。
   */
  element: HTMLElement;
  /**
   * Property `subscription` (`Subscription`) storing subscription.
   * @zh 属性 `subscription`（类型：`Subscription`），用于存储或配置订阅对象。
   */
  subscription: Subscription;
  /**
   * Property `resizing` (`boolean`) storing resizing (default: `false`).
   * @zh 属性 `resizing`（类型：`boolean`），用于存储或配置调整尺寸中（默认值：`false`）。
   */
  resizing: boolean = false;
  /**
   * Property `resizeHandle` (`HTMLElement`) storing resize handle.
   * @zh 属性 `resizeHandle`（类型：`HTMLElement`），用于存储或配置调整尺寸连接手柄。
   */
  private resizeHandle: HTMLElement;

  /**
   * Creates an instance of `ResizeableDirective` and initializes its dependencies and internal state.
   * @zh 创建 `ResizeableDirective` 实例，并初始化其依赖项与内部状态。
   * @param element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   */
  constructor(element: ElementRef, private renderer: Renderer2) {
    this.element = element.nativeElement;
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit(): void {
    const renderer2 = this.renderer;
    this.resizeHandle = renderer2.createElement('span');
    if (this.resizeEnabled) {
      renderer2.addClass(this.resizeHandle, 'resize-handle');
    } else {
      renderer2.addClass(this.resizeHandle, 'resize-handle--not-resizable');
    }
    renderer2.appendChild(this.element, this.resizeHandle);
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this._destroySubscription();
    if (this.renderer.destroyNode) {
      this.renderer.destroyNode(this.resizeHandle);
    } else {
      this.renderer.removeChild(this.renderer.parentNode(this.resizeHandle), this.resizeHandle);
    }
  }

  /**
   * Executes `onMouseup` to handle on mouseup.
   * @zh 执行 `onMouseup`，用于当鼠标抬起。
   */
  onMouseup(): void {
    this.resizing = false;

    if (this.subscription && !this.subscription.closed) {
      this._destroySubscription();
      this.resize.emit(this.element.clientWidth);
    }
  }

  /**
   * Host event listener `onMousedown` handling `mousedown` events for on mousedown.
   * @zh 宿主事件监听方法 `onMousedown`，响应 `mousedown` 事件以处理当鼠标按下。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent): void {
    const isHandle = (<HTMLElement>event.target).classList.contains('resize-handle');
    const initialWidth = this.element.clientWidth;
    const mouseDownScreenX = event.screenX;

    if (isHandle) {
      event.stopPropagation();
      this.resizing = true;

      const mouseup = fromEvent(document, 'mouseup');
      this.subscription = mouseup.subscribe(() => this.onMouseup());
      const mouseMoveSub = fromEvent(document, 'mousemove')
        .pipe(takeUntil(mouseup))
        .subscribe((e: MouseEvent) => this.move(e, initialWidth, mouseDownScreenX));

      this.subscription.add(mouseMoveSub);
    }
  }

  /**
   * Executes `move` to handle move.
   * @zh 执行 `move`，用于移动。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   * @param initialWidth - initial width parameter (`number`) / 初始宽度参数（`number`）
   * @param mouseDownScreenX - mouse down screen x parameter (`number`) / 鼠标向下屏幕X坐标参数（`number`）
   */
  move(event: MouseEvent, initialWidth: number, mouseDownScreenX: number): void {
    const movementX = event.screenX - mouseDownScreenX;
    const newWidth = initialWidth + movementX;

    const overMinWidth = !this.minWidth || newWidth >= this.minWidth;
    const underMaxWidth = !this.maxWidth || newWidth <= this.maxWidth;

    if (overMinWidth && underMaxWidth) {
      this.element.style.width = `${newWidth}px`;
    }
  }

  /**
   * Executes `_destroySubscription` to handle destroy subscription.
   * @zh 执行 `_destroySubscription`，用于销毁订阅对象。
   */
  private _destroySubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}
