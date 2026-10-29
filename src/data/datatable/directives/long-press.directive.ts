/**
 * @fileoverview Module `src/data/datatable/directives/long-press.directive.ts` providing long press directive definitions and implementation.
 * @zh 模块文件 `src/data/datatable/directives/long-press.directive.ts`，提供longpress指令相关的定义与实现。
 */

import {
  Directive, Input, Output, EventEmitter, HostBinding,
  HostListener, OnDestroy
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


/**
 * Angular directive `LongPressDirective` (selector: '[long-press]') attaching long press directive behavior to host DOM elements.
 * @zh Angular 指令 `LongPressDirective`（selector: '[long-press]'），为宿主 DOM 元素附加LongPress指令行为。
 */
@Directive({ selector: '[long-press]' })
export class LongPressDirective implements OnDestroy {
  /**
   * Input property `pressEnabled` (`boolean`) configuring press enabled (default: `true`).
   * @zh 输入属性 `pressEnabled`（类型：`boolean`），用于配置press已启用（默认值：`true`）。
   */
  @Input() pressEnabled: boolean = true;
  /**
   * Input property `pressModel` (`any`) configuring press model.
   * @zh 输入属性 `pressModel`（类型：`any`），用于配置press模型。
   */
  @Input() pressModel;
  /**
   * Input property `duration` (`number`) configuring duration (default: `500`).
   * @zh 输入属性 `duration`（类型：`number`），用于配置持续时间（默认值：`500`）。
   */
  @Input() duration: number = 500;

  /**
   * Output event emitter `longPressStart` (`EventEmitter<any>`) firing when long press start occurs.
   * @zh 输出事件 `longPressStart`（类型：`EventEmitter<any>`），当触发longPress开始时向外发出事件。
   */
  @Output() longPressStart = new EventEmitter();
  /**
   * Output event emitter `longPressing` (`EventEmitter<any>`) firing when long pressing occurs.
   * @zh 输出事件 `longPressing`（类型：`EventEmitter<any>`），当触发longPressing时向外发出事件。
   */
  @Output() longPressing = new EventEmitter();
  /**
   * Output event emitter `longPressEnd` (`EventEmitter<any>`) firing when long press end occurs.
   * @zh 输出事件 `longPressEnd`（类型：`EventEmitter<any>`），当触发longPress结束时向外发出事件。
   */
  @Output() longPressEnd = new EventEmitter();

  /**
   * Property `pressing` (`boolean`) storing pressing.
   * @zh 属性 `pressing`（类型：`boolean`），用于存储或配置pressing。
   */
  pressing: boolean;
  /**
   * Property `isLongPressing` (`boolean`) storing is long pressing.
   * @zh 属性 `isLongPressing`（类型：`boolean`），用于存储或配置是否为LongPressing。
   */
  isLongPressing: boolean;
  /**
   * Property `timeout` (`any`) storing timeout.
   * @zh 属性 `timeout`（类型：`any`），用于存储或配置延时器。
   */
  timeout;
  /**
   * Property `mouseX` (`number`) storing mouse x (default: `0`).
   * @zh 属性 `mouseX`（类型：`number`），用于存储或配置鼠标X坐标（默认值：`0`）。
   */
  mouseX: number = 0;
  /**
   * Property `mouseY` (`number`) storing mouse y (default: `0`).
   * @zh 属性 `mouseY`（类型：`number`），用于存储或配置鼠标Y坐标（默认值：`0`）。
   */
  mouseY: number = 0;

  /**
   * Property `subscription` (`Subscription`) storing subscription.
   * @zh 属性 `subscription`（类型：`Subscription`），用于存储或配置订阅对象。
   */
  subscription: Subscription;

  /**
   * Host-bound getter `press` (`boolean`) computing press.
   * @zh 宿主绑定读取器 `press`（绑定至 `class.press`），计算并返回press。
   */
  @HostBinding('class.press')
  get press(): boolean {
    return this.pressing;
  }

  /**
   * Host-bound getter `isLongPress` (`boolean`) computing is long press.
   * @zh 宿主绑定读取器 `isLongPress`（绑定至 `class.longpress`），计算并返回是否为LongPress。
   */
  @HostBinding('class.longpress')
  get isLongPress(): boolean {
    return this.isLongPressing;
  }

  /**
   * Host event listener `onMouseDown` handling `mousedown` events for on mouse down.
   * @zh 宿主事件监听方法 `onMouseDown`，响应 `mousedown` 事件以处理当鼠标向下。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    // don't do right/middle clicks
    if (event.which !== 1 || !this.pressEnabled) return;

    // don't start drag if its on resize handle
    const target = <HTMLElement>event.target;
    if (target.classList.contains('resize-handle')) return;

    this.mouseX = event.clientX;
    this.mouseY = event.clientY;

    this.pressing = true;
    this.isLongPressing = false;

    const mouseup = fromEvent(document, 'mouseup');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.subscription = mouseup.subscribe((ev) => this.onMouseup());

    this.timeout = setTimeout(() => {
      this.isLongPressing = true;
      this.longPressStart.emit({
        event,
        model: this.pressModel
      });

      this.subscription.add(
        fromEvent(document, 'mousemove')
          .pipe(takeUntil(mouseup))
          .subscribe((mouseEvent: MouseEvent) => this.onMouseMove(mouseEvent))
      );

      this.loop(event);
    }, this.duration);

    this.loop(event);
  }

  /**
   * Executes `onMouseMove` to handle on mouse move.
   * @zh 执行 `onMouseMove`，用于当鼠标移动。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  onMouseMove(event: MouseEvent): void {
    if (this.pressing && !this.isLongPressing) {
      const xThres = Math.abs(event.clientX - this.mouseX) > 10;
      const yThres = Math.abs(event.clientY - this.mouseY) > 10;

      if (xThres || yThres) {
        this.endPress();
      }
    }
  }

  /**
   * Executes `loop` to handle loop.
   * @zh 执行 `loop`，用于loop。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  loop(event: MouseEvent): void {
    if (this.isLongPressing) {
      this.timeout = setTimeout(() => {
        this.longPressing.emit({
          event,
          model: this.pressModel
        });
        this.loop(event);
      }, 50);
    }
  }

  /**
   * Executes `endPress` to handle end press.
   * @zh 执行 `endPress`，用于结束Press。
   */
  endPress(): void {
    clearTimeout(this.timeout);
    this.isLongPressing = false;
    this.pressing = false;
    this._destroySubscription();

    this.longPressEnd.emit({
      model: this.pressModel
    });
  }

  /**
   * Executes `onMouseup` to handle on mouseup.
   * @zh 执行 `onMouseup`，用于当鼠标抬起。
   */
  onMouseup(): void {
    this.endPress();
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    clearTimeout(this.timeout);
    this._destroySubscription();
  }

  /**
   * Executes `_destroySubscription` to handle destroy subscription.
   * @zh 执行 `_destroySubscription`，用于销毁订阅对象。
   */
  private _destroySubscription(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}
