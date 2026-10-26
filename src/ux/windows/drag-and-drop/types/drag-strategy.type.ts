/**
 * @fileoverview Module `src/ux/windows/drag-and-drop/types/drag-strategy.type.ts` providing drag strategy type definitions and implementation.
 * @zh 模块文件 `src/ux/windows/drag-and-drop/types/drag-strategy.type.ts`，提供拖拽策略类型相关的定义与实现。
 */

import { DragStrategyByAxisProperties, DragStrategyByTranslate3d } from '../classes';

/**
 * Type alias `DragStrategyType` representing drag strategy type (`DragStrategyByTranslate3d | DragStrategyByAxisProperties`).
 * @zh 类型别名 `DragStrategyType`，表示拖拽策略类型（`DragStrategyByTranslate3d | DragStrategyByAxisProperties`）。
 */
export type DragStrategyType =
    DragStrategyByTranslate3d | DragStrategyByAxisProperties;
