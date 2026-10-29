/**
 * @fileoverview Module `src/container/dock-layout/controls/header.ts` providing header definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/controls/header.ts`，提供表头相关的定义与实现。
 */

import { UnexpectedUndefinedError } from '../errors/internal-error';
import { ComponentItem } from '../items/component-item';
import { Stack } from '../items/stack';
import { LayoutManager } from '../layout-manager';
import { DomConstants } from '../utils/dom-constants';
import { DragListener } from '../utils/drag-listener';
import { EventEmitter } from '../utils/event-emitter';
import { Side } from '../utils/types';
import { numberToPixels, setElementDisplayVisibility } from '../utils/utils';
import { HeaderButton } from './header-button';
import { Tab } from './tab';
import { TabsContainer } from './tabs-container';

/**
 * This class represents a header above a Stack ContentItem.
 * @public

 * @zh 类 `Header`，封装 `src/container/dock-layout/controls` 中的表头数据结构与处理逻辑。
 */
export class Header extends EventEmitter {
    /**
     * Property `_tabsContainer` (`TabsContainer`) storing tabs container.
     * @internal
     * @zh 属性 `_tabsContainer`（类型：`TabsContainer`），用于存储或配置选项卡组容器。
     */
    private readonly _tabsContainer: TabsContainer;
    /**
     * Property `_element` (`HTMLElement`) storing element.
     * @internal
     * @zh 属性 `_element`（类型：`HTMLElement`），用于存储或配置元素。
     */
    private readonly _element: HTMLElement;
    /**
     * Property `_controlsContainerElement` (`HTMLElement`) storing controls container element.
     * @internal
     * @zh 属性 `_controlsContainerElement`（类型：`HTMLElement`），用于存储或配置控件集合容器元素。
     */
    private readonly _controlsContainerElement: HTMLElement;

    /**
     * Property `_show` (`boolean`) storing show.
     * @internal
     * @zh 属性 `_show`（类型：`boolean`），用于存储或配置显示。
     */
    private readonly _show: boolean;
    /**
     * Property `_popoutEnabled` (`boolean`) storing popout enabled.
     * @internal
     * @zh 属性 `_popoutEnabled`（类型：`boolean`），用于存储或配置弹出窗口已启用。
     */
    private readonly _popoutEnabled: boolean;
    /**
     * Property `_popoutLabel` (`string`) storing popout label.
     * @internal
     * @zh 属性 `_popoutLabel`（类型：`string`），用于存储或配置弹出窗口标签。
     */
    private readonly _popoutLabel: string;
    /**
     * Property `_maximiseEnabled` (`boolean`) storing maximise enabled.
     * @internal
     * @zh 属性 `_maximiseEnabled`（类型：`boolean`），用于存储或配置最大化已启用。
     */
    private readonly _maximiseEnabled: boolean;
    /**
     * Property `_maximiseLabel` (`string`) storing maximise label.
     * @internal
     * @zh 属性 `_maximiseLabel`（类型：`string`），用于存储或配置最大化标签。
     */
    private readonly _maximiseLabel: string;
    /**
     * Property `_minimiseEnabled` (`boolean`) storing minimise enabled.
     * @internal
     * @zh 属性 `_minimiseEnabled`（类型：`boolean`），用于存储或配置minimise已启用。
     */
    private readonly _minimiseEnabled: boolean;
    /**
     * Property `_minimiseLabel` (`string`) storing minimise label.
     * @internal
     * @zh 属性 `_minimiseLabel`（类型：`string`），用于存储或配置minimise标签。
     */
    private readonly _minimiseLabel: string;
    /**
     * Property `_closeEnabled` (`boolean`) storing close enabled.
     * @internal
     * @zh 属性 `_closeEnabled`（类型：`boolean`），用于存储或配置关闭已启用。
     */
    private readonly _closeEnabled: boolean;
    /**
     * Property `_closeLabel` (`string`) storing close label.
     * @internal
     * @zh 属性 `_closeLabel`（类型：`string`），用于存储或配置关闭标签。
     */
    private readonly _closeLabel: string;
    /**
     * Property `_tabDropdownEnabled` (`boolean`) storing tab dropdown enabled.
     * @internal
     * @zh 属性 `_tabDropdownEnabled`（类型：`boolean`），用于存储或配置选项卡下拉框已启用。
     */
    private readonly _tabDropdownEnabled: boolean;
    /**
     * Property `_tabDropdownLabel` (`string`) storing tab dropdown label.
     * @internal
     * @zh 属性 `_tabDropdownLabel`（类型：`string`），用于存储或配置选项卡下拉框标签。
     */
    private readonly _tabDropdownLabel: string;

