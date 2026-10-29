/**
 * @fileoverview Module `src/container/dock-layout/controls/tabs-container.ts` providing tabs container definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/controls/tabs-container.ts`，提供选项卡组容器相关的定义与实现。
 */

import { AssertError } from '../errors/internal-error';
import { ComponentItem } from '../items/component-item';
import { LayoutManager } from '../layout-manager';
import { DomConstants } from '../utils/dom-constants';
import { DragListener } from '../utils/drag-listener';
import { numberToPixels, pixelsToNumber } from '../utils/utils';
import { Tab } from './tab';

/**
 * Class `TabsContainer` encapsulating tabs container data structures and logic in `src/container/dock-layout/controls`.
 * @internal
 * @zh 类 `TabsContainer`，封装 `src/container/dock-layout/controls` 中的选项卡组容器数据结构与处理逻辑。
 */
export class TabsContainer {
    // There is one tab per ComponentItem in stack.  However they may not be ordered the same
    /**
     * Property `_tabs` (`Tab[]`) storing tabs (default: `[]`).
     * @zh 属性 `_tabs`（类型：`Tab[]`），用于存储或配置选项卡组（默认值：`[]`）。
     */
    private readonly _tabs: Tab[] = [];

    /**
     * Property `_dropdownElement` (`HTMLElement`) storing dropdown element.
     * @zh 属性 `_dropdownElement`（类型：`HTMLElement`），用于存储或配置下拉框元素。
     */
    private readonly _dropdownElement: HTMLElement;
    /**
     * Property `_element` (`HTMLElement`) storing element.
     * @zh 属性 `_element`（类型：`HTMLElement`），用于存储或配置元素。
     */
    private readonly _element: HTMLElement;
    /**
     * Property `_lastVisibleTabIndex` (`number`) storing last visible tab index (default: `-1`).
     * @zh 属性 `_lastVisibleTabIndex`（类型：`number`），用于存储或配置末尾可见选项卡索引（默认值：`-1`）。
     */
    private _lastVisibleTabIndex = -1;
    /**
     * Property `_dropdownActive` (`boolean`) storing dropdown active (default: `false`).
     * @zh 属性 `_dropdownActive`（类型：`boolean`），用于存储或配置下拉框激活（默认值：`false`）。
     */
    private _dropdownActive = false;

    /**
     * Gets the current tabs (`tabs: Tab[]`).
     * @zh 获取当前选项卡组（`tabs: Tab[]`）。
     */
    get tabs(): Tab[] { return this._tabs; }
    /**
     * Gets the current tab count (`tabCount: number`).
     * @zh 获取当前选项卡计数（`tabCount: number`）。
     */
    get tabCount(): number { return this._tabs.length; }
    /**
     * Gets the current last visible tab index (`lastVisibleTabIndex: number`).
     * @zh 获取当前末尾可见选项卡索引（`lastVisibleTabIndex: number`）。
     */
    get lastVisibleTabIndex(): number { return this._lastVisibleTabIndex; }

    /**
     * Gets the current element (`element: HTMLElement`).
     * @zh 获取当前元素（`element: HTMLElement`）。
     */
    get element(): HTMLElement { return this._element; }
    /**
     * Gets the current dropdown element (`dropdownElement: HTMLElement`).
     * @zh 获取当前下拉框元素（`dropdownElement: HTMLElement`）。
     */
    get dropdownElement(): HTMLElement { return this._dropdownElement; }
    /**
     * Gets the current dropdown active (`dropdownActive: boolean`).
     * @zh 获取当前下拉框激活（`dropdownActive: boolean`）。
     */
    get dropdownActive(): boolean { return this._dropdownActive; }

