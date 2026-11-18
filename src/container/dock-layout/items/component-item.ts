/**
 * @fileoverview Module `src/container/dock-layout/items/component-item.ts` providing component item definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/items/component-item.ts`，提供组件条目相关的定义与实现。
 */

import { TranslateService } from '@dotos1/dui/translator';
import { ResolvedComponentItemConfig, ResolvedHeaderedItemConfig } from '../config/resolved-config';
import { ComponentContainer } from '../container/component-container';
import { Tab } from '../controls/tab';
import { UnexpectedNullError } from '../errors/internal-error';
import { LayoutManager } from '../layout-manager';
import { DomConstants } from '../utils/dom-constants';
import { ItemType, JsonValue } from '../utils/types';
import { getElementWidthAndHeight, setElementHeight, setElementWidth } from '../utils/utils';
import { ComponentParentableItem } from './component-parentable-item';
import { ContentItem } from './content-item';

/**
 * Class `ComponentItem` encapsulating component item data structures and logic in `src/container/dock-layout/items`.
 * @public
 * @zh 类 `ComponentItem`，封装 `src/container/dock-layout/items` 中的组件条目数据结构与处理逻辑。
 */
export class ComponentItem extends ContentItem {
    /**
     * Property `_reorderEnabled` (`boolean`) storing reorder enabled.
     * @internal
     * @zh 属性 `_reorderEnabled`（类型：`boolean`），用于存储或配置重排已启用。
     */
    private _reorderEnabled: boolean;
    /**
     * Property `_headerConfig` (`ResolvedHeaderedItemConfig.Header`) storing header config.
     * @internal
     * @zh 属性 `_headerConfig`（类型：`ResolvedHeaderedItemConfig.Header`），用于存储或配置表头配置。
     */
    private _headerConfig: ResolvedHeaderedItemConfig.Header | undefined;
    /**
     * Property `_title` (`string`) storing title.
     * @internal
     * @zh 属性 `_title`（类型：`string`），用于存储或配置标题。
     */
    private _title: string;
    /**
     * Property `_initialWantMaximise` (`boolean`) storing initial want maximise.
     * @internal
     * @zh 属性 `_initialWantMaximise`（类型：`boolean`），用于存储或配置初始Want最大化。
     */
    private readonly _initialWantMaximise: boolean;
    /**
     * Property `_container` (`ComponentContainer`) storing container.
     * @internal
     * @zh 属性 `_container`（类型：`ComponentContainer`），用于存储或配置容器。
     */
    private _container: ComponentContainer;
    /**
     * Property `_tab` (`Tab`) storing tab.
     * @internal
     * @zh 属性 `_tab`（类型：`Tab`），用于存储或配置选项卡。
     */
    private _tab: Tab;
    /**
     * Property `_focused` (`boolean`) storing focused (default: `false`).
     * @internal
     * @zh 属性 `_focused`（类型：`boolean`），用于存储或配置已聚焦（默认值：`false`）。
     */
    private _focused = false;

    /**
     * @internal @deprecated use {@link (ComponentItem:class).componentType}
     * @zh 获取当前组件名称（`componentName: JsonValue`）。
     */
    get componentName(): JsonValue { return this._container.componentType; }
    /**
     * Gets the current component type (`componentType: JsonValue`).
     * @zh 获取当前组件类型（`componentType: JsonValue`）。
     */
    get componentType(): JsonValue { return this._container.componentType; }
    /**
     * Gets the current reorder enabled (`reorderEnabled: boolean`).
     * @zh 获取当前重排已启用（`reorderEnabled: boolean`）。
     */
    get reorderEnabled(): boolean { return this._reorderEnabled; }
    /**
     * Gets the current initial want maximise (`initialWantMaximise: boolean`).
     * @internal
     * @zh 获取当前初始Want最大化（`initialWantMaximise: boolean`）。
     */
    get initialWantMaximise(): boolean { return this._initialWantMaximise; }
    /**
     * Gets the current component (`component: ComponentContainer.Component | undefined`).
     * @zh 获取当前组件（`component: ComponentContainer.Component | undefined`）。
     */
    get component(): ComponentContainer.Component | undefined { return this._container.component; }
    /**
     * Gets the current container (`container: ComponentContainer`).
     * @zh 获取当前容器（`container: ComponentContainer`）。
     */
    get container(): ComponentContainer { return this._container; }
    /**
     * Gets the current parent item (`parentItem: ComponentParentableItem`).
     * @zh 获取当前父级条目（`parentItem: ComponentParentableItem`）。
     */
    get parentItem(): ComponentParentableItem { return this._parentItem; }