    /**
     * Property `_tabControlOffset` (`number`) storing tab control offset.
     * @internal
     * @zh 属性 `_tabControlOffset`（类型：`number`），用于存储或配置选项卡表单控件偏移量。
     */
    private readonly _tabControlOffset: number;

    /**
     * Property `_clickListener` (`(ev: MouseEvent) => void`) storing click listener (default: `(ev: MouseEvent) => this.onClick(ev)`).
     * @internal
     * @zh 属性 `_clickListener`（类型：`(ev: MouseEvent) => void`），用于存储或配置点击监听器（默认值：`(ev: MouseEvent) => this.onClick(ev)`）。
     */
    private readonly _clickListener = (ev: MouseEvent) => this.onClick(ev);
    /**
     * Property `_touchStartListener` (`(ev: TouchEvent) => void`) storing touch start listener.
     * @internal
     * @zh 属性 `_touchStartListener`（类型：`(ev: TouchEvent) => void`），用于存储或配置触摸开始监听器。
     */
    private readonly _touchStartListener = (ev: TouchEvent) => this.onTouchStart(ev);
    /**
     * Property `_documentMouseUpListener` (`(this: void) => void`) storing document mouse up listener.
     * @internal
     * @zh 属性 `_documentMouseUpListener`（类型：`(this: void) => void`），用于存储或配置文档对象鼠标向上监听器。
     */
    private readonly _documentMouseUpListener: (this: void) => void;

    /**
     * Property `_rowColumnClosable` (`boolean`) storing row column closable (default: `true`).
     * @internal
     * @zh 属性 `_rowColumnClosable`（类型：`boolean`），用于存储或配置行列是否可关闭（默认值：`true`）。
     */
    private _rowColumnClosable = true;
    /**
     * Property `_canRemoveComponent` (`boolean`) storing can remove component.
     * @internal
     * @zh 属性 `_canRemoveComponent`（类型：`boolean`），用于存储或配置是否可以移除组件。
     */
    private _canRemoveComponent: boolean;
    /**
     * Property `_side` (`Side`) storing side.
     * @internal
     * @zh 属性 `_side`（类型：`Side`），用于存储或配置side。
     */
    private _side: Side;
    /**
     * Property `_leftRightSided` (`boolean`) storing left right sided.
     * @internal
     * @zh 属性 `_leftRightSided`（类型：`boolean`），用于存储或配置左侧位置右侧位置Sided。
     */
    private _leftRightSided: boolean;
    /**
     * Property `_closeButton` (`HeaderButton`) storing close button (default: `null`).
     * @internal
     * @zh 属性 `_closeButton`（类型：`HeaderButton`），用于存储或配置关闭按钮（默认值：`null`）。
     */
    private readonly _closeButton: HeaderButton | null = null;
    /**
     * Property `_popoutButton` (`HeaderButton`) storing popout button (default: `null`).
     * @internal
     * @zh 属性 `_popoutButton`（类型：`HeaderButton`），用于存储或配置弹出窗口按钮（默认值：`null`）。
     */
    private readonly _popoutButton: HeaderButton | null = null;
    /**
     * Property `_tabDropdownButton` (`HeaderButton`) storing tab dropdown button.
     * @internal
     * @zh 属性 `_tabDropdownButton`（类型：`HeaderButton`），用于存储或配置选项卡下拉框按钮。
     */
    private readonly _tabDropdownButton: HeaderButton;
    /**
     * Property `_maximiseButton` (`HeaderButton`) storing maximise button.
     * @internal
     * @zh 属性 `_maximiseButton`（类型：`HeaderButton`），用于存储或配置最大化按钮。
     */
    private readonly _maximiseButton: HeaderButton | undefined;
    // /** @internal */
    // private _activeComponentItem: ComponentItem | null = null; // only used to identify active tab

