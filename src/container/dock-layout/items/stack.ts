/**
 * @fileoverview Module `src/container/dock-layout/items/stack.ts` providing stack definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/items/stack.ts`，提供栈相关的定义与实现。
 */

import { TranslateService } from '@dotos/dui/translator';
import { ComponentItemConfig, ItemConfig } from '../config/config';
import { ResolvedComponentItemConfig, ResolvedHeaderedItemConfig, ResolvedItemConfig, ResolvedStackItemConfig } from '../config/resolved-config';
import { Header } from '../controls/header';
import { AssertError, UnexpectedNullError, UnexpectedUndefinedError } from '../errors/internal-error';
import { LayoutManager } from '../layout-manager';
import { DomConstants } from '../utils/dom-constants';
import { DragListener } from '../utils/drag-listener';
import { EventEmitter } from '../utils/event-emitter';
import { AreaLinkedRect, ItemType, JsonValue, Side, SizeUnitEnum, WidthAndHeight, WidthOrHeightPropertyName } from '../utils/types';
import {
    getElementWidthAndHeight,
    numberToPixels,
    setElementDisplayVisibility
} from '../utils/utils';
import { ComponentItem } from './component-item';
import { ComponentParentableItem } from './component-parentable-item';
import { ContentItem } from './content-item';

/**
 * Class `Stack` encapsulating stack data structures and logic in `src/container/dock-layout/items`.
 * @public
 * @zh 类 `Stack`，封装 `src/container/dock-layout/items` 中的栈数据结构与处理逻辑。
 */
export class Stack extends ComponentParentableItem {
    /**
     * Property `_headerConfig` (`ResolvedHeaderedItemConfig.Header | undefined`) storing header config.
     * @internal
     * @zh 属性 `_headerConfig`（类型：`ResolvedHeaderedItemConfig.Header | undefined`），用于存储或配置表头配置。
     */
    private readonly _headerConfig: ResolvedHeaderedItemConfig.Header | undefined;
    /**
     * Property `_header` (`Header`) storing header.
     * @internal
     * @zh 属性 `_header`（类型：`Header`），用于存储或配置表头。
     */
    private readonly _header: Header;
    /**
     * Property `_childElementContainer` (`HTMLElement`) storing child element container.
     * @internal
     * @zh 属性 `_childElementContainer`（类型：`HTMLElement`），用于存储或配置子级元素容器。
     */
    private readonly _childElementContainer: HTMLElement;
    /**
     * Property `_maximisedEnabled` (`boolean`) storing maximised enabled.
     * @internal
     * @zh 属性 `_maximisedEnabled`（类型：`boolean`），用于存储或配置最大化已启用。
     */
    private readonly _maximisedEnabled: boolean;
    /**
     * Property `_activeComponentItem` (`ComponentItem | undefined`) storing active component item.
     * @internal
     * @zh 属性 `_activeComponentItem`（类型：`ComponentItem | undefined`），用于存储或配置激活组件条目。
     */
    private _activeComponentItem: ComponentItem | undefined;
    /**
     * Property `_dropSegment` (`Stack.Segment`) storing drop segment.
     * @internal
     * @zh 属性 `_dropSegment`（类型：`Stack.Segment`），用于存储或配置放置Segment。
     */
    private _dropSegment: Stack.Segment;
    /**
     * Property `_dropIndex` (`number`) storing drop index.
     * @internal
     * @zh 属性 `_dropIndex`（类型：`number`），用于存储或配置放置索引。
     */
    private _dropIndex: number;
    /**
     * Property `_contentAreaDimensions` (`Stack.ContentAreaDimensions`) storing content area dimensions.
     * @internal
     * @zh 属性 `_contentAreaDimensions`（类型：`Stack.ContentAreaDimensions`），用于存储或配置内容区域维度列表。
     */
    private _contentAreaDimensions: Stack.ContentAreaDimensions;
    /**
     * Property `_headerSideChanged` (`boolean`) storing header side changed (default: `false`).
     * @internal
     * @zh 属性 `_headerSideChanged`（类型：`boolean`），用于存储或配置表头Side已变更（默认值：`false`）。
     */
    private _headerSideChanged = false;
    /**
     * Property `_initialWantMaximise` (`boolean`) storing initial want maximise.
     * @internal
     * @zh 属性 `_initialWantMaximise`（类型：`boolean`），用于存储或配置初始Want最大化。
     */
    private readonly _initialWantMaximise: boolean;
    /**
     * Property `_initialActiveItemIndex` (`number`) storing initial active item index.
     * @internal
     * @zh 属性 `_initialActiveItemIndex`（类型：`number`），用于存储或配置初始激活条目索引。
     */
    private _initialActiveItemIndex: number;

    /**
     * Property `_resizeListener` (`any`) storing resize listener (default: `() => this.handleResize()`).
     * @internal
     * @zh 属性 `_resizeListener`（类型：`any`），用于存储或配置调整尺寸监听器（默认值：`() => this.handleResize()`）。
     */
    private _resizeListener = () => this.handleResize();
    /**
     * Property `_maximisedListener` (`any`) storing maximised listener (default: `() => this.handleMaximised()`).
     * @internal
     * @zh 属性 `_maximisedListener`（类型：`any`），用于存储或配置最大化监听器（默认值：`() => this.handleMaximised()`）。
     */
    private _maximisedListener = () => this.handleMaximised();
    /**
     * Property `_minimisedListener` (`any`) storing minimised listener (default: `() => this.handleMinimised()`).
     * @internal
     * @zh 属性 `_minimisedListener`（类型：`any`），用于存储或配置最小化监听器（默认值：`() => this.handleMinimised()`）。
     */
    private _minimisedListener = () => this.handleMinimised();

