/**
 * @fileoverview Module `src/ux/windows/drag-and-drop/interfaces/dragger-config.interface.ts` providing dragger config interface definitions and implementation.
 * @zh 模块文件 `src/ux/windows/drag-and-drop/interfaces/dragger-config.interface.ts`，提供dragger配置interface相关的定义与实现。
 */


import { MouseButtonEnum } from '../../core/enums/mouse-button.enum';
import { DragInfo } from '../interfaces';
import { DragStrategyType } from '../types';


/**
 * Interface `DraggerConfig` defining the contract and properties for dragger config.
 * @zh 接口 `DraggerConfig`，定义Dragger配置的数据结构契约与属性规范。
 */
export interface DraggerConfig {
    /**
     * Is dragging enabled
     * @zh 属性 `isEnabled`（类型：`boolean`），用于存储或配置是否为已启用。
     */
    isEnabled?: boolean;
    /**
     * The target element by dragging which the dragging of `movableElement` will take place
     * @zh 属性 `draggableElement`（类型：`HTMLElement`），用于存储或配置是否可拖拽元素。
     */
    draggableElement?: HTMLElement;
    /**
     * The target element will be moving as a result of dragging by `draggableElement`.
     * @zh 属性 `movableElement`（类型：`HTMLElement`），用于存储或配置是否可移动元素。
     */
    movableElement?: HTMLElement;
    /**
     * Child elements by trying dragging which, prevent dragging process.
     *
     * Prevents dragging if some of those element contain in `mouseEvent.target`
     *
     * @zh 属性 `childElementsBlackList`（类型：`HTMLElement[]`），用于存储或配置子级元素列表Black列表。
     */
    childElementsBlackList?: HTMLElement[];
    /**
     * Mouse buttons by using which dragging allowed
     * @zh 属性 `allowedMouseButtons`（类型：`MouseButtonEnum[]`），用于存储或配置允许的鼠标按钮。
     */
    allowedMouseButtons?: MouseButtonEnum[];
    /**
     * Offset relative to the cursor by X-Axis when dragging
     * @zh 属性 `shiftX`（类型：`number`），用于存储或配置移出首项X坐标。
     */
    shiftX?: number;
    /**
     * Offset relative to the cursor by Y-Axis when dragging
     * @zh 属性 `shiftY`（类型：`number`），用于存储或配置移出首项Y坐标。
     */
    shiftY?: number;
    /**
     * Dragging strategy. Different strategy affects element in a different way
     * @zh 属性 `strategy`（类型：`DragStrategyType`），用于存储或配置策略。
     */
    strategy?: DragStrategyType;
    /**
     * Should directive move movable element?
     * @zh 属性 `isAllowMoveElement`（类型：`boolean`），用于存储或配置是否为允许移动元素。
     */
    isAllowMoveElement?: boolean;
    /**
     * Handler for custom logic implementation for mousemove
     * @zh 属性 `mouseMoveHandler`（类型：`(event: DragInfo) => void`），用于存储或配置鼠标移动处理器。
     */
    mouseMoveHandler?: (event: DragInfo) => void;

    /**
     * Property `maxX` (`number`) storing max x.
     * @zh 属性 `maxX`（类型：`number`），用于存储或配置最大值X坐标。
     */
    maxX?: number;

    /**
     * Property `maxY` (`number`) storing max y.
     * @zh 属性 `maxY`（类型：`number`），用于存储或配置最大值Y坐标。
     */
    maxY?: number;
}