    /**
     * Gets the current show (`show: boolean`).
     * @zh 获取当前显示（`show: boolean`）。
     */
    get show(): boolean { return this._show; }
    /**
     * Gets the current side (`side: Side`).
     * @zh 获取当前side（`side: Side`）。
     */
    get side(): Side { return this._side; }
    /**
     * Gets the current left right sided (`leftRightSided: boolean`).
     * @zh 获取当前左侧位置右侧位置Sided（`leftRightSided: boolean`）。
     */
    get leftRightSided(): boolean { return this._leftRightSided; }

    /**
     * Gets the current layout manager (`layoutManager: LayoutManager`).
     * @zh 获取当前布局管理器（`layoutManager: LayoutManager`）。
     */
    get layoutManager(): LayoutManager { return this._layoutManager; }
    /**
     * Gets the current parent (`parent: Stack`).
     * @zh 获取当前父级（`parent: Stack`）。
     */
    get parent(): Stack { return this._parent; }
    /**
     * Gets the current tabs (`tabs: Tab[]`).
     * @zh 获取当前选项卡组（`tabs: Tab[]`）。
     */
    get tabs(): Tab[] { return this._tabsContainer.tabs; }
    /**
     * Gets the current last visible tab index (`lastVisibleTabIndex: number`).
     * @zh 获取当前末尾可见选项卡索引（`lastVisibleTabIndex: number`）。
     */
    get lastVisibleTabIndex(): number { return this._tabsContainer.lastVisibleTabIndex; }

    /**
     * Gets the current element (`element: HTMLElement`).
     * @zh 获取当前元素（`element: HTMLElement`）。
     */
    get element(): HTMLElement { return this._element; }
    /**
     * Gets the current tabs container element (`tabsContainerElement: HTMLElement`).
     * @zh 获取当前选项卡组容器元素（`tabsContainerElement: HTMLElement`）。
     */
    get tabsContainerElement(): HTMLElement { return this._tabsContainer.element; }
    /**
     * Gets the current controls container element (`controlsContainerElement: HTMLElement`).
     * @zh 获取当前控件集合容器元素（`controlsContainerElement: HTMLElement`）。
     */
    get controlsContainerElement(): HTMLElement { return this._controlsContainerElement; }

