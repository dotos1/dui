/**
 * @fileoverview Module `src/container/dock-layout/layout-manager.ts` providing layout manager definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/layout-manager.ts`，提供布局管理器相关的定义与实现。
 */

/* eslint-disable no-dupe-class-members */
import { TranslateService } from '@dotos/dui/translator';
import { ComponentItemConfig, ItemConfig, LayoutConfig, RowOrColumnItemConfig, StackItemConfig } from './config/config';
import {
    ResolvedComponentItemConfig,
    ResolvedItemConfig,
    ResolvedLayoutConfig,
    ResolvedPopoutLayoutConfig,
    ResolvedRootItemConfig,
    ResolvedRowOrColumnItemConfig,
    ResolvedStackItemConfig
} from "./config/resolved-config";
import { ComponentContainer } from './container/component-container';
import { BrowserPopout } from './controls/browser-popout';
import { DragProxy } from './controls/drag-proxy';
import { DragSource } from './controls/drag-source';
import { DropTargetIndicator } from './controls/drop-target-indicator';
import { TransitionIndicator } from './controls/transition-indicator';
import { ConfigurationError } from './errors/external-error';
import { AssertError, UnexpectedNullError, UnexpectedUndefinedError, UnreachableCaseError } from './errors/internal-error';
import { ComponentItem } from './items/component-item';
import { ComponentParentableItem } from './items/component-parentable-item';
import { ContentItem } from './items/content-item';
import { GroundItem } from './items/ground-item';
import { RowOrColumn } from './items/row-or-column';
import { Stack } from './items/stack';
import { ConfigMinifier } from './utils/config-minifier';
import { DomConstants } from './utils/dom-constants';
import { DragListener } from './utils/drag-listener';
import { EventEmitter } from './utils/event-emitter';
import { EventHub } from './utils/event-hub';
import { ItemType, JsonValue, Rect, ResponsiveMode } from './utils/types';
import {
    getElementWidthAndHeight,
    removeFromArray,
    setElementHeight,
    setElementWidth
} from './utils/utils';

/** @internal */
declare global {
    /**
     * Interface `Window` defining the contract and properties for window.
     * @zh 接口 `Window`，定义窗口的数据结构契约与属性规范。
     */
    interface Window {
        /**
         * Property `__glInstance` (`LayoutManager`) storing gl instance.
         * @zh 属性 `__glInstance`（类型：`LayoutManager`），用于存储或配置gl实例。
         */
        __glInstance: LayoutManager;
    }
}

/**
 * Class `LayoutManager` encapsulating layout manager data structures and logic in `src/container/dock-layout`.
 * @zh 类 `LayoutManager`，封装 `src/container/dock-layout` 中的布局管理器数据结构与处理逻辑。
 */
export abstract class LayoutManager extends EventEmitter {

    /**
     * Property `resizeWithContainerAutomatically` (`boolean`) storing resize with container automatically (default: `false`).
     * @zh 属性 `resizeWithContainerAutomatically`（类型：`boolean`），用于存储或配置调整尺寸带有容器Automatically（默认值：`false`）。
     */
    resizeWithContainerAutomatically = false;
  
    /**
     * Property `resizeDebounceInterval` (`number`) storing resize debounce interval (default: `100`).
     * @zh 属性 `resizeDebounceInterval`（类型：`number`），用于存储或配置调整尺寸防抖间隔定时器（默认值：`100`）。
     */
    resizeDebounceInterval = 100;

    /**
     * Property `resizeDebounceExtendedWhenPossible` (`boolean`) storing resize debounce extended when possible (default: `true`).
     * @zh 属性 `resizeDebounceExtendedWhenPossible`（类型：`boolean`），用于存储或配置调整尺寸防抖ExtendedWhenPossible（默认值：`true`）。
     */
    resizeDebounceExtendedWhenPossible = true;

    /**
     * Property `_containerElement` (`HTMLElement`) storing container element.
     * @internal
     * @zh 属性 `_containerElement`（类型：`HTMLElement`），用于存储或配置容器元素。
     */
    private _containerElement: HTMLElement;
    /**
     * Property `_isInitialised` (`boolean`) storing is initialised (default: `false`).
     * @internal
     * @zh 属性 `_isInitialised`（类型：`boolean`），用于存储或配置是否为Initialised（默认值：`false`）。
     */
    private _isInitialised = false;
    /**
     * Property `_groundItem` (`GroundItem | undefined`) storing ground item (default: `undefined`).
     * @internal
     * @zh 属性 `_groundItem`（类型：`GroundItem | undefined`），用于存储或配置ground条目（默认值：`undefined`）。
     */
    private _groundItem: GroundItem | undefined = undefined;
    /**
     * Property `_openPopouts` (`BrowserPopout[]`) storing open popouts (default: `[]`).
     * @internal
     * @zh 属性 `_openPopouts`（类型：`BrowserPopout[]`），用于存储或配置打开弹出窗口（默认值：`[]`）。
     */
    private _openPopouts: BrowserPopout[] = [];
    /**
     * Property `_dropTargetIndicator` (`DropTargetIndicator | null`) storing drop target indicator (default: `null`).
     * @internal
     * @zh 属性 `_dropTargetIndicator`（类型：`DropTargetIndicator | null`），用于存储或配置放置目标指示器（默认值：`null`）。
     */
    private _dropTargetIndicator: DropTargetIndicator | null = null;
    /**
     * Property `_transitionIndicator` (`TransitionIndicator | null`) storing transition indicator (default: `null`).
     * @internal
     * @zh 属性 `_transitionIndicator`（类型：`TransitionIndicator | null`），用于存储或配置过渡动画指示器（默认值：`null`）。
     */
    private _transitionIndicator: TransitionIndicator | null = null;
    /**
     * Property `_resizeTimeoutId` (`ReturnType<typeof setTimeout> | undefined`) storing resize timeout id.
     * @internal
     * @zh 属性 `_resizeTimeoutId`（类型：`ReturnType<typeof setTimeout> | undefined`），用于存储或配置调整尺寸延时器唯一标识。
     */
    private _resizeTimeoutId: ReturnType<typeof setTimeout> | undefined;
    /**
     * Property `_itemAreas` (`ContentItem.Area[]`) storing item areas (default: `[]`).
     * @internal
     * @zh 属性 `_itemAreas`（类型：`ContentItem.Area[]`），用于存储或配置条目区域集合（默认值：`[]`）。
     */
    private _itemAreas: ContentItem.Area[] = [];
    /**
     * Property `_maximisedStack` (`Stack | undefined`) storing maximised stack.
     * @internal
     * @zh 属性 `_maximisedStack`（类型：`Stack | undefined`），用于存储或配置最大化栈。
     */
    private _maximisedStack: Stack | undefined;
    /**
     * Property `_maximisePlaceholder` (`any`) storing maximise placeholder.
     * @internal
     * @zh 属性 `_maximisePlaceholder`（类型：`any`），用于存储或配置最大化占位提示。
     */
    private _maximisePlaceholder = LayoutManager.createMaximisePlaceElement(document);
    /**
     * Property `_tabDropPlaceholder` (`any`) storing tab drop placeholder.
     * @internal
     * @zh 属性 `_tabDropPlaceholder`（类型：`any`），用于存储或配置选项卡放置占位提示。
     */
    private _tabDropPlaceholder = LayoutManager.createTabDropPlaceholderElement(document);
    /**
     * Property `_dragSources` (`DragSource[]`) storing drag sources (default: `[]`).
     * @internal
     * @zh 属性 `_dragSources`（类型：`DragSource[]`），用于存储或配置拖拽源（默认值：`[]`）。
     */
    private _dragSources: DragSource[] = [];
    /**
     * Property `_updatingColumnsResponsive` (`boolean`) storing updating columns responsive (default: `false`).
     * @internal
     * @zh 属性 `_updatingColumnsResponsive`（类型：`boolean`），用于存储或配置更新列集合Responsive（默认值：`false`）。
     */
    private _updatingColumnsResponsive = false;
    /**
     * Property `_firstLoad` (`boolean`) storing first load (default: `true`).
     * @internal
     * @zh 属性 `_firstLoad`（类型：`boolean`），用于存储或配置首个加载（默认值：`true`）。
     */
    private _firstLoad = true;
    /**
     * Property `_eventHub` (`EventHub`) storing event hub (default: `new EventHub(this)`).
     * @internal
     * @zh 属性 `_eventHub`（类型：`EventHub`），用于存储或配置事件Hub（默认值：`new EventHub(this)`）。
     */
    private _eventHub = new EventHub(this);
    /**
     * Property `_width` (`number | null`) storing width (default: `null`).
     * @internal
     * @zh 属性 `_width`（类型：`number | null`），用于存储或配置宽度（默认值：`null`）。
     */
    private _width: number | null = null;
    /**
     * Property `_height` (`number | null`) storing height (default: `null`).
     * @internal
     * @zh 属性 `_height`（类型：`number | null`），用于存储或配置高度（默认值：`null`）。
     */
    private _height: number | null = null;
    /**
     * Property `_focusedComponentItem` (`ComponentItem | undefined`) storing focused component item.
     * @internal
     * @zh 属性 `_focusedComponentItem`（类型：`ComponentItem | undefined`），用于存储或配置已聚焦组件条目。
     */
    private _focusedComponentItem: ComponentItem | undefined;
    /**
     * Property `_virtualSizedContainers` (`ComponentContainer[]`) storing virtual sized containers (default: `[]`).
     * @internal
     * @zh 属性 `_virtualSizedContainers`（类型：`ComponentContainer[]`），用于存储或配置虚拟滚动已尺寸容器（默认值：`[]`）。
     */
    private _virtualSizedContainers: ComponentContainer[] = [];
    /**
     * Property `_virtualSizedContainerAddingBeginCount` (`number`) storing virtual sized container adding begin count (default: `0`).
     * @internal
     * @zh 属性 `_virtualSizedContainerAddingBeginCount`（类型：`number`），用于存储或配置虚拟滚动已尺寸容器添加开始计数（默认值：`0`）。
     */
    private _virtualSizedContainerAddingBeginCount = 0;
    /**
     * Property `_sizeInvalidationBeginCount` (`number`) storing size invalidation begin count (default: `0`).
     * @internal
     * @zh 属性 `_sizeInvalidationBeginCount`（类型：`number`），用于存储或配置尺寸Invalidation开始计数（默认值：`0`）。
     */
    private _sizeInvalidationBeginCount = 0;
    /**
     * Property `_constructorOrSubWindowLayoutConfig` (`LayoutConfig | undefined`) storing constructor or sub window layout config.
     * @internal
     * @zh 属性 `_constructorOrSubWindowLayoutConfig`（类型：`LayoutConfig | undefined`），用于存储或配置constructorOr子窗口布局配置。
     */
    protected _constructorOrSubWindowLayoutConfig: LayoutConfig | undefined; // protected for backwards compatibility

    /**
     * Property `_resizeObserver` (`ResizeObserver`) storing resize observer.
     * @internal
     * @zh 属性 `_resizeObserver`（类型：`ResizeObserver`），用于存储或配置调整尺寸观察者。
     */
    private _resizeObserver = new ResizeObserver(() => this.handleContainerResize());

    /**
     * Property `_windowBeforeUnloadListener` (`any`) storing window before unload listener (default: `() => this.onBeforeUnload()`).
     * @zh 属性 `_windowBeforeUnloadListener`（类型：`any`），用于存储或配置窗口之前Unload监听器（默认值：`() => this.onBeforeUnload()`）。
     */
    private _windowBeforeUnloadListener = () => this.onBeforeUnload();

