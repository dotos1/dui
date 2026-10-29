/**
 * @fileoverview Module `src/container/dock-layout/controls/tab.ts` providing tab definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/controls/tab.ts`，提供选项卡相关的定义与实现。
 */

import { UnexpectedUndefinedError } from '../errors/internal-error';
import { ComponentItem } from '../items/component-item';
import { LayoutManager } from '../layout-manager';
import { DomConstants } from '../utils/dom-constants';
import { DragListener } from '../utils/drag-listener';

/**
 * Represents an individual tab within a Stack's header
 * @public

 * @zh 类 `Tab`，封装 `src/container/dock-layout/controls` 中的选项卡数据结构与处理逻辑。
 */
export class Tab {
    /**
     * Property `_element` (`HTMLDivElement`) storing element.
     * @internal
     * @zh 属性 `_element`（类型：`HTMLDivElement`），用于存储或配置元素。
     */
    private readonly _element: HTMLDivElement;
    /**
     * Property `_titleElement` (`HTMLSpanElement`) storing title element.
     * @internal
     * @zh 属性 `_titleElement`（类型：`HTMLSpanElement`），用于存储或配置标题元素。
     */
    private readonly _titleElement: HTMLSpanElement;
    /**
     * Property `_closeElement` (`HTMLDivElement`) storing close element.
     * @internal
     * @zh 属性 `_closeElement`（类型：`HTMLDivElement`），用于存储或配置关闭元素。
     */
    private readonly _closeElement: HTMLDivElement | undefined;

    /**
     * Property `_dragListener` (`DragListener`) storing drag listener.
     * @internal
     * @zh 属性 `_dragListener`（类型：`DragListener`），用于存储或配置拖拽监听器。
     */
    private _dragListener: DragListener | undefined;
    /**
     * Property `_isActive` (`boolean`) storing is active (default: `false`).
     * @internal
     * @zh 属性 `_isActive`（类型：`boolean`），用于存储或配置是否为激活（默认值：`false`）。
     */
    private _isActive = false;

    /**
     * Property `_tabClickListener` (`(ev: MouseEvent) => void`) storing tab click listener.
     * @internal
     * @zh 属性 `_tabClickListener`（类型：`(ev: MouseEvent) => void`），用于存储或配置选项卡点击监听器。
     */
    private readonly _tabClickListener = (ev: MouseEvent) => this.onTabClickDown(ev);
    /**
     * Property `_tabTouchStartListener` (`(ev: TouchEvent) => void`) storing tab touch start listener.
     * @internal
     * @zh 属性 `_tabTouchStartListener`（类型：`(ev: TouchEvent) => void`），用于存储或配置选项卡触摸开始监听器。
     */
    private readonly _tabTouchStartListener = (ev: TouchEvent) => this.onTabTouchStart(ev);
    /**
     * Property `_closeClickListener` (`() => void`) storing close click listener (default: `() => this.onCloseClick()`).
     * @internal
     * @zh 属性 `_closeClickListener`（类型：`() => void`），用于存储或配置关闭点击监听器（默认值：`() => this.onCloseClick()`）。
     */
    private readonly _closeClickListener = () => this.onCloseClick();
    /**
     * Property `_closeTouchStartListener` (`() => void`) storing close touch start listener (default: `() => this.onCloseTouchStart()`).
     * @internal
     * @zh 属性 `_closeTouchStartListener`（类型：`() => void`），用于存储或配置关闭触摸开始监听器（默认值：`() => this.onCloseTouchStart()`）。
     */
    private readonly _closeTouchStartListener = () => this.onCloseTouchStart();
    // /** @internal */
    // private readonly _closeMouseDownListener = () => this.onCloseMousedown();
    /**
     * Property `_dragStartListener` (`(x: number, y: number) => void`) storing drag start listener.
     * @internal
     * @zh 属性 `_dragStartListener`（类型：`(x: number, y: number) => void`），用于存储或配置拖拽开始监听器。
     */
    private readonly _dragStartListener = (x: number, y: number) => this.onDragStart(x, y);
    /**
     * Property `_contentItemDestroyListener` (`() => void`) storing content item destroy listener (default: `() => this.onContentItemDestroy()`).
     * @internal
     * @zh 属性 `_contentItemDestroyListener`（类型：`() => void`），用于存储或配置内容条目销毁监听器（默认值：`() => this.onContentItemDestroy()`）。
     */
    private readonly _contentItemDestroyListener = () => this.onContentItemDestroy();
    /**
     * Property `_tabTitleChangedListener` (`(title: string) => void`) storing tab title changed listener (default: `(title: string) => this.setTitle(title)`).
     * @internal
     * @zh 属性 `_tabTitleChangedListener`（类型：`(title: string) => void`），用于存储或配置选项卡标题已变更监听器（默认值：`(title: string) => this.setTitle(title)`）。
     */
    private readonly _tabTitleChangedListener = (title: string) => this.setTitle(title)