    /**
     * Creates an instance of `Header` and initializes its dependencies and internal state.
     * @internal
     * @zh 创建 `Header` 实例，并初始化其依赖项与内部状态。
     */
    constructor(
        /** @internal */
        private _layoutManager: LayoutManager,
        /** @internal */
        private _parent: Stack,
        settings: Header.Settings,
        /** @internal */
        private readonly _configClosable: boolean,
        /** @internal */
        private _getActiveComponentItemEvent: Header.GetActiveComponentItemEvent,
        closeEvent: Header.CloseEvent,
        /** @internal */
        private _popoutEvent: Header.PopoutEvent | undefined,
        /** @internal */
        private _maximiseToggleEvent: Header.MaximiseToggleEvent | undefined,
        /** @internal */
        private _clickEvent: Header.ClickEvent | undefined,
        /** @internal */
        private _touchStartEvent: Header.TouchStartEvent | undefined,
        /** @internal */
        private _componentRemoveEvent: Header.ComponentRemoveEvent | undefined,
        /** @internal */
        private _componentFocusEvent: Header.ComponentFocusEvent | undefined,
        /** @internal */
        private _componentDragStartEvent: Header.ComponentDragStartEvent | undefined,
    ) {
        super();

        this._tabsContainer = new TabsContainer(this._layoutManager,
            (item) => this.handleTabInitiatedComponentRemoveEvent(item),
            (item) => this.handleTabInitiatedComponentFocusEvent(item),
            (x, y, dragListener, item) => this.handleTabInitiatedDragStartEvent(x, y, dragListener, item),
            () => this.processTabDropdownActiveChanged(),
        );

        this._show = settings.show;
        this._popoutEnabled = settings.popoutEnabled;
        this._popoutLabel = settings.popoutLabel;
        this._maximiseEnabled = settings.maximiseEnabled;
        this._maximiseLabel = settings.maximiseLabel;
        this._minimiseEnabled = settings.minimiseEnabled;
        this._minimiseLabel = settings.minimiseLabel;
        this._closeEnabled = settings.closeEnabled;
        this._closeLabel = settings.closeLabel;
        this._tabDropdownEnabled = settings.tabDropdownEnabled;
        this._tabDropdownLabel = settings.tabDropdownLabel;
        this.setSide(settings.side);

        this._canRemoveComponent = this._configClosable;

        this._element = document.createElement('section');
        this._element.classList.add(DomConstants.ClassName.Header);
        this._controlsContainerElement = document.createElement('section');
        this._controlsContainerElement.classList.add(DomConstants.ClassName.Controls);
        this._element.appendChild(this._tabsContainer.element);
        this._element.appendChild(this._controlsContainerElement);
        this._element.appendChild(this._tabsContainer.dropdownElement);

        this._element.addEventListener('click', this._clickListener, { passive: true });
        this._element.addEventListener('touchstart', this._touchStartListener, { passive: true });

        this._documentMouseUpListener = () => this._tabsContainer.hideAdditionalTabsDropdown()
        globalThis.document.addEventListener('mouseup', this._documentMouseUpListener, { passive: true });

        this._tabControlOffset = this._layoutManager.layoutConfig.settings.tabControlOffset;

        if (this._tabDropdownEnabled) {
            this._tabDropdownButton = new HeaderButton(this, this._tabDropdownLabel, DomConstants.ClassName.TabDropdown,
                () => this._tabsContainer.showAdditionalTabsDropdown()
            );
        }

        if (this._popoutEnabled) {
            this._popoutButton = new HeaderButton(this, this._popoutLabel, DomConstants.ClassName.Popout, () => this.handleButtonPopoutEvent());
        }

   
        if (this._maximiseEnabled) {
            this._maximiseButton = new HeaderButton(this, this._maximiseLabel, DomConstants.ClassName.Maximise,
                (ev) => this.handleButtonMaximiseToggleEvent(ev)
            );
        }

        /**
         * Close button
         */
        if (this._configClosable) {
            this._closeButton = new HeaderButton(this, this._closeLabel, DomConstants.ClassName.Close, () => closeEvent());
        }

        this.processTabDropdownActiveChanged();
    }

    /**
     * Destroys the entire header
     * @internal

     * @zh 执行 `destroy`，用于销毁。
     */
    destroy(): void {
        this.emit('destroy');

        this._popoutEvent = undefined;
        this._maximiseToggleEvent = undefined;
        this._clickEvent = undefined;
        this._touchStartEvent = undefined;
        this._componentRemoveEvent = undefined;
        this._componentFocusEvent = undefined;
        this._componentDragStartEvent = undefined;

        this._tabsContainer.destroy();

        globalThis.document.removeEventListener('mouseup', this._documentMouseUpListener);
        this._element.remove();
    }

    /**
     * Creates a new tab and associates it with a contentItem
     * @param index - The position of the tab
     * @internal

     * @zh 执行 `createTab`，用于创建选项卡。
     */
    createTab(componentItem: ComponentItem, index: number): void {
        this._tabsContainer.createTab(componentItem, index);
    }