    /**
     * Gets the current child element container (`childElementContainer: HTMLElement`).
     * @zh 获取当前子级元素容器（`childElementContainer: HTMLElement`）。
     */
    get childElementContainer(): HTMLElement { return this._childElementContainer; }
    /**
     * Gets the current header (`header: Header`).
     * @zh 获取当前表头（`header: Header`）。
     */
    get header(): Header { return this._header; }
    /**
     * Gets the current header show (`headerShow: boolean`).
     * @zh 获取当前表头显示（`headerShow: boolean`）。
     */
    get headerShow(): boolean { return this._header.show; }
    /**
     * Gets the current header side (`headerSide: Side`).
     * @zh 获取当前表头Side（`headerSide: Side`）。
     */
    get headerSide(): Side { return this._header.side; }
    /**
     * Gets the current header left right sided (`headerLeftRightSided: boolean`).
     * @zh 获取当前表头左侧位置右侧位置Sided（`headerLeftRightSided: boolean`）。
     */
    get headerLeftRightSided(): boolean { return this._header.leftRightSided; }
    /**
     * Gets the current content area dimensions (`contentAreaDimensions: Stack.ContentAreaDimensions | undefined`).
     * @internal
     * @zh 获取当前内容区域维度列表（`contentAreaDimensions: Stack.ContentAreaDimensions | undefined`）。
     */
    get contentAreaDimensions(): Stack.ContentAreaDimensions | undefined { return this._contentAreaDimensions; }
    /**
     * Gets the current initial want maximise (`initialWantMaximise: boolean`).
     * @internal
     * @zh 获取当前初始Want最大化（`initialWantMaximise: boolean`）。
     */
    get initialWantMaximise(): boolean { return this._initialWantMaximise; }
    /**
     * Gets the current is maximised (`isMaximised: boolean`).
     * @zh 获取当前是否为最大化（`isMaximised: boolean`）。
     */
    get isMaximised(): boolean { return this === this.layoutManager.maximisedStack; }
    /**
     * Gets the current stack parent (`stackParent: ContentItem`).
     * @zh 获取当前栈父级（`stackParent: ContentItem`）。
     */
    get stackParent(): ContentItem {
        if (!this.parent) {
            throw new Error('Stack should always have a parent');
        }
        return this.parent;
    }

    /**
     * Creates an instance of `Stack` and initializes its dependencies and internal state.
     * @internal
     * @zh 创建 `Stack` 实例，并初始化其依赖项与内部状态。
     */
    constructor(private translator:TranslateService,layoutManager: LayoutManager, config: ResolvedStackItemConfig, parent: ContentItem) {
        super(layoutManager, config, parent, Stack.createElement(document));

        this._headerConfig = config.header;
        this.translator=translator;
        const layoutHeaderConfig = layoutManager.layoutConfig.header;
        const configContent = config.content;
        // If stack has only one component, then we can also check this for header settings
        let componentHeaderConfig: ResolvedHeaderedItemConfig.Header | undefined;
        if (configContent.length !== 1) {
            componentHeaderConfig = undefined;
        } else {
            const firstChildItemConfig = configContent[0];
            componentHeaderConfig = (firstChildItemConfig as ResolvedHeaderedItemConfig).header; // will be undefined if not component (and wont be stack)
        }

        this._initialWantMaximise = config.maximised;
        this._initialActiveItemIndex = config.activeItemIndex ?? 0; // make sure defined

        // check for defined value for each item in order of Stack (this Item), Component (first child), Manager.
        const show = this._headerConfig?.show ?? componentHeaderConfig?.show ?? layoutHeaderConfig.show;
        const popout = this._headerConfig?.popout ?? componentHeaderConfig?.popout ?? layoutHeaderConfig.popout;
        const maximise = this._headerConfig?.maximise ?? componentHeaderConfig?.maximise ?? layoutHeaderConfig.maximise;
        const close = this._headerConfig?.close ?? componentHeaderConfig?.close ?? layoutHeaderConfig.close;
        const minimise = this._headerConfig?.minimise ?? componentHeaderConfig?.minimise ?? layoutHeaderConfig.minimise;
        const tabDropdown = this._headerConfig?.tabDropdown ?? componentHeaderConfig?.tabDropdown ?? layoutHeaderConfig.tabDropdown;
        this._maximisedEnabled = maximise !== false;
        const headerSettings: Header.Settings = {
            show: show !== false,
            side: show === false ? Side.top : this.translator.instant(show),
            popoutEnabled: popout !== false,
            popoutLabel: popout === false ? '' :this.translator.instant(popout),
            maximiseEnabled: this._maximisedEnabled,
            maximiseLabel: maximise === false ? '' : this.translator.instant(maximise),
            closeEnabled: close !== false,
            closeLabel: close === false ? '' : this.translator.instant(close),
            minimiseEnabled: true,
            minimiseLabel: this.translator.instant(minimise),
            tabDropdownEnabled: tabDropdown !== false,
            tabDropdownLabel: tabDropdown === false ? '' :this.translator.instant( tabDropdown),
        };

        this._header = new Header(layoutManager,
            this, headerSettings,
            config.isClosable && close !== false,
            () => this.getActiveComponentItem(),
            () => this.remove(),
            () => this.handlePopoutEvent(),
            () => this.toggleMaximise(),
            (ev) => this.handleHeaderClickEvent(ev),
            (ev) => this.handleHeaderTouchStartEvent(ev),
            (item) => this.handleHeaderComponentRemoveEvent(item),
            (item) => this.handleHeaderComponentFocusEvent(item),
            (x, y, dragListener, item) => this.handleHeaderComponentStartDragEvent(x, y, dragListener, item),
        );

        // this._dropZones = {};

        this.isStack = true;

        this._childElementContainer = document.createElement('section');
        this._childElementContainer.classList.add(DomConstants.ClassName.Items);
        this._childElementContainer.addEventListener('click', this.contentClickEventListener, { passive: true });

        this.on('resize', this._resizeListener);
        if (this._maximisedEnabled) {
            this.on('maximised', this._maximisedListener);
            this.on('minimised', this._minimisedListener);
        }

        this.element.appendChild(this._header.element);
        this.element.appendChild(this._childElementContainer);

        this.setupHeaderPosition();
        this._header.updateClosability();
    }

    /**
     * Executes `updateSize` to handle update size.
     * @internal
     * @zh 执行 `updateSize`，用于更新尺寸。
     */
    override updateSize(force: boolean): void {
        this.layoutManager.beginVirtualSizedContainerAdding();
        try {
            this.updateNodeSize();
            this.updateContentItemsSize(force);
        } finally {
            this.layoutManager.endVirtualSizedContainerAdding();
        }
    }