    /**
     * Gets the current is active (`isActive: boolean`).
     * @zh 获取当前是否为激活（`isActive: boolean`）。
     */
    get isActive(): boolean { return this._isActive; }
    // get header(): Header { return this._header; }
    /**
     * Gets the current component item (`componentItem: ComponentItem`).
     * @zh 获取当前组件条目（`componentItem: ComponentItem`）。
     */
    get componentItem(): ComponentItem { return this._componentItem; }
    /**
     * @deprecated use {@link (Tab:class).componentItem}
     * @zh 获取当前内容条目（`contentItem: ComponentItem`）。
     */
    get contentItem(): ComponentItem { return this._componentItem; }
    /**
     * Gets the current element (`element: HTMLElement`).
     * @zh 获取当前元素（`element: HTMLElement`）。
     */
    get element(): HTMLElement { return this._element; }
    /**
     * Gets the current title element (`titleElement: HTMLElement`).
     * @zh 获取当前标题元素（`titleElement: HTMLElement`）。
     */
    get titleElement(): HTMLElement { return this._titleElement; }
    /**
     * Gets the current close element (`closeElement: HTMLElement | undefined`).
     * @zh 获取当前关闭元素（`closeElement: HTMLElement | undefined`）。
     */
    get closeElement(): HTMLElement | undefined { return this._closeElement; }
    /**
     * Gets the current reorder enabled (`reorderEnabled: boolean`).
     * @zh 获取当前重排已启用（`reorderEnabled: boolean`）。
     */
    get reorderEnabled(): boolean { return this._dragListener !== undefined; }
    /**
     * Sets the reorder enabled (`reorderEnabled`).
     * @zh 设置重排已启用（`reorderEnabled`）。
     * @param value - New reorder enabled value (`boolean`) / 新的重排已启用值（`boolean`）
     */
    set reorderEnabled(value: boolean) {
        if (value !== this.reorderEnabled) {
            if (value) {
                this.enableReorder();
            } else {
                this.disableReorder();
            }
        }
    }

    /**
     * Creates an instance of `Tab` and initializes its dependencies and internal state.
     * @internal
     * @zh 创建 `Tab` 实例，并初始化其依赖项与内部状态。
     */
    constructor(

        private readonly _layoutManager: LayoutManager,

        private _componentItem: ComponentItem,

        private _closeEvent: Tab.CloseEvent | undefined,

        private _focusEvent: Tab.FocusEvent | undefined,

        private _dragStartEvent: Tab.DragStartEvent | undefined
    ) {
        this._element = document.createElement('div');
        this._element.classList.add(DomConstants.ClassName.Tab);
        this._titleElement = document.createElement('span'); 
        this._titleElement.classList.add(DomConstants.ClassName.Title);
        this._closeElement = document.createElement('div'); 
        this._closeElement.classList.add(DomConstants.ClassName.CloseTab);
        // this._closeElement.classList.add(DomConstants.ClassName.MaterialCloseTab);
        // this._closeElement.innerText='close';
   
        this._element.appendChild(this._titleElement);
        this._element.appendChild(this._closeElement);

        if (_componentItem.isClosable) {
            this._closeElement.style.display = '';
        } else {
            this._closeElement.style.display = 'none';
        }

        this.setTitle(_componentItem.title);
        this._componentItem.on('titleChanged', this._tabTitleChangedListener);

        const reorderEnabled = _componentItem.reorderEnabled ?? this._layoutManager.layoutConfig.settings.reorderEnabled;

        if (reorderEnabled) {
            this.enableReorder();
        }

        this._element.addEventListener('click', this._tabClickListener, { passive: true });
        this._element.addEventListener('touchstart', this._tabTouchStartListener, { passive: true });

        if (this._componentItem.isClosable) {
            this._closeElement.addEventListener('click', this._closeClickListener, { passive: true });
            this._closeElement.addEventListener('touchstart', this._closeTouchStartListener, { passive: true });
            // this._closeElement.addEventListener('mousedown', this._closeMouseDownListener, { passive: true });
        } else {
            this._closeElement.remove();
            this._closeElement = undefined;
        }

        this._componentItem.setTab(this);
        this._layoutManager.emit('tabCreated', this);
    }