    /**
     * Finds a tab based on the contentItem its associated with and removes it.
     * Cannot remove tab if it has the active ComponentItem
     * @internal

     * @zh 执行 `removeTab`，用于移除选项卡。
     */
    removeTab(componentItem: ComponentItem): void {
        this._tabsContainer.removeTab(componentItem);
    }

    /**
     * Executes `processActiveComponentChanged` to handle process active component changed.
     * @internal
     * @zh 执行 `processActiveComponentChanged`，用于处理激活组件已变更。
     */
    processActiveComponentChanged(newActiveComponentItem: ComponentItem): void {
        this._tabsContainer.processActiveComponentChanged(newActiveComponentItem);
        this.updateTabSizes();
    }

    /**
     * Executes `setSide` to handle set side.
     * @internal
     * @zh 执行 `setSide`，用于集合Side。
     */
    setSide(value: Side): void {
        this._side = value;
        this._leftRightSided = [Side.right, Side.left].includes(this._side);
    }

    /**
     * Programmatically set closability.
     * @param value - Whether to enable/disable closability.
     * @returns Whether the action was successful
     * @internal

     * @zh 执行 `setRowColumnClosable`，用于集合行列是否可关闭。
     */
    setRowColumnClosable(value: boolean): void {
        this._rowColumnClosable = value;
        this.updateClosability();
    }

    /**
     * Updates the header's closability. If a stack/header is able
     * to close, but has a non closable component added to it, the stack is no
     * longer closable until all components are closable.
     * @internal

     * @zh 执行 `updateClosability`，用于更新Closability。
     */
    updateClosability(): void {
        let isClosable: boolean;
        if (!this._configClosable) {
            isClosable = false;
        } else {
            if (!this._rowColumnClosable) {
                isClosable = false;
            } else {
                isClosable = true;
                const len = this.tabs.length;
                for (let i = 0; i < len; i++) {
                    const tab = this._tabsContainer.tabs[i];
                    const item = tab.componentItem;
                    if (!item.isClosable) {
                        isClosable = false;
                        break;
                    }
                }
            }
        }

        if (this._closeButton !== null) {
            setElementDisplayVisibility(this._closeButton.element, isClosable);
        }
        if (this._popoutButton !== null) {
            setElementDisplayVisibility(this._popoutButton.element, isClosable);
        }

        this._canRemoveComponent = isClosable || this._tabsContainer.tabCount > 1;
    }

    /**
     * Executes `applyFocusedValue` to handle apply focused value.
     * @internal
     * @zh 执行 `applyFocusedValue`，用于应用已聚焦值。
     */
    applyFocusedValue(value: boolean): void {
        if (value) {
            this._element.classList.add(DomConstants.ClassName.Focused);
        } else {
            this._element.classList.remove(DomConstants.ClassName.Focused);
        }
    }

    /**
     * Executes `processMaximised` to handle process maximised.
     * @internal
     * @zh 执行 `processMaximised`，用于处理最大化。
     */
    processMaximised(): void {
        if (this._maximiseButton === undefined) {
            throw new UnexpectedUndefinedError('HPMAX16997');
        } else {
            this._maximiseButton.element.setAttribute('title', this._minimiseLabel);
        }
    }

    /**
     * Executes `processMinimised` to handle process minimised.
     * @internal
     * @zh 执行 `processMinimised`，用于处理最小化。
     */
    processMinimised(): void {
        if (this._maximiseButton === undefined) {
            throw new UnexpectedUndefinedError('HPMIN16997');
        } else {
            this._maximiseButton.element.setAttribute('title', this._maximiseLabel);
        }
    }