    /**
     * Gets the current header config (`headerConfig: ResolvedHeaderedItemConfig.Header | undefined`).
     * @zh 获取当前表头配置（`headerConfig: ResolvedHeaderedItemConfig.Header | undefined`）。
     */
    get headerConfig(): ResolvedHeaderedItemConfig.Header | undefined { return this._headerConfig; }
    /**
     * Gets the current title (`title: string`).
     * @zh 获取当前标题（`title: string`）。
     */
    get title(): string { return this._title; }
    /**
     * Gets the current tab (`tab: Tab`).
     * @zh 获取当前选项卡（`tab: Tab`）。
     */
    get tab(): Tab { return this._tab; }
    /**
     * Gets the current focused (`focused: boolean`).
     * @zh 获取当前已聚焦（`focused: boolean`）。
     */
    get focused(): boolean { return this._focused; }

    /**
     * Creates an instance of `ComponentItem` and initializes its dependencies and internal state.
     * @internal
     * @zh 创建 `ComponentItem` 实例，并初始化其依赖项与内部状态。
     */
    constructor(
        private translator:TranslateService,
        layoutManager: LayoutManager,
        config: ResolvedComponentItemConfig,
        /** @internal */
        private _parentItem: ComponentParentableItem
    ) {
        super(layoutManager, config, _parentItem, document.createElement('div'));

        this.isComponent = true;

        this._reorderEnabled = config.reorderEnabled;

        this.applyUpdatableConfig(config);

        this._initialWantMaximise = config.maximised;

        const containerElement = document.createElement('div');
        containerElement.classList.add(DomConstants.ClassName.Content);
        this.element.appendChild(containerElement);
        this._container = new ComponentContainer(translator,config, this, layoutManager, containerElement,
            (itemConfig) => this.handleUpdateItemConfigEvent(itemConfig),
            () => this.show(),
            () => this.hide(),
            (suppressEvent) => this.focus(suppressEvent),
            (suppressEvent) => this.blur(suppressEvent),
        );
    }

    /**
     * Executes `destroy` to handle destroy.
     * @internal
     * @zh 执行 `destroy`，用于销毁。
     */
    override destroy(): void {
        this._container.destroy()
        super.destroy();
    }

    /**
     * Executes `applyUpdatableConfig` to handle apply updatable config.
     * @zh 执行 `applyUpdatableConfig`，用于应用Updatable配置。
     * @param config - config parameter (`ResolvedComponentItemConfig`) / 配置参数（`ResolvedComponentItemConfig`）
     */
    applyUpdatableConfig(config: ResolvedComponentItemConfig): void {
        this.setTitle(config.title);
        this._headerConfig = config.header;
    }

    /**
     * Executes `toConfig` to handle to config.
     * @zh 执行 `toConfig`，用于转换为配置。
     * @returns Result of type `ResolvedComponentItemConfig` / 类型为 `ResolvedComponentItemConfig` 的返回值
     */
    toConfig(): ResolvedComponentItemConfig {
        const stateRequestEvent = this._container.stateRequestEvent;
        const state = stateRequestEvent === undefined ? this._container.state : stateRequestEvent();
        let componentType='';
        if(this.componentType['xtype']){
            componentType=this.componentType['xtype'];
        }else if(this.componentType['node']){
            componentType=this.componentType['node'].tagName.toLowerCase()
        }
        const result: ResolvedComponentItemConfig = {
            type: ItemType.component,
            content: [],
            size: this.size,
            sizeUnit: this.sizeUnit,
            minSize: this.minSize,
            minSizeUnit: this.minSizeUnit,
            id: this.id,
            maximised: false,
            isClosable: this.isClosable,
            reorderEnabled: this._reorderEnabled,
            title: this._title,
            header: ResolvedHeaderedItemConfig.Header.createCopy(this._headerConfig),
            componentType:componentType,
            // componentType: ResolvedComponentItemConfig.copyComponentType(this.componentType),
            componentState: state,
        }

        return result;
    }

    /**
     * Executes `close` to handle close.
     * @zh 执行 `close`，用于关闭。
     */
    close(): void {
        if (this.parent === null) {
            throw new UnexpectedNullError('CIC68883');
        } else {
            this.parent.removeChild(this, false);
        }
    }

    // Used by Drag Proxy
    /**
     * Executes `enterDragMode` to handle enter drag mode.
     * @internal
     * @zh 执行 `enterDragMode`，用于进入拖拽模式。
     */
    enterDragMode(width: number, height: number): void {
        setElementWidth(this.element, width);
        setElementHeight(this.element, height);
        this._container.enterDragMode(width, height);
    }

    /**
     * Executes `exitDragMode` to handle exit drag mode.
     * @internal
     * @zh 执行 `exitDragMode`，用于退出拖拽模式。
     */
    exitDragMode(): void {
        this._container.exitDragMode();
    }

    /**
     * Executes `enterStackMaximised` to handle enter stack maximised.
     * @internal
     * @zh 执行 `enterStackMaximised`，用于进入栈最大化。
     */
    enterStackMaximised(): void {
        this._container.enterStackMaximised();
    }

