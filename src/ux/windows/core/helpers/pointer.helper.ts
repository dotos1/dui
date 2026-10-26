/**
 * @fileoverview Module `src/ux/windows/core/helpers/pointer.helper.ts` providing pointer helper definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/helpers/pointer.helper.ts`，提供指针辅助工具相关的定义与实现。
 */

import { ɵIsNil } from './methods.helper';


/**
 * Class `ɵPointerHelper` encapsulating ɵpointer helper data structures and logic in `src/ux/windows/core/helpers`.
 * @zh 类 `ɵPointerHelper`，封装 `src/ux/windows/core/helpers` 中的ɵPointer辅助工具数据结构与处理逻辑。
 */
export abstract class ɵPointerHelper {
    /**
     * Executes `getClientX` to handle get client x.
     * @zh 执行 `getClientX`，用于获取ClientX坐标。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    public static getClientX(event: PointerEvent | TouchEvent): number {
        if (this.isPointerEvent(event)) {
            return event.clientX;
        }

        return event.changedTouches[0].clientX;
    }

    /**
     * Executes `getClientY` to handle get client y.
     * @zh 执行 `getClientY`，用于获取ClientY坐标。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    public static getClientY(event: PointerEvent | TouchEvent): number {
        if (this.isPointerEvent(event)) {
            return event.clientY;
        }

        return event.changedTouches[0].clientY;
    }

    /**
     * Executes `getPageX` to handle get page x.
     * @zh 执行 `getPageX`，用于获取页面X坐标。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    public static getPageX(event: PointerEvent | TouchEvent): number {
        if (this.isPointerEvent(event)) {
            return event.pageX;
        }

        return event.touches[0].pageX;
    }

    /**
     * Executes `getPageY` to handle get page y.
     * @zh 执行 `getPageY`，用于获取页面Y坐标。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    public static getPageY(event: PointerEvent | TouchEvent): number {
        if (this.isPointerEvent(event)) {
            return event.pageY;
        }

        return event.touches[0].pageY;
    }

    /**
     * Executes `isPointerEvent` to handle is pointer event.
     * @zh 执行 `isPointerEvent`，用于是否为指针事件。
     * @param event - event parameter (`Event`) / 事件参数（`Event`）
     * @returns Result of type `event is PointerEvent` / 类型为 `event is PointerEvent` 的返回值
     */
    public static isPointerEvent(event: Event): event is PointerEvent {
        const mouseEvent = event as PointerEvent;

        return !ɵIsNil(mouseEvent.clientX) && !ɵIsNil(mouseEvent.clientY);
    }

    /**
     * Executes `isTouchEvent` to handle is touch event.
     * @zh 执行 `isTouchEvent`，用于是否为触摸事件。
     * @param event - event parameter (`Event`) / 事件参数（`Event`）
     * @returns Result of type `event is TouchEvent` / 类型为 `event is TouchEvent` 的返回值
     */
    public static isTouchEvent(event: Event): event is TouchEvent {
        const touchEvent = event as TouchEvent;

        return !ɵIsNil(touchEvent.touches);
    }
}