    /**
     * Pushes the tabs to the tab dropdown if the available space is not sufficient
     * @internal

     * @zh 执行 `updateTabSizes`，用于更新选项卡尺寸列表。
     */
    updateTabSizes(): void {
        if (this._tabsContainer.tabCount > 0) {
            const headerHeight = this._show ? this._layoutManager.layoutConfig.dimensions.headerHeight : 0;

            if (this._leftRightSided) {
                this._element.style.height = '';
                this._element.style.width = numberToPixels(headerHeight);
            } else {
                this._element.style.width = '';
                this._element.style.height = numberToPixels(headerHeight);
            }
            let availableWidth: number;
            if (this._leftRightSided) {
                availableWidth = this._element.offsetHeight - this._controlsContainerElement.offsetHeight - this._tabControlOffset;
            } else {
                availableWidth = this._element.offsetWidth - this._controlsContainerElement.offsetWidth - this._tabControlOffset;
            }

            this._tabsContainer.updateTabSizes(availableWidth, this._getActiveComponentItemEvent());
        }
    }

    /**
     * Executes `handleTabInitiatedComponentRemoveEvent` to handle handle tab initiated component remove event.
     * @internal
     * @zh 执行 `handleTabInitiatedComponentRemoveEvent`，用于连接手柄选项卡Initiated组件移除事件。
     */
    private handleTabInitiatedComponentRemoveEvent(componentItem: ComponentItem) {
        if (this._canRemoveComponent) {
            if (this._componentRemoveEvent === undefined) {
                throw new UnexpectedUndefinedError('HHTCE22294');
            } else {
                this._componentRemoveEvent(componentItem);
            }
        }
    }

    /**
     * Executes `handleTabInitiatedComponentFocusEvent` to handle handle tab initiated component focus event.
     * @internal
     * @zh 执行 `handleTabInitiatedComponentFocusEvent`，用于连接手柄选项卡Initiated组件聚焦事件。
     */
    private handleTabInitiatedComponentFocusEvent(componentItem: ComponentItem) {
        if (this._componentFocusEvent === undefined) {
            throw new UnexpectedUndefinedError('HHTAE22294');
        } else {
            this._componentFocusEvent(componentItem);
        }
    }

    /**
     * Executes `handleTabInitiatedDragStartEvent` to handle handle tab initiated drag start event.
     * @internal
     * @zh 执行 `handleTabInitiatedDragStartEvent`，用于连接手柄选项卡Initiated拖拽开始事件。
     */
    private handleTabInitiatedDragStartEvent(x: number, y: number, dragListener: DragListener, componentItem: ComponentItem) {
        if (!this._canRemoveComponent) {
            dragListener.cancelDrag();
        } else {
            if (this._componentDragStartEvent === undefined) {
                throw new UnexpectedUndefinedError('HHTDSE22294');
            } else {
                this._componentDragStartEvent(x, y, dragListener, componentItem);
            }
        }
    }

    /**
     * Executes `processTabDropdownActiveChanged` to handle process tab dropdown active changed.
     * @internal
     * @zh 执行 `processTabDropdownActiveChanged`，用于处理选项卡下拉框激活已变更。
     */
    private processTabDropdownActiveChanged() {
        if (this._tabDropdownButton !== undefined) {
            setElementDisplayVisibility(this._tabDropdownButton.element, this._tabsContainer.dropdownActive);
        }
    }

    /**
     * Executes `handleButtonPopoutEvent` to handle handle button popout event.
     * @internal
     * @zh 执行 `handleButtonPopoutEvent`，用于连接手柄按钮弹出窗口事件。
     */
    private handleButtonPopoutEvent() {
        if (this._layoutManager.layoutConfig.settings.popoutWholeStack) {
            if (this._popoutEvent === undefined) {
                throw new UnexpectedUndefinedError('HHBPOE17834');
            } else {
                this._popoutEvent();
            }
        } else {
            const activeComponentItem = this._getActiveComponentItemEvent();
            if (activeComponentItem) {
                activeComponentItem.popout();
            }
            // else: if the stack is empty there won't be an active item (and nothing to popout)
        }
    }