    /**
     * Creates an instance of `TabsContainer` and initializes its dependencies and internal state.
     * @zh 创建 `TabsContainer` 实例，并初始化其依赖项与内部状态。
     * @param _layoutManager - Injected or initial layout manager (`LayoutManager`) / 注入或传入的布局管理器（`LayoutManager`）
     * @param _componentRemoveEvent - Injected or initial component remove event (`TabsContainer.ComponentItemRemoveEvent`) / 注入或传入的组件移除事件（`TabsContainer.ComponentItemRemoveEvent`）
     * @param _componentFocusEvent - Injected or initial component focus event (`TabsContainer.ComponentItemFocusEvent`) / 注入或传入的组件聚焦事件（`TabsContainer.ComponentItemFocusEvent`）
     * @param _componentDragStartEvent - Injected or initial component drag start event (`TabsContainer.ComponentItemDragStartEvent`) / 注入或传入的组件拖拽开始事件（`TabsContainer.ComponentItemDragStartEvent`）
     * @param _dropdownActiveChangedEvent - Injected or initial dropdown active changed event (`TabsContainer.DropdownActiveChangedEvent`) / 注入或传入的下拉框激活已变更事件（`TabsContainer.DropdownActiveChangedEvent`）
     */
    constructor(private _layoutManager: LayoutManager,
        private _componentRemoveEvent: TabsContainer.ComponentItemRemoveEvent,
        private _componentFocusEvent: TabsContainer.ComponentItemFocusEvent,
        private _componentDragStartEvent: TabsContainer.ComponentItemDragStartEvent,
        private _dropdownActiveChangedEvent: TabsContainer.DropdownActiveChangedEvent,
    ) {
        this._element = document.createElement('section');
        this._element.classList.add(DomConstants.ClassName.Tabs);

        this._dropdownElement = document.createElement('section');
        this._dropdownElement.classList.add(DomConstants.ClassName.TabDropdownList);
        this._dropdownElement.style.display = 'none';
    }

    /**
     * Executes `destroy` to handle destroy.
     * @zh 执行 `destroy`，用于销毁。
     */
    destroy(): void {
        for (let i = 0; i < this._tabs.length; i++) {
            this._tabs[i].destroy();
        }
    }

    /**
     * Creates a new tab and associates it with a contentItem
     * @param index - The position of the tab

     * @zh 执行 `createTab`，用于创建选项卡。
     */
    createTab(componentItem: ComponentItem, index: number): void {
        //If there's already a tab relating to the
        //content item, don't do anything
        for (let i = 0; i < this._tabs.length; i++) {
            if (this._tabs[i].componentItem === componentItem) {
                return;
            }
        }

        const tab = new Tab(this._layoutManager,
            componentItem,
            (item) => this.handleTabCloseEvent(item),
            (item) => this.handleTabFocusEvent(item),
            (x, y, dragListener, item) => this.handleTabDragStartEvent(x, y, dragListener, item));

        if (index === undefined) {
            index = this._tabs.length;
        }

        this._tabs.splice(index, 0, tab);

        if (index < this._element.childNodes.length) {
            this._element.insertBefore(tab.element, this._element.childNodes[index]);
        } else {
            this._element.appendChild(tab.element);
        }
    }

    /**
     * Executes `removeTab` to handle remove tab.
     * @zh 执行 `removeTab`，用于移除选项卡。
     * @param componentItem - component item parameter (`ComponentItem`) / 组件条目参数（`ComponentItem`）
     */
    removeTab(componentItem: ComponentItem): void {
        // componentItem cannot be ActiveComponentItem
        for (let i = 0; i < this._tabs.length; i++) {
            if (this._tabs[i].componentItem === componentItem) {
                const tab = this._tabs[i];
                tab.destroy();
                this._tabs.splice(i, 1);
                return;
            }
        }

        throw new Error('contentItem is not controlled by this header');
    }

    /**
     * Executes `processActiveComponentChanged` to handle process active component changed.
     * @zh 执行 `processActiveComponentChanged`，用于处理激活组件已变更。
     * @param newActiveComponentItem - new active component item parameter (`ComponentItem`) / 新激活组件条目参数（`ComponentItem`）
     */
    processActiveComponentChanged(newActiveComponentItem: ComponentItem): void {
        let activeIndex = -1;
        for (let i = 0; i < this._tabs.length; i++) {
            const isActive = this._tabs[i].componentItem === newActiveComponentItem;
            this._tabs[i].setActive(isActive);
            if (isActive) {
                activeIndex = i;
            }
        }

        if (activeIndex < 0) {
            throw new AssertError('HSACI56632');
        } else {
            if (this._layoutManager.layoutConfig.settings.reorderOnTabMenuClick) {
                /**
                 * If the tab selected was in the dropdown, move everything down one to make way for this one to be the first.
                 * This will make sure the most used tabs stay visible.
                 */
                if (this._lastVisibleTabIndex !== -1 && activeIndex > this._lastVisibleTabIndex) {
                    const activeTab = this._tabs[activeIndex];
                    for (let j = activeIndex; j > 0; j--) {
                        this._tabs[j] = this._tabs[j - 1];
                    }
                    this._tabs[0] = activeTab;

                    // updateTabSizes will always be called after this and it will reposition tab elements
                }
            }
        }
    }

