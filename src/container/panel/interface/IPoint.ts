/**
 * @fileoverview Module `src/container/panel/interface/IPoint.ts` providing i point definitions and implementation.
 * @zh 模块文件 `src/container/panel/interface/IPoint.ts`，提供I坐标点相关的定义与实现。
 */


/**
 * Interface `IPoint` defining the contract and properties for i point.
 * @zh 接口 `IPoint`，定义I坐标点的数据结构契约与属性规范。
 */
export interface IPoint {
    /**
     * Property `x` (`number`) storing x.
     * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标。
     */
    x: number;
    /**
     * Property `y` (`number`) storing y.
     * @zh 属性 `y`（类型：`number`），用于存储或配置Y坐标。
     */
    y: number;
}
