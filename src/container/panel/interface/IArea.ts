/**
 * @fileoverview Module `src/container/panel/interface/IArea.ts` providing i area definitions and implementation.
 * @zh 模块文件 `src/container/panel/interface/IArea.ts`，提供I区域相关的定义与实现。
 */

import { AbstractPanel } from '../abstract.panel';

/**
 * Interface `IArea` defining the contract and properties for i area.
 * @zh 接口 `IArea`，定义I区域的数据结构契约与属性规范。
 */
export interface IArea {
    /**
     * Property `comp` (`AbstractPanel`) storing comp.
     * @zh 属性 `comp`（类型：`AbstractPanel`），用于存储或配置组件。
     */
    comp: AbstractPanel;
    /**
     * Property `size` (`number`) storing size.
     * @zh 属性 `size`（类型：`number`），用于存储或配置尺寸。
     */
    size: number;
    /**
     * Property `order` (`number`) storing order.
     * @zh 属性 `order`（类型：`number`），用于存储或配置顺序。
     */
    order: number;
}
