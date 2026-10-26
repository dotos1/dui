/**
 * @fileoverview Module `src/container/dock-layout/controls/drop-target-indicator.ts` providing drop target indicator definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/controls/drop-target-indicator.ts`，提供放置目标指示器相关的定义与实现。
 */

import { DomConstants } from '../utils/dom-constants';
import { AreaLinkedRect } from '../utils/types';
import { numberToPixels, setElementDisplayVisibility } from '../utils/utils';

/**
 * Class `DropTargetIndicator` encapsulating drop target indicator data structures and logic in `src/container/dock-layout/controls`.
 * @internal
 * @zh 类 `DropTargetIndicator`，封装 `src/container/dock-layout/controls` 中的放置目标指示器数据结构与处理逻辑。
 */
export class DropTargetIndicator {
    /**
     * Property `_element` (`HTMLElement`) storing element.
     * @zh 属性 `_element`（类型：`HTMLElement`），用于存储或配置元素。
     */
    private _element: HTMLElement;

    /**
     * Creates an instance of `DropTargetIndicator` and initializes its dependencies and internal state.
     * @zh 创建 `DropTargetIndicator` 实例，并初始化其依赖项与内部状态。
     */
    constructor() {
        // Maybe use container instead of Document Body?
        this._element = document.createElement('div');
        this._element.classList.add(DomConstants.ClassName.DropTargetIndicator);
        const innerElement = document.createElement('div');
        innerElement.classList.add(DomConstants.ClassName.Inner);
        this._element.appendChild(innerElement);

        document.body.appendChild(this._element);
    }

    /**
     * Executes `destroy` to handle destroy.
     * @zh 执行 `destroy`，用于销毁。
     */
    destroy(): void {
        this._element.remove();
    }

    /**
     * Executes `highlightArea` to handle highlight area.
     * @zh 执行 `highlightArea`，用于highlight区域。
     * @param area - area parameter (`AreaLinkedRect`) / 区域参数（`AreaLinkedRect`）
     * @param margin - margin parameter (`number`) / 外边距参数（`number`）
     */
    highlightArea(area: AreaLinkedRect, margin: number): void {
        this._element.style.left = numberToPixels(area.x1 + margin);
        this._element.style.top = numberToPixels(area.y1 + margin);
        this._element.style.width = numberToPixels(area.x2 - area.x1 - margin);
        this._element.style.height = numberToPixels(area.y2 - area.y1 - margin);
        this._element.style.display = 'block';
    }

    /**
     * Executes `hide` to handle hide.
     * @zh 执行 `hide`，用于隐藏。
     */
    hide(): void {
        setElementDisplayVisibility(this._element, false);
    }
}