    /**
     * Executes `init` to handle init.
     * @internal
     * @zh 执行 `init`，用于初始化。
     */
    override init(): void {
        if (this.isInitialised === true) return;

        this.updateNodeSize();

        for (let i = 0; i < this.contentItems.length; i++) {
            this._childElementContainer.appendChild(this.contentItems[i].element);
        }

        super.init();

        const contentItems = this.contentItems;
        const contentItemCount = contentItems.length;
        if (contentItemCount > 0) { // contentItemCount will be 0 on drag drop
            if (this._initialActiveItemIndex < 0 || this._initialActiveItemIndex >= contentItemCount) {
                throw new Error(`ActiveItemIndex out of range: ${this._initialActiveItemIndex} id: ${this.id}`);
            } else {
                for (let i = 0; i < contentItemCount; i++) {
                    const contentItem = contentItems[i];
                    if (!(contentItem instanceof ComponentItem)) {
                        throw new Error(`Stack Content Item is not of type ComponentItem: ${i} id: ${this.id}`);
                    } else {
                        this._header.createTab(contentItem, i);
                        contentItem.hide();
                        contentItem.container.setBaseLogicalZIndex();
                    }
                }

                this.setActiveComponentItem(contentItems[this._initialActiveItemIndex] as ComponentItem, false);

                this._header.updateTabSizes();
            }
        }

        this._header.updateClosability();
        this.initContentItems();
    }

    /**
     * @deprecated Use {@link (Stack:class).setActiveComponentItem}
     * @zh 执行 `setActiveContentItem`，用于集合激活内容条目。
     */
    setActiveContentItem(item: ContentItem): void {
        if (!ContentItem.isComponentItem(item)) {
            throw new Error('Stack.setActiveContentItem: item is not a ComponentItem');
        } else {
            this.setActiveComponentItem(item, false);
        }
    }

    /**
     * Executes `setActiveComponentItem` to handle set active component item.
     * @zh 执行 `setActiveComponentItem`，用于集合激活组件条目。
     * @param componentItem - component item parameter (`ComponentItem`) / 组件条目参数（`ComponentItem`）
     * @param focus - focus parameter (`boolean`) / 聚焦参数（`boolean`）
     * @param suppressFocusEvent - suppress focus event parameter (`any`) / suppress聚焦事件参数（`any`）
     */
    setActiveComponentItem(componentItem: ComponentItem, focus: boolean, suppressFocusEvent = false): void {
        if (this._activeComponentItem !== componentItem) {
            if (this.contentItems.indexOf(componentItem) === -1) {
                throw new Error('componentItem is not a child of this stack');
            } else {
                this.layoutManager.beginSizeInvalidation();
                try {
                    if (this._activeComponentItem !== undefined) {
                        this._activeComponentItem.hide();
                    }
                    this._activeComponentItem = componentItem;
                    this._header.processActiveComponentChanged(componentItem);
                    componentItem.show();
                } finally {
                    this.layoutManager.endSizeInvalidation();
                }

                this.emit('activeContentItemChanged', componentItem);
                this.layoutManager.emit('activeContentItemChanged', componentItem);
                this.emitStateChangedEvent();
            }
        }

        if (this.focused || focus) {
            this.layoutManager.setFocusedComponentItem(componentItem, suppressFocusEvent);
        }
    }

    /**
     * @deprecated Use {@link (Stack:class).getActiveComponentItem}
     * @zh 执行 `getActiveContentItem`，用于获取激活内容条目。
     */
    getActiveContentItem(): ContentItem | null {
        return this.getActiveComponentItem() ?? null;
    }

    /**
     * Executes `getActiveComponentItem` to handle get active component item.
     * @zh 执行 `getActiveComponentItem`，用于获取激活组件条目。
     * @returns Result of type `ComponentItem | undefined` / 类型为 `ComponentItem | undefined` 的返回值
     */
    getActiveComponentItem(): ComponentItem | undefined {
        return this._activeComponentItem;
    }

    /**
     * Executes `focusActiveContentItem` to handle focus active content item.
     * @internal
     * @zh 执行 `focusActiveContentItem`，用于聚焦激活内容条目。
     */
    focusActiveContentItem(): void {
        this._activeComponentItem?.focus();
    }

    /**
     * Executes `setFocusedValue` to handle set focused value.
     * @internal
     * @zh 执行 `setFocusedValue`，用于集合已聚焦值。
     */
    override setFocusedValue(value: boolean): void {
        this._header.applyFocusedValue(value);
        super.setFocusedValue(value);
    }

    /**
     * Executes `setRowColumnClosable` to handle set row column closable.
     * @internal
     * @zh 执行 `setRowColumnClosable`，用于集合行列是否可关闭。
     */
    setRowColumnClosable(value: boolean): void {
        this._header.setRowColumnClosable(value);
    }

    /**
     * Executes `newComponent` to handle new component.
     * @zh 执行 `newComponent`，用于新组件。
     * @param componentType - component type parameter (`JsonValue`) / 组件类型参数（`JsonValue`）
     * @param componentState - component state parameter (`JsonValue`) / 组件状态参数（`JsonValue`）
     * @param title - title parameter (`string`) / 标题参数（`string`）
     * @param index - index parameter (`number`) / 索引参数（`number`）
     * @returns Result of type `ComponentItem` / 类型为 `ComponentItem` 的返回值
     */
    newComponent(componentType: JsonValue, componentState?: JsonValue, title?: string, index?: number): ComponentItem {
        const itemConfig: ComponentItemConfig = {
            type: 'component',
            componentType,
            componentState,
            title,
        };
        
        return this.newItem(itemConfig, index) as ComponentItem;
    }

    /**
     * Executes `addComponent` to handle add component.
     * @zh 执行 `addComponent`，用于添加组件。
     * @param componentType - component type parameter (`JsonValue`) / 组件类型参数（`JsonValue`）
     * @param componentState - component state parameter (`JsonValue`) / 组件状态参数（`JsonValue`）
     * @param title - title parameter (`string`) / 标题参数（`string`）
     * @param index - index parameter (`number`) / 索引参数（`number`）
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    addComponent(componentType: JsonValue, componentState?: JsonValue, title?: string, index?: number): number {
        const itemConfig: ComponentItemConfig = {
            type: 'component',
            componentType,
            componentState,
            title,
        };
        return this.addItem(itemConfig, index);
    }

    /**
     * Executes `newItem` to handle new item.
     * @zh 执行 `newItem`，用于新条目。
     * @param itemConfig - item config parameter (`ComponentItemConfig`) / 条目配置参数（`ComponentItemConfig`）
     * @param index - index parameter (`number`) / 索引参数（`number`）
     * @returns Result of type `ContentItem` / 类型为 `ContentItem` 的返回值
     */
    newItem(itemConfig: ComponentItemConfig,  index?: number): ContentItem {
        index = this.addItem(itemConfig, index);
        return this.contentItems[index];
    }

