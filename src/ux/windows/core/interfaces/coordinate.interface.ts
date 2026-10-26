/**
 * @fileoverview Module `src/ux/windows/core/interfaces/coordinate.interface.ts` providing coordinate interface definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/interfaces/coordinate.interface.ts`，提供坐标interface相关的定义与实现。
 */

/**
 * Interface `Coordinate` defining the contract and properties for coordinate.
 * @zh 接口 `Coordinate`，定义坐标的数据结构契约与属性规范。
 */
export interface Coordinate {
    /**
     * The x-axis of coordinate
     * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标。
     */
    x: number;
    /**
     * The y-axis of coordinate
     * @zh 属性 `y`（类型：`number`），用于存储或配置Y坐标。
     */
    y: number;
}
