/**
 * @fileoverview Module `src/ux/windows/drag-and-drop/classes/drag-strategy/drag-strategy.factory.ts` providing drag strategy factory definitions and implementation.
 * @zh 模块文件 `src/ux/windows/drag-and-drop/classes/drag-strategy/drag-strategy.factory.ts`，提供拖拽策略工厂相关的定义与实现。
 */

import { DraggableDirective } from '../../directives/draggable.directive';
import { ɵDragStrategyEnum } from '../../enums';
import { DragStrategyType } from '../../types';
import { ɵBaseDragStrategyImpl } from './base-drag-impl.strategy';
import { ɵDragStrategyByAxisPropertiesImpl } from './by-axis-properties-drag-impl.strategy';
import { ɵDragStrategyByTranslate3dImpl } from './by-translate3d-drag-impl.strategy';


/**
 * Class `ɵDragStrategyFactory` encapsulating ɵdrag strategy factory data structures and logic in `src/ux/windows/drag-and-drop/classes/drag-strategy`.
 * @zh 类 `ɵDragStrategyFactory`，封装 `src/ux/windows/drag-and-drop/classes/drag-strategy` 中的ɵDrag策略工厂数据结构与处理逻辑。
 */
export abstract class ɵDragStrategyFactory {
    /**
     * Executes `create` to handle create.
     * @zh 执行 `create`，用于创建。
     * @param strategyConfig - strategy config parameter (`DragStrategyType`) / 策略配置参数（`DragStrategyType`）
     * @param context - context parameter (`DraggableDirective`) / 上下文参数（`DraggableDirective`）
     * @returns Result of type `ɵBaseDragStrategyImpl` / 类型为 `ɵBaseDragStrategyImpl` 的返回值
     */
    public static create(
        strategyConfig: DragStrategyType,
        context: DraggableDirective
    ): ɵBaseDragStrategyImpl {
        switch (strategyConfig.type) {
            case ɵDragStrategyEnum.ByAxisProperties:
                return new ɵDragStrategyByAxisPropertiesImpl(context);
            case ɵDragStrategyEnum.ByTranslate3d:
                return new ɵDragStrategyByTranslate3dImpl(context);
            default:
                throw new Error(
                    `Incorrect type of strategyConfig. ` +
                    `Can't create strategy implementation instance!`
                );
        }
    }

    /**
     * Executes `isDifferent` to handle is different.
     * @zh 执行 `isDifferent`，用于是否为Different。
     * @param newStrategyConfig - new strategy config parameter (`DragStrategyType`) / 新策略配置参数（`DragStrategyType`）
     * @param context - context parameter (`DraggableDirective`) / 上下文参数（`DraggableDirective`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    public static isDifferent(
        newStrategyConfig: DragStrategyType,
        context: DraggableDirective
    ): boolean {
        return (context.strategy?.type !== newStrategyConfig.type);
    }
}
