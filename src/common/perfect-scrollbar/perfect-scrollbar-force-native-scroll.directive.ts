/**
 * @fileoverview Module `src/common/perfect-scrollbar/perfect-scrollbar-force-native-scroll.directive.ts` providing perfect scrollbar force native scroll directive definitions and implementation.
 * @zh 模块文件 `src/common/perfect-scrollbar/perfect-scrollbar-force-native-scroll.directive.ts`，提供perfect滚动条force原生滚动指令相关的定义与实现。
 */

import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * Marks an element (typically a scrollable child inside a `perfectScrollbar` container)
 * so Perfect Scrollbar lets it use native browser scrolling instead of intercepting it.
 * @zh 标记一个元素（通常是 `perfectScrollbar` 容器内的可滚动子元素），
 * 使 Perfect Scrollbar 放行其原生浏览器滚动，而不是拦截处理。
 */
@Directive({
    selector: '[forceNativeScrolling]',
    standalone: false,
})
export class ForceNativeScrollDirective {
    /**
     * Creates an instance of `ForceNativeScrollDirective` and initializes its dependencies and internal state.
     * @zh 创建 `ForceNativeScrollDirective` 实例，并初始化其依赖项与内部状态。
     * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
     * @param el - Injected or initial el (`ElementRef<any>`) / 注入或传入的DOM元素（`ElementRef<any>`）
     */
    constructor(private renderer: Renderer2, el: ElementRef) {
        ['ps__child', 'ps__child--consume'].forEach(className => {
            this.renderer.addClass(el?.nativeElement, className);
        });
    }
}
