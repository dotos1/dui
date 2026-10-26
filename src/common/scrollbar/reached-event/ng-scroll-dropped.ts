/**
 * @fileoverview Module `src/common/scrollbar/reached-event/ng-scroll-dropped.ts` providing ng scroll dropped definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/reached-event/ng-scroll-dropped.ts`，提供Angular滚动dropped相关的定义与实现。
 */

import {
  Directive,
  Input,
  Output,
  numberAttribute,
  booleanAttribute,
  input,
  EventEmitter,
  InputSignalWithTransform
} from '@angular/core';
import { ReachedDroppedBase } from './reached-dropped-base';

/**
 * Angular directive `NgScrollDropped` (selector: 'ng-scrollbar[droppedTop], ng-scrollbar[droppedBottom], ng-scrollbar[droppedStart], ng-scrollbar[droppedEnd]') attaching ng scroll dropped behavior to host DOM elements.
 * @zh Angular 指令 `NgScrollDropped`（selector: 'ng-scrollbar[droppedTop], ng-scrollbar[droppedBottom], ng-scrollbar[droppedStart], ng-scrollbar[droppedEnd]'），为宿主 DOM 元素附加Angular滚动Dropped行为。
 */
@Directive({
  selector: 'ng-scrollbar[droppedTop], ng-scrollbar[droppedBottom], ng-scrollbar[droppedStart], ng-scrollbar[droppedEnd]',
  standalone: true,
})
export class NgScrollDropped extends ReachedDroppedBase {

  /**
   * Dropped offset value in px
   * @zh 输入属性 `offsetSetter` 的设置器，用于更新偏移量Setter。
   */
  @Input({ alias: 'droppedOffset', transform: numberAttribute }) set offsetSetter(value: number) {
    this.setCssVariable('--dropped-offset', value);
  }

  /**
   * Input setter `offsetTopSetter` updating offset top setter.
   * @zh 输入属性 `offsetTopSetter` 的设置器，用于更新偏移量顶部位置Setter。
   * @param value - New offset top setter value (`number`) / 新的偏移量顶部位置Setter值（`number`）
   */
  @Input({ alias: 'droppedTopOffset', transform: numberAttribute }) set offsetTopSetter(value: number) {
    this.setCssVariable('--dropped-offset-top', value);
  }

  /**
   * Input setter `offsetBottomSetter` updating offset bottom setter.
   * @zh 输入属性 `offsetBottomSetter` 的设置器，用于更新偏移量底部位置Setter。
   * @param value - New offset bottom setter value (`number`) / 新的偏移量底部位置Setter值（`number`）
   */
  @Input({ alias: 'droppedBottomOffset', transform: numberAttribute }) set offsetBottomSetter(value: number) {
    this.setCssVariable('--dropped-offset-bottom', value);
  }

  /**
   * Input setter `offsetStartSetter` updating offset start setter.
   * @zh 输入属性 `offsetStartSetter` 的设置器，用于更新偏移量开始Setter。
   * @param value - New offset start setter value (`number`) / 新的偏移量开始Setter值（`number`）
   */
  @Input({ alias: 'droppedStartOffset', transform: numberAttribute }) set offsetStartSetter(value: number) {
    this.setCssVariable('--dropped-offset-start', value);
  }

  /**
   * Input setter `offsetEndSetter` updating offset end setter.
   * @zh 输入属性 `offsetEndSetter` 的设置器，用于更新偏移量结束Setter。
   * @param value - New offset end setter value (`number`) / 新的偏移量结束Setter值（`number`）
   */
  @Input({ alias: 'droppedEndOffset', transform: numberAttribute }) set offsetEndSetter(value: number) {
    this.setCssVariable('--dropped-offset-end', value);
  }

  /**
   * Property `disabled` (`InputSignalWithTransform<boolean, string | boolean>`) storing disabled.
   * @zh 属性 `disabled`（类型：`InputSignalWithTransform<boolean, string | boolean>`），用于存储或配置已禁用。
   */
  disabled: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(false, {
    alias: 'disableDropped',
    transform: booleanAttribute
  });

  /**
   * Output event emitter `droppedTop` (`EventEmitter<void>`) firing when top occurs.
   * @zh 输出事件 `droppedTop`（类型：`EventEmitter<void>`），当触发顶部位置时向外发出事件。
   */
  @Output('droppedTop') top: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Output event emitter `droppedBottom` (`EventEmitter<void>`) firing when bottom occurs.
   * @zh 输出事件 `droppedBottom`（类型：`EventEmitter<void>`），当触发底部位置时向外发出事件。
   */
  @Output('droppedBottom') bottom: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Output event emitter `droppedStart` (`EventEmitter<void>`) firing when start occurs.
   * @zh 输出事件 `droppedStart`（类型：`EventEmitter<void>`），当触发开始时向外发出事件。
   */
  @Output('droppedStart') start: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Output event emitter `droppedEnd` (`EventEmitter<void>`) firing when end occurs.
   * @zh 输出事件 `droppedEnd`（类型：`EventEmitter<void>`），当触发结束时向外发出事件。
   */
  @Output('droppedEnd') end: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Property `triggerElementsWrapperClass` (`string`) storing trigger elements wrapper class (default: `'ng-scroll-dropped-wrapper'`).
   * @zh 属性 `triggerElementsWrapperClass`（类型：`string`），用于存储或配置触发元素列表包装器类名（默认值：`'ng-scroll-dropped-wrapper'`）。
   */
  protected triggerElementsWrapperClass: string = 'ng-scroll-dropped-wrapper';

  /**
   * Property `triggerElementClass` (`string`) storing trigger element class (default: `'scroll-dropped-trigger-element'`).
   * @zh 属性 `triggerElementClass`（类型：`string`），用于存储或配置触发元素类名（默认值：`'scroll-dropped-trigger-element'`）。
   */
  protected triggerElementClass: string = 'scroll-dropped-trigger-element';

  /**
   * Executes `isTriggered` to handle is triggered.
   * @zh 执行 `isTriggered`，用于是否为已触发。
   * @param entry - entry parameter (`IntersectionObserverEntry`) / 条目参数（`IntersectionObserverEntry`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  protected isTriggered(entry: IntersectionObserverEntry): boolean {
    return !entry.isIntersecting;
  }
}