    /**
     * Executes `exitStackMaximised` to handle exit stack maximised.
     * @internal
     * @zh 执行 `exitStackMaximised`，用于退出栈最大化。
     */
    exitStackMaximised(): void {
        this._container.exitStackMaximised();
    }

    // Used by Drag Proxy
    /**
     * Executes `drag` to handle drag.
     * @internal
     * @zh 执行 `drag`，用于拖拽。
     */
    drag(): void {
        this._container.drag();
    }

    /**
     * Executes `updateSize` to handle update size.
     * @internal
     * @zh 执行 `updateSize`，用于更新尺寸。
     */
    override updateSize(force: boolean): void {
        this.updateNodeSize(force);
    }

    /**
     * Executes `init` to handle init.
     * @internal
     * @zh 执行 `init`，用于初始化。
     */
    override init(): void {
        this.updateNodeSize(false);

        super.init();
        this._container.emit('open');
        this.initContentItems();
    }


    /**
     * Executes `setTitle` to handle set title.
     * @zh 执行 `setTitle`，用于集合标题。
     * @param title - title parameter (`string`) / 标题参数（`string`）
     */
    setTitle(title: string): void {
        this._title = title;
        this.emit('titleChanged', title);
        this.emit('stateChanged');
    }

    /**
     * Executes `setTab` to handle set tab.
     * @zh 执行 `setTab`，用于集合选项卡。
     * @param tab - tab parameter (`Tab`) / 选项卡参数（`Tab`）
     */
    setTab(tab: Tab): void {
        this._tab = tab;
        this.emit('tab', tab)
        this._container.setTab(tab);
    }

    /**
     * Executes `hide` to handle hide.
     * @internal
     * @zh 执行 `hide`，用于隐藏。
     */
    override hide(): void {
        super.hide();
        this._container.setVisibility(false);
    }

    /**
     * Executes `show` to handle show.
     * @internal
     * @zh 执行 `show`，用于显示。
     */
    override show(): void {
        super.show();
        this._container.setVisibility(true);
    }

    /**
     * Focuses the item if it is not already focused

     * @zh 执行 `focus`，用于聚焦。
     */
    focus(suppressEvent = false): void {
        this.parentItem.setActiveComponentItem(this, true, suppressEvent);
    }

    /**
     * Executes `setFocused` to handle set focused.
     * @internal
     * @zh 执行 `setFocused`，用于集合已聚焦。
     */
    setFocused(suppressEvent: boolean): void {
        this._focused = true;
        this.tab.setFocused();
        if (!suppressEvent) {
            this.emitBaseBubblingEvent('focus');
        }
    }

    /**
     * Executes `blur` to handle blur.
     * @zh 执行 `blur`，用于失焦。
     * @param suppressEvent - suppress event parameter (`boolean`) / suppress事件参数（`boolean`）
     */
    blur(suppressEvent = false): void {
        if (this._focused) {
            this.layoutManager.setFocusedComponentItem(undefined, suppressEvent);
        }
    }

    /**
     * Executes `setBlurred` to handle set blurred.
     * @internal
     * @zh 执行 `setBlurred`，用于集合已失焦。
     */
    setBlurred(suppressEvent: boolean): void {
        this._focused = false;
        this.tab.setBlurred();
        if (!suppressEvent) {
            this.emitBaseBubblingEvent('blur');
        }
    }

    /**
     * Executes `setParent` to handle set parent.
     * @internal
     * @zh 执行 `setParent`，用于集合父级。
     */
    protected override setParent(parent: ContentItem): void {
        this._parentItem = parent as ComponentParentableItem;
        super.setParent(parent);
    }

    /**
     * Executes `handleUpdateItemConfigEvent` to handle handle update item config event.
     * @internal
     * @zh 执行 `handleUpdateItemConfigEvent`，用于连接手柄更新条目配置事件。
     */
    private handleUpdateItemConfigEvent(itemConfig: ResolvedComponentItemConfig) {
        this.applyUpdatableConfig(itemConfig);
    }

    /**
     * Executes `updateNodeSize` to handle update node size.
     * @internal
     * @zh 执行 `updateNodeSize`，用于更新节点尺寸。
     */
    private updateNodeSize(force: boolean): void {
        if (this.element.style.display !== 'none') {
            // Do not update size of hidden components to prevent unwanted reflows

            const { width, height } = getElementWidthAndHeight(this.element);
            this._container.setSizeToNodeSize(width, height, force);
        }
    }
}

/**
 * @public @deprecated use {@link (ComponentItem:class)}
 * @zh 类型别名 `Component`，表示组件（`ComponentItem`）。
 */
export type Component = ComponentItem;

/** @public */
export namespace ComponentItem {
    /**
     * Type alias `Component` representing component (`ComponentContainer.Component`).
     * @zh 类型别名 `Component`，表示组件（`ComponentContainer.Component`）。
     */
    export type Component = ComponentContainer.Component;
}