    /**
     * Executes `addItem` to handle add item.
     * @zh 执行 `addItem`，用于添加条目。
     * @param itemConfig - item config parameter (`ComponentItemConfig`) / 条目配置参数（`ComponentItemConfig`）
     * @param index - index parameter (`number`) / 索引参数（`number`）
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    addItem(itemConfig: ComponentItemConfig, index?: number): number {
        this.layoutManager.checkMinimiseMaximisedStack();
        const resolvedItemConfig = ItemConfig.resolve(this.translator,itemConfig, false);
        const contentItem = this.layoutManager.createAndInitContentItem(resolvedItemConfig, this);
  
        return this.addChild(contentItem, index);
    }

    /**
     * Executes `addChild` to handle add child.
     * @zh 执行 `addChild`，用于添加子级。
     * @param contentItem - content item parameter (`ContentItem`) / 内容条目参数（`ContentItem`）
     * @param index - index parameter (`number`) / 索引参数（`number`）
     * @param focus - focus parameter (`any`) / 聚焦参数（`any`）
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    override addChild(contentItem: ContentItem, index?: number, focus = false): number {
        if(index !== undefined && index > this.contentItems.length){
            index -= 1;
            throw new AssertError('SAC99728'); // undisplayChild() removed so this condition should no longer occur
        }

        if (!(contentItem instanceof ComponentItem)) {
            throw new AssertError('SACC88532'); // Stacks can only have Component children
        } else {
            index = super.addChild(contentItem, index);
            this._childElementContainer.appendChild(contentItem.element);
            this._header.createTab(contentItem, index);
            this.setActiveComponentItem(contentItem, focus);
            this._header.updateTabSizes();
            this.updateSize(false);
            contentItem.container.setBaseLogicalZIndex();
            this._header.updateClosability();
            this.emitStateChangedEvent();
            return index;
        }
    }

    /**
     * Executes `removeChild` to handle remove child.
     * @zh 执行 `removeChild`，用于移除子级。
     * @param contentItem - content item parameter (`ContentItem`) / 内容条目参数（`ContentItem`）
     * @param keepChild - keep child parameter (`boolean`) / keep子级参数（`boolean`）
     */
    override removeChild(contentItem: ContentItem, keepChild: boolean): void {
        const componentItem = contentItem as ComponentItem;
        const index = this.contentItems.indexOf(componentItem);
        const stackWillBeDeleted = this.contentItems.length === 1;

        if (this._activeComponentItem === componentItem) {
            if (componentItem.focused) {
                componentItem.blur();
            }
            if (!stackWillBeDeleted) {
                // At this point we're already sure we have at least one content item left *after*
                // removing contentItem, so we can safely assume index 1 is a valid one if
                // the index of contentItem is 0, otherwise we just use the previous content item.
                const newActiveComponentIdx = index === 0 ? 1 : index - 1;
                this.setActiveComponentItem(this.contentItems[newActiveComponentIdx] as ComponentItem, false);
            }
        }

        this._header.removeTab(componentItem);

        super.removeChild(componentItem, keepChild);

        if (!stackWillBeDeleted) {
            this._header.updateClosability();
        }

        this.emitStateChangedEvent();
    }

    /**
     * Maximises the Item or minimises it if it is already maximised

     * @zh 执行 `toggleMaximise`，用于开关最大化。
     */
    toggleMaximise(): void {
        if (this.isMaximised) {
            this.minimise();
        } else {
            this.maximise();
        }
    }

    /**
     * Executes `maximise` to handle maximise.
     * @zh 执行 `maximise`，用于最大化。
     */
    maximise(): void {
        if (!this.isMaximised) {
            this.layoutManager.setMaximisedStack(this);
            const contentItems = this.contentItems;
            const contentItemCount = contentItems.length;
            for (let i = 0; i < contentItemCount; i++) {
                const contentItem = contentItems[i];
                if (contentItem instanceof ComponentItem) {
                    contentItem.enterStackMaximised();
                } else {
                    throw new AssertError('SMAXI87773');
                }
            }
            this.emitStateChangedEvent();
        }
    }

    /**
     * Executes `minimise` to handle minimise.
     * @zh 执行 `minimise`，用于minimise。
     */
    minimise(): void {
        if (this.isMaximised) {
            this.layoutManager.setMaximisedStack(undefined);
            const contentItems = this.contentItems;
            const contentItemCount = contentItems.length;
            for (let i = 0; i < contentItemCount; i++) {
                const contentItem = contentItems[i];
                if (contentItem instanceof ComponentItem) {
                    contentItem.exitStackMaximised();
                } else {
                    throw new AssertError('SMINI87773');
                }
            }
            this.emitStateChangedEvent();
        }
    }

    /**
     * Executes `destroy` to handle destroy.
     * @internal
     * @zh 执行 `destroy`，用于销毁。
     */
    override destroy(): void {
        if (this._activeComponentItem?.focused) {
            this._activeComponentItem.blur();
        }
        super.destroy();
        this.off('resize', this._resizeListener);
        if (this._maximisedEnabled) {
            this.off('maximised', this._maximisedListener);
            this.off('minimised', this._minimisedListener);
        }
        this._header.destroy();
    }

    /**
     * Executes `toConfig` to handle to config.
     * @zh 执行 `toConfig`，用于转换为配置。
     * @returns Result of type `ResolvedStackItemConfig` / 类型为 `ResolvedStackItemConfig` 的返回值
     */
    toConfig(): ResolvedStackItemConfig {
        let activeItemIndex: number | undefined;
        if (this._activeComponentItem) {
            activeItemIndex = this.contentItems.indexOf(this._activeComponentItem);
            if (activeItemIndex < 0) {
                throw new Error('active component item not found in stack');
            }
        }
        if (this.contentItems.length > 0 && activeItemIndex === undefined) {
            throw new Error('expected non-empty stack to have an active component item');
        } else {
            const result: ResolvedStackItemConfig = {
                type: 'stack',
                content: this.calculateConfigContent() as ResolvedComponentItemConfig[],
                size: this.size,
                sizeUnit: this.sizeUnit,
                minSize: this.minSize,
                minSizeUnit: this.minSizeUnit,
                id: this.id,
                isClosable: this.isClosable,
                maximised: this.isMaximised,
                header: this.createHeaderConfig(),
                activeItemIndex,
            }
            return result;
        }
    }

