import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * Marks an element (typically a scrollable child inside a `perfectScrollbar` container)
 * so Perfect Scrollbar lets it use native browser scrolling instead of intercepting it.
 * @zh 标记一个元素（通常是 `perfectScrollbar` 容器内的可滚动子元素），
 * 使 Perfect Scrollbar 放行其原生浏览器滚动，而不是拦截处理。
 */
@Directive({
    selector: '[forceNativeScrolling]',
})
export class ForceNativeScrollDirective {
    constructor(private renderer: Renderer2, el: ElementRef) {
        ['ps__child', 'ps__child--consume'].forEach(className => {
            this.renderer.addClass(el?.nativeElement, className);
        });
    }
}
