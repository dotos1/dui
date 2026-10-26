/**
 * @fileoverview Module `src/ux/windows/drag-and-drop/classes/drag-strategy/by-axis-properties-drag.strategy.ts` providing by axis properties drag strategy definitions and implementation.
 * @zh 模块文件 `src/ux/windows/drag-and-drop/classes/drag-strategy/by-axis-properties-drag.strategy.ts`，提供按坐标轴属性列表拖拽策略相关的定义与实现。
 */


import { ɵInvertedKeysOfType } from '../../../core/types/inverted-keys-of.type';
import { ɵDragStrategyEnum } from '../../enums';


/**
 * Class `DragStrategyByAxisProperties` encapsulating drag strategy by axis properties data structures and logic in `src/ux/windows/drag-and-drop/classes/drag-strategy`.
 * @zh 类 `DragStrategyByAxisProperties`，封装 `src/ux/windows/drag-and-drop/classes/drag-strategy` 中的拖拽策略按坐标轴属性列表数据结构与处理逻辑。
 */
export class DragStrategyByAxisProperties {
    /**
     * Property `type` (`any`) storing type (default: `ɵDragStrategyEnum.ByAxisProperties`).
     * @internal
     * @zh 属性 `type`（类型：`any`），用于存储或配置类型（默认值：`ɵDragStrategyEnum.ByAxisProperties`）。
     */
    public readonly type = ɵDragStrategyEnum.ByAxisProperties;

    /**
     * Property `xAxisLeftStyleProperty` (`string`) storing x axis left style property (default: `'left'`).
     * @zh 属性 `xAxisLeftStyleProperty`（类型：`string`），用于存储或配置X坐标坐标轴左侧位置样式属性（默认值：`'left'`）。
     */
    public xAxisLeftStyleProperty?: string = 'left';

    /**
     * Property `yAxisTopStyleProperty` (`string`) storing y axis top style property (default: `'top'`).
     * @zh 属性 `yAxisTopStyleProperty`（类型：`string`），用于存储或配置Y坐标坐标轴顶部位置样式属性（默认值：`'top'`）。
     */
    public yAxisTopStyleProperty?: string = 'top';

    /**
     * Creates an instance of `DragStrategyByAxisProperties` and initializes its dependencies and internal state.
     * @zh 创建 `DragStrategyByAxisProperties` 实例，并初始化其依赖项与内部状态。
     * @param params - Injected or initial params (`ɵInvertedKeysOfType<DragStrategyByAxisProperties, ɵDragStrat...`) / 注入或传入的参数集合（`ɵInvertedKeysOfType<DragStrategyByAxisProperties, ɵDragStrat...`）
     */
    constructor(params?: ɵInvertedKeysOfType<DragStrategyByAxisProperties, ɵDragStrategyEnum>) {
        Object.assign(this, params);
    }
}
