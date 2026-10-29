/**
 * @fileoverview Module `src/container/dock-layout/controls/header-button.ts` providing header button definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/controls/header-button.ts`，提供表头按钮相关的定义与实现。
 */

import { Header } from './header';

/**
 * Class `HeaderButton` encapsulating header button data structures and logic in `src/container/dock-layout/controls`.
 * @internal
 * @zh 类 `HeaderButton`，封装 `src/container/dock-layout/controls` 中的表头按钮数据结构与处理逻辑。
 */
export class HeaderButton {
    /**
     * Property `_element` (`HTMLElement`) storing element.
     * @zh 属性 `_element`（类型：`HTMLElement`），用于存储或配置元素。
     */
    private _element: HTMLElement;
    /**
     * Property `_clickEventListener` (`(ev: MouseEvent) => void`) storing click event listener (default: `(ev: MouseEvent) => this.onClick(ev)`).
     * @zh 属性 `_clickEventListener`（类型：`(ev: MouseEvent) => void`），用于存储或配置点击事件监听器（默认值：`(ev: MouseEvent) => this.onClick(ev)`）。
     */
    private _clickEventListener = (ev: MouseEvent) => this.onClick(ev);
    /**
     * Property `_touchStartEventListener` (`(ev: TouchEvent) => void`) storing touch start event listener.
     * @zh 属性 `_touchStartEventListener`（类型：`(ev: TouchEvent) => void`），用于存储或配置触摸开始事件监听器。
     */
    private _touchStartEventListener = (ev: TouchEvent) => this.onTouchStart(ev);

    /**
     * Gets the current element (`element: HTMLElement`).
     * @zh 获取当前元素（`element: HTMLElement`）。
     */
    get element(): HTMLElement { return this._element; }

    /**
     * Creates an instance of `HeaderButton` and initializes its dependencies and internal state.
     * @zh 创建 `HeaderButton` 实例，并初始化其依赖项与内部状态。
     * @param _header - Injected or initial header (`Header`) / 注入或传入的表头（`Header`）
     * @param label - Injected or initial label (`string`) / 注入或传入的标签（`string`）
     * @param cssClass - Injected or initial css class (`string`) / 注入或传入的CSS样式类名（`string`）
     * @param _pushEvent - Injected or initial push event (`HeaderButton.PushEvent`) / 注入或传入的推入事件（`HeaderButton.PushEvent`）
     */
    constructor(private _header: Header, label: string, cssClass: string, private _pushEvent: HeaderButton.PushEvent) {
        this._element = document.createElement('div');
        this._element.classList.add(cssClass);
        this._element.title = label;
        this._header.on('destroy', () => this.destroy());
        this._element.addEventListener('click', this._clickEventListener, { passive: true });
        this._element.addEventListener('touchstart', this._touchStartEventListener, { passive: true });
        this._header.controlsContainerElement.appendChild(this._element);
    }

    /**
     * Executes `destroy` to handle destroy.
     * @zh 执行 `destroy`，用于销毁。
     */
    destroy(): void {
        this._element.removeEventListener('click', this._clickEventListener);
        this._element.removeEventListener('touchstart', this._touchStartEventListener);
        this._element.parentNode?.removeChild(this._element);
    }

    /**
     * Executes `onClick` to handle on click.
     * @zh 执行 `onClick`，用于当点击。
     * @param ev - ev parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
     */
    private onClick(ev: MouseEvent) {
        this._pushEvent(ev);
    }

    /**
     * Executes `onTouchStart` to handle on touch start.
     * @zh 执行 `onTouchStart`，用于当触摸开始。
     * @param ev - ev parameter (`TouchEvent`) / 事件参数（`TouchEvent`）
     */
    private onTouchStart(ev: TouchEvent) {
        this._pushEvent(ev);
    }
}

/** @internal */
export namespace HeaderButton {
    /**
     * Type alias `PushEvent` representing push event (`(this: void, ev: Event) => void`).
     * @zh 类型别名 `PushEvent`，表示推入事件（`(this: void, ev: Event) => void`）。
     */
    export type PushEvent = (this: void, ev: Event) => void;
}