    /**
     * Property `_windowBeforeUnloadListening` (`boolean`) storing window before unload listening (default: `false`).
     * @zh 属性 `_windowBeforeUnloadListening`（类型：`boolean`），用于存储或配置窗口之前Unload监听（默认值：`false`）。
     */
    private _windowBeforeUnloadListening = false;
    /**
     * Property `_maximisedStackBeforeDestroyedListener` (`any`) storing maximised stack before destroyed listener.
     * @internal
     * @zh 属性 `_maximisedStackBeforeDestroyedListener`（类型：`any`），用于存储或配置最大化栈之前已销毁监听器。
     */
    private _maximisedStackBeforeDestroyedListener = (ev: EventEmitter.BubblingEvent) => this.cleanupBeforeMaximisedStackDestroyed(ev);

    /**
     * Property `isSubWindow` (`boolean`) storing is sub window.
     * @zh 属性 `isSubWindow`（类型：`boolean`），用于存储或配置是否为子窗口。
     */
    readonly isSubWindow: boolean;
    /**
     * Property `layoutConfig` (`ResolvedLayoutConfig`) storing layout config.
     * @zh 属性 `layoutConfig`（类型：`ResolvedLayoutConfig`），用于存储或配置布局配置。
     */
    layoutConfig: ResolvedLayoutConfig;

    /**
     * Property `beforeVirtualRectingEvent` (`LayoutManager.BeforeVirtualRectingEvent | undefined`) storing before virtual recting event.
     * @zh 属性 `beforeVirtualRectingEvent`（类型：`LayoutManager.BeforeVirtualRectingEvent | undefined`），用于存储或配置之前虚拟滚动矩形事件。
     */
    beforeVirtualRectingEvent: LayoutManager.BeforeVirtualRectingEvent | undefined;
    /**
     * Property `afterVirtualRectingEvent` (`LayoutManager.AfterVirtualRectingEvent | undefined`) storing after virtual recting event.
     * @zh 属性 `afterVirtualRectingEvent`（类型：`LayoutManager.AfterVirtualRectingEvent | undefined`），用于存储或配置之后虚拟滚动矩形事件。
     */
    afterVirtualRectingEvent: LayoutManager.AfterVirtualRectingEvent | undefined;

    /**
     * Gets the current container (`container: HTMLElement`).
     * @zh 获取当前容器（`container: HTMLElement`）。
     */
    get container(): HTMLElement { return this._containerElement; }
    /**
     * Gets the current is initialised (`isInitialised: boolean`).
     * @zh 获取当前是否为Initialised（`isInitialised: boolean`）。
     */
    get isInitialised(): boolean { return this._isInitialised; }
    /**
     * Gets the current ground item (`groundItem: GroundItem | undefined`).
     * @internal
     * @zh 获取当前ground条目（`groundItem: GroundItem | undefined`）。
     */
    get groundItem(): GroundItem | undefined { return this._groundItem; }
    /**
     * @internal @deprecated use {@link (LayoutManager:class).groundItem} instead
     * @zh 获取当前根节点（`root: GroundItem | undefined`）。
     */
    get root(): GroundItem | undefined { return this._groundItem; }
    /**
     * Gets the current open popouts (`openPopouts: BrowserPopout[]`).
     * @zh 获取当前打开弹出窗口（`openPopouts: BrowserPopout[]`）。
     */
    get openPopouts(): BrowserPopout[] { return this._openPopouts; }
    /**
     * Gets the current drop target indicator (`dropTargetIndicator: DropTargetIndicator | null`).
     * @internal
     * @zh 获取当前放置目标指示器（`dropTargetIndicator: DropTargetIndicator | null`）。
     */
    get dropTargetIndicator(): DropTargetIndicator | null { return this._dropTargetIndicator; }

    /**
     * Gets the current transition indicator (`transitionIndicator: TransitionIndicator | null`).
     * @zh 获取当前过渡动画指示器（`transitionIndicator: TransitionIndicator | null`）。
     */
    get transitionIndicator(): TransitionIndicator | null { return this._transitionIndicator; }
    /**
     * Gets the current width (`width: number | null`).
     * @zh 获取当前宽度（`width: number | null`）。
     */
    get width(): number | null { return this._width; }
    /**
     * Gets the current height (`height: number | null`).
     * @zh 获取当前高度（`height: number | null`）。
     */
    get height(): number | null { return this._height; }
    /**
     * Gets the current event hub (`eventHub: EventHub`).
     * @zh 获取当前事件Hub（`eventHub: EventHub`）。
     */
    get eventHub(): EventHub { return this._eventHub; }
    /**
     * Gets the current root item (`rootItem: ContentItem | undefined`).
     * @zh 获取当前根节点条目（`rootItem: ContentItem | undefined`）。
     */
    get rootItem(): ContentItem | undefined {
        if (this._groundItem === undefined) {
            throw new Error('Cannot access rootItem before init');
        } else {
            const groundContentItems = this._groundItem.contentItems;
            if (groundContentItems.length === 0) {
                return undefined;
            } else {
                return this._groundItem.contentItems[0];
            }
        }
    }
    /**
     * Gets the current focused component item (`focusedComponentItem: ComponentItem | undefined`).
     * @zh 获取当前已聚焦组件条目（`focusedComponentItem: ComponentItem | undefined`）。
     */
    get focusedComponentItem(): ComponentItem | undefined { return this._focusedComponentItem; }
    /**
     * Gets the current tab drop placeholder (`tabDropPlaceholder: HTMLElement`).
     * @internal
     * @zh 获取当前选项卡放置占位提示（`tabDropPlaceholder: HTMLElement`）。
     */
    get tabDropPlaceholder(): HTMLElement { return this._tabDropPlaceholder; }
    /**
     * Gets the current maximised stack (`maximisedStack: Stack | undefined`).
     * @zh 获取当前最大化栈（`maximisedStack: Stack | undefined`）。
     */
    get maximisedStack(): Stack | undefined { return this._maximisedStack; }

    /**
     * @deprecated indicates deprecated constructor use
     * @zh 获取当前deprecatedConstructor（`deprecatedConstructor: boolean`）。
     */
    get deprecatedConstructor(): boolean { return !this.isSubWindow && this._constructorOrSubWindowLayoutConfig !== undefined; }

    /**
     * Property `translator` (`any`) storing translator.
     * @zh 属性 `translator`（类型：`any`），用于存储或配置翻译器。
     */
    public translator;
    /**
    * @param container - A Dom HTML element. Defaults to body
    * @internal

     * @zh 创建 `LayoutManager` 实例，并初始化其依赖项与内部状态。
     */
    constructor(translator:TranslateService,parameters: LayoutManager.ConstructorParameters) {
        super();
        this.translator=translator;
        this.isSubWindow = parameters.isSubWindow;

        this._constructorOrSubWindowLayoutConfig = parameters.constructorOrSubWindowLayoutConfig;

        ConfigMinifier.checkInitialise();

        if (parameters.containerElement !== undefined) {
            this._containerElement = parameters.containerElement;
        }
    }

    /**
     * Executes `destroy` to handle destroy.
     * @zh 执行 `destroy`，用于销毁。
     */
    destroy(): void {
        if (this._isInitialised) {
            if (this._windowBeforeUnloadListening) {
                globalThis.removeEventListener('beforeunload', this._windowBeforeUnloadListener);
                this._windowBeforeUnloadListening = false;
            }

            if (this.layoutConfig.settings.closePopoutsOnUnload === true) {
                this.closeAllOpenPopouts();
            }

            this._resizeObserver.disconnect();
            this.checkClearResizeTimeout();

            if (this._groundItem !== undefined) {
                this._groundItem.destroy();
            }
            this._tabDropPlaceholder.remove();
            if (this._dropTargetIndicator !== null) {
                this._dropTargetIndicator.destroy();
            }
            if (this._transitionIndicator !== null) {
                this._transitionIndicator.destroy();
            }
            this._eventHub.destroy();

            for (const dragSource of this._dragSources) {
                dragSource.destroy();
            }
            this._dragSources = [];

            this._isInitialised = false;
        }
    }

    /**
     * Executes `minifyConfig` to handle minify config.
     * @zh 执行 `minifyConfig`，用于minify配置。
     * @param config - config parameter (`ResolvedLayoutConfig`) / 配置参数（`ResolvedLayoutConfig`）
     * @returns Result of type `ResolvedLayoutConfig` / 类型为 `ResolvedLayoutConfig` 的返回值
     */
    minifyConfig(config: ResolvedLayoutConfig): ResolvedLayoutConfig {
        return ResolvedLayoutConfig.minifyConfig(config);
    }

    /**
     * Executes `unminifyConfig` to handle unminify config.
     * @zh 执行 `unminifyConfig`，用于unminify配置。
     * @param config - config parameter (`ResolvedLayoutConfig`) / 配置参数（`ResolvedLayoutConfig`）
     * @returns Result of type `ResolvedLayoutConfig` / 类型为 `ResolvedLayoutConfig` 的返回值
     */
    unminifyConfig(config: ResolvedLayoutConfig): ResolvedLayoutConfig {
        return ResolvedLayoutConfig.unminifyConfig(config);
    }

    /**
     * Executes `bindComponent` to handle bind component.
     * @internal
     * @zh 执行 `bindComponent`，用于绑定组件。
     */
    abstract bindComponent(translator:TranslateService,container: ComponentContainer, itemConfig: ResolvedComponentItemConfig): ComponentContainer.BindableComponent;
    /**
     * Executes `unbindComponent` to handle unbind component.
     * @internal
     * @zh 执行 `unbindComponent`，用于解绑组件。
     */
    abstract unbindComponent(container: ComponentContainer, virtual: boolean, component: ComponentContainer.Component | undefined): void;


    /**
     * Executes `init` to handle init.
     * @zh 执行 `init`，用于初始化。
     */
    init(): void {
        this.setContainer();
        this._dropTargetIndicator = new DropTargetIndicator(/*this.container*/);
        this._transitionIndicator = new TransitionIndicator();
        this.updateSizeFromContainer();

        let subWindowRootConfig: ComponentItemConfig | undefined;
        if (this.isSubWindow) {
            if (this._constructorOrSubWindowLayoutConfig === undefined) {
                // SubWindow LayoutConfig should have been generated by constructor
                throw new UnexpectedUndefinedError('LMIU07155');
            } else {
                const root = this._constructorOrSubWindowLayoutConfig.root;
                if (root === undefined) {
                    // SubWindow LayoutConfig must not be empty
                    throw new AssertError('LMIC07156');
                } else {
                    if (ItemConfig.isComponent(root)) {
                        subWindowRootConfig = root;
                    } else {
                        // SubWindow LayoutConfig must have Component as Root
                        throw new AssertError('LMIC07157');
                    }
                }
                const resolvedLayoutConfig = LayoutConfig.resolve(this.translator,this._constructorOrSubWindowLayoutConfig);
                // remove root from layoutConfig
                this.layoutConfig = {
                    ...resolvedLayoutConfig,
                    root: undefined,
                }
            }
        } else {
            if (this._constructorOrSubWindowLayoutConfig === undefined) {
                this.layoutConfig = ResolvedLayoutConfig.createDefault(); // will overwritten be loaded via loadLayout
            } else {
                // backwards compatibility
                this.layoutConfig = LayoutConfig.resolve(this.translator,this._constructorOrSubWindowLayoutConfig);
            }
        }
        const layoutConfig = this.layoutConfig;
        this._groundItem = new GroundItem(this.translator,this, layoutConfig.root, this._containerElement);
        this._groundItem.init();

        this.checkLoadedLayoutMaximiseItem();

        this._resizeObserver.observe(this._containerElement);
        this._isInitialised = true;
        this.adjustColumnsResponsive();
        this.emit('initialised');

        if (subWindowRootConfig !== undefined) {
            // must be SubWindow
            this.loadComponentAsRoot(subWindowRootConfig);
        }
    }


