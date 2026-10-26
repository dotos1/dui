/**
 * @fileoverview Module `src/ux/windows/core/interfaces/css-coordinate.interface.ts` providing css coordinate interface definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/interfaces/css-coordinate.interface.ts`，提供CSS样式坐标interface相关的定义与实现。
 */

/**
 * Interface `CssCoordinate` defining the contract and properties for css coordinate.
 * @zh 接口 `CssCoordinate`，定义CSS样式坐标的数据结构契约与属性规范。
 */
export interface CssCoordinate {
    /**
     * The x-axis of coordinate
     * @zh 属性 `x`（类型：`string`），用于存储或配置X坐标。
     */
    x: string;
    /**
     * The y-axis of coordinate
     * @zh 属性 `y`（类型：`string`），用于存储或配置Y坐标。
     */
    y: string;
}