    /**
     * Ok, this one is going to be the tricky one: The user has dropped a {@link (ContentItem:class)} onto this stack.
     *
     * It was dropped on either the stacks header or the top, right, bottom or left bit of the content area
     * (which one of those is stored in this._dropSegment). Now, if the user has dropped on the header the case
     * is relatively clear: We add the item to the existing stack... job done (might be good to have
     * tab reordering at some point, but lets not sweat it right now)
     *
     * If the item was dropped on the content part things are a bit more complicated. If it was dropped on either the
     * top or bottom region we need to create a new column and place the items accordingly.
     * Unless, of course if the stack is already within a column... in which case we want
     * to add the newly created item to the existing column...
     * either prepend or append it, depending on wether its top or bottom.
     *
     * Same thing for rows and left / right drop segments... so in total there are 9 things that can potentially happen
     * (left, top, right, bottom) * is child of the right parent (row, column) + header drop
     *
     * @internal

     * @zh 执行 `onDrop`，用于当放置。
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override onDrop(contentItem: ContentItem, area: ContentItem.Area): void {
        /*
         * The item was dropped on the header area. Just add it as a child of this stack and
         * get the hell out of this logic
         */
        if (this._dropSegment === Stack.Segment.Header) {
            this.resetHeaderDropZone();
            if (this._dropIndex === undefined) {
                throw new UnexpectedUndefinedError('SODDI68990');
            } else {
                this.addChild(contentItem, this._dropIndex);
                return;
            }
        }

        /*
         * The stack is empty. Let's just add the element.
         */
        if (this._dropSegment === Stack.Segment.Body) {
            this.addChild(contentItem, 0, true);
            return;
        }

        /*
         * The item was dropped on the top-, left-, bottom- or right- part of the content. Let's
         * aggregate some conditions to make the if statements later on more readable
         */
        const isVertical = this._dropSegment === Stack.Segment.Top || this._dropSegment === Stack.Segment.Bottom;
        const isHorizontal = this._dropSegment === Stack.Segment.Left || this._dropSegment === Stack.Segment.Right;
        const insertBefore = this._dropSegment === Stack.Segment.Top || this._dropSegment === Stack.Segment.Left;
        const hasCorrectParent = (isVertical && this.stackParent.isColumn) || (isHorizontal && this.stackParent.isRow);

        /*
         * The content item can be either a component or a stack. If it is a component, wrap it into a stack
         */
        if (contentItem.isComponent) {
            const itemConfig = ResolvedStackItemConfig.createDefault();
            itemConfig.header = this.createHeaderConfig();
            const stack = this.layoutManager.createAndInitContentItem(itemConfig, this);
            stack.addChild(contentItem);
            contentItem = stack;
        }


        /*
         * If the contentItem that's being dropped is not dropped on a Stack (cases which just passed above and
         * which would wrap the contentItem in a Stack) we need to check whether contentItem is a RowOrColumn.
         * If it is, we need to re-wrap it in a Stack like it was when it was dragged by its Tab (it was dragged!).
         */
        if(contentItem.type === ItemType.row || contentItem.type === ItemType.column){
            const itemConfig = ResolvedStackItemConfig.createDefault();
            itemConfig.header = this.createHeaderConfig();
            const stack = this.layoutManager.createContentItem(itemConfig, this);
            stack.addChild(contentItem)
            contentItem = stack
        }

