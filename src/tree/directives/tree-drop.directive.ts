/**
 * @fileoverview Module `src/tree/directives/tree-drop.directive.ts` providing tree drop directive definitions and implementation.
 * @zh 模块文件 `src/tree/directives/tree-drop.directive.ts`，提供树形控件放置指令相关的定义与实现。
 */

import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  Output,
  Renderer2
} from '@angular/core';
import { TreeDraggedElement } from '../models/';

/**
 * Constant/variable `DRAG_OVER_CLASS` defining drag over class in `src/tree/directives`.
 * @zh 常量/变量 `DRAG_OVER_CLASS`，定义 `src/tree/directives` 中的拖拽越过类名。
 */
const DRAG_OVER_CLASS = 'is-dragging-over';
/**
 * Constant/variable `DRAG_DISABLED_CLASS` defining drag disabled class in `src/tree/directives`.
 * @zh 常量/变量 `DRAG_DISABLED_CLASS`，定义 `src/tree/directives` 中的拖拽已禁用类名。
 */
const DRAG_DISABLED_CLASS = 'is-dragging-over-disabled';

/**
 * Angular directive `TreeDropDirective` (selector: '[treeDrop]') attaching tree drop directive behavior to host DOM elements.
 * @zh Angular 指令 `TreeDropDirective`（selector: '[treeDrop]'），为宿主 DOM 元素附加树形控件放置指令行为。
 */
@Directive({
  selector: '[treeDrop]',
  
})
export class TreeDropDirective implements AfterViewInit, OnDestroy {
  /**
   * Input property `allowDragoverStyling` (`boolean`) configuring allow dragover styling (default: `true`).
   * @zh 输入属性 `allowDragoverStyling`（类型：`boolean`），用于配置允许Dragover样式（默认值：`true`）。
   */
  @Input() allowDragoverStyling = true;
  /**
   * Output event emitter `treeDrop` (`EventEmitter`) firing when on drop callback occurs.
   * @zh 输出事件 `treeDrop`（类型：`EventEmitter`），当触发当放置回调函数时向外发出事件。
   */
  @Output('treeDrop') onDropCallback = new EventEmitter();
  /**
   * Output event emitter `treeDropDragOver` (`EventEmitter`) firing when on drag over callback occurs.
   * @zh 输出事件 `treeDropDragOver`（类型：`EventEmitter`），当触发当拖拽越过回调函数时向外发出事件。
   */
  @Output('treeDropDragOver') onDragOverCallback = new EventEmitter();
  /**
   * Output event emitter `treeDropDragLeave` (`EventEmitter`) firing when on drag leave callback occurs.
   * @zh 输出事件 `treeDropDragLeave`（类型：`EventEmitter`），当触发当拖拽离开回调函数时向外发出事件。
   */
  @Output('treeDropDragLeave') onDragLeaveCallback = new EventEmitter();
  /**
   * Output event emitter `treeDropDragEnter` (`EventEmitter`) firing when on drag enter callback occurs.
   * @zh 输出事件 `treeDropDragEnter`（类型：`EventEmitter`），当触发当拖拽进入回调函数时向外发出事件。
   */
  @Output('treeDropDragEnter') onDragEnterCallback = new EventEmitter();
  /**
   * Property `dragOverEventHandler` (`(ev: DragEvent) => void`) storing drag over event handler.
   * @zh 属性 `dragOverEventHandler`（类型：`(ev: DragEvent) => void`），用于存储或配置拖拽越过事件处理器。
   */
  private readonly dragOverEventHandler: (ev: DragEvent) => void;
  /**
   * Property `dragEnterEventHandler` (`(ev: DragEvent) => void`) storing drag enter event handler.
   * @zh 属性 `dragEnterEventHandler`（类型：`(ev: DragEvent) => void`），用于存储或配置拖拽进入事件处理器。
   */
  private readonly dragEnterEventHandler: (ev: DragEvent) => void;
  /**
   * Property `dragLeaveEventHandler` (`(ev: DragEvent) => void`) storing drag leave event handler.
   * @zh 属性 `dragLeaveEventHandler`（类型：`(ev: DragEvent) => void`），用于存储或配置拖拽离开事件处理器。
   */
  private readonly dragLeaveEventHandler: (ev: DragEvent) => void;
  /**
   * Property `unlisteners` (`Array<() => void>`) storing unlisteners (default: `[]`).
   * @zh 属性 `unlisteners`（类型：`Array<() => void>`），用于存储或配置unlisteners（默认值：`[]`）。
   */
  private unlisteners: Array<() => void> = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Property `_allowDrop` (`any`) storing allow drop (default: `(element, $event) => true`).
   * @zh 属性 `_allowDrop`（类型：`any`），用于存储或配置允许放置（默认值：`(element, $event) => true`）。
   */
  private _allowDrop = (element, $event) => true;