    /**
     * Executes `setTitle` to handle set title.
     * @zh 执行 `setTitle`，用于集合标题。
     * @param title - title parameter (`string`) / 标题参数（`string`）
     */
    setTitle(title: string): void {
        this._titleElement.innerText = title;
        this._element.title = title;
    }

    /**
     * Executes `setActive` to handle set active.
     * @zh 执行 `setActive`，用于集合激活。
     * @param isActive - is active parameter (`boolean`) / 是否为激活参数（`boolean`）
     */
    setActive(isActive: boolean): void {
        if (isActive === this._isActive) {
            return;
        }
        this._isActive = isActive;

        if (isActive) {
            this._element.classList.add(DomConstants.ClassName.Active);
        } else {
            this._element.classList.remove(DomConstants.ClassName.Active);
        }
    }

    /**
     * Executes `destroy` to handle destroy.
     * @zh 执行 `destroy`，用于销毁。
     */
    destroy(): void {
        this._closeEvent = undefined;
        this._focusEvent = undefined;
        this._dragStartEvent = undefined;
        this._element.removeEventListener('click', this._tabClickListener);
        this._element.removeEventListener('touchstart', this._tabTouchStartListener);
        this._closeElement?.removeEventListener('click', this._closeClickListener);
        this._closeElement?.removeEventListener('touchstart', this._closeTouchStartListener);
        // this._closeElement?.removeEventListener('mousedown', this._closeMouseDownListener);
        this._componentItem.off('titleChanged', this._tabTitleChangedListener);
        if (this.reorderEnabled) {
            this.disableReorder();
        }
        this._element.remove();
    }

    /**
     * Executes `setBlurred` to handle set blurred.
     * @internal
     * @zh 执行 `setBlurred`，用于集合已失焦。
     */
    setBlurred(): void {
        this._element.classList.remove(DomConstants.ClassName.Focused);
        this._titleElement.classList.remove(DomConstants.ClassName.Focused);
    }

    /**
     * Executes `setFocused` to handle set focused.
     * @internal
     * @zh 执行 `setFocused`，用于集合已聚焦。
     */
    setFocused(): void {
        this._element.classList.add(DomConstants.ClassName.Focused);
        this._titleElement.classList.add(DomConstants.ClassName.Focused);
    }

    /**
     * Executes `onDragStart` to handle on drag start.
     * @zh 执行 `onDragStart`，用于当拖拽开始。
     * @param x - x parameter (`number`) / X坐标参数（`number`）
     * @param y - y parameter (`number`) / Y坐标参数（`number`）
     */
    private onDragStart(x: number, y: number): void {
        if (this._dragListener === undefined) {
            throw new UnexpectedUndefinedError('TODSDLU10093');
        } else {
            if (this._dragStartEvent === undefined) {
                throw new UnexpectedUndefinedError('TODS23309');
            } else {
                this._dragStartEvent(x, y, this._dragListener, this.componentItem);
            }
        }

    }

    /**
     * Executes `onContentItemDestroy` to handle on content item destroy.
     * @internal
     * @zh 执行 `onContentItemDestroy`，用于当内容条目销毁。
     */
    private onContentItemDestroy() {
        if (this._dragListener !== undefined) {
            this._dragListener.destroy();
            this._dragListener = undefined;
        }
    }


