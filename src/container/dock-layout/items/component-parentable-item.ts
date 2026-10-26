/**
 * @fileoverview Module `src/container/dock-layout/items/component-parentable-item.ts` providing component parentable item definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/items/component-parentable-item.ts`，提供组件parentable条目相关的定义与实现。
 */

import { ComponentItem } from './component-item';
import { ContentItem } from './content-item';

/**
 * Class `ComponentParentableItem` encapsulating component parentable item data structures and logic in `src/container/dock-layout/items`.
 * @zh 类 `ComponentParentableItem`，封装 `src/container/dock-layout/items` 中的组件Parentable条目数据结构与处理逻辑。
 */
export abstract class ComponentParentableItem extends ContentItem {
    /**
     * Property `_focused` (`boolean`) storing focused (default: `false`).
     * @internal
     * @zh 属性 `_focused`（类型：`boolean`），用于存储或配置已聚焦（默认值：`false`）。
     */
    private _focused = false;

    /**
     * Gets the current focused (`focused: boolean`).
     * @zh 获取当前已聚焦（`focused: boolean`）。
     */
    get focused(): boolean { return this._focused; }

    /**
     * Executes `setFocusedValue` to handle set focused value.
     * @zh 执行 `setFocusedValue`，用于集合已聚焦值。
     * @param value - value parameter (`boolean`) / 值参数（`boolean`）
     */
    setFocusedValue(value: boolean): void {
        this._focused = value;
    }

    /**
     * Executes `setActiveComponentItem` to handle set active component item.
     * @zh 执行 `setActiveComponentItem`，用于集合激活组件条目。
     * @param item - item parameter (`ComponentItem`) / 条目参数（`ComponentItem`）
     * @param focus - focus parameter (`boolean`) / 聚焦参数（`boolean`）
     * @param suppressFocusEvent - suppress focus event parameter (`boolean`) / suppress聚焦事件参数（`boolean`）
     */
    abstract setActiveComponentItem(item: ComponentItem, focus: boolean, suppressFocusEvent: boolean): void;
}
