/**
 * @fileoverview Module `src/ux/windows/drag-and-drop/classes/drag-strategy/by-translate3d-drag.strategy.ts` providing by translate3d drag strategy definitions and implementation.
 * @zh 模块文件 `src/ux/windows/drag-and-drop/classes/drag-strategy/by-translate3d-drag.strategy.ts`，提供按translate3d拖拽策略相关的定义与实现。
 */


import { ɵInvertedKeysOfType } from '../../../core/types';
import { ɵDragStrategyEnum } from '../../enums';


/**
 * Class `DragStrategyByTranslate3d` encapsulating drag strategy by translate3d data structures and logic in `src/ux/windows/drag-and-drop/classes/drag-strategy`.
 * @zh 类 `DragStrategyByTranslate3d`，封装 `src/ux/windows/drag-and-drop/classes/drag-strategy` 中的拖拽策略按Translate3d数据结构与处理逻辑。
 */
export class DragStrategyByTranslate3d {

    /**
     * Property `type` (`ɵDragStrategyEnum.ByTranslate3d`) storing type (default: `ɵDragStrategyEnum.ByTranslate3d`).
     * @zh 属性 `type`（类型：`ɵDragStrategyEnum.ByTranslate3d`），用于存储或配置类型（默认值：`ɵDragStrategyEnum.ByTranslate3d`）。
     */
    public readonly type = ɵDragStrategyEnum.ByTranslate3d;

    /**
     * Property `isLockAxisX` (`boolean`) storing is lock axis x (default: `false`).
     * @zh 属性 `isLockAxisX`（类型：`boolean`），用于存储或配置是否为锁定坐标轴X坐标（默认值：`false`）。
     */
    public isLockAxisX?: boolean = false;

    /**
     * Property `isLockAxisY` (`boolean`) storing is lock axis y (default: `false`).
     * @zh 属性 `isLockAxisY`（类型：`boolean`），用于存储或配置是否为锁定坐标轴Y坐标（默认值：`false`）。
     */
    public isLockAxisY?: boolean = false;

    /**
     * Creates an instance of `DragStrategyByTranslate3d` and initializes its dependencies and internal state.
     * @zh 创建 `DragStrategyByTranslate3d` 实例，并初始化其依赖项与内部状态。
     * @param params - Injected or initial params (`ɵInvertedKeysOfType<DragStrategyByTranslate3d, ɵDragStrategyEnum>`) / 注入或传入的参数集合（`ɵInvertedKeysOfType<DragStrategyByTranslate3d, ɵDragStrategyEnum>`）
     */
    constructor(params?: ɵInvertedKeysOfType<DragStrategyByTranslate3d, ɵDragStrategyEnum>) {
        Object.assign(this, params);
    }
}