    /**
     * Pushes the tabs to the tab dropdown if the available space is not sufficient

     * @zh 执行 `updateTabSizes`，用于更新选项卡尺寸列表。
     */
    updateTabSizes(availableWidth: number, activeComponentItem: ComponentItem | undefined): void {
        let dropDownActive = false;
        const success = this.tryUpdateTabSizes(dropDownActive, availableWidth, activeComponentItem);
        if (!success) {
            dropDownActive = true;
            // this will always succeed
            this.tryUpdateTabSizes(dropDownActive, availableWidth, activeComponentItem)
        }

        if (dropDownActive !== this._dropdownActive) {
            this._dropdownActive = dropDownActive;
            this._dropdownActiveChangedEvent();
        }
    }

    /**
     * Executes `tryUpdateTabSizes` to handle try update tab sizes.
     * @zh 执行 `tryUpdateTabSizes`，用于尝试更新选项卡尺寸列表。
     * @param dropdownActive - dropdown active parameter (`boolean`) / 下拉框激活参数（`boolean`）
     * @param availableWidth - available width parameter (`number`) / available宽度参数（`number`）
     * @param activeComponentItem - active component item parameter (`ComponentItem`) / 激活组件条目参数（`ComponentItem`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    tryUpdateTabSizes(dropdownActive: boolean, availableWidth: number, activeComponentItem: ComponentItem | undefined): boolean {
        if (this._tabs.length > 0) {
            if (activeComponentItem === undefined) {
                throw new Error('non-empty tabs must have active component item');
            }

            let cumulativeTabWidth = 0;
            let tabOverlapAllowanceExceeded = false;
            const tabOverlapAllowance = this._layoutManager.layoutConfig.settings.tabOverlapAllowance;
            const activeIndex = this._tabs.indexOf(activeComponentItem.tab);
            const activeTab = this._tabs[activeIndex];
            this._lastVisibleTabIndex = -1;

            for (let i = 0; i < this._tabs.length; i++) {
                const tabElement = this._tabs[i].element;

                //Put the tab in the tabContainer so its true width can be checked
                if (tabElement.parentElement !== this._element) {
                    this._element.appendChild(tabElement);
                }
                const tabMarginRightPixels = getComputedStyle(activeTab.element).marginRight;
                const tabMarginRight = pixelsToNumber(tabMarginRightPixels);
                const tabWidth = tabElement.offsetWidth + tabMarginRight;

                cumulativeTabWidth += tabWidth;

                //Include the active tab's width if it isn't already
                //This is to ensure there is room to show the active tab
                let visibleTabWidth = 0;
                if (activeIndex <= i) {
                    visibleTabWidth = cumulativeTabWidth;
                } else {
                    const activeTabMarginRightPixels = getComputedStyle(activeTab.element).marginRight;
                    const activeTabMarginRight = pixelsToNumber(activeTabMarginRightPixels);
                    visibleTabWidth = cumulativeTabWidth + activeTab.element.offsetWidth + activeTabMarginRight;
                }

                // If the tabs won't fit, check the overlap allowance.
                if (visibleTabWidth > availableWidth) {

                    //Once allowance is exceeded, all remaining tabs go to menu.
                    if (!tabOverlapAllowanceExceeded) {

                        //No overlap for first tab or active tab
                        //Overlap spreads among non-active, non-first tabs
                        let overlap: number;
                        if (activeIndex > 0 && activeIndex <= i) {
                            overlap = (visibleTabWidth - availableWidth) / (i - 1);
                        } else {
                            overlap = (visibleTabWidth - availableWidth) / i;
                        }

                        //Check overlap against allowance.
                        if (overlap < tabOverlapAllowance) {
                            for (let j = 0; j <= i; j++) {
                                const marginLeft = (j !== activeIndex && j !== 0) ? '-' + numberToPixels(overlap) : '';
                                this._tabs[j].element.style.zIndex = numberToPixels(i - j);
                                this._tabs[j].element.style.marginLeft = marginLeft;
                            }
                            this._lastVisibleTabIndex = i;
                            if (tabElement.parentElement !== this._element) {
                                this._element.appendChild(tabElement);
                            }
                        } else {
                            tabOverlapAllowanceExceeded = true;
                        }

                    } else if (i === activeIndex) {
                        //Active tab should show even if allowance exceeded. (We left room.)
                        tabElement.style.zIndex = 'auto';
                        tabElement.style.marginLeft = '';
                        if (tabElement.parentElement !== this._element) {
                            this._element.appendChild(tabElement);
                        }
                    }

                    if (tabOverlapAllowanceExceeded && i !== activeIndex) {
                        if (dropdownActive) {
                            //Tab menu already shown, so we just add to it.
                            tabElement.style.zIndex = 'auto';
                            tabElement.style.marginLeft = '';

                            if (tabElement.parentElement !== this._dropdownElement) {
                                this._dropdownElement.appendChild(tabElement);
                            }
                        } else {
                            //We now know the tab menu must be shown, so we have to recalculate everything.
                            return false;
                        }
                    }

                } else {
                    this._lastVisibleTabIndex = i;
                    tabElement.style.zIndex = 'auto';
                    tabElement.style.marginLeft = '';
                    if (tabElement.parentElement !== this._element) {
                        this._element.appendChild(tabElement);
                    }
                }
            }
        }

        return true;
    }

    /**
     * Shows drop down for additional tabs when there are too many to display.

     * @zh 执行 `showAdditionalTabsDropdown`，用于显示Additional选项卡组下拉框。
     */
    showAdditionalTabsDropdown(): void {
        this._dropdownElement.style.display = '';
    }

