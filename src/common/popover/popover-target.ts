/**
 * @fileoverview Module `src/common/popover/popover-target.ts` providing popover target definitions and implementation.
 * @zh 模块文件 `src/common/popover/popover-target.ts`，提供气泡卡片目标相关的定义与实现。
 */

import { Directive, ElementRef } from '@angular/core';


/**
 * Marks an element as the positioning target for a {@link PopoverTrigger}, used when the
 * popover should be anchored to an element other than the trigger's own host.
 * @zh 将某个元素标记为 {@link PopoverTrigger} 的定位目标，用于弹出层需要锚定在触发元素之外的其他元素上的场景。
 */
@Directive({
  selector: 'popover-target, [popoverTarget]',
  exportAs: 'popoverTarget'
})

export class PopoverTarget {
  /**
   * Creates an instance of `PopoverTarget` and initializes its dependencies and internal state.
   * @zh 创建 `PopoverTarget` 实例，并初始化其依赖项与内部状态。
   * @param _elementRef - Injected or initial element ref (`ElementRef`) / 注入或传入的元素引用（`ElementRef`）
   */
  constructor(public _elementRef: ElementRef) { }
}