        /*
         * If the item is dropped on top or bottom of a column or left and right of a row, it's already
         * layd out in the correct way. Just add it as a child
         */
        if (hasCorrectParent) {
            const index = this.stackParent.contentItems.indexOf(this);
            this.stackParent.addChild(contentItem, insertBefore ? index : index + 1, true);
            this.size *= 0.5;
            contentItem.size = this.size;
            contentItem.sizeUnit = this.sizeUnit;
            this.stackParent.updateSize(false);
            /*
             * This handles items that are dropped on top or bottom of a row or left / right of a column. We need
             * to create the appropriate contentItem for them to live in
             */
        } else {
            const type = isVertical ? ItemType.column : ItemType.row;
            const itemConfig = ResolvedItemConfig.createDefault(type) as ResolvedItemConfig;
            const rowOrColumn = this.layoutManager.createContentItem(itemConfig, this);
            this.stackParent.replaceChild(this, rowOrColumn);

            rowOrColumn.addChild(contentItem, insertBefore ? 0 : undefined, true);
            rowOrColumn.addChild(this, insertBefore ? undefined : 0, true);

            this.size = 50;
            contentItem.size = 50;
            contentItem.sizeUnit = SizeUnitEnum.Percent;
            rowOrColumn.updateSize(false);
        }
    }

    /**
     * Executes `highlightDropZone` to handle highlight drop zone.
     * @zh 执行 `highlightDropZone`，用于highlight放置区域(NgZone)。
     * @param x - x parameter (`number`) / X坐标参数（`number`）
     * @param y - y parameter (`number`) / Y坐标参数（`number`）
     */
    override highlightDropZone(x: number, y: number): void {
        for (const key in this._contentAreaDimensions) {
            const segment = key as Stack.Segment;
            const area = this._contentAreaDimensions[segment].hoverArea;

            if (area.x1 < x && area.x2 > x && area.y1 < y && area.y2 > y) {

                if (segment === Stack.Segment.Header) {
                    this._dropSegment = Stack.Segment.Header;
                    this.highlightHeaderDropZone(this._header.leftRightSided ? y : x);
                } else {
                    this.resetHeaderDropZone();
                    this.highlightBodyDropZone(segment);
                }

                return;
            }
        }
    }

    /**
     * Executes `getArea` to handle get area.
     * @internal
     * @zh 执行 `getArea`，用于获取区域。
     */
    getArea(): ContentItem.Area | null {
        if (this.element.style.display === 'none') {
            return null;
        }

        const headerArea = super.getElementArea(this._header.element);
        const contentArea = super.getElementArea(this._childElementContainer);
        if (headerArea === null || contentArea === null) {
            throw new UnexpectedNullError('SGAHC13086');
        }
        const contentWidth = contentArea.x2 - contentArea.x1;
        const contentHeight = contentArea.y2 - contentArea.y1;

        this._contentAreaDimensions = {
            header: {
                hoverArea: {
                    x1: headerArea.x1,
                    y1: headerArea.y1,
                    x2: headerArea.x2,
                    y2: headerArea.y2
                },
                highlightArea: {
                    x1: headerArea.x1,
                    y1: headerArea.y1,
                    x2: headerArea.x2,
                    y2: headerArea.y2
                }
            }
        };

        /**
         * Highlight the entire body if the stack is empty
         */
        if (this.contentItems.length === 0) {

            this._contentAreaDimensions.body = {
                hoverArea: {
                    x1: contentArea.x1,
                    y1: contentArea.y1,
                    x2: contentArea.x2,
                    y2: contentArea.y2
                },
                highlightArea: {
                    x1: contentArea.x1,
                    y1: contentArea.y1,
                    x2: contentArea.x2,
                    y2: contentArea.y2
                }
            };

            return super.getElementArea(this.element);
        } else {
            this._contentAreaDimensions.left = {
                hoverArea: {
                    x1: contentArea.x1,
                    y1: contentArea.y1,
                    x2: contentArea.x1 + contentWidth * 0.25,
                    y2: contentArea.y2
                },
                highlightArea: {
                    x1: contentArea.x1,
                    y1: contentArea.y1,
                    x2: contentArea.x1 + contentWidth * 0.5,
                    y2: contentArea.y2
                }
            };

            this._contentAreaDimensions.top = {
                hoverArea: {
                    x1: contentArea.x1 + contentWidth * 0.25,
                    y1: contentArea.y1,
                    x2: contentArea.x1 + contentWidth * 0.75,
                    y2: contentArea.y1 + contentHeight * 0.5
                },
                highlightArea: {
                    x1: contentArea.x1,
                    y1: contentArea.y1,
                    x2: contentArea.x2,
                    y2: contentArea.y1 + contentHeight * 0.5
                }
            };

            this._contentAreaDimensions.right = {
                hoverArea: {
                    x1: contentArea.x1 + contentWidth * 0.75,
                    y1: contentArea.y1,
                    x2: contentArea.x2,
                    y2: contentArea.y2
                },
                highlightArea: {
                    x1: contentArea.x1 + contentWidth * 0.5,
                    y1: contentArea.y1,
                    x2: contentArea.x2,
                    y2: contentArea.y2
                }
            };

            this._contentAreaDimensions.bottom = {
                hoverArea: {
                    x1: contentArea.x1 + contentWidth * 0.25,
                    y1: contentArea.y1 + contentHeight * 0.5,
                    x2: contentArea.x1 + contentWidth * 0.75,
                    y2: contentArea.y2
                },
                highlightArea: {
                    x1: contentArea.x1,
                    y1: contentArea.y1 + contentHeight * 0.5,
                    x2: contentArea.x2,
                    y2: contentArea.y2
                }
            };

            return super.getElementArea(this.element);
        }
    }

    /**
     * Programmatically operate with header position.
     *
     * @param position -
     *
     * @returns previous header position
     * @internal

     * @zh 执行 `positionHeader`，用于位置表头。
     */
    positionHeader(position: Side): void {
        if (this._header.side !== position) {
            this._header.setSide(position);
            this._headerSideChanged = true;
            this.setupHeaderPosition();
        }
    }

    /**
     * Executes `updateNodeSize` to handle update node size.
     * @internal
     * @zh 执行 `updateNodeSize`，用于更新节点尺寸。
     */
    private updateNodeSize(): void {
        if (this.element.style.display !== 'none') {
            const content: WidthAndHeight = getElementWidthAndHeight(this.element);

            if (this._header.show) {
                const dimension = this._header.leftRightSided ? WidthOrHeightPropertyName.width : WidthOrHeightPropertyName.height;
                content[dimension] -= this.layoutManager.layoutConfig.dimensions.headerHeight;
            }
            this._childElementContainer.style.width = numberToPixels(content.width);
            this._childElementContainer.style.height = numberToPixels(content.height);
            for (let i = 0; i < this.contentItems.length; i++) {
                this.contentItems[i].element.style.width = numberToPixels(content.width);
                this.contentItems[i].element.style.height = numberToPixels(content.height);
            }
            this.emit('resize');
            this.emitStateChangedEvent();
        }
    }

    /**
     * Executes `highlightHeaderDropZone` to handle highlight header drop zone.
     * @internal
     * @zh 执行 `highlightHeaderDropZone`，用于highlight表头放置区域(NgZone)。
     */
    private highlightHeaderDropZone(x: number): void {
        const visibleTabsLength = this._header.lastVisibleTabIndex + 1;
        const tabsContainerElement = this._header.tabsContainerElement;
        const tabsContainerElementChildNodes = tabsContainerElement.childNodes;

        // Create shallow copy of childNodes list, excluding DropPlaceHolder, as we will be modifying the childNodes list
        const visibleTabElements = new Array<HTMLElement>(visibleTabsLength);
        let tabIndex = 0;
        let tabCount = 0;
        while (tabCount < visibleTabsLength) {
            const visibleTabElement = tabsContainerElementChildNodes[tabIndex++] as HTMLElement;
            if (visibleTabElement !== this.layoutManager.tabDropPlaceholder) {
                visibleTabElements[tabCount++] = visibleTabElement;
            }
        }

        const dropTargetIndicator = this.layoutManager.dropTargetIndicator;
        if (dropTargetIndicator === null) {
            throw new UnexpectedNullError('SHHDZDTI97110');
        }

        let area: AreaLinkedRect;

        // Empty stack
        if (visibleTabsLength === 0) {
            const headerRect = this._header.element.getBoundingClientRect();
            const headerTop = headerRect.top + document.body.scrollTop;
            const headerLeft = headerRect.left + document.body.scrollLeft;

            area = {
                x1: headerLeft,
                x2: headerLeft + 100,
                y1: headerTop + headerRect.height - 20,
                y2: headerTop + headerRect.height,
            };

            this._dropIndex = 0;
        } else {
            let tabIndex = 0;
            // This indicates whether our cursor is exactly over a tab
            let isAboveTab = false;
            let tabTop: number;
            let tabLeft: number;
            let tabWidth: number;
            let tabElement: HTMLElement;
            do {
                tabElement = visibleTabElements[tabIndex] as HTMLElement;
                const tabRect = tabElement.getBoundingClientRect();
                const tabRectTop = tabRect.top + document.body.scrollTop;
                const tabRectLeft = tabRect.left + document.body.scrollLeft;

                if (this._header.leftRightSided) {
                    tabLeft = tabRectTop;
                    tabTop = tabRectLeft;
                    tabWidth = tabRect.height;
                } else {
                    tabLeft = tabRectLeft;
                    tabTop = tabRectTop;
                    tabWidth = tabRect.width;
                }

                if (x >= tabLeft && x < tabLeft + tabWidth) {
                    isAboveTab = true;
                } else {
                    tabIndex++;
                }
            } while (tabIndex < visibleTabsLength && !isAboveTab);

            // If we're not above any tabs, or to the right of any tab, we are out of the area, so give up
            if (isAboveTab === false && x < tabLeft) {
                return;
            }

            const halfX = tabLeft + tabWidth / 2;

            if (x < halfX) {
                this._dropIndex = tabIndex;
                tabElement.insertAdjacentElement('beforebegin', this.layoutManager.tabDropPlaceholder);
            } else {
                this._dropIndex = Math.min(tabIndex + 1, visibleTabsLength);
                tabElement.insertAdjacentElement('afterend', this.layoutManager.tabDropPlaceholder);
            }

            const tabDropPlaceholderRect = this.layoutManager.tabDropPlaceholder.getBoundingClientRect();
            const tabDropPlaceholderRectTop = tabDropPlaceholderRect.top + document.body.scrollTop;
            const tabDropPlaceholderRectLeft = tabDropPlaceholderRect.left + document.body.scrollLeft;
            const tabDropPlaceholderRectWidth = tabDropPlaceholderRect.width;

            if (this._header.leftRightSided) {
                const placeHolderTop = tabDropPlaceholderRectTop;
                area = {
                    x1: tabTop,
                    x2: tabTop + tabElement.clientHeight,
                    y1: placeHolderTop,
                    y2: placeHolderTop + tabDropPlaceholderRectWidth,
                };
            } else {
                const placeHolderLeft = tabDropPlaceholderRectLeft;

                area = {
                    x1: placeHolderLeft,
                    x2: placeHolderLeft + tabDropPlaceholderRectWidth,
                    y1: tabTop,
                    y2: tabTop + tabElement.clientHeight,
                };
            }
        }

        dropTargetIndicator.highlightArea(area, 0);
        return;
    }

    /**
     * Executes `resetHeaderDropZone` to handle reset header drop zone.
     * @internal
     * @zh 执行 `resetHeaderDropZone`，用于重置表头放置区域(NgZone)。
     */
    private resetHeaderDropZone() {
        this.layoutManager.tabDropPlaceholder.remove();
    }

    /**
     * Executes `setupHeaderPosition` to handle setup header position.
     * @internal
     * @zh 执行 `setupHeaderPosition`，用于setup表头位置。
     */
    private setupHeaderPosition() {
        setElementDisplayVisibility(this._header.element, this._header.show);
        this.element.classList.remove(DomConstants.ClassName.Left, DomConstants.ClassName.Right, DomConstants.ClassName.Bottom);
        if (this._header.leftRightSided) {
            this.element.classList.add('lm_' + this._header.side);
        }

        //if ([Side.right, Side.bottom].includes(this._header.side)) {
        //    // move the header behind the content.
        //    this.element.appendChild(this._header.element);
        //}
        this.updateSize(false);
    }

    /**
     * Executes `highlightBodyDropZone` to handle highlight body drop zone.
     * @internal
     * @zh 执行 `highlightBodyDropZone`，用于highlight主体放置区域(NgZone)。
     */
    private highlightBodyDropZone(segment: Stack.Segment): void {
        if (this._contentAreaDimensions === undefined) {
            throw new UnexpectedUndefinedError('SHBDZC82265');
        } else {
            const highlightArea = this._contentAreaDimensions[segment].highlightArea;
            const dropTargetIndicator = this.layoutManager.dropTargetIndicator;
            if (dropTargetIndicator === null) {
                throw new UnexpectedNullError('SHBDZD96110');
            } else {
                dropTargetIndicator.highlightArea(highlightArea, 1);
                this._dropSegment = segment;
            }
        }
    }

    /**
     * Executes `handleResize` to handle handle resize.
     * @internal
     * @zh 执行 `handleResize`，用于连接手柄调整尺寸。
     */
    private handleResize() {
        this._header.updateTabSizes()
    }

    /**
     * Executes `handleMaximised` to handle handle maximised.
     * @internal
     * @zh 执行 `handleMaximised`，用于连接手柄最大化。
     */
    private handleMaximised() {
        this._header.processMaximised();
    }

    /**
     * Executes `handleMinimised` to handle handle minimised.
     * @internal
     * @zh 执行 `handleMinimised`，用于连接手柄最小化。
     */
    private handleMinimised() {
        this._header.processMinimised();
    }

    /**
     * Executes `handlePopoutEvent` to handle handle popout event.
     * @internal
     * @zh 执行 `handlePopoutEvent`，用于连接手柄弹出窗口事件。
     */
    private handlePopoutEvent() {
        this.popout();
    }

    /**
     * Executes `handleHeaderClickEvent` to handle handle header click event.
     * @internal
     * @zh 执行 `handleHeaderClickEvent`，用于连接手柄表头点击事件。
     */
    private handleHeaderClickEvent(ev: MouseEvent) {
        const eventName = EventEmitter.headerClickEventName;
        const bubblingEvent = new EventEmitter.ClickBubblingEvent(eventName, this, ev);
        this.emit(eventName, bubblingEvent);
    }

    /**
     * Property `contentClickEventListener` (`any`) storing content click event listener.
     * @zh 属性 `contentClickEventListener`（类型：`any`），用于存储或配置内容点击事件监听器。
     */
    contentClickEventListener=(ev: MouseEvent)=> {
        const eventName = EventEmitter.contentClickEventName;
        const bubblingEvent = new EventEmitter.ClickBubblingEvent(eventName, this, ev);
        this.emit(eventName, bubblingEvent);
        let activeComp=this.getActiveComponentItem();
        this.layoutManager.setFocusedComponentItem(activeComp);
    }

    /**
     * Executes `handleHeaderTouchStartEvent` to handle handle header touch start event.
     * @internal
     * @zh 执行 `handleHeaderTouchStartEvent`，用于连接手柄表头触摸开始事件。
     */
    private handleHeaderTouchStartEvent(ev: TouchEvent) {
        const eventName = EventEmitter.headerTouchStartEventName;
        const bubblingEvent = new EventEmitter.TouchStartBubblingEvent(eventName, this, ev);
        this.emit(eventName, bubblingEvent);
    }

    /**
     * Executes `handleHeaderComponentRemoveEvent` to handle handle header component remove event.
     * @internal
     * @zh 执行 `handleHeaderComponentRemoveEvent`，用于连接手柄表头组件移除事件。
     */
    private handleHeaderComponentRemoveEvent(item: ComponentItem) {
        this.removeChild(item, false);
    }

    /**
     * Executes `handleHeaderComponentFocusEvent` to handle handle header component focus event.
     * @internal
     * @zh 执行 `handleHeaderComponentFocusEvent`，用于连接手柄表头组件聚焦事件。
     */
    private handleHeaderComponentFocusEvent(item: ComponentItem) {
        this.setActiveComponentItem(item, true);
    }

    /**
     * Executes `handleHeaderComponentStartDragEvent` to handle handle header component start drag event.
     * @internal
     * @zh 执行 `handleHeaderComponentStartDragEvent`，用于连接手柄表头组件开始拖拽事件。
     */
    private handleHeaderComponentStartDragEvent(x: number, y: number, dragListener: DragListener, componentItem: ComponentItem) {
        if (this.isMaximised === true) {
            this.toggleMaximise();
        }
        this.layoutManager.startComponentDrag(x, y, dragListener, componentItem, this);
    }

    /**
     * Executes `createHeaderConfig` to handle create header config.
     * @internal
     * @zh 执行 `createHeaderConfig`，用于创建表头配置。
     */
    private createHeaderConfig() {
        if (!this._headerSideChanged) {
            return ResolvedHeaderedItemConfig.Header.createCopy(this._headerConfig);
        } else {
            const show = this._header.show ? this._header.side : false;

            let result = ResolvedHeaderedItemConfig.Header.createCopy(this._headerConfig, show);
            if (result === undefined) {
                result = {
                    show,
                    popout: undefined,
                    maximise: undefined,
                    close: undefined,
                    minimise: undefined,
                    tabDropdown: undefined,
                };
            }
            return result;
        }
    }

    /**
     * Executes `emitStateChangedEvent` to handle emit state changed event.
     * @zh 执行 `emitStateChangedEvent`，用于发出状态已变更事件。
     */
    private emitStateChangedEvent() {
        this.emitBaseBubblingEvent('stateChanged');
    }
}

