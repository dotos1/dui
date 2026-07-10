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

  readonly nativeElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

}
