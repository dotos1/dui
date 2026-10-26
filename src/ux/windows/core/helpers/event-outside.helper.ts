/**
 * @fileoverview Module `src/ux/windows/core/helpers/event-outside.helper.ts` providing event outside helper definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/helpers/event-outside.helper.ts`，提供事件外部辅助工具相关的定义与实现。
 */


/**
 * Class `ɵEventOutside` encapsulating ɵevent outside data structures and logic in `src/ux/windows/core/helpers`.
 * @zh 类 `ɵEventOutside`，封装 `src/ux/windows/core/helpers` 中的ɵEvent外部数据结构与处理逻辑。
 */
export abstract class ɵEventOutside {
    /**
     * Executes `checkForElement` to handle check for element.
     * @zh 执行 `checkForElement`，用于检查用于元素。
     * @param element - element parameter (`HTMLElement`) / 元素参数（`HTMLElement`）
     * @param event - event parameter (`Event`) / 事件参数（`Event`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    public static checkForElement(element: HTMLElement, event: Event): boolean {
        const bubbledElements = event.composedPath() as HTMLElement[];

        return bubbledElements
            .every((currElement) => (currElement !== element));
    }
}
