/**
 * @fileoverview Module `src/common/scrollbar/viewport/scroll-viewport.ts` providing scroll viewport definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/viewport/scroll-viewport.ts`，提供滚动视口相关的定义与实现。
 */

import { Directive, inject, ElementRef } from '@angular/core';

/**
 * Marks an element as the scrollable viewport that {@link NgScrollbarExt} should attach its
 * custom scrollbar overlay to.
 * @zh 将元素标记为 {@link NgScrollbarExt} 应附加自定义滚动条覆层的可滚动视口。
 */
@Directive({
  standalone: true,
  selector: '[scrollViewport]'
})
export class ScrollViewport {

  /**
   * Property `nativeElement` (`HTMLElement`) storing native element.
   * @zh 标记该指令所在的原生元素。
   * @zh 标记该指令所在的原生元素。
   */
  readonly nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

}