    /**
     * Executes `handleButtonMaximiseToggleEvent` to handle handle button maximise toggle event.
     * @internal
     * @zh 执行 `handleButtonMaximiseToggleEvent`，用于连接手柄按钮最大化开关事件。
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private handleButtonMaximiseToggleEvent(ev: Event) {
        if (this._maximiseToggleEvent === undefined) {
            throw new UnexpectedUndefinedError('HHBMTE16834');
        } else {
            this._maximiseToggleEvent();
        }
    }

    /**
     * Invoked when the header's background is clicked (not it's tabs or controls)
     * @internal

     * @zh 执行 `onClick`，用于当点击。
     */
    private onClick(event: MouseEvent) {
        if (event.target === this._element) {
            this.notifyClick(event);
        }
    }

    /**
     * Invoked when the header's background is touched (not it's tabs or controls)
     * @internal

     * @zh 执行 `onTouchStart`，用于当触摸开始。
     */
    private onTouchStart(event: TouchEvent) {
        if (event.target === this._element) {
            this.notifyTouchStart(event);
        }
    }

    /**
     * Executes `notifyClick` to handle notify click.
     * @internal
     * @zh 执行 `notifyClick`，用于通知点击。
     */
    private notifyClick(ev: MouseEvent) {
        if (this._clickEvent === undefined) {
            throw new UnexpectedUndefinedError('HNHC46834');
        } else {
            this._clickEvent(ev);
        }
    }

    /**
     * Executes `notifyTouchStart` to handle notify touch start.
     * @internal
     * @zh 执行 `notifyTouchStart`，用于通知触摸开始。
     */
    private notifyTouchStart(ev: TouchEvent) {
        if (this._touchStartEvent === undefined) {
            throw new UnexpectedUndefinedError('HNHTS46834');
        } else {
            this._touchStartEvent(ev);
        }
    }
}

/** @public */
export namespace Header {
    /**
     * Type alias `GetActiveComponentItemEvent` representing get active component item event (`(this: void) => ComponentItem | undefined`).
     * @internal
     * @zh 类型别名 `GetActiveComponentItemEvent`，表示获取激活组件条目事件（`(this: void) => ComponentItem | undefined`）。
     */
    export type GetActiveComponentItemEvent = (this: void) => ComponentItem | undefined;
    /**
     * Type alias `CloseEvent` representing close event (`(this: void) => void`).
     * @internal
     * @zh 类型别名 `CloseEvent`，表示关闭事件（`(this: void) => void`）。
     */
    export type CloseEvent = (this: void) => void;
    /**
     * Type alias `PopoutEvent` representing popout event (`(this: void) => void`).
     * @internal
     * @zh 类型别名 `PopoutEvent`，表示弹出窗口事件（`(this: void) => void`）。
     */
    export type PopoutEvent = (this: void) => void;
    /**
     * Type alias `MaximiseToggleEvent` representing maximise toggle event (`(this: void) => void`).
     * @internal
     * @zh 类型别名 `MaximiseToggleEvent`，表示最大化开关事件（`(this: void) => void`）。
     */
    export type MaximiseToggleEvent = (this: void) => void;
    /**
     * Type alias `ClickEvent` representing click event (`(this: void, ev: MouseEvent) => void`).
     * @internal
     * @zh 类型别名 `ClickEvent`，表示点击事件（`(this: void, ev: MouseEvent) => void`）。
     */
    export type ClickEvent = (this: void, ev: MouseEvent) => void;
    /**
     * Type alias `TouchStartEvent` representing touch start event (`(this: void, ev: TouchEvent) => void`).
     * @internal
     * @zh 类型别名 `TouchStartEvent`，表示触摸开始事件（`(this: void, ev: TouchEvent) => void`）。
     */
    export type TouchStartEvent = (this: void, ev: TouchEvent) => void;
    /**
     * Type alias `ComponentRemoveEvent` representing component remove event (`(this: void, componentItem: ComponentItem) => void`).
     * @internal
     * @zh 类型别名 `ComponentRemoveEvent`，表示组件移除事件（`(this: void, componentItem: ComponentItem) => void`）。
     */
    export type ComponentRemoveEvent = (this: void, componentItem: ComponentItem) => void;
    /**
     * Type alias `ComponentFocusEvent` representing component focus event (`(this: void, componentItem: ComponentItem) => void`).
     * @internal
     * @zh 类型别名 `ComponentFocusEvent`，表示组件聚焦事件（`(this: void, componentItem: ComponentItem) => void`）。
     */
    export type ComponentFocusEvent = (this: void, componentItem: ComponentItem) => void;
    /**
     * Type alias `ComponentDragStartEvent` representing component drag start event (`(this: void, x: number, y: number, dragListener: DragListener, compone...`).
     * @internal
     * @zh 类型别名 `ComponentDragStartEvent`，表示组件拖拽开始事件（`(this: void, x: number, y: number, dragListener: DragListener, compone...`）。
     */
    export type ComponentDragStartEvent = (this: void, x: number, y: number, dragListener: DragListener, componentItem: ComponentItem) => void;
    /**
     * Type alias `StateChangedEvent` representing state changed event (`(this: void) => void`).
     * @internal
     * @zh 类型别名 `StateChangedEvent`，表示状态已变更事件（`(this: void) => void`）。
     */
    export type StateChangedEvent = (this: void) => void;

