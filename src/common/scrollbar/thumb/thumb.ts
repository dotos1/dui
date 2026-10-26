/**
 * @fileoverview Module `src/common/scrollbar/thumb/thumb.ts` providing thumb definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/thumb/thumb.ts`，提供thumb相关的定义与实现。
 */

import { Directive } from '@angular/core';
import { ThumbAdapter } from './thumb-adapter';

/**
 * Angular directive `ThumbXDirective` (selector: '[scrollbarThumbX]') attaching thumb x directive behavior to host DOM elements.
 * @zh Angular 指令 `ThumbXDirective`（selector: '[scrollbarThumbX]'），为宿主 DOM 元素附加ThumbX坐标指令行为。
 */
@Directive({
  standalone: true,
  selector: '[scrollbarThumbX]',
  providers: [{ provide: ThumbAdapter, useExisting: ThumbXDirective }]
})
export class ThumbXDirective extends ThumbAdapter {
}

/**
 * Angular directive `ThumbYDirective` (selector: '[scrollbarThumbY]') attaching thumb y directive behavior to host DOM elements.
 * @zh Angular 指令 `ThumbYDirective`（selector: '[scrollbarThumbY]'），为宿主 DOM 元素附加ThumbY坐标指令行为。
 */
@Directive({
  standalone: true,
  selector: '[scrollbarThumbY]',
  providers: [{ provide: ThumbAdapter, useExisting: ThumbYDirective }]
})
export class ThumbYDirective extends ThumbAdapter {
}