    /**
     * Executes `onTabClickDown` to handle on tab click down.
     * @zh 执行 `onTabClickDown`，用于当选项卡点击向下。
     * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
     */
    private onTabClickDown(event: MouseEvent) {
        const target = event.target;
        if (target === this._element || target === this._titleElement) {
            // left mouse button
            if (event.button === 0) {
                // event.stopPropagation();
                this.notifyFocus();

                // middle mouse button
            } else if (event.button === 1 && this._componentItem.isClosable) {
                // event.stopPropagation();
                this.notifyClose();
            }
        }
    }

    /**
     * Executes `onTabTouchStart` to handle on tab touch start.
     * @internal
     * @zh 执行 `onTabTouchStart`，用于当选项卡触摸开始。
     */
    private onTabTouchStart(event: TouchEvent) {
        if (event.target === this._element) {
            this.notifyFocus();
        }
    }

    /**
     * Callback when the tab's close button is clicked
     * @internal

     * @zh 执行 `onCloseClick`，用于当关闭点击。
     */
    private onCloseClick() {
        this.notifyClose();
    }

    /**
     * Executes `onCloseTouchStart` to handle on close touch start.
     * @internal
     * @zh 执行 `onCloseTouchStart`，用于当关闭触摸开始。
     */
    private onCloseTouchStart() {
        this.notifyClose();
    }

    /**
     * Callback to capture tab close button mousedown
     * to prevent tab from activating.
     * @internal

     * @zh 执行 `notifyClose`，用于通知关闭。
     */
    // private onCloseMousedown(): void {
    //     // event.stopPropagation();
    // }

    private notifyClose() {
        if (this._closeEvent === undefined) {
            throw new UnexpectedUndefinedError('TNC15007');
        } else {
            this._closeEvent(this._componentItem);
        }
    }

    /**
     * Executes `notifyFocus` to handle notify focus.
     * @internal
     * @zh 执行 `notifyFocus`，用于通知聚焦。
     */
    private notifyFocus() {
        if (this._focusEvent === undefined) {
            throw new UnexpectedUndefinedError('TNA15007');
        } else {
            this._focusEvent(this._componentItem);
        }
    }

    /**
     * Executes `enableReorder` to handle enable reorder.
     * @internal
     * @zh 执行 `enableReorder`，用于启用重排。
     */
    private enableReorder() {
        this._dragListener = new DragListener(this._element, [this._titleElement]);
        this._dragListener.on('dragStart', this._dragStartListener);
        this._componentItem.on('destroy', this._contentItemDestroyListener);
    }

    /**
     * Executes `disableReorder` to handle disable reorder.
     * @internal
     * @zh 执行 `disableReorder`，用于禁用重排。
     */
    private disableReorder() {
        if (this._dragListener === undefined) {
            throw new UnexpectedUndefinedError('TDR87745');
        } else {
            this._componentItem.off('destroy', this._contentItemDestroyListener);
            this._dragListener.off('dragStart', this._dragStartListener);
            this._dragListener = undefined;
        }
    }
}

/** @public */
export namespace Tab {
    /**
     * Type alias `CloseEvent` representing close event (`(componentItem: ComponentItem) => void`).
     * @internal
     * @zh 类型别名 `CloseEvent`，表示关闭事件（`(componentItem: ComponentItem) => void`）。
     */
    export type CloseEvent = (componentItem: ComponentItem) => void;
    /**
     * Type alias `FocusEvent` representing focus event (`(componentItem: ComponentItem) => void`).
     * @internal
     * @zh 类型别名 `FocusEvent`，表示聚焦事件（`(componentItem: ComponentItem) => void`）。
     */
    export type FocusEvent = (componentItem: ComponentItem) => void;
    /**
     * Type alias `DragStartEvent` representing drag start event (`(x: number, y: number, dragListener: DragListener, componentItem: Comp...`).
     * @internal
     * @zh 类型别名 `DragStartEvent`，表示拖拽开始事件（`(x: number, y: number, dragListener: DragListener, componentItem: Comp...`）。
     */
    export type DragStartEvent = (x: number, y: number, dragListener: DragListener, componentItem: ComponentItem) => void;
}