    /**
     * Interface `Settings` defining the contract and properties for settings.
     * @internal
     * @zh 接口 `Settings`，定义设置项的数据结构契约与属性规范。
     */
    export interface Settings {
        /**
         * Property `show` (`boolean`) storing show.
         * @zh 属性 `show`（类型：`boolean`），用于存储或配置显示。
         */
        show: boolean;
        /**
         * Property `side` (`Side`) storing side.
         * @zh 属性 `side`（类型：`Side`），用于存储或配置side。
         */
        side: Side;
        /**
         * Property `popoutEnabled` (`boolean`) storing popout enabled.
         * @zh 属性 `popoutEnabled`（类型：`boolean`），用于存储或配置弹出窗口已启用。
         */
        popoutEnabled: boolean;
        /**
         * Property `popoutLabel` (`string`) storing popout label.
         * @zh 属性 `popoutLabel`（类型：`string`），用于存储或配置弹出窗口标签。
         */
        popoutLabel: string;
        /**
         * Property `maximiseEnabled` (`boolean`) storing maximise enabled.
         * @zh 属性 `maximiseEnabled`（类型：`boolean`），用于存储或配置最大化已启用。
         */
        maximiseEnabled: boolean;
        /**
         * Property `maximiseLabel` (`string`) storing maximise label.
         * @zh 属性 `maximiseLabel`（类型：`string`），用于存储或配置最大化标签。
         */
        maximiseLabel: string;
        /**
         * Property `minimiseEnabled` (`boolean`) storing minimise enabled.
         * @zh 属性 `minimiseEnabled`（类型：`boolean`），用于存储或配置minimise已启用。
         */
        minimiseEnabled: boolean;
        /**
         * Property `minimiseLabel` (`string`) storing minimise label.
         * @zh 属性 `minimiseLabel`（类型：`string`），用于存储或配置minimise标签。
         */
        minimiseLabel: string;
        /**
         * Property `closeEnabled` (`boolean`) storing close enabled.
         * @zh 属性 `closeEnabled`（类型：`boolean`），用于存储或配置关闭已启用。
         */
        closeEnabled: boolean;
        /**
         * Property `closeLabel` (`string`) storing close label.
         * @zh 属性 `closeLabel`（类型：`string`），用于存储或配置关闭标签。
         */
        closeLabel: string;
        /**
         * Property `tabDropdownEnabled` (`boolean`) storing tab dropdown enabled.
         * @zh 属性 `tabDropdownEnabled`（类型：`boolean`），用于存储或配置选项卡下拉框已启用。
         */
        tabDropdownEnabled: boolean;
        /**
         * Property `tabDropdownLabel` (`string`) storing tab dropdown label.
         * @zh 属性 `tabDropdownLabel`（类型：`string`），用于存储或配置选项卡下拉框标签。
         */
        tabDropdownLabel: string;
    }
}
