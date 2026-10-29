/**
 * @fileoverview Module `src/container/dock-layout/controls/transition-indicator.ts` providing transition indicator definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/controls/transition-indicator.ts`，提供过渡动画指示器相关的定义与实现。
 */

import { DomConstants } from '../utils/dom-constants';
import { Rect } from '../utils/types';

/**
 * @internal @deprecated To be removed
 * @zh 类 `TransitionIndicator`，封装 `src/container/dock-layout/controls` 中的过渡动画指示器数据结构与处理逻辑。
 */
export class TransitionIndicator {
    /**
     * Property `_element` (`HTMLElement`) storing element.
     * @zh 属性 `_element`（类型：`HTMLElement`），用于存储或配置元素。
     */
    private _element: HTMLElement;
    /**
     * Property `_toElement` (`HTMLElement`) storing to element.
     * @zh 属性 `_toElement`（类型：`HTMLElement`），用于存储或配置转换为元素。
     */
    private _toElement: HTMLElement | null;
    /**
     * Property `_fromDimensions` (`null`) storing from dimensions.
     * @zh 属性 `_fromDimensions`（类型：`null`），用于存储或配置从维度列表。
     */
    private _fromDimensions: null;
    /**
     * Property `_totalAnimationDuration` (`number`) storing total animation duration.
     * @zh 属性 `_totalAnimationDuration`（类型：`number`），用于存储或配置总计动画持续时间。
     */
    private _totalAnimationDuration: number;
    /**
     * Property `_animationStartTime` (`number`) storing animation start time.
     * @zh 属性 `_animationStartTime`（类型：`number`），用于存储或配置动画开始时间。
     */
    private _animationStartTime: number | null;

    /**
     * Creates an instance of `TransitionIndicator` and initializes its dependencies and internal state.
     * @zh 创建 `TransitionIndicator` 实例，并初始化其依赖项与内部状态。
     */
    constructor() {
        this._element = document.createElement('div');
        this._element.classList.add(DomConstants.ClassName.TransitionIndicator);
        document.body.appendChild(this._element);

        this._toElement = null;
        this._fromDimensions = null;
        this._totalAnimationDuration = 200;
        this._animationStartTime = null;
    }

    /**
     * Executes `destroy` to handle destroy.
     * @zh 执行 `destroy`，用于销毁。
     */
    destroy(): void {
        this._element.remove();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    /**
     * Executes `transitionElements` to handle transition elements.
     * @zh 执行 `transitionElements`，用于过渡动画元素列表。
     * @param fromElement - from element parameter (`HTMLElement`) / 从元素参数（`HTMLElement`）
     * @param toElement - to element parameter (`HTMLElement`) / 转换为元素参数（`HTMLElement`）
     */
    transitionElements(fromElement: HTMLElement, toElement: HTMLElement): void {
        /**
         * TODO - This is not quite as cool as expected. Review.
         */
        return;
        // this._toElement = toElement;
        // this._animationStartTime = now();
        // this._fromDimensions = this._measure(fromElement);
        // this._fromDimensions.opacity = 0.8;
        // this._element.show().css(this._fromDimensions);
        // animFrame(fnBind(this._nextAnimationFrame, this));
    }

    /**
     * Executes `nextAnimationFrame` to handle next animation frame.
     * @zh 执行 `nextAnimationFrame`，用于下一个动画框架。
     */
    private nextAnimationFrame(): void {
        // if (this._toElement === null || this._fromDimensions === null || this._animationStartTime === null) {
        //     throw new UnexpectedNullError('TINAFTD97115');
        // } else {
        //     const toDimensions = this.measure(this._toElement);
        //     const animationProgress = (now() - this._animationStartTime) / this._totalAnimationDuration;
        //     const currentFrameStyles = {};
        //     const cssProperty;

        //     if (animationProgress >= 1) {
        //         this._element.style.display = 'none';
        //         return;
        //     }

        //     toDimensions.opacity = 0;

        //     for (const cssProperty in this._fromDimensions) {
        //         currentFrameStyles[cssProperty] = this._fromDimensions[cssProperty] +
        //             (toDimensions[cssProperty] - this._fromDimensions[cssProperty]) *
        //             animationProgress;
        //     }

        //     this._element.css(currentFrameStyles);
        //     animFrame(fnBind(this._nextAnimationFrame, this));
        // }
    }

    /**
     * Executes `measure` to handle measure.
     * @zh 执行 `measure`，用于度量。
     * @param element - element parameter (`HTMLElement`) / 元素参数（`HTMLElement`）
     * @returns Result of type `Rect` / 类型为 `Rect` 的返回值
     */
    private measure(element: HTMLElement): Rect {
        const rect = element.getBoundingClientRect();

        return {
            left: rect.left,
            top: rect.top,
            width: element.offsetWidth,
            height: element.offsetHeight,
        };
    }
}