  /**
   * Input setter `treeAllowDrop` updating tree allow drop.
   * @zh 输入属性 `treeAllowDrop` 的设置器，用于更新树形控件允许放置。
   * @param allowDrop - New tree allow drop value (`any`) / 新的树形控件允许放置值（`any`）
   */
  @Input() set treeAllowDrop(allowDrop) {
    if (allowDrop instanceof Function) {
      this._allowDrop = allowDrop;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    else this._allowDrop = (element, $event) => allowDrop;
  }

  /**
   * Executes `allowDrop` to handle allow drop.
   * @zh 执行 `allowDrop`，用于允许放置。
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   */
  allowDrop($event) {
    return this._allowDrop(this.treeDraggedElement.get(), $event);
  }

  /**
   * Creates an instance of `TreeDropDirective` and initializes its dependencies and internal state.
   * @zh 创建 `TreeDropDirective` 实例，并初始化其依赖项与内部状态。
   * @param el - Injected or initial el (`ElementRef`) / 注入或传入的DOM元素（`ElementRef`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param treeDraggedElement - Injected or initial tree dragged element (`TreeDraggedElement`) / 注入或传入的树形控件Dragged元素（`TreeDraggedElement`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   */
  constructor(private el: ElementRef, private renderer: Renderer2, private treeDraggedElement: TreeDraggedElement, private ngZone: NgZone) {
    this.dragOverEventHandler = this.onDragOver.bind(this);
    this.dragEnterEventHandler = this.onDragEnter.bind(this);
    this.dragLeaveEventHandler = this.onDragLeave.bind(this);
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit() {
    let el: HTMLElement = this.el.nativeElement;
    this.ngZone.runOutsideAngular(() => {
      this.unlisteners.push(
        this.renderer.listen(el, 'dragover', this.dragOverEventHandler),
        this.renderer.listen(el, 'dragenter', this.dragEnterEventHandler),
        this.renderer.listen(el, 'dragleave', this.dragLeaveEventHandler),
      );
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this.unlisteners.forEach(unlisten => unlisten());
    this.unlisteners = [];
  }

  /**
   * Executes `onDragOver` to handle on drag over.
   * @zh 执行 `onDragOver`，用于当拖拽越过。
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   */
  onDragOver($event) {

    if (!this.allowDrop($event)) {
      if (this.allowDragoverStyling) {
        return this.addDisabledClass();
      }
      return;
    }
    this.onDragOverCallback.emit({event: $event, element: this.treeDraggedElement.get()});
    $event.preventDefault();
    if (this.allowDragoverStyling) {
      this.addClass();
    }
  }

  /**
   * Executes `onDragEnter` to handle on drag enter.
   * @zh 执行 `onDragEnter`，用于当拖拽进入。
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   */
  onDragEnter($event) {

    if (!this.allowDrop($event)) return;
    $event.preventDefault();
    this.onDragEnterCallback.emit({event: $event, element: this.treeDraggedElement.get()});
  }

  /**
   * Executes `onDragLeave` to handle on drag leave.
   * @zh 执行 `onDragLeave`，用于当拖拽离开。
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   */
  onDragLeave($event) {
    if (!this.allowDrop($event)) {
      if (this.allowDragoverStyling) {
        return this.removeDisabledClass();
      }
      return;
    }
    this.onDragLeaveCallback.emit({event: $event, element: this.treeDraggedElement.get()});

    if (this.allowDragoverStyling) {
      this.removeClass();
    }
  }

  /**
   * Host event listener `onDrop` handling `drop` events for on drop.
   * @zh 宿主事件监听方法 `onDrop`，响应 `drop` 事件以处理当放置。
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   */
  @HostListener('drop', ['$event']) onDrop($event) {
    if (!this.allowDrop($event)) return;
    $event.preventDefault();
    this.onDropCallback.emit({event: $event, element: this.treeDraggedElement.get()});
    if (this.allowDragoverStyling) {
      this.removeClass();
    }
    this.treeDraggedElement.set(null);
  }

  /**
   * Executes `addClass` to handle add class.
   * @zh 执行 `addClass`，用于添加类名。
   */
  private addClass() {
    this.renderer.addClass(this.el.nativeElement, DRAG_OVER_CLASS);
  }

  /**
   * Executes `removeClass` to handle remove class.
   * @zh 执行 `removeClass`，用于移除类名。
   */
  private removeClass() {
    this.renderer.removeClass(this.el.nativeElement, DRAG_OVER_CLASS);
  }

  /**
   * Executes `addDisabledClass` to handle add disabled class.
   * @zh 执行 `addDisabledClass`，用于添加已禁用类名。
   */
  private addDisabledClass() {
    this.renderer.addClass(this.el.nativeElement, DRAG_DISABLED_CLASS);
  }

  /**
   * Executes `removeDisabledClass` to handle remove disabled class.
   * @zh 执行 `removeDisabledClass`，用于移除已禁用类名。
   */
  private removeDisabledClass() {
    this.renderer.removeClass(this.el.nativeElement, DRAG_DISABLED_CLASS);
  }
}