    /**
     * Executes `loadLayout` to handle load layout.
     * @zh 执行 `loadLayout`，用于加载布局。
     * @param layoutConfig - layout config parameter (`LayoutConfig`) / 布局配置参数（`LayoutConfig`）
     */
    loadLayout(layoutConfig: LayoutConfig): void {
        if (!this.isInitialised) {
            // In case application not correctly using legacy constructor
            throw new Error('DockLayout: Need to call init() if LayoutConfig with defined root passed to constructor')
        } else {
            if (this._groundItem === undefined) {
                throw new UnexpectedUndefinedError('LMLL11119');
            } else {
                this.createSubWindows(); // still needs to be tested

                this.layoutConfig = LayoutConfig.resolve(this.translator,layoutConfig);
                this._groundItem.loadRoot(this.layoutConfig.root);
                this.checkLoadedLayoutMaximiseItem();
                this.adjustColumnsResponsive();
            }
        }
    }

    /**
     * Executes `saveLayout` to handle save layout.
     * @zh 执行 `saveLayout`，用于保存布局。
     * @returns Result of type `ResolvedLayoutConfig` / 类型为 `ResolvedLayoutConfig` 的返回值
     */
    saveLayout(): ResolvedLayoutConfig {
        if (this._isInitialised === false) {
            throw new Error('Can\'t create config, layout not yet initialised');
        } else {
            // if (root !== undefined && !(root instanceof ContentItem)) {
            //     throw new Error('Root must be a ContentItem');
            // }
            if (this._groundItem === undefined) {
                throw new UnexpectedUndefinedError('LMTC18244');
            } else {
                const groundContent = this._groundItem.calculateConfigContent();

                let rootItemConfig: ResolvedRootItemConfig | undefined;
                if (groundContent.length !== 1) {
                    rootItemConfig = undefined;
                } else {
                    rootItemConfig = groundContent[0];
                }
                this.reconcilePopoutWindows();
                const openPopouts: ResolvedPopoutLayoutConfig[] = [];
                for (let i = 0; i < this._openPopouts.length; i++) {
                    openPopouts.push(this._openPopouts[i].toConfig());
                }
                const config: ResolvedLayoutConfig = {
                    root: rootItemConfig,
                    openPopouts,
                    settings:  ResolvedLayoutConfig.Settings.createCopy(this.layoutConfig.settings),
                    dimensions: ResolvedLayoutConfig.Dimensions.createCopy(this.layoutConfig.dimensions),
                    header: ResolvedLayoutConfig.Header.createCopy(this.layoutConfig.header),
                    resolved: true,
                }

                return config;
            }
        }
    }