    /**
     * Hides drop down for additional tabs when there are too many to display.

     * @zh 执行 `hideAdditionalTabsDropdown`，用于隐藏Additional选项卡组下拉框。
     */
    hideAdditionalTabsDropdown(): void {
        this._dropdownElement.style.display = 'none';
    }

    /**
     * Executes `handleTabCloseEvent` to handle handle tab close event.
     * @zh 执行 `handleTabCloseEvent`，用于连接手柄选项卡关闭事件。
     * @param componentItem - component item parameter (`ComponentItem`) / 组件条目参数（`ComponentItem`）
     */
    private handleTabCloseEvent(componentItem: ComponentItem) {
        this._componentRemoveEvent(componentItem);
    }

    /**
     * Executes `handleTabFocusEvent` to handle handle tab focus event.
     * @zh 执行 `handleTabFocusEvent`，用于连接手柄选项卡聚焦事件。
     * @param componentItem - component item parameter (`ComponentItem`) / 组件条目参数（`ComponentItem`）
     */
    private handleTabFocusEvent(componentItem: ComponentItem) {
        this._componentFocusEvent(componentItem);
    }

    /**
     * Executes `handleTabDragStartEvent` to handle handle tab drag start event.
     * @zh 执行 `handleTabDragStartEvent`，用于连接手柄选项卡拖拽开始事件。
     * @param x - x parameter (`number`) / X坐标参数（`number`）
     * @param y - y parameter (`number`) / Y坐标参数（`number`）
     * @param dragListener - drag listener parameter (`DragListener`) / 拖拽监听器参数（`DragListener`）
     * @param componentItem - component item parameter (`ComponentItem`) / 组件条目参数（`ComponentItem`）
     */
    private handleTabDragStartEvent(x: number, y: number, dragListener: DragListener, componentItem: ComponentItem) {
        this._componentDragStartEvent(x, y, dragListener, componentItem);
    }

}

/** @internal */
export namespace TabsContainer {
    /**
     * Type alias `ComponentItemRemoveEvent` representing component item remove event (`(this: void, componentItem: ComponentItem) => void`).
     * @zh 类型别名 `ComponentItemRemoveEvent`，表示组件条目移除事件（`(this: void, componentItem: ComponentItem) => void`）。
     */
    export type ComponentItemRemoveEvent = (this: void, componentItem: ComponentItem) => void;
    /**
     * Type alias `ComponentItemFocusEvent` representing component item focus event (`(this: void, componentItem: ComponentItem) => void`).
     * @zh 类型别名 `ComponentItemFocusEvent`，表示组件条目聚焦事件（`(this: void, componentItem: ComponentItem) => void`）。
     */
    export type ComponentItemFocusEvent = (this: void, componentItem: ComponentItem) => void;
    /**
     * Type alias `ComponentItemDragStartEvent` representing component item drag start event (`(this: void, x: number, y: number, dragListener: DragListener, compone...`).
     * @zh 类型别名 `ComponentItemDragStartEvent`，表示组件条目拖拽开始事件（`(this: void, x: number, y: number, dragListener: DragListener, compone...`）。
     */
    export type ComponentItemDragStartEvent = (this: void, x: number, y: number, dragListener: DragListener, componentItem: ComponentItem) => void;
    /**
     * Type alias `DropdownActiveChangedEvent` representing dropdown active changed event (`(this: void) => void`).
     * @zh 类型别名 `DropdownActiveChangedEvent`，表示下拉框激活已变更事件（`(this: void) => void`）。
     */
    export type DropdownActiveChangedEvent = (this: void) => void;
}