/** @public */
export namespace Stack {
    /**
     * Enumeration `Segment` defining supported segment constants.
     * @internal
     * @zh 枚举 `Segment`，定义支持的Segment常量集合。
     */
    export const enum Segment {
        /**
         * Enum member `Segment.Header` = 'header' representing header.
         * @zh 枚举项 `Segment.Header` = 'header'，表示表头。
         */
        Header = 'header',
        /**
         * Enum member `Segment.Body` = 'body' representing body.
         * @zh 枚举项 `Segment.Body` = 'body'，表示主体。
         */
        Body = 'body',
        /**
         * Enum member `Segment.Left` = 'left' representing left.
         * @zh 枚举项 `Segment.Left` = 'left'，表示左侧位置。
         */
        Left = 'left',
        /**
         * Enum member `Segment.Right` = 'right' representing right.
         * @zh 枚举项 `Segment.Right` = 'right'，表示右侧位置。
         */
        Right = 'right',
        /**
         * Enum member `Segment.Top` = 'top' representing top.
         * @zh 枚举项 `Segment.Top` = 'top'，表示顶部位置。
         */
        Top = 'top',
        /**
         * Enum member `Segment.Bottom` = 'bottom' representing bottom.
         * @zh 枚举项 `Segment.Bottom` = 'bottom'，表示底部位置。
         */
        Bottom = 'bottom',
    }

