/**
 * @fileoverview Module `src/data/datatable/directives/orderable.directive.ts` providing orderable directive definitions and implementation.
 * @zh 模块文件 `src/data/datatable/directives/orderable.directive.ts`，提供orderable指令相关的定义与实现。
 */

import {
  Directive, Output, EventEmitter, ContentChildren,
  QueryList, KeyValueDiffers, AfterContentInit, OnDestroy, Inject
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DraggableDirective } from './draggable.directive';
import { DOCUMENT } from "@angular/common";

/**
 * Angular directive `OrderableDirective` (selector: '[orderable]') attaching orderable directive behavior to host DOM elements.
 * @zh Angular 指令 `OrderableDirective`（selector: '[orderable]'），为宿主 DOM 元素附加Orderable指令行为。
 */
@Directive({ selector: '[orderable]', standalone: false })
export class OrderableDirective implements AfterContentInit, OnDestroy {
  /**
   * Output event emitter `reorder` (`EventEmitter<any>`) firing when reorder occurs.
   * @zh 输出事件 `reorder`（类型：`EventEmitter<any>`），当触发重排时向外发出事件。
   */
  @Output() reorder = new EventEmitter();
  /**
   * Output event emitter `targetChanged` (`EventEmitter<any>`) firing when target changed occurs.
   * @zh 输出事件 `targetChanged`（类型：`EventEmitter<any>`），当触发目标已变更时向外发出事件。
   */
  @Output() targetChanged = new EventEmitter();

  /**
   * Template/content query reference `draggables` (`QueryList<DraggableDirective>`) targeting draggables.
   * @zh 模板/内容视图查询引用 `draggables`（`@ContentChildren`），指向是否可拖拽。
   */
  @ContentChildren(DraggableDirective, { descendants: true })
  draggables: QueryList<DraggableDirective>;

  /**
   * Property `positions` (`any`) storing positions.
   * @zh 属性 `positions`（类型：`any`），用于存储或配置位置。
   */
  positions;
  /**
   * Property `differ` (`any`) storing differ.
   * @zh 属性 `differ`（类型：`any`），用于存储或配置differ。
   */
  differ;
  /**
   * Property `lastDraggingIndex` (`number`) storing last dragging index.
   * @zh 属性 `lastDraggingIndex`（类型：`number`），用于存储或配置末尾拖拽中索引。
   */
  lastDraggingIndex: number;
  /**
   * Property `draggableSubscriptions` (`Map<DraggableDirective, Subscription>`) storing draggable subscriptions.
   * @zh 属性 `draggableSubscriptions`（类型：`Map<DraggableDirective, Subscription>`），用于存储或配置是否可拖拽订阅集合。
   */
  private draggableSubscriptions = new Map<DraggableDirective, Subscription>();
  /**
   * Property `changesSubscription` (`Subscription`) storing changes subscription.
   * @zh 属性 `changesSubscription`（类型：`Subscription`），用于存储或配置变更集合订阅对象。
   */
  private changesSubscription: Subscription;

  /**
   * Creates an instance of `OrderableDirective` and initializes its dependencies and internal state.
   * @zh 创建 `OrderableDirective` 实例，并初始化其依赖项与内部状态。
   * @param differs - Injected or initial differs (`KeyValueDiffers`) / 注入或传入的differs（`KeyValueDiffers`）
   * @param document - Injected or initial document (`any`) / 注入或传入的文档对象（`any`）
   */
  constructor(differs: KeyValueDiffers, @Inject(DOCUMENT) private document) {
    this.differ = differs.find({}).create();
  }

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit(): void {
    // HACK: Investigate Better Way
    this.updateSubscriptions();
    this.changesSubscription = this.draggables.changes.subscribe(this.updateSubscriptions.bind(this));
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    if (this.changesSubscription) {
      this.changesSubscription.unsubscribe();
    }
    this.draggableSubscriptions.forEach(sub => sub.unsubscribe());
    this.draggableSubscriptions.clear();
  }

