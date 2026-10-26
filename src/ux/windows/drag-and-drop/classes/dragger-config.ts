/**
 * @fileoverview Module `src/ux/windows/drag-and-drop/classes/dragger-config.ts` providing dragger config definitions and implementation.
 * @zh 模块文件 `src/ux/windows/drag-and-drop/classes/dragger-config.ts`，提供dragger配置相关的定义与实现。
 */


import { MouseButtonEnum } from '../../core/enums/mouse-button.enum';
import { DraggerConfig, DragInfo } from '../interfaces';
import { DragStrategyType } from '../types';
import { DragStrategyByTranslate3d } from './drag-strategy';


/**
 * Class `ɵDraggerConfigModel` encapsulating ɵdragger config model data structures and logic in `src/ux/windows/drag-and-drop/classes`.
 * @zh 类 `ɵDraggerConfigModel`，封装 `src/ux/windows/drag-and-drop/classes` 中的ɵDragger配置模型数据结构与处理逻辑。
 */
export class ɵDraggerConfigModel implements DraggerConfig {
    /**
     * Property `draggableElement` (`HTMLElement`) storing draggable element.
     * @zh 属性 `draggableElement`（类型：`HTMLElement`），用于存储或配置是否可拖拽元素。
     */
    public draggableElement?: HTMLElement;
    /**
     * Property `movableElement` (`HTMLElement`) storing movable element.
     * @zh 属性 `movableElement`（类型：`HTMLElement`），用于存储或配置是否可移动元素。
     */
    public movableElement?: HTMLElement;
    /**
     * Property `childElementsBlackList` (`HTMLElement[]`) storing child elements black list (default: `[]`).
     * @zh 属性 `childElementsBlackList`（类型：`HTMLElement[]`），用于存储或配置子级元素列表Black列表（默认值：`[]`）。
     */
    public childElementsBlackList?: HTMLElement[] = [];
    /**
     * Property `allowedMouseButtons` (`MouseButtonEnum[]`) storing allowed mouse buttons (default: `[MouseButtonEnum.Left]`).
     * @zh 属性 `allowedMouseButtons`（类型：`MouseButtonEnum[]`），用于存储或配置允许的鼠标按钮（默认值：`[MouseButtonEnum.Left]`）。
     */
    public allowedMouseButtons?: MouseButtonEnum[] = [MouseButtonEnum.Left];
    /**
     * Property `shiftX` (`number`) storing shift x.
     * @zh 属性 `shiftX`（类型：`number`），用于存储或配置移出首项X坐标。
     */
    public shiftX?: number;
    /**
     * Property `shiftY` (`number`) storing shift y.
     * @zh 属性 `shiftY`（类型：`number`），用于存储或配置移出首项Y坐标。
     */
    public shiftY?: number;
    /**
     * Property `strategy` (`DragStrategyType`) storing strategy (default: `new DragStrategyByTranslate3d()`).
     * @zh 属性 `strategy`（类型：`DragStrategyType`），用于存储或配置策略（默认值：`new DragStrategyByTranslate3d()`）。
     */
    public strategy?: DragStrategyType = new DragStrategyByTranslate3d();
    /**
     * Property `isEnabled` (`boolean`) storing is enabled (default: `true`).
     * @zh 属性 `isEnabled`（类型：`boolean`），用于存储或配置是否为已启用（默认值：`true`）。
     */
    public isEnabled?: boolean = true;
    /**
     * Property `isAllowMoveElement` (`boolean`) storing is allow move element (default: `true`).
     * @zh 属性 `isAllowMoveElement`（类型：`boolean`），用于存储或配置是否为允许移动元素（默认值：`true`）。
     */
    public isAllowMoveElement?: boolean = true;
    /**
     * Property `mouseMoveHandler` (`(event: DragInfo) => void`) storing mouse move handler.
     * @zh 属性 `mouseMoveHandler`（类型：`(event: DragInfo) => void`），用于存储或配置鼠标移动处理器。
     */
    public mouseMoveHandler?: (event: DragInfo) => void;
}