    /**
     * Interface `ContentAreaDimension` defining the contract and properties for content area dimension.
     * @internal
     * @zh 接口 `ContentAreaDimension`，定义内容区域维度的数据结构契约与属性规范。
     */
    export interface ContentAreaDimension {
        /**
         * Property `hoverArea` (`AreaLinkedRect`) storing hover area.
         * @zh 属性 `hoverArea`（类型：`AreaLinkedRect`），用于存储或配置hover区域。
         */
        hoverArea: AreaLinkedRect;
        /**
         * Property `highlightArea` (`AreaLinkedRect`) storing highlight area.
         * @zh 属性 `highlightArea`（类型：`AreaLinkedRect`），用于存储或配置highlight区域。
         */
        highlightArea: AreaLinkedRect;
    }

    /**
     * Type alias `ContentAreaDimensions` representing content area dimensions (`{ [segment: string]: ContentAreaDimension; body?:any; top?:any; left?:...`).
     * @internal
     * @zh 类型别名 `ContentAreaDimensions`，表示内容区域维度列表（`{ [segment: string]: ContentAreaDimension; body?:any; top?:any; left?:...`）。
     */
    export type ContentAreaDimensions = {
        [segment: string]: ContentAreaDimension;
        /**
         * Property `body` (`any`) storing body.
         * @zh 属性 `body`（类型：`any`），用于存储或配置主体。
         */
        body?;
        /**
         * Property `top` (`any`) storing top.
         * @zh 属性 `top`（类型：`any`），用于存储或配置顶部位置。
         */
        top?;
        /**
         * Property `left` (`any`) storing left.
         * @zh 属性 `left`（类型：`any`），用于存储或配置左侧位置。
         */
        left?;
        /**
         * Property `bottom` (`any`) storing bottom.
         * @zh 属性 `bottom`（类型：`any`），用于存储或配置底部位置。
         */
        bottom?;
        /**
         * Property `right` (`any`) storing right.
         * @zh 属性 `right`（类型：`any`），用于存储或配置右侧位置。
         */
        right?;
    };

    /**
     * Executes `createElement` to handle create element.
     * @internal
     * @zh 执行 `createElement`，用于创建元素。
     */
    export function createElement(document: Document): HTMLDivElement {
        const element = document.createElement('div');
        element.classList.add(DomConstants.ClassName.Item);
        element.classList.add(DomConstants.ClassName.Stack);
        return element;
    }
}
