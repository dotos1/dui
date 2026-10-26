/**
 * @fileoverview Module `src/common/popover/popover-types.ts` providing popover types definitions and implementation.
 * @zh 模块文件 `src/common/popover/popover-types.ts`，提供气泡卡片类型列表相关的定义与实现。
 */

/**
 * Type alias `PopoverPositionX` representing popover position x (`'before' | 'after'`).
 * @zh 类型别名 `PopoverPositionX`，表示气泡卡片位置X坐标（`'before' | 'after'`）。
 */
export type PopoverPositionX = 'before' | 'after';

/**
 * Type alias `PopoverPositionY` representing popover position y (`'above' | 'below'`).
 * @zh 类型别名 `PopoverPositionY`，表示气泡卡片位置Y坐标（`'above' | 'below'`）。
 */
export type PopoverPositionY = 'above' | 'below';

/**
 * Type alias `PopoverTriggerEvent` representing popover trigger event (`'click' | 'hover' | 'none'`).
 * @zh 类型别名 `PopoverTriggerEvent`，表示气泡卡片触发事件（`'click' | 'hover' | 'none'`）。
 */
export type PopoverTriggerEvent = 'click' | 'hover' | 'none';

/**
 * Type alias `PopoverScrollStrategy` representing popover scroll strategy (`'noop' | 'close' | 'block' | 'reposition'`).
 * @zh 类型别名 `PopoverScrollStrategy`，表示气泡卡片滚动策略（`'noop' | 'close' | 'block' | 'reposition'`）。
 */
export type PopoverScrollStrategy = 'noop' | 'close' | 'block' | 'reposition';
