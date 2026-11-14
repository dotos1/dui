/**
 * @fileoverview Module `src/data/datatable/directives/draggable.directive.ts` providing draggable directive definitions and implementation.
 * @zh 模块文件 `src/data/datatable/directives/draggable.directive.ts`，提供是否可拖拽指令相关的定义与实现。
 */

import {
  Directive, ElementRef, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges
} from '@angular/core';
import {  Subscription, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


/**
 * Angular directive `DraggableDirective` (selector: '[draggable]') attaching draggable directive behavior to host DOM elements.
 * @zh Angular 指令 `DraggableDirective`（selector: '[draggable]'），为宿主 DOM 元素附加是否可拖拽指令行为。
 */
@Directive({ selector: '[draggable]', standalone: false })
export class DraggableDirective implements OnDestroy, OnChanges {
  /**
   * Input property `dragEventTarget` (`any`) configuring drag event target.
   * @zh 输入属性 `dragEventTarget`（类型：`any`），用于配置拖拽事件目标。
   */
  @Input() dragEventTarget;
  /**
   * Input property `dragModel` (`any`) configuring drag model.
   * @zh 输入属性 `dragModel`（类型：`any`），用于配置拖拽模型。
   */
  @Input() dragModel;
  /**
   * Input property `dragX` (`boolean`) configuring drag x (default: `true`).
   * @zh 输入属性 `dragX`（类型：`boolean`），用于配置拖拽X坐标（默认值：`true`）。
   */
  @Input() dragX: boolean = true;
  /**
   * Input property `dragY` (`boolean`) configuring drag y (default: `true`).
   * @zh 输入属性 `dragY`（类型：`boolean`），用于配置拖拽Y坐标（默认值：`true`）。
   */
  @Input() dragY: boolean = true;

  /**
   * Output event emitter `dragStart` (`EventEmitter<any>`) firing when drag start occurs.
   * @zh 输出事件 `dragStart`（类型：`EventEmitter<any>`），当触发拖拽开始时向外发出事件。
   */
  @Output() dragStart = new EventEmitter();
  /**
   * Output event emitter `dragging` (`EventEmitter<any>`) firing when dragging occurs.
   * @zh 输出事件 `dragging`（类型：`EventEmitter<any>`），当触发拖拽中时向外发出事件。
   */
  @Output() dragging = new EventEmitter();
  /**
   * Output event emitter `dragEnd` (`EventEmitter<any>`) firing when drag end occurs.
   * @zh 输出事件 `dragEnd`（类型：`EventEmitter<any>`），当触发拖拽结束时向外发出事件。
   */
  @Output() dragEnd = new EventEmitter();

  /**
   * Property `element` (`HTMLElement`) storing element.
   * @zh 属性 `element`（类型：`HTMLElement`），用于存储或配置元素。
   */
  element: HTMLElement;
  /**
   * Property `isDragging` (`boolean`) storing is dragging (default: `false`).
   * @zh 属性 `isDragging`（类型：`boolean`），用于存储或配置是否为拖拽中（默认值：`false`）。
   */
  isDragging: boolean = false;
  /**
   * Property `subscription` (`Subscription`) storing subscription.
   * @zh 属性 `subscription`（类型：`Subscription`），用于存储或配置订阅对象。
   */
  subscription: Subscription;

  /**
   * Creates an instance of `DraggableDirective` and initializes its dependencies and internal state.
   * @zh 创建 `DraggableDirective` 实例，并初始化其依赖项与内部状态。
   * @param element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
   */
  constructor(element: ElementRef) {
    this.element = element.nativeElement;
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dragEventTarget'] && changes['dragEventTarget'].currentValue && this.dragModel.dragging) {
      this.onMousedown(changes['dragEventTarget'].currentValue);
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this._destroySubscription();
  }

  /**
   * Executes `onMouseup` to handle on mouseup.
   * @zh 执行 `onMouseup`，用于当鼠标抬起。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  onMouseup(event): void {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.element.classList.remove('dragging');

    if (this.subscription) {
      this._destroySubscription();
      this.dragEnd.emit({
        event,
        element: this.element,
        model: this.dragModel
      });
    }
  }

  /**
   * Executes `onMousedown` to handle on mousedown.
   * @zh 执行 `onMousedown`，用于当鼠标按下。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  onMousedown(event: MouseEvent): void {
    // we only want to drag the inner header text
    const isDragElm = (<HTMLElement>event.target).classList.contains('draggable');

    if (isDragElm && (this.dragX || this.dragY)) {
      event.preventDefault();
      this.isDragging = true;

      const mouseDownPos = { x: event.clientX, y: event.clientY };

      const mouseup = fromEvent(document, 'mouseup');
      this.subscription = mouseup.subscribe((ev) => this.onMouseup(ev));

      const mouseMoveSub = fromEvent(document, 'mousemove')
        .pipe(takeUntil(mouseup))
        .subscribe((ev) => this.move(ev, mouseDownPos));

      this.subscription.add(mouseMoveSub);

      this.dragStart.emit({
        event,
        element: this.element,
        model: this.dragModel
      });
    }
  }

  /**
   * Executes `move` to handle move.
   * @zh 执行 `move`，用于移动。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   * @param mouseDownPos - mouse down pos parameter (`{ x: number; y: number; }`) / 鼠标向下位置参数（`{ x: number; y: number; }`）
   */
  move(event, mouseDownPos: { x: number; y: number }): void {
    if (!this.isDragging) return;

    const x = event.clientX - mouseDownPos.x;
    const y = event.clientY - mouseDownPos.y;

    if (this.dragX) this.element.style.left = `${x}px`;
    if (this.dragY) this.element.style.top = `${y}px`;

    this.element.classList.add('dragging');

    this.dragging.emit({
      event,
      element: this.element,
      model: this.dragModel
    });
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