  /**
   * Executes `updateSubscriptions` to handle update subscriptions.
   * @zh 执行 `updateSubscriptions`，用于更新订阅集合。
   */
  updateSubscriptions(): void {
    const diffs = this.differ.diff(this.createMapDiffs());

    if (diffs) {
      const subscribe = ({ currentValue, previousValue }) => {
        unsubscribe({ previousValue });

        if (currentValue) {
          const sub = new Subscription();
          sub.add(currentValue.dragStart.subscribe(this.onDragStart.bind(this)));
          sub.add(currentValue.dragging.subscribe(this.onDragging.bind(this)));
          sub.add(currentValue.dragEnd.subscribe(this.onDragEnd.bind(this)));
          this.draggableSubscriptions.set(currentValue, sub);
        }
      };

      const unsubscribe = ({ previousValue }) => {
        if (previousValue) {
          const sub = this.draggableSubscriptions.get(previousValue);
          if (sub) {
            sub.unsubscribe();
            this.draggableSubscriptions.delete(previousValue);
          }
        }
      };

      diffs.forEachAddedItem(subscribe);
      // diffs.forEachChangedItem(subscribe.bind(this));
      diffs.forEachRemovedItem(unsubscribe);
    }
  }

  /**
   * Executes `onDragStart` to handle on drag start.
   * @zh 执行 `onDragStart`，用于当拖拽开始。
   */
  onDragStart(): void {
    this.positions = {};

    let i = 0;
    for (const dragger of this.draggables.toArray()) {
      const elm = dragger.element;
      const left = parseInt(elm.offsetLeft.toString(), 0);
      this.positions[dragger.dragModel.prop] = {
        left,
        right: left + parseInt(elm.offsetWidth.toString(), 0),
        index: i++,
        element: elm
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `onDragging` to handle on dragging.
   * @zh 执行 `onDragging`，用于当拖拽中。
   * @param options - { element, model, event } parameter (`any`) / {element,model,事件}参数（`any`）
   */
  onDragging({ element, model, event }): void {
    const prevPos = this.positions[model.prop];
    const target = this.isTarget(model, event);

    if (target) {
      if (this.lastDraggingIndex !== target.i) {
        this.targetChanged.emit({
          prevIndex: this.lastDraggingIndex,
          newIndex: target.i,
          initialIndex: prevPos.index
        });
        this.lastDraggingIndex = target.i;
      }
    } else if (this.lastDraggingIndex !== prevPos.index) {
      this.targetChanged.emit({
        prevIndex: this.lastDraggingIndex,
        initialIndex: prevPos.index
      });
      this.lastDraggingIndex = prevPos.index;
    }
  }

  /**
   * Executes `onDragEnd` to handle on drag end.
   * @zh 执行 `onDragEnd`，用于当拖拽结束。
   * @param options - { element, model, event } parameter (`any`) / {element,model,事件}参数（`any`）
   */
  onDragEnd({ element, model, event }): void {
    const prevPos = this.positions[model.prop];

    const target = this.isTarget(model, event);
    if (target) {
      this.reorder.emit({
        prevIndex: prevPos.index,
        newIndex: target.i,
        model
      });
    }

    this.lastDraggingIndex = undefined;
    element.style.left = 'auto';
  }

  /**
   * Executes `isTarget` to handle is target.
   * @zh 执行 `isTarget`，用于是否为目标。
   * @param model - model parameter (`any`) / 模型参数（`any`）
   * @param event - event parameter (`any`) / 事件参数（`any`）
   * @returns Result of type `{ pos: any; i: number; }` / 类型为 `{ pos: any; i: number; }` 的返回值
   */
  isTarget(model, event) {
    let i = 0;
    const x = event.x || event.clientX;
    const y = event.y || event.clientY;
    const targets = this.document.elementsFromPoint(x, y);

    for (const prop in this.positions) {
      // current column position which throws event.
      const pos = this.positions[prop];

      // since we drag the inner span, we need to find it in the elements at the cursor
      if (model.prop !== prop && targets.find((el) => el === pos.element)) {
        return {
          pos,
          i
        };
      }

      i++;
    }
    return undefined;
  }

  /**
   * Executes `createMapDiffs` to handle create map diffs.
   * @zh 执行 `createMapDiffs`，用于创建映射表Diffs。
   * @returns Result of type `{ [key: string]: DraggableDirective; }` / 类型为 `{ [key: string]: DraggableDirective; }` 的返回值
   */
  private createMapDiffs(): { [key: string]: DraggableDirective } {
    return this.draggables.toArray().reduce((acc, curr) => {
      acc[curr.dragModel.$$id] = curr;
      return acc;
    }, {});
  }
}
