/**
 * @fileoverview Module `src/tree/directives/tree-drag.directive.ts` providing tree drag directive definitions and implementation.
 * @zh 模块文件 `src/tree/directives/tree-drag.directive.ts`，提供树形控件拖拽指令相关的定义与实现。
 */

import { AfterViewInit, Directive, DoCheck, ElementRef, HostListener, Input, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import { TreeDraggedElement } from '../models';


/**
 * Angular directive `TreeDragDirective` (selector: '[treeDrag]') attaching tree drag directive behavior to host DOM elements.
 * @zh Angular 指令 `TreeDragDirective`（selector: '[treeDrag]'），为宿主 DOM 元素附加树形控件拖拽指令行为。
 */
@Directive({
  selector: '[treeDrag]',
  
})
export class TreeDragDirective implements AfterViewInit, DoCheck, OnDestroy {
  /**
   * Input property `treeDrag` (`any`) configuring dragged element.
   * @zh 输入属性 `treeDrag`（类型：`any`），用于配置dragged元素。
   */
  @Input('treeDrag') draggedElement;
  /**
   * Input property `treeDragEnabled` (`any`) configuring tree drag enabled.
   * @zh 输入属性 `treeDragEnabled`（类型：`any`），用于配置树形控件拖拽已启用。
   */
  @Input() treeDragEnabled;
  /**
   * Property `dragEventHandler` (`(ev: DragEvent) => void`) storing drag event handler.
   * @zh 属性 `dragEventHandler`（类型：`(ev: DragEvent) => void`），用于存储或配置拖拽事件处理器。
   */
  private readonly dragEventHandler: (ev: DragEvent) => void;

  /**
   * Creates an instance of `TreeDragDirective` and initializes its dependencies and internal state.
   * @zh 创建 `TreeDragDirective` 实例，并初始化其依赖项与内部状态。
   * @param el - Injected or initial el (`ElementRef`) / 注入或传入的DOM元素（`ElementRef`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param treeDraggedElement - Injected or initial tree dragged element (`TreeDraggedElement`) / 注入或传入的树形控件Dragged元素（`TreeDraggedElement`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   */
  constructor(private el: ElementRef, private renderer: Renderer2, private treeDraggedElement: TreeDraggedElement, private ngZone: NgZone) {
    this.dragEventHandler = this.onDrag.bind(this);
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit() {
    let el: HTMLElement = this.el.nativeElement;
    this.ngZone.runOutsideAngular(() => {
      el.addEventListener('drag', this.dragEventHandler);
    });
  }

  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  ngDoCheck() {
    this.renderer.setAttribute(this.el.nativeElement, 'draggable', this.treeDragEnabled ? 'true' : 'false');
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    let el: HTMLElement = this.el.nativeElement;
    el.removeEventListener('drag', this.dragEventHandler);
  }

  /**
   * Host event listener `onDragStart` handling `dragstart` events for on drag start.
   * @zh 宿主事件监听方法 `onDragStart`，响应 `dragstart` 事件以处理当拖拽开始。
   * @param ev - ev parameter (`any`) / 事件参数（`any`）
   */
  @HostListener('dragstart', ['$event']) onDragStart(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
    this.treeDraggedElement.set(this.draggedElement);
    if (this.draggedElement.mouseAction) {
      this.draggedElement.mouseAction('dragStart', ev);
    }
  }

  /**
   * Executes `onDrag` to handle on drag.
   * @zh 执行 `onDrag`，用于当拖拽。
   * @param ev - ev parameter (`any`) / 事件参数（`any`）
   */
  onDrag(ev) {
    if (this.draggedElement.mouseAction) {
      this.draggedElement.mouseAction('drag', ev);
    }
  }

  /**
   * Host event listener `onDragEnd` handling `dragend` events for on drag end.
   * @zh 宿主事件监听方法 `onDragEnd`，响应 `dragend` 事件以处理当拖拽结束。
   */
  @HostListener('dragend') onDragEnd() {
    if (this.draggedElement.mouseAction) {
      this.draggedElement.mouseAction('dragEnd');
    }
    this.treeDraggedElement.set(null);
  }
}