    /**
     * Executes `clear` to handle clear.
     * @zh 执行 `clear`，用于清空。
     */
    clear(): void {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMCL11129');
        } else {
            this._groundItem.clearRoot();
        }
    }

    /**
     * Executes `toConfig` to handle to config.
     * @zh 执行 `toConfig`，用于转换为配置。
     * @returns Result of type `ResolvedLayoutConfig` / 类型为 `ResolvedLayoutConfig` 的返回值
     */
    toConfig(): ResolvedLayoutConfig {
        return this.saveLayout();
    }

    /**
     * Executes `newComponent` to handle new component.
     * @zh 执行 `newComponent`，用于新组件。
     * @param componentType - component type parameter (`JsonValue`) / 组件类型参数（`JsonValue`）
     * @param componentState - component state parameter (`JsonValue`) / 组件状态参数（`JsonValue`）
     * @param title - title parameter (`string`) / 标题参数（`string`）
     * @param stackId - stack id parameter (`string`) / 栈唯一标识参数（`string`）
     * @returns Result of type `ComponentItem` / 类型为 `ComponentItem` 的返回值
     */
    newComponent(componentType: JsonValue, componentState?: JsonValue, title?: string,stackId?:string): ComponentItem {
        if(stackId){
            const componentItem = this.newComponentAtStack(componentType, componentState, title,stackId);
            if (componentItem === undefined) {
                throw new AssertError('LMNC65588');
            } else {
                return componentItem;
            }
        }else{
            const componentItem = this.newComponentAtLocation(componentType, componentState, title);
            if (componentItem === undefined) {
                throw new AssertError('LMNC65588');
            } else {
                return componentItem;
            }
        }
    }


    /**
     * Executes `newComponentAtStack` to handle new component at stack.
     * @zh 执行 `newComponentAtStack`，用于新组件位于栈。
     * @param componentType - component type parameter (`JsonValue`) / 组件类型参数（`JsonValue`）
     * @param componentState - component state parameter (`JsonValue`) / 组件状态参数（`JsonValue`）
     * @param title - title parameter (`string`) / 标题参数（`string`）
     * @param stackId - stack id parameter (`string`) / 栈唯一标识参数（`string`）
     * @returns Result of type `ComponentItem | undefined` / 类型为 `ComponentItem | undefined` 的返回值
     */
    newComponentAtStack(componentType: JsonValue, componentState?: JsonValue, title?: string,
        stackId?:string
    ): ComponentItem | undefined{
        if (this._groundItem === undefined) {
            throw new Error('Cannot add component before init');
        } else {
            const location = this.addComponentAtStack(componentType, componentState, title, stackId);
            if (location === undefined) {
                return undefined;
            } else {
                const createdItem = location.parentItem.contentItems[location.index];
                if (!ContentItem.isComponentItem(createdItem)) {
                    throw new AssertError('LMNC992877533');
                } else {
                    return createdItem;
                }
            }
        }
    }
    /**
     * Executes `addComponentAtStack` to handle add component at stack.
     * @zh 执行 `addComponentAtStack`，用于添加组件位于栈。
     * @param componentType - component type parameter (`any`) / 组件类型参数（`any`）
     * @param componentState - component state parameter (`JsonValue`) / 组件状态参数（`JsonValue`）
     * @param title - title parameter (`string`) / 标题参数（`string`）
     * @param stackId - stack id parameter (`string`) / 栈唯一标识参数（`string`）
     * @returns Result of type `LayoutManager.Location | undefined` / 类型为 `LayoutManager.Location | undefined` 的返回值
     */
    addComponentAtStack(componentType, componentState?: JsonValue, title?: string,
        stackId?:string
    ): LayoutManager.Location | undefined {
        const itemConfig: ComponentItemConfig = {
            id:componentType['id']?componentType['id']:undefined,
            type: 'component',
            componentType,
            componentState,
            title,
        };
        return this.addItemAtStack(itemConfig, stackId);
    }


    /**
     * Executes `addItemAtStack` to handle add item at stack.
     * @zh 执行 `addItemAtStack`，用于添加条目位于栈。
     * @param itemConfig - item config parameter (`ComponentItemConfig`) / 条目配置参数（`ComponentItemConfig`）
     * @param stackId - stack id parameter (`string`) / 栈唯一标识参数（`string`）
     * @returns Result of type `LayoutManager.Location | undefined` / 类型为 `LayoutManager.Location | undefined` 的返回值
     */
    addItemAtStack(itemConfig: ComponentItemConfig,
        stackId?:string
    ): LayoutManager.Location | undefined {
        if (this._groundItem === undefined) {
            throw new Error('Cannot add component before init');
        } else {
            const stack:Stack = this.findFirstStackComponentItemById(stackId) as unknown as Stack;
            let index=stack.contentItems.length;
            let addIdx= stack.addItem(itemConfig, index);
          
            let location: LayoutManager.Location = {
                parentItem: stack,
                index: addIdx
            };
            return location;
        }
    }


    /**
     * Executes `newComponentAtLocation` to handle new component at location.
     * @zh 执行 `newComponentAtLocation`，用于新组件位于Location。
     * @param componentType - component type parameter (`JsonValue`) / 组件类型参数（`JsonValue`）
     * @param componentState - component state parameter (`JsonValue`) / 组件状态参数（`JsonValue`）
     * @param title - title parameter (`string`) / 标题参数（`string`）
     * @param locationSelectors - location selectors parameter (`LayoutManager.LocationSelector[]`) / location选择器参数（`LayoutManager.LocationSelector[]`）
     * @returns Result of type `ComponentItem | undefined` / 类型为 `ComponentItem | undefined` 的返回值
     */
    newComponentAtLocation(componentType: JsonValue, componentState?: JsonValue, title?: string,
        locationSelectors?: LayoutManager.LocationSelector[]
    ): ComponentItem | undefined{
        if (this._groundItem === undefined) {
            throw new Error('Cannot add component before init');
        } else {
            const location = this.addComponentAtLocation(componentType, componentState, title, locationSelectors);
            if (location === undefined) {
                return undefined;
            } else {
                const createdItem = location.parentItem.contentItems[location.index];
                if (!ContentItem.isComponentItem(createdItem)) {
                    throw new AssertError('LMNC992877533');
                } else {
                    return createdItem;
                }
            }
        }
    }
    /**
     * Executes `addComponent` to handle add component.
     * @zh 执行 `addComponent`，用于添加组件。
     * @param componentType - component type parameter (`JsonValue`) / 组件类型参数（`JsonValue`）
     * @param componentState - component state parameter (`JsonValue`) / 组件状态参数（`JsonValue`）
     * @param title - title parameter (`string`) / 标题参数（`string`）
     * @returns Result of type `LayoutManager.Location` / 类型为 `LayoutManager.Location` 的返回值
     */
    addComponent(componentType: JsonValue, componentState?: JsonValue, title?: string): LayoutManager.Location {
        const location = this.addComponentAtLocation(componentType, componentState, title);
        if (location === undefined) {
            throw new AssertError('LMAC99943');
        } else {
            return location;
        }
    }

    /**
     * Executes `addComponentAtLocation` to handle add component at location.
     * @zh 执行 `addComponentAtLocation`，用于添加组件位于Location。
     * @param componentType - component type parameter (`any`) / 组件类型参数（`any`）
     * @param componentState - component state parameter (`JsonValue`) / 组件状态参数（`JsonValue`）
     * @param title - title parameter (`string`) / 标题参数（`string`）
     * @param locationSelectors - location selectors parameter (`readonly LayoutManager.LocationSelector[]`) / location选择器参数（`readonly LayoutManager.LocationSelector[]`）
     * @returns Result of type `LayoutManager.Location | undefined` / 类型为 `LayoutManager.Location | undefined` 的返回值
     */
    addComponentAtLocation(componentType, componentState?: JsonValue, title?: string,
        locationSelectors?: readonly LayoutManager.LocationSelector[]
    ): LayoutManager.Location | undefined {
        const itemConfig: ComponentItemConfig = {
            type: 'component',
            id:componentType['id']?componentType['id']:undefined,
            componentType,
            componentState,
            title,
        };

        return this.addItemAtLocation(itemConfig, locationSelectors);
    }

    /**
     * Executes `newItem` to handle new item.
     * @zh 执行 `newItem`，用于新条目。
     * @param itemConfig - item config parameter (`RowOrColumnItemConfig | StackItemConfig | ComponentItemConfi...`) / 条目配置参数（`RowOrColumnItemConfig | StackItemConfig | ComponentItemConfi...`）
     * @returns Result of type `ContentItem` / 类型为 `ContentItem` 的返回值
     */
    newItem(itemConfig: RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig): ContentItem {
        const contentItem = this.newItemAtLocation(itemConfig);
        if (contentItem === undefined) {
            throw new AssertError('LMNC65588');
        } else {
            return contentItem;
        }
    }

     /**
      * Executes `newItemAtLocation` to handle new item at location.
      * @zh 执行 `newItemAtLocation`，用于新条目位于Location。
      * @param itemConfig - item config parameter (`RowOrColumnItemConfig | StackItemConfig | ComponentItemConfi...`) / 条目配置参数（`RowOrColumnItemConfig | StackItemConfig | ComponentItemConfi...`）
      * @param locationSelectors - location selectors parameter (`readonly LayoutManager.LocationSelector[]`) / location选择器参数（`readonly LayoutManager.LocationSelector[]`）
      * @returns Result of type `ContentItem | undefined` / 类型为 `ContentItem | undefined` 的返回值
      */
     newItemAtLocation(itemConfig: RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig,
        locationSelectors?: readonly LayoutManager.LocationSelector[]
    ): ContentItem | undefined {
        if (this._groundItem === undefined) {
            throw new Error('Cannot add component before init');
        } else {
            const location = this.addItemAtLocation(itemConfig, locationSelectors);
            if (location === undefined) {
                return undefined;
            } else {
                const createdItem = location.parentItem.contentItems[location.index];
                return createdItem;
            }
        }
    }

    /**
     * Executes `addItem` to handle add item.
     * @zh 执行 `addItem`，用于添加条目。
     * @param itemConfig - item config parameter (`RowOrColumnItemConfig | StackItemConfig | ComponentItemConfi...`) / 条目配置参数（`RowOrColumnItemConfig | StackItemConfig | ComponentItemConfi...`）
     * @returns Result of type `LayoutManager.Location` / 类型为 `LayoutManager.Location` 的返回值
     */
    addItem(itemConfig: RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig): LayoutManager.Location {
        const location = this.addItemAtLocation(itemConfig);
        if (location === undefined) {
            throw new AssertError('LMAI99943');
        } else {
            return location;
        }
    }

    /**
     * Executes `addItemAtLocation` to handle add item at location.
     * @zh 执行 `addItemAtLocation`，用于添加条目位于Location。
     * @param itemConfig - item config parameter (`RowOrColumnItemConfig | StackItemConfig | ComponentItemConfi...`) / 条目配置参数（`RowOrColumnItemConfig | StackItemConfig | ComponentItemConfi...`）
     * @param locationSelectors - location selectors parameter (`readonly LayoutManager.LocationSelector[]`) / location选择器参数（`readonly LayoutManager.LocationSelector[]`）
     * @returns Result of type `LayoutManager.Location | undefined` / 类型为 `LayoutManager.Location | undefined` 的返回值
     */
    addItemAtLocation(itemConfig: RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig,
        locationSelectors?: readonly LayoutManager.LocationSelector[]
    ): LayoutManager.Location | undefined {
        if (this._groundItem === undefined) {
            throw new Error('Cannot add component before init');
        } else {
            if (locationSelectors === undefined) {
                // defaultLocationSelectors should always find a location
                locationSelectors = LayoutManager.defaultLocationSelectors;
            }

            const location = this.findFirstLocation(locationSelectors);
            if (location === undefined) {
                return undefined;
            } else {
                let parentItem = location.parentItem;
                let addIdx: number;
                switch (parentItem.type) {
                    case ItemType.ground: {
                        const groundItem = parentItem as GroundItem;
                        addIdx = groundItem.addItem(itemConfig, location.index);
                        if (addIdx >= 0) {
                            parentItem = this._groundItem.contentItems[0];
                        } else {
                            addIdx = 0;
                        }
                        break;
                    }
                    case ItemType.row:
                    case ItemType.column: {
                        const rowOrColumn = parentItem as RowOrColumn;
                        addIdx = rowOrColumn.addItem(itemConfig, location.index);
                        break;
                    }
                    case ItemType.stack: {
                        if (!ItemConfig.isComponent(itemConfig)) {
                            throw Error(
                                this.translator.instant("docklayout.ItemConfigIsNotTypeComponent"));
                        } else {
                            const stack = parentItem as Stack;
                            addIdx = stack.addItem(itemConfig, location.index);
                            break;
                        }
                    }
                    case ItemType.component: {
                        throw new AssertError('LMAIALC87444602');
                    }
                    default:
                        throw new UnreachableCaseError('LMAIALU98881733', parentItem.type);
                }

                if (ItemConfig.isComponent(itemConfig)) {
                    const item = parentItem.contentItems[addIdx];
                    if (ContentItem.isStack(item)) {
                        parentItem = item;
                        addIdx = 0;
                    }
                }

                location.parentItem = parentItem;
                location.index = addIdx;
                return location;
            }
        }
    }

    /**
     * Executes `loadComponentAsRoot` to handle load component as root.
     * @zh 执行 `loadComponentAsRoot`，用于加载组件As根节点。
     * @param itemConfig - item config parameter (`ComponentItemConfig`) / 条目配置参数（`ComponentItemConfig`）
     */
    loadComponentAsRoot(itemConfig: ComponentItemConfig): void {
        if (this._groundItem === undefined) {
            throw new Error('Cannot add item before init');
        } else {
            this._groundItem.loadComponentAsRoot(itemConfig);
        }
    }

    /**
     * Executes `updateSize` to handle update size.
     * @zh 执行 `updateSize`，用于更新尺寸。
     * @param width - width parameter (`number`) / 宽度参数（`number`）
     * @param height - height parameter (`number`) / 高度参数（`number`）
     */
    updateSize(width: number, height: number): void {
        this.setSize(width, height);
    }


    /**
     * Executes `setSize` to handle set size.
     * @zh 执行 `setSize`，用于集合尺寸。
     * @param width - width parameter (`number`) / 宽度参数（`number`）
     * @param height - height parameter (`number`) / 高度参数（`number`）
     */
    setSize(width: number, height: number): void {
        this._width = width;
        this._height = height;

        if (this._isInitialised === true) {
            if (this._groundItem === undefined) {
                throw new UnexpectedUndefinedError('LMUS18881');
            } else {
                this._groundItem.setSize(this._width, this._height);

                if (this._maximisedStack) {
                    const { width, height } = getElementWidthAndHeight(this._containerElement);
                    setElementWidth(this._maximisedStack.element, width);
                    setElementHeight(this._maximisedStack.element, height);
                    this._maximisedStack.updateSize(false);
                }

                this.adjustColumnsResponsive();
            }
        }
    }

    /**
     * Executes `beginSizeInvalidation` to handle begin size invalidation.
     * @internal
     * @zh 执行 `beginSizeInvalidation`，用于开始尺寸Invalidation。
     */
    beginSizeInvalidation(): void {
        this._sizeInvalidationBeginCount++;
    }

    /**
     * Executes `endSizeInvalidation` to handle end size invalidation.
     * @internal
     * @zh 执行 `endSizeInvalidation`，用于结束尺寸Invalidation。
     */
    endSizeInvalidation(): void {
        if (--this._sizeInvalidationBeginCount === 0) {
            this.updateSizeFromContainer();
        }
    }

    /**
     * Executes `updateSizeFromContainer` to handle update size from container.
     * @internal
     * @zh 执行 `updateSizeFromContainer`，用于更新尺寸从容器。
     */
    updateSizeFromContainer(): void {
        const { width, height } = getElementWidthAndHeight(this._containerElement);
        this.setSize(width, height);
    }


    /**
     * Executes `updateRootSize` to handle update root size.
     * @zh 执行 `updateRootSize`，用于更新根节点尺寸。
     * @param force - force parameter (`any`) / force参数（`any`）
     */
    updateRootSize(force = false): void {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMURS28881');
        } else {
            this._groundItem.updateSize(force);
        }
    }

    /**
     * Executes `createAndInitContentItem` to handle create and init content item.
     * @public
     * @zh 执行 `createAndInitContentItem`，用于创建And初始化内容条目。
     */
    createAndInitContentItem(config: ResolvedItemConfig, parent: ContentItem): ContentItem {
        const newItem = this.createContentItem(config, parent);
        newItem.init();
        return newItem;
    }

    /**
     * Executes `createContentItem` to handle create content item.
     * @zh 执行 `createContentItem`，用于创建内容条目。
     * @param config - config parameter (`ResolvedItemConfig`) / 配置参数（`ResolvedItemConfig`）
     * @param parent - parent parameter (`ContentItem`) / 父级参数（`ContentItem`）
     * @returns Result of type `ContentItem` / 类型为 `ContentItem` 的返回值
     */
    createContentItem(config: ResolvedItemConfig, parent: ContentItem): ContentItem {
        if (typeof config.type !== 'string') {
            throw new ConfigurationError('Missing parameter \'type\'', JSON.stringify(config));
        }
        if (
            // If this is a component
            ResolvedItemConfig.isComponentItem(config) &&

            // and it's not already within a stack
            !(parent instanceof Stack) &&

            // and we have a parent
            !!parent &&

            // and it's not the topmost item in a new window
            !(this.isSubWindow === true && parent instanceof GroundItem)
        ) {
            const stackConfig: ResolvedStackItemConfig = {
                type: ItemType.stack,
                content: [config],
                size: config.size,
                sizeUnit: config.sizeUnit,
                minSize: config.minSize,
                minSizeUnit: config.minSizeUnit,
                id: config.id,
                maximised: config.maximised,
                isClosable: config.isClosable,
                activeItemIndex: 0,
                header: undefined,
            };

            config = stackConfig;
        }

        const contentItem = this.createContentItemFromConfig(config, parent);
        return contentItem;
    }

    /**
     * Executes `findFirstStackComponentItemById` to handle find first stack component item by id.
     * @zh 执行 `findFirstStackComponentItemById`，用于查找首个栈组件条目按唯一标识。
     * @param id - id parameter (`string`) / 唯一标识参数（`string`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    findFirstStackComponentItemById(id: string) {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMFFCIBI82446');
        } else {
            return this.findFirstContentItemTypeByIdRecursive(ItemType.stack, id, this._groundItem) as ComponentItem;
        }
    }

    /**
     * Executes `findFirstComponentItemById` to handle find first component item by id.
     * @zh 执行 `findFirstComponentItemById`，用于查找首个组件条目按唯一标识。
     * @param id - id parameter (`string`) / 唯一标识参数（`string`）
     * @returns Result of type `ComponentItem | undefined` / 类型为 `ComponentItem | undefined` 的返回值
     */
    findFirstComponentItemById(id: string): ComponentItem | undefined {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMFFCIBI82446');
        } else {
            return this.findFirstContentItemTypeByIdRecursive(ItemType.component, id, this._groundItem) as ComponentItem;
        }
    }

    /**
     * Executes `createPopout` to handle create popout.
     * @zh 执行 `createPopout`，用于创建弹出窗口。
     * @param itemConfigOrContentItem - item config or content item parameter (`ContentItem | ResolvedRootItemConfig`) / 条目配置Or内容条目参数（`ContentItem | ResolvedRootItemConfig`）
     * @param positionAndSize - position and size parameter (`ResolvedPopoutLayoutConfig.Window`) / 位置And尺寸参数（`ResolvedPopoutLayoutConfig.Window`）
     * @param parentId - parent id parameter (`string | null`) / 父级唯一标识参数（`string | null`）
     * @param indexInParent - index in parent parameter (`number | null`) / 索引在父级参数（`number | null`）
     * @returns Result of type `BrowserPopout` / 类型为 `BrowserPopout` 的返回值
     */
    createPopout(itemConfigOrContentItem: ContentItem | ResolvedRootItemConfig,
        positionAndSize: ResolvedPopoutLayoutConfig.Window,
        parentId: string | null,
        indexInParent: number | null
    ): BrowserPopout {
        if (itemConfigOrContentItem instanceof ContentItem) {
            return this.createPopoutFromContentItem(itemConfigOrContentItem, positionAndSize, parentId, indexInParent);
        } else {
            return this.createPopoutFromItemConfig(itemConfigOrContentItem, positionAndSize, parentId, indexInParent);
        }
    }

    /**
     * Executes `createPopoutFromContentItem` to handle create popout from content item.
     * @internal
     * @zh 执行 `createPopoutFromContentItem`，用于创建弹出窗口从内容条目。
     */
    createPopoutFromContentItem(item: ContentItem,
        window: ResolvedPopoutLayoutConfig.Window | undefined,
        parentId: string | null,
        indexInParent: number | null | undefined,
    ): BrowserPopout {
        let parent = item.parent;
        let child = item;
        while (parent !== null && parent.contentItems.length === 1 && !parent.isGround) {
            child = parent;
            parent = parent.parent;
        }

        if (parent === null) {
            throw new UnexpectedNullError('LMCPFCI00834');
        } else {
            if (indexInParent === undefined) {
                indexInParent = parent.contentItems.indexOf(child);
            }

            if (parentId !== null) {
                parent.addPopInParentId(parentId);
            }

            if (window === undefined) {
                const windowLeft = globalThis.screenX || globalThis.screenLeft;
                const windowTop = globalThis.screenY || globalThis.screenTop;
                const offsetLeft = item.element.offsetLeft;
                const offsetTop = item.element.offsetTop
                // const { left: offsetLeft, top: offsetTop } = getJQueryLeftAndTop(item.element);
                const { width, height } = getElementWidthAndHeight(item.element);

                window = {
                    left: windowLeft + offsetLeft,
                    top: windowTop + offsetTop,
                    width,
                    height,
                };
            }

            const itemConfig = item.toConfig();
            item.remove();

            if (!ResolvedRootItemConfig.isRootItemConfig(itemConfig)) {
                throw new Error(
                    this.translator.instant("docklayout.PopoutCannotBeCreatedWithGroundItemConfig"));
            } else {
                return this.createPopoutFromItemConfig(itemConfig, window, parentId, indexInParent);
            }
        }
    }

    /**
     * Executes `beginVirtualSizedContainerAdding` to handle begin virtual sized container adding.
     * @internal
     * @zh 执行 `beginVirtualSizedContainerAdding`，用于开始虚拟滚动已尺寸容器添加。
     */
    beginVirtualSizedContainerAdding(): void {
        if (++this._virtualSizedContainerAddingBeginCount === 0) {
            this._virtualSizedContainers.length = 0;
        }
    }

    /**
     * Executes `addVirtualSizedContainer` to handle add virtual sized container.
     * @internal
     * @zh 执行 `addVirtualSizedContainer`，用于添加虚拟滚动已尺寸容器。
     */
    addVirtualSizedContainer(container: ComponentContainer): void {
        this._virtualSizedContainers.push(container);
    }

    /**
     * Executes `endVirtualSizedContainerAdding` to handle end virtual sized container adding.
     * @internal
     * @zh 执行 `endVirtualSizedContainerAdding`，用于结束虚拟滚动已尺寸容器添加。
     */
    endVirtualSizedContainerAdding(): void {
        if (--this._virtualSizedContainerAddingBeginCount === 0) {
            const count = this._virtualSizedContainers.length;
            if (count > 0) {
                this.fireBeforeVirtualRectingEvent(count);
                for (let i = 0; i < count; i++) {
                    const container = this._virtualSizedContainers[i];
                    container.notifyVirtualRectingRequired();
                }
                this.fireAfterVirtualRectingEvent();
                this._virtualSizedContainers.length = 0;
            }
        }
    }

    /**
     * Executes `fireBeforeVirtualRectingEvent` to handle fire before virtual recting event.
     * @internal
     * @zh 执行 `fireBeforeVirtualRectingEvent`，用于触发之前虚拟滚动矩形事件。
     */
    fireBeforeVirtualRectingEvent(count: number): void {
        if (this.beforeVirtualRectingEvent !== undefined) {
            this.beforeVirtualRectingEvent(count);
        }
    }

    /**
     * Executes `fireAfterVirtualRectingEvent` to handle fire after virtual recting event.
     * @internal
     * @zh 执行 `fireAfterVirtualRectingEvent`，用于触发之后虚拟滚动矩形事件。
     */
    fireAfterVirtualRectingEvent(): void {
        if (this.afterVirtualRectingEvent !== undefined) {
            this.afterVirtualRectingEvent();
        }
    }

    /**
     * Executes `createPopoutFromItemConfig` to handle create popout from item config.
     * @internal
     * @zh 执行 `createPopoutFromItemConfig`，用于创建弹出窗口从条目配置。
     */
    private createPopoutFromItemConfig(rootItemConfig: ResolvedRootItemConfig,
        window: ResolvedPopoutLayoutConfig.Window,
        parentId: string | null,
        indexInParent: number | null
    ) {
        const layoutConfig = this.toConfig();

        const popoutLayoutConfig: ResolvedPopoutLayoutConfig = {
            root: rootItemConfig,
            openPopouts: [],
            settings: layoutConfig.settings,
            dimensions: layoutConfig.dimensions,
            header: layoutConfig.header,
            window,
            parentId,
            indexInParent,
            resolved: true,
        }

        return this.createPopoutFromPopoutLayoutConfig(popoutLayoutConfig);
    }

    /**
     * Executes `createPopoutFromPopoutLayoutConfig` to handle create popout from popout layout config.
     * @internal
     * @zh 执行 `createPopoutFromPopoutLayoutConfig`，用于创建弹出窗口从弹出窗口布局配置。
     */
    createPopoutFromPopoutLayoutConfig(config: ResolvedPopoutLayoutConfig): BrowserPopout {
        const configWindow = config.window;
        const initialWindow: Rect = {
            left: configWindow.left ?? (globalThis.screenX || globalThis.screenLeft + 20),
            top: configWindow.top ?? (globalThis.screenY || globalThis.screenTop + 20),
            width: configWindow.width ?? 500,
            height: configWindow.height ?? 309,
        };

        const browserPopout = new BrowserPopout(config, initialWindow, this);

        browserPopout.on('initialised', () => this.emit('windowOpened', browserPopout));
        browserPopout.on('closed', () => this.reconcilePopoutWindows());

        this._openPopouts.push(browserPopout);

        if (this.layoutConfig.settings.closePopoutsOnUnload && !this._windowBeforeUnloadListening) {
            globalThis.addEventListener('beforeunload', this._windowBeforeUnloadListener, { passive: true });
            this._windowBeforeUnloadListening = true;
        }

        return browserPopout;
    }


    /**
     * Executes `closeAllOpenPopouts` to handle close all open popouts.
     * @zh 执行 `closeAllOpenPopouts`，用于关闭全部打开弹出窗口。
     */
    closeAllOpenPopouts() {
        for (let i = 0; i < this._openPopouts.length; i++) {
            this._openPopouts[i].close();
        }

        this._openPopouts.length = 0;

        if (this._windowBeforeUnloadListening) {
            globalThis.removeEventListener('beforeunload', this._windowBeforeUnloadListener);
            this._windowBeforeUnloadListening = false;
        }
    }


    /**
     * Executes `newDragSource` to handle new drag source.
     * @zh 执行 `newDragSource`，用于新拖拽源。
     * @param element - element parameter (`HTMLElement`) / 元素参数（`HTMLElement`）
     * @param itemConfigCallback - item config callback parameter (`() => (DragSource.ComponentItemConfig | ComponentItemConfig)`) / 条目配置回调函数参数（`() => (DragSource.ComponentItemConfig | ComponentItemConfig)`）
     * @returns Result of type `DragSource` / 类型为 `DragSource` 的返回值
     */
    newDragSource(element: HTMLElement, itemConfigCallback: () => (DragSource.ComponentItemConfig | ComponentItemConfig)): DragSource;
    /**
     * @deprecated will be replaced in version 3 with newDragSource(element: HTMLElement, itemConfig: ComponentItemConfig)
     * @zh 执行 `newDragSource`，用于新拖拽源。
     */
    newDragSource(element: HTMLElement, componentType: JsonValue, componentState?: JsonValue, title?: JsonValue, id?: string): DragSource;
    /**
     * Executes `newDragSource` to handle new drag source.
     * @zh 执行 `newDragSource`，用于新拖拽源。
     * @param element - element parameter (`HTMLElement`) / 元素参数（`HTMLElement`）
     * @param componentTypeOrItemConfigCallb... - component type or item config callb parameter (`JsonValue | (() => (DragSource.ComponentItemConfig | Compone...`) / 组件类型Or条目配置Callb参数（`JsonValue | (() => (DragSource.ComponentItemConfig | Compone...`）
     * @param componentState - component state parameter (`JsonValue`) / 组件状态参数（`JsonValue`）
     * @param title - title parameter (`string`) / 标题参数（`string`）
     * @param id - id parameter (`string`) / 唯一标识参数（`string`）
     * @returns Result of type `DragSource` / 类型为 `DragSource` 的返回值
     */
    newDragSource(element: HTMLElement,
        componentTypeOrItemConfigCallback: JsonValue | (() => (DragSource.ComponentItemConfig | ComponentItemConfig)),
        componentState?: JsonValue,
        title?: string,
        id?: string,
    ): DragSource {
        const dragSource = new DragSource(this.translator,this, element, [], componentTypeOrItemConfigCallback, componentState, title, id);
        this._dragSources.push(dragSource);

        return dragSource;
    }


	/**
	 * Executes `removeDragSource` to handle remove drag source.
	 * @zh 执行 `removeDragSource`，用于移除拖拽源。
	 * @param dragSource - drag source parameter (`DragSource`) / 拖拽源参数（`DragSource`）
	 */
	removeDragSource(dragSource: DragSource): void {
		removeFromArray(dragSource, this._dragSources );
		dragSource.destroy();
    }

    /**
     * Executes `startComponentDrag` to handle start component drag.
     * @internal
     * @zh 执行 `startComponentDrag`，用于开始组件拖拽。
     */
    startComponentDrag(x: number, y: number, dragListener: DragListener, componentItem: ComponentItem, stack: Stack): void {
        new DragProxy(
            x,
            y,
            dragListener,
            this,
            componentItem,
            stack
        );
    }

    /**
     * Executes `focusComponent` to handle focus component.
     * @zh 执行 `focusComponent`，用于聚焦组件。
     * @param item - item parameter (`ComponentItem`) / 条目参数（`ComponentItem`）
     * @param suppressEvent - suppress event parameter (`any`) / suppress事件参数（`any`）
     */
    focusComponent(item: ComponentItem, suppressEvent = false): void {
        item.focus(suppressEvent);
    }

    /**
     * Executes `clearComponentFocus` to handle clear component focus.
     * @zh 执行 `clearComponentFocus`，用于清空组件聚焦。
     * @param suppressEvent - suppress event parameter (`any`) / suppress事件参数（`any`）
     */
    clearComponentFocus(suppressEvent = false): void {
        this.setFocusedComponentItem(undefined, suppressEvent);
    }

    /**
     * Executes `setFocusedComponentItem` to handle set focused component item.
     * @zh 执行 `setFocusedComponentItem`，用于集合已聚焦组件条目。
     * @param item - item parameter (`ComponentItem | undefined`) / 条目参数（`ComponentItem | undefined`）
     * @param suppressEvents - suppress events parameter (`any`) / suppress事件集合参数（`any`）
     */
    setFocusedComponentItem(item: ComponentItem | undefined, suppressEvents = false): void {
        if (item !== this._focusedComponentItem) {

            let newFocusedParentItem: ComponentParentableItem | undefined;
            if (item === undefined) {
                newFocusedParentItem = undefined;
            } else {
                newFocusedParentItem = item.parentItem;
              
            }

            if (this._focusedComponentItem !== undefined) {
                const oldFocusedItem = this._focusedComponentItem;
                this._focusedComponentItem = undefined;
                oldFocusedItem.setBlurred(suppressEvents);
                const oldFocusedParentItem = oldFocusedItem.parentItem;
                // if (newFocusedParentItem === oldFocusedParentItem) {
                //     newFocusedParentItem = undefined;
                // } else {
                    oldFocusedParentItem.setFocusedValue(false);
               // }
            }

            if (item !== undefined) {
                this._focusedComponentItem = item;
                item.setFocused(suppressEvents);
                if (newFocusedParentItem !== undefined) {
                    // newFocusedParentItem.setFocusedValue(true);
                    newFocusedParentItem.setActiveComponentItem(item,false,true)
                    // setActiveContentItem(newFocusedParentItem)
             
                }
            }
        }
    }

    /**
     * Executes `createContentItemFromConfig` to handle create content item from config.
     * @internal
     * @zh 执行 `createContentItemFromConfig`，用于创建内容条目从配置。
     */
    private createContentItemFromConfig(config: ResolvedItemConfig, parent: ContentItem): ContentItem {
        switch (config.type) {
            case ItemType.ground: throw new AssertError('LMCCIFC68871');
            case ItemType.row: return new RowOrColumn(this.translator,false, this, config as ResolvedRowOrColumnItemConfig, parent);
            case ItemType.column: return new RowOrColumn(this.translator,true, this, config as ResolvedRowOrColumnItemConfig, parent);
            case ItemType.stack: return new Stack(this.translator,this, config as ResolvedStackItemConfig, parent);
            case ItemType.component:
                return new ComponentItem(this.translator,this, config as ResolvedComponentItemConfig, parent as Stack);
            default:
                throw new UnreachableCaseError('CCC913564', config.type, 'Invalid Config Item type specified');
        }
    }


    /**
     * Executes `setMaximisedStack` to handle set maximised stack.
     * @zh 执行 `setMaximisedStack`，用于集合最大化栈。
     * @param stack - stack parameter (`Stack | undefined`) / 栈参数（`Stack | undefined`）
     */
    setMaximisedStack(stack: Stack | undefined): void {
        if (stack === undefined) {
            if (this._maximisedStack !== undefined) {
                this.processMinimiseMaximisedStack();
            }
        } else {
            if (stack !== this._maximisedStack) {
                if (this._maximisedStack !== undefined) {
                    this.processMinimiseMaximisedStack();
                }

                this.processMaximiseStack(stack);
            }
        }
    }

    /**
     * Executes `checkMinimiseMaximisedStack` to handle check minimise maximised stack.
     * @zh 执行 `checkMinimiseMaximisedStack`，用于检查Minimise最大化栈。
     */
    checkMinimiseMaximisedStack(): void {
        if (this._maximisedStack !== undefined) {
            this._maximisedStack.minimise();
        }
    }

    // showAllActiveContentItems() was called from ContentItem.show().  Not sure what its purpose was so have commented out
    // Everything seems to work ok without this.  Have left commented code just in case there was a reason for it becomes
    // apparent

    // /** @internal */
    // showAllActiveContentItems(): void {
    //     const allStacks = this.getAllStacks();

    //     for (let i = 0; i < allStacks.length; i++) {
    //         const stack = allStacks[i];
    //         const activeContentItem = stack.getActiveComponentItem();

    //         if (activeContentItem !== undefined) {
    //             if (!(activeContentItem instanceof ComponentItem)) {
    //                 throw new AssertError('LMSAACIS22298');
    //             } else {
    //                 activeContentItem.container.show();
    //             }
    //         }
    //     }
    // }

    // hideAllActiveContentItems() was called from ContentItem.hide().  Not sure what its purpose was so have commented out
    // Everything seems to work ok without this.  Have left commented code just in case there was a reason for it becomes
    // apparent

    // /** @internal */
    // hideAllActiveContentItems(): void {
    //     const allStacks = this.getAllStacks();

    //     for (let i = 0; i < allStacks.length; i++) {
    //         const stack = allStacks[i];
    //         const activeContentItem = stack.getActiveComponentItem();

    //         if (activeContentItem !== undefined) {
    //             if (!(activeContentItem instanceof ComponentItem)) {
    //                 throw new AssertError('LMSAACIH22298');
    //             } else {
    //                 activeContentItem.container.hide();
    //             }
    //         }
    //     }
    // }

    /**
     * Executes `cleanupBeforeMaximisedStackDestroyed` to handle cleanup before maximised stack destroyed.
     * @internal
     * @zh 执行 `cleanupBeforeMaximisedStackDestroyed`，用于cleanup之前最大化栈已销毁。
     */
    private cleanupBeforeMaximisedStackDestroyed(event: EventEmitter.BubblingEvent) {
		if (this._maximisedStack !== null && this._maximisedStack === event.target) {
			this._maximisedStack.off('beforeItemDestroyed', this._maximisedStackBeforeDestroyedListener);
			this._maximisedStack = undefined;
		}
    }

    /**
     * Executes `closeWindow` to handle close window.
     * @zh 执行 `closeWindow`，用于关闭窗口。
     */
    closeWindow(): void {
        globalThis.setTimeout(() => globalThis.close(), 1);
    }

    /**
     * Executes `getArea` to handle get area.
     * @internal
     * @zh 执行 `getArea`，用于获取区域。
     */
    getArea(x: number, y: number): ContentItem.Area | null {
        let matchingArea = null;
        let smallestSurface = Infinity;

        for (let i = 0; i < this._itemAreas.length; i++) {
            const area = this._itemAreas[i];

            if (
                x >= area.x1 &&
                x < area.x2 && // x2 is not included in area
                y >= area.y1 &&
                y < area.y2 && // y2 is not included in area
                smallestSurface > area.surface
            ) {
                smallestSurface = area.surface;
                matchingArea = area;
            }
        }

        return matchingArea;
    }

    /**
     * Executes `calculateItemAreas` to handle calculate item areas.
     * @internal
     * @zh 执行 `calculateItemAreas`，用于计算条目区域集合。
     */
    calculateItemAreas(): void {
        const allContentItems = this.getAllContentItems();
        const groundItem = this._groundItem;
        if (groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMCIAR44365');
        } else {
            if (allContentItems.length === 1) {
                // No root ContentItem (just Ground ContentItem)
                const groundArea = groundItem.getElementArea();
                if (groundArea === null) {
                    throw new UnexpectedNullError('LMCIARA44365')
                } else {
                    this._itemAreas = [groundArea];
                }
                return;
            } else {
                if (groundItem.contentItems[0].isStack) {
                    // if root is Stack, then split stack and sides of Layout are same, so skip sides
                    this._itemAreas = [];
                } else {
                    // sides of layout
                    this._itemAreas = groundItem.createSideAreas();
                }

                for (let i = 0; i < allContentItems.length; i++) {
                    const stack = allContentItems[i];
                    if (ContentItem.isStack(stack)) {
                        const area = stack.getArea();

                        if (area === null) {
                            continue;
                        } else {
                            this._itemAreas.push(area);
                            const stackContentAreaDimensions = stack.contentAreaDimensions;
                            if (stackContentAreaDimensions === undefined) {
                                throw new UnexpectedUndefinedError('LMCIASC45599');
                            } else {
                                const highlightArea = stackContentAreaDimensions['header'].highlightArea
                                const surface = (highlightArea.x2 - highlightArea.x1) * (highlightArea.y2 - highlightArea.y1);

                                const header: ContentItem.Area = {
                                    x1: highlightArea.x1,
                                    x2: highlightArea.x2,
                                    y1: highlightArea.y1,
                                    y2: highlightArea.y2,
                                    contentItem: stack,
                                    surface,
                                };
                                this._itemAreas.push(header);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Executes `checkLoadedLayoutMaximiseItem` to handle check loaded layout maximise item.
     * @zh 执行 `checkLoadedLayoutMaximiseItem`，用于检查已加载布局最大化条目。
     */
    private checkLoadedLayoutMaximiseItem() {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMCLLMI43432');
        } else {
            const configMaximisedItems = this._groundItem.getConfigMaximisedItems();

            if (configMaximisedItems.length > 0) {
                let item = configMaximisedItems[0];
                if (ContentItem.isComponentItem(item)) {
                    const stack = item.parent;
                    if (stack === null) {
                        throw new UnexpectedNullError('LMXLLMI69999');
                    } else {
                        item = stack;
                    }
                }
                if (!ContentItem.isStack(item)) {
                    throw new AssertError('LMCLLMI19993');
                } else {
                    item.maximise();
                }
            }
        }
    }

    /**
     * Executes `processMaximiseStack` to handle process maximise stack.
     * @internal
     * @zh 执行 `processMaximiseStack`，用于处理最大化栈。
     */
    private processMaximiseStack(stack: Stack): void {
        this._maximisedStack = stack;
        stack.on('beforeItemDestroyed', this._maximisedStackBeforeDestroyedListener);
        stack.element.classList.add(DomConstants.ClassName.Maximised);
        stack.element.insertAdjacentElement('afterend', this._maximisePlaceholder);
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMMXI19993');
        } else {
            this._groundItem.element.prepend(stack.element);
            const { width, height } = getElementWidthAndHeight(this._containerElement);
            setElementWidth(stack.element, width);
            setElementHeight(stack.element, height);
            stack.updateSize(true);
            stack.focusActiveContentItem();
            this._maximisedStack.emit('maximised');
            this.emit('stateChanged');
        }
    }

    /**
     * Executes `processMinimiseMaximisedStack` to handle process minimise maximised stack.
     * @internal
     * @zh 执行 `processMinimiseMaximisedStack`，用于处理Minimise最大化栈。
     */
    private processMinimiseMaximisedStack(): void {
        if (this._maximisedStack === undefined) {
            throw new AssertError('LMMMS74422');
        } else {
            const stack = this._maximisedStack;
            if (stack.parent === null) {
                throw new UnexpectedNullError('LMMI13668');
            } else {
                stack.element.classList.remove(DomConstants.ClassName.Maximised);
                this._maximisePlaceholder.insertAdjacentElement('afterend', stack.element);
                this._maximisePlaceholder.remove();
                this.updateRootSize(true);
                this._maximisedStack = undefined;
                stack.off('beforeItemDestroyed', this._maximisedStackBeforeDestroyedListener);
                stack.emit('minimised');
                this.emit('stateChanged');
            }
        }
    }

    /**
     * Executes `reconcilePopoutWindows` to handle reconcile popout windows.
     * @zh 执行 `reconcilePopoutWindows`，用于reconcile弹出窗口多窗口。
     */
    private reconcilePopoutWindows() {
        const openPopouts: BrowserPopout[] = [];

        for (let i = 0; i < this._openPopouts.length; i++) {
            if (this._openPopouts[i].getWindow().closed === false) {
                openPopouts.push(this._openPopouts[i]);
            } else {
                this.emit('windowClosed', this._openPopouts[i]);
            }
        }

        if (this._openPopouts.length !== openPopouts.length) {
            this._openPopouts = openPopouts;
            this.emit('stateChanged');
        }

    }

    /**
     * Executes `getAllContentItems` to handle get all content items.
     * @zh 执行 `getAllContentItems`，用于获取全部内容条目列表。
     */
    private getAllContentItems() {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMGACI13130');
        } else {
            return this._groundItem.getAllContentItems();
        }
    }

    /**
     * Executes `createSubWindows` to handle create sub windows.
     * @zh 执行 `createSubWindows`，用于创建子多窗口。
     */
    private createSubWindows() {
        for (let i = 0; i < this.layoutConfig.openPopouts.length; i++) {
            const popoutConfig = this.layoutConfig.openPopouts[i];
            this.createPopoutFromPopoutLayoutConfig(popoutConfig);
        }
    }


    /**
     * Executes `handleContainerResize` to handle handle container resize.
     * @zh 执行 `handleContainerResize`，用于连接手柄容器调整尺寸。
     */
    private handleContainerResize(): void {
        if (this.resizeWithContainerAutomatically) {
            this.processResizeWithDebounce();
        }
    }

    /**
     * Debounces resize events
     * @internal

     * @zh 执行 `processResizeWithDebounce`，用于处理调整尺寸带有防抖。
     */
    private processResizeWithDebounce(): void {
        if (this.resizeDebounceExtendedWhenPossible) {
            this.checkClearResizeTimeout();
        }

        if (this._resizeTimeoutId === undefined) {
            this._resizeTimeoutId = setTimeout(
                () => {
                    this._resizeTimeoutId = undefined;
                    this.beginSizeInvalidation();
                    this.endSizeInvalidation();
                },
                this.resizeDebounceInterval,
            );
        }
    }

    /**
     * Executes `checkClearResizeTimeout` to handle check clear resize timeout.
     * @zh 执行 `checkClearResizeTimeout`，用于检查清空调整尺寸延时器。
     */
    private checkClearResizeTimeout() {
        if (this._resizeTimeoutId !== undefined) {
            clearTimeout(this._resizeTimeoutId);
            this._resizeTimeoutId = undefined;
        }
    }

    /**
     * Determines what element the layout will be created in
     * @internal

     * @zh 执行 `setContainer`，用于集合容器。
     */
    private setContainer() {
        const bodyElement = document.body;
        const containerElement = this._containerElement ?? bodyElement;

        if (containerElement === bodyElement) {
            this.resizeWithContainerAutomatically = true;

            const documentElement = document.documentElement;
            documentElement.style.height = '100%';
            documentElement.style.margin = '0';
            documentElement.style.padding = '0';
            documentElement.style.overflow = 'clip';
            bodyElement.style.height = '100%';
            bodyElement.style.margin = '0';
            bodyElement.style.padding = '0';
            bodyElement.style.overflow = 'clip';
        }

        this._containerElement = containerElement;
    }

  
    /**
     * Executes `onBeforeUnload` to handle on before unload.
     * @zh 执行 `onBeforeUnload`，用于当之前Unload。
     */
    private onBeforeUnload(): void {
        this.destroy();
    }

    /**
     * Adjusts the number of columns to be lower to fit the screen and still maintain minItemWidth.
     * @internal

     * @zh 执行 `adjustColumnsResponsive`，用于adjust列集合Responsive。
     */
    private adjustColumnsResponsive() {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMACR20883');
        } else {
            this._firstLoad = false;
            // If there is no min width set, or not content items, do nothing.
            if (this.useResponsiveLayout() &&
                !this._updatingColumnsResponsive &&
                this._groundItem.contentItems.length > 0 &&
                this._groundItem.contentItems[0].isRow)
            {
                if (this._groundItem === undefined || this._width === null) {
                    throw new UnexpectedUndefinedError('LMACR77412');
                } else {
                    // If there is only one column, do nothing.
                    const columnCount = this._groundItem.contentItems[0].contentItems.length;
                    if (columnCount <= 1) {
                        return;
                    } else {
                        // If they all still fit, do nothing.
                        const minItemWidth = this.layoutConfig.dimensions.defaultMinItemWidth;
                        const totalMinWidth = columnCount * minItemWidth;
                        if (totalMinWidth <= this._width) {
                            return;
                        } else {
                            // Prevent updates while it is already happening.
                            this._updatingColumnsResponsive = true;

                            // Figure out how many columns to stack, and put them all in the first stack container.
                            const finalColumnCount = Math.max(Math.floor(this._width / minItemWidth), 1);
                            const stackColumnCount = columnCount - finalColumnCount;

                            const rootContentItem = this._groundItem.contentItems[0];
                            const allStacks = this.getAllStacks();
                            if (allStacks.length === 0) {
                                throw new AssertError('LMACRS77413')
                            } else {
                                const firstStackContainer = allStacks[0];
                                for (let i = 0; i < stackColumnCount; i++) {
                                    // Stack from right.
                                    const column = rootContentItem.contentItems[rootContentItem.contentItems.length - 1];
                                    this.addChildContentItemsToContainer(firstStackContainer, column);
                                }

                                this._updatingColumnsResponsive = false;
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Executes `useResponsiveLayout` to handle use responsive layout.
     * @zh 执行 `useResponsiveLayout`，用于使用Responsive布局。
     */
    private useResponsiveLayout() {
        const settings = this.layoutConfig.settings;
        const alwaysResponsiveMode = settings.responsiveMode === ResponsiveMode.always;
        const onLoadResponsiveModeAndFirst = settings.responsiveMode === ResponsiveMode.onload && this._firstLoad;
        return alwaysResponsiveMode || onLoadResponsiveModeAndFirst;
    }

    /**
     * Executes `addChildContentItemsToContainer` to handle add child content items to container.
     * @zh 执行 `addChildContentItemsToContainer`，用于添加子级内容条目列表转换为容器。
     * @param container - container parameter (`ContentItem`) / 容器参数（`ContentItem`）
     * @param node - node parameter (`ContentItem`) / 节点参数（`ContentItem`）
     */
    private addChildContentItemsToContainer(container: ContentItem, node: ContentItem) {
        const contentItems = node.contentItems;
        if (node instanceof Stack) {
            for (let i = 0; i < contentItems.length; i++) {
                const item = contentItems[i];
                node.removeChild(item, true);
                container.addChild(item);
            }
        } else {
            for (let i = 0; i < contentItems.length; i++) {
                const item = contentItems[i];
                this.addChildContentItemsToContainer(container, item);
            }
        }
    }

    /**
     * Executes `getAllStacks` to handle get all stacks.
     * @zh 执行 `getAllStacks`，用于获取全部栈。
     */
    public getAllStacks() {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMFASC52778');
        } else {
            const stacks: Stack[] = [];
            this.findAllStacksRecursive(stacks, this._groundItem);

            return stacks;
        }
    }

    /**
     * Executes `findFirstContentItemType` to handle find first content item type.
     * @internal
     * @zh 执行 `findFirstContentItemType`，用于查找首个内容条目类型。
     */
    private findFirstContentItemType(type: ItemType): ContentItem | undefined {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMFFCIT82446');
        } else {
            return this.findFirstContentItemTypeRecursive(type, this._groundItem);
        }
    }

    /**
     * Executes `findFirstContentItemTypeRecursive` to handle find first content item type recursive.
     * @internal
     * @zh 执行 `findFirstContentItemTypeRecursive`，用于查找首个内容条目类型Recursive。
     */
    private findFirstContentItemTypeRecursive(type: ItemType, node: ContentItem): ContentItem | undefined {
        const contentItems = node.contentItems;
        const contentItemCount = contentItems.length;
        if (contentItemCount === 0) {
            return undefined;
        } else {
            for (let i = 0; i < contentItemCount; i++) {
                const contentItem = contentItems[i];
                if (contentItem.type === type) {
                    return contentItem;
                }
            }

            for (let i = 0; i < contentItemCount; i++) {
                const contentItem = contentItems[i];
                const foundContentItem = this.findFirstContentItemTypeRecursive(type, contentItem);
                if (foundContentItem !== undefined) {
                    return foundContentItem;
                }
            }

            return undefined;
        }
    }

    /**
     * Executes `findFirstContentItemTypeByIdRecursive` to handle find first content item type by id recursive.
     * @internal
     * @zh 执行 `findFirstContentItemTypeByIdRecursive`，用于查找首个内容条目类型按唯一标识Recursive。
     */
    private findFirstContentItemTypeByIdRecursive(type: ItemType, id: string, node: ContentItem): ContentItem | undefined {
        const contentItems = node.contentItems;
        const contentItemCount = contentItems.length;
        if (contentItemCount === 0) {
            return undefined;
        } else {
            for (let i = 0; i < contentItemCount; i++) {
                const contentItem = contentItems[i];
                if (contentItem.type === type && contentItem.id === id) {
                    return contentItem;
                }
            }

            for (let i = 0; i < contentItemCount; i++) {
                const contentItem = contentItems[i];
                const foundContentItem = this.findFirstContentItemTypeByIdRecursive(type, id, contentItem);
                if (foundContentItem !== undefined) {
                    return foundContentItem;
                }
            }

            return undefined;
        }
    }

    /**
     * Finds all the stack containers.
     *
     * @param stacks - Set of containers to populate.
     * @param node - Current node to process.
     * @internal

     * @zh 执行 `findAllStacksRecursive`，用于查找全部栈Recursive。
     */
    private findAllStacksRecursive(stacks: Stack[], node: ContentItem) {
        const contentItems = node.contentItems;
        for (let i = 0; i < contentItems.length; i++) {
            const item = contentItems[i];
            if (item instanceof Stack) {
                stacks.push(item);
            } else {
                if (!item.isComponent) {
                    this.findAllStacksRecursive(stacks, item);
                }
            }
        }
    }


    /**
     * Executes `findFirstLocation` to handle find first location.
     * @zh 执行 `findFirstLocation`，用于查找首个Location。
     * @param selectors - selectors parameter (`readonly LayoutManager.LocationSelector[]`) / 选择器参数（`readonly LayoutManager.LocationSelector[]`）
     * @returns Result of type `LayoutManager.Location | undefined` / 类型为 `LayoutManager.Location | undefined` 的返回值
     */
    public findFirstLocation(selectors: readonly LayoutManager.LocationSelector[]): LayoutManager.Location | undefined {
        const count = selectors.length;
        for (let i = 0; i < count; i++) {
            const selector = selectors[i];
            const location = this.findLocation(selector);
            if (location !== undefined) {
                return location;
            }
        }
        return undefined;
    }

    /**
     * Executes `findLocation` to handle find location.
     * @internal
     * @zh 执行 `findLocation`，用于查找Location。
     */
    private findLocation(selector: LayoutManager.LocationSelector): LayoutManager.Location | undefined {
        const selectorIndex = selector.index;
        switch (selector.typeId) {
            case LayoutManager.LocationSelector.TypeId.FocusedItem: {
                if (this._focusedComponentItem === undefined) {
                    return undefined
                } else {
                    const parentItem = this._focusedComponentItem.parentItem;
                    const parentContentItems = parentItem.contentItems;
                    const parentContentItemCount = parentContentItems.length;
                    if (selectorIndex === undefined) {
                        return { parentItem, index: parentContentItemCount };
                    } else {
                        const focusedIndex = parentContentItems.indexOf(this._focusedComponentItem);
                        const index = focusedIndex + selectorIndex;
                        if (index < 0 || index > parentContentItemCount) {
                            return undefined;
                        } else {
                            return { parentItem, index };
                        }
                    }
                }
            }
            case LayoutManager.LocationSelector.TypeId.FocusedStack: {
                if (this._focusedComponentItem === undefined) {
                    return undefined
                } else {
                    const parentItem = this._focusedComponentItem.parentItem;
                    return this.tryCreateLocationFromParentItem(parentItem, selectorIndex);
                }
            }
            case LayoutManager.LocationSelector.TypeId.FirstStack: {
                const parentItem = this.findFirstContentItemType(ItemType.stack);
                if (parentItem === undefined) {
                    return undefined;
                } else {
                    return this.tryCreateLocationFromParentItem(parentItem, selectorIndex);
                }
            }
            case LayoutManager.LocationSelector.TypeId.FirstRowOrColumn: {
                let parentItem = this.findFirstContentItemType(ItemType.row);
                if (parentItem !== undefined) {
                    return this.tryCreateLocationFromParentItem(parentItem, selectorIndex);
                } else {
                    parentItem = this.findFirstContentItemType(ItemType.column);
                    if (parentItem !== undefined) {
                        return this.tryCreateLocationFromParentItem(parentItem, selectorIndex);
                    } else {
                        return undefined;
                    }
                }
            }
            case LayoutManager.LocationSelector.TypeId.FirstRow: {
                const parentItem = this.findFirstContentItemType(ItemType.row);
                if (parentItem === undefined) {
                    return undefined;
                } else {
                    return this.tryCreateLocationFromParentItem(parentItem, selectorIndex);
                }
            }
            case LayoutManager.LocationSelector.TypeId.FirstColumn: {
                const parentItem = this.findFirstContentItemType(ItemType.column);
                if (parentItem === undefined) {
                    return undefined;
                } else {
                    return this.tryCreateLocationFromParentItem(parentItem, selectorIndex);
                }
            }
            case LayoutManager.LocationSelector.TypeId.Empty: {
                if (this._groundItem === undefined) {
                    throw new UnexpectedUndefinedError('LMFLRIF18244');
                } else {
                    if (this.rootItem !== undefined) {
                        return undefined;
                    } else {
                        if (selectorIndex === undefined || selectorIndex === 0)
                            return { parentItem: this._groundItem, index: 0 };
                        else {
                            return undefined;
                        }
                    }
                }
            }
            case LayoutManager.LocationSelector.TypeId.Root: {
                if (this._groundItem === undefined) {
                    throw new UnexpectedUndefinedError('LMFLF18244');
                } else {
                    const groundContentItems = this._groundItem.contentItems;
                    if (groundContentItems.length === 0) {
                        if (selectorIndex === undefined || selectorIndex === 0)
                            return { parentItem: this._groundItem, index: 0 };
                        else {
                            return undefined;
                        }
                    } else {
                        const parentItem = groundContentItems[0];
                        return this.tryCreateLocationFromParentItem(parentItem, selectorIndex);
                    }
                }
            }
        }
    }

    /**
     * Executes `tryCreateLocationFromParentItem` to handle try create location from parent item.
     * @internal
     * @zh 执行 `tryCreateLocationFromParentItem`，用于try创建Location从父级条目。
     */
    private tryCreateLocationFromParentItem(parentItem: ContentItem,
        selectorIndex: number | undefined
    ): LayoutManager.Location | undefined {
        const parentContentItems = parentItem.contentItems;
        const parentContentItemCount = parentContentItems.length;
        if (selectorIndex === undefined) {
            return { parentItem, index: parentContentItemCount };
        } else {
            if (selectorIndex < 0 || selectorIndex > parentContentItemCount) {
                return undefined;
            } else {
                return { parentItem, index: selectorIndex };
            }
        }
    }
}

/** @public */
export namespace LayoutManager {
    /**
     * Type alias `BeforeVirtualRectingEvent` representing before virtual recting event (`(this: void, count: number) => void`).
     * @zh 类型别名 `BeforeVirtualRectingEvent`，表示之前虚拟滚动矩形事件（`(this: void, count: number) => void`）。
     */
    export type BeforeVirtualRectingEvent = (this: void, count: number) => void;
    /**
     * Type alias `AfterVirtualRectingEvent` representing after virtual recting event (`(this: void) => void`).
     * @zh 类型别名 `AfterVirtualRectingEvent`，表示之后虚拟滚动矩形事件（`(this: void) => void`）。
     */
    export type AfterVirtualRectingEvent = (this: void) => void;

    /**
     * Interface `ConstructorParameters` defining the contract and properties for constructor parameters.
     * @internal
     * @zh 接口 `ConstructorParameters`，定义Constructor参数列表的数据结构契约与属性规范。
     */
    export interface ConstructorParameters {
        /**
         * Property `constructorOrSubWindowLayoutConfig` (`LayoutConfig | undefined`) storing constructor or sub window layout config.
         * @zh 属性 `constructorOrSubWindowLayoutConfig`（类型：`LayoutConfig | undefined`），用于存储或配置constructorOr子窗口布局配置。
         */
        constructorOrSubWindowLayoutConfig: LayoutConfig | undefined;
        /**
         * Property `isSubWindow` (`boolean`) storing is sub window.
         * @zh 属性 `isSubWindow`（类型：`boolean`），用于存储或配置是否为子窗口。
         */
        isSubWindow: boolean;
        /**
         * Property `containerElement` (`HTMLElement | undefined`) storing container element.
         * @zh 属性 `containerElement`（类型：`HTMLElement | undefined`），用于存储或配置容器元素。
         */
        containerElement: HTMLElement | undefined;
    }

    /**
     * Executes `createMaximisePlaceElement` to handle create maximise place element.
     * @internal
     * @zh 执行 `createMaximisePlaceElement`，用于创建最大化Place元素。
     */
    export function createMaximisePlaceElement(document: Document): HTMLElement {
        const element = document.createElement('div');
        element.classList.add(DomConstants.ClassName.MaximisePlace);
        return element;
    }

    /**
     * Executes `createTabDropPlaceholderElement` to handle create tab drop placeholder element.
     * @internal
     * @zh 执行 `createTabDropPlaceholderElement`，用于创建选项卡放置占位提示元素。
     */
    export function createTabDropPlaceholderElement(document: Document): HTMLElement {
        const element = document.createElement('div');
        element.classList.add(DomConstants.ClassName.DropTabPlaceholder);
        return element;
    }

    /**
     * Interface `Location` defining the contract and properties for location.
     * @zh 接口 `Location`，定义Location的数据结构契约与属性规范。
     */
    export interface Location {
        /**
         * Property `parentItem` (`ContentItem`) storing parent item.
         * @zh 属性 `parentItem`（类型：`ContentItem`），用于存储或配置父级条目。
         */
        parentItem: ContentItem;
        /**
         * Property `index` (`number`) storing index.
         * @zh 属性 `index`（类型：`number`），用于存储或配置索引。
         */
        index: number;
    }

    /**
     * Interface `LocationSelector` defining the contract and properties for location selector.
     * @zh 接口 `LocationSelector`，定义Location选择器的数据结构契约与属性规范。
     */
    export interface LocationSelector {
        /**
         * Specifies selector algorithm
         * @zh 属性 `typeId`（类型：`LocationSelector.TypeId`），用于存储或配置类型唯一标识。
         */
        typeId: LocationSelector.TypeId;
        /**
         * Used by algorithm to determine index in found ContentItem
         * @zh 属性 `index`（类型：`number`），用于存储或配置索引。
         */
        index?: number;
    }

    /** @public */
    export namespace LocationSelector {
        /**
         * Enumeration `TypeId` defining supported type id constants.
         * @zh 枚举 `TypeId`，定义支持的类型唯一标识常量集合。
         */
        export const enum TypeId {
            /**
             * Stack with focused Item. Index specifies offset from index of focused item (eg 1 is the position after focused item)
             * @zh 枚举项 `TypeId.FocusedItem`，表示已聚焦条目。
             */
            FocusedItem,
            /**
             * Stack with focused Item. Index specfies ContentItems index
             * @zh 枚举项 `TypeId.FocusedStack`，表示已聚焦栈。
             */
            FocusedStack,
            /**
             * First stack found in layout
             * @zh 枚举项 `TypeId.FirstStack`，表示首个栈。
             */
            FirstStack,
            /**
             * First Row or Column found in layout (rows are searched first)
             * @zh 枚举项 `TypeId.FirstRowOrColumn`，表示首个行Or列。
             */
            FirstRowOrColumn,
            /**
             * First Row in layout
             * @zh 枚举项 `TypeId.FirstRow`，表示首个行。
             */
            FirstRow,
            /**
             * First Column in layout
             * @zh 枚举项 `TypeId.FirstColumn`，表示首个列。
             */
            FirstColumn,
            /**
             * Finds a location if layout is empty. The found location will be the root ContentItem.
             * @zh 枚举项 `TypeId.Empty`，表示空。
             */
            Empty,
            /**
             * Finds root if layout is empty, otherwise a child under root
             * @zh 枚举项 `TypeId.Root`，表示根节点。
             */
            Root,
        }
    }

    /**
     * Constant/variable `defaultLocationSelectors` defining default location selectors in `src/container/dock-layout`.
     * @zh 常量/变量 `defaultLocationSelectors`，定义 `src/container/dock-layout` 中的默认Location选择器。
     */
    export const defaultLocationSelectors: readonly LocationSelector[] = [
        { typeId: LocationSelector.TypeId.FocusedStack, index: undefined },
        { typeId: LocationSelector.TypeId.FirstStack, index: undefined },
        { typeId: LocationSelector.TypeId.FirstRowOrColumn, index: undefined },
        { typeId: LocationSelector.TypeId.Root, index: undefined },
    ];

    /**
     * LocationSelectors to try to get location next to existing focused item
     * @public

     * @zh 常量/变量 `afterFocusedItemIfPossibleLocationSelectors`，定义 `src/container/dock-layout` 中的之后已聚焦条目IfPossibleLocation选择器。
     */
    export const afterFocusedItemIfPossibleLocationSelectors: readonly LocationSelector[] = [
        { typeId: LocationSelector.TypeId.FocusedItem, index: 1 },
        { typeId: LocationSelector.TypeId.FirstStack, index: undefined },
        { typeId: LocationSelector.TypeId.FirstRowOrColumn, index: undefined },
        { typeId: LocationSelector.TypeId.Root, index: undefined },
    ];
}
