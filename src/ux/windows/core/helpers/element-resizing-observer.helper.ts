/**
 * @fileoverview Module `src/ux/windows/core/helpers/element-resizing-observer.helper.ts` providing element resizing observer helper definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/helpers/element-resizing-observer.helper.ts`，提供元素调整尺寸中观察者辅助工具相关的定义与实现。
 */

import { Observable } from 'rxjs';

/**
 * Executes `ɵElementResizingObserver` to handle ɵelement resizing observer.
 * @zh 执行 `ɵElementResizingObserver`，用于ɵElement调整尺寸中观察者。
 * @param element - element parameter (`HTMLElement`) / 元素参数（`HTMLElement`）
 * @returns Result of type `Observable<HTMLElement>` / 类型为 `Observable<HTMLElement>` 的返回值
 */
export function ɵElementResizingObserver(element: HTMLElement): Observable<HTMLElement> {
    return new Observable((subscriber) => {
        const resizeObserver = new ResizeObserver(() => subscriber.next(element));
        resizeObserver.observe(element);
        return function unsubscribe() {
            resizeObserver.unobserve(element);
        };
    });
}
