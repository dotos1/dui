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
    interface Window {
        __glInstance: LayoutManager;
    }
}

export abstract class LayoutManager extends EventEmitter {

    resizeWithContainerAutomatically = false;
  
    resizeDebounceInterval = 100;

    resizeDebounceExtendedWhenPossible = true;

    /** @internal */
    private _containerElement: HTMLElement;
    /** @internal */
    private _isInitialised = false;
    /** @internal */
    private _groundItem: GroundItem | undefined = undefined;
    /** @internal */
    private _openPopouts: BrowserPopout[] = [];
    /** @internal */
    private _dropTargetIndicator: DropTargetIndicator | null = null;
    /** @internal */
    private _transitionIndicator: TransitionIndicator | null = null;
    /** @internal */
    private _resizeTimeoutId: ReturnType<typeof setTimeout> | undefined;
    /** @internal */
    private _itemAreas: ContentItem.Area[] = [];
    /** @internal */
    private _maximisedStack: Stack | undefined;
    /** @internal */
    private _maximisePlaceholder = LayoutManager.createMaximisePlaceElement(document);
    /** @internal */
    private _tabDropPlaceholder = LayoutManager.createTabDropPlaceholderElement(document);
    /** @internal */
    private _dragSources: DragSource[] = [];
    /** @internal */
    private _updatingColumnsResponsive = false;
    /** @internal */
    private _firstLoad = true;
    /** @internal */
    private _eventHub = new EventHub(this);
    /** @internal */
    private _width: number | null = null;
    /** @internal */
    private _height: number | null = null;
    /** @internal */
    private _focusedComponentItem: ComponentItem | undefined;
    /** @internal */
    private _virtualSizedContainers: ComponentContainer[] = [];
    /** @internal */
    private _virtualSizedContainerAddingBeginCount = 0;
    /** @internal */
    private _sizeInvalidationBeginCount = 0;
    /** @internal */
    protected _constructorOrSubWindowLayoutConfig: LayoutConfig | undefined; // protected for backwards compatibility

    /** @internal */
    private _resizeObserver = new ResizeObserver(() => this.handleContainerResize());

    private _windowBeforeUnloadListener = () => this.onBeforeUnload();

    private _windowBeforeUnloadListening = false;
    /** @internal */
    private _maximisedStackBeforeDestroyedListener = (ev: EventEmitter.BubblingEvent) => this.cleanupBeforeMaximisedStackDestroyed(ev);

    readonly isSubWindow: boolean;
    layoutConfig: ResolvedLayoutConfig;

    beforeVirtualRectingEvent: LayoutManager.BeforeVirtualRectingEvent | undefined;
    afterVirtualRectingEvent: LayoutManager.AfterVirtualRectingEvent | undefined;

    get container(): HTMLElement { return this._containerElement; }
    get isInitialised(): boolean { return this._isInitialised; }
    /** @internal */
    get groundItem(): GroundItem | undefined { return this._groundItem; }
    /** @internal @deprecated use {@link (LayoutManager:class).groundItem} instead */
    get root(): GroundItem | undefined { return this._groundItem; }
    get openPopouts(): BrowserPopout[] { return this._openPopouts; }
    /** @internal */
    get dropTargetIndicator(): DropTargetIndicator | null { return this._dropTargetIndicator; }

    get transitionIndicator(): TransitionIndicator | null { return this._transitionIndicator; }
    get width(): number | null { return this._width; }
    get height(): number | null { return this._height; }
    get eventHub(): EventHub { return this._eventHub; }
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
    get focusedComponentItem(): ComponentItem | undefined { return this._focusedComponentItem; }
    /** @internal */
    get tabDropPlaceholder(): HTMLElement { return this._tabDropPlaceholder; }
    get maximisedStack(): Stack | undefined { return this._maximisedStack; }

    /** @deprecated indicates deprecated constructor use */
    get deprecatedConstructor(): boolean { return !this.isSubWindow && this._constructorOrSubWindowLayoutConfig !== undefined; }

    public translator;
    /**
    * @param container - A Dom HTML element. Defaults to body
    * @internal
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

    minifyConfig(config: ResolvedLayoutConfig): ResolvedLayoutConfig {
        return ResolvedLayoutConfig.minifyConfig(config);
    }

    unminifyConfig(config: ResolvedLayoutConfig): ResolvedLayoutConfig {
        return ResolvedLayoutConfig.unminifyConfig(config);
    }

    /** @internal */
    abstract bindComponent(translator:TranslateService,container: ComponentContainer, itemConfig: ResolvedComponentItemConfig): ComponentContainer.BindableComponent;
    /** @internal */
    abstract unbindComponent(container: ComponentContainer, virtual: boolean, component: ComponentContainer.Component | undefined): void;


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


    clear(): void {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMCL11129');
        } else {
            this._groundItem.clearRoot();
        }
    }

    toConfig(): ResolvedLayoutConfig {
        return this.saveLayout();
    }

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
    addComponentAtStack(componentType: any, componentState?: JsonValue, title?: string,
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


    addItemAtStack(itemConfig: ComponentItemConfig,
        stackId?:string
    ): LayoutManager.Location | undefined {
        if (this._groundItem === undefined) {
            throw new Error('Cannot add component before init');
        } else {
            const stack:Stack =this.findFirstStackComponentItemById(stackId);
            let index=stack.contentItems.length;
            let addIdx= stack.addItem(itemConfig, index);
          
            let location:any = {};
            location.parentItem = stack;
            location.index = addIdx;
            return location;
        }
    }


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
    addComponent(componentType: JsonValue, componentState?: JsonValue, title?: string): LayoutManager.Location {
        const location = this.addComponentAtLocation(componentType, componentState, title);
        if (location === undefined) {
            throw new AssertError('LMAC99943');
        } else {
            return location;
        }
    }

    addComponentAtLocation(componentType: any, componentState?: JsonValue, title?: string,
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

    newItem(itemConfig: RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig): ContentItem {
        const contentItem = this.newItemAtLocation(itemConfig);
        if (contentItem === undefined) {
            throw new AssertError('LMNC65588');
        } else {
            return contentItem;
        }
    }

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

    addItem(itemConfig: RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig): LayoutManager.Location {
        const location = this.addItemAtLocation(itemConfig);
        if (location === undefined) {
            throw new AssertError('LMAI99943');
        } else {
            return location;
        }
    }

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

    loadComponentAsRoot(itemConfig: ComponentItemConfig): void {
        if (this._groundItem === undefined) {
            throw new Error('Cannot add item before init');
        } else {
            this._groundItem.loadComponentAsRoot(itemConfig);
        }
    }

    updateSize(width: number, height: number): void {
        this.setSize(width, height);
    }


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

    /** @internal */
    beginSizeInvalidation(): void {
        this._sizeInvalidationBeginCount++;
    }

    /** @internal */
    endSizeInvalidation(): void {
        if (--this._sizeInvalidationBeginCount === 0) {
            this.updateSizeFromContainer();
        }
    }

    /** @internal */
    updateSizeFromContainer(): void {
        const { width, height } = getElementWidthAndHeight(this._containerElement);
        this.setSize(width, height);
    }


    updateRootSize(force = false): void {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMURS28881');
        } else {
            this._groundItem.updateSize(force);
        }
    }

    /** @public */
    createAndInitContentItem(config: ResolvedItemConfig, parent: ContentItem): ContentItem {
        const newItem = this.createContentItem(config, parent);
        newItem.init();
        return newItem;
    }

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

    findFirstStackComponentItemById(id: string): any {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMFFCIBI82446');
        } else {
            return this.findFirstContentItemTypeByIdRecursive(ItemType.stack, id, this._groundItem) as ComponentItem;
        }
    }

    findFirstComponentItemById(id: string): ComponentItem | undefined {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMFFCIBI82446');
        } else {
            return this.findFirstContentItemTypeByIdRecursive(ItemType.component, id, this._groundItem) as ComponentItem;
        }
    }

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

    /** @internal */
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

    /** @internal */
    beginVirtualSizedContainerAdding(): void {
        if (++this._virtualSizedContainerAddingBeginCount === 0) {
            this._virtualSizedContainers.length = 0;
        }
    }

    /** @internal */
    addVirtualSizedContainer(container: ComponentContainer): void {
        this._virtualSizedContainers.push(container);
    }

    /** @internal */
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

    /** @internal */
    fireBeforeVirtualRectingEvent(count: number): void {
        if (this.beforeVirtualRectingEvent !== undefined) {
            this.beforeVirtualRectingEvent(count);
        }
    }

    /** @internal */
    fireAfterVirtualRectingEvent(): void {
        if (this.afterVirtualRectingEvent !== undefined) {
            this.afterVirtualRectingEvent();
        }
    }

    /** @internal */
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

    /** @internal */
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


    newDragSource(element: HTMLElement, itemConfigCallback: () => (DragSource.ComponentItemConfig | ComponentItemConfig)): DragSource;
    /** @deprecated will be replaced in version 3 with newDragSource(element: HTMLElement, itemConfig: ComponentItemConfig) */
    newDragSource(element: HTMLElement, componentType: JsonValue, componentState?: JsonValue, title?: JsonValue, id?: string): DragSource;
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


	removeDragSource(dragSource: DragSource): void {
		removeFromArray(dragSource, this._dragSources );
		dragSource.destroy();
    }

    /** @internal */
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

    focusComponent(item: ComponentItem, suppressEvent = false): void {
        item.focus(suppressEvent);
    }

    clearComponentFocus(suppressEvent = false): void {
        this.setFocusedComponentItem(undefined, suppressEvent);
    }

    setFocusedComponentItem(item: ComponentItem | undefined, suppressEvents = false): void {
        if (item !== this._focusedComponentItem) {

            let newFocusedParentItem: ComponentParentableItem | undefined;
            if (item === undefined) {
                newFocusedParentItem === undefined;
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

    /** @internal */
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

    /** @internal */
    private cleanupBeforeMaximisedStackDestroyed(event: EventEmitter.BubblingEvent) {
		if (this._maximisedStack !== null && this._maximisedStack === event.target) {
			this._maximisedStack.off('beforeItemDestroyed', this._maximisedStackBeforeDestroyedListener);
			this._maximisedStack = undefined;
		}
    }

    closeWindow(): void {
        globalThis.setTimeout(() => globalThis.close(), 1);
    }

    /** @internal */
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

    /** @internal */
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

    /** @internal */
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

    /** @internal */
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

    private getAllContentItems() {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMGACI13130');
        } else {
            return this._groundItem.getAllContentItems();
        }
    }

    private createSubWindows() {
        for (let i = 0; i < this.layoutConfig.openPopouts.length; i++) {
            const popoutConfig = this.layoutConfig.openPopouts[i];
            this.createPopoutFromPopoutLayoutConfig(popoutConfig);
        }
    }


    private handleContainerResize(): void {
        if (this.resizeWithContainerAutomatically) {
            this.processResizeWithDebounce();
        }
    }

    /**
     * Debounces resize events
     * @internal
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

    private checkClearResizeTimeout() {
        if (this._resizeTimeoutId !== undefined) {
            clearTimeout(this._resizeTimeoutId);
            this._resizeTimeoutId = undefined;
        }
    }

    /**
     * Determines what element the layout will be created in
     * @internal
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

  
    private onBeforeUnload(): void {
        this.destroy();
    }

    /**
     * Adjusts the number of columns to be lower to fit the screen and still maintain minItemWidth.
     * @internal
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

    private useResponsiveLayout() {
        const settings = this.layoutConfig.settings;
        const alwaysResponsiveMode = settings.responsiveMode === ResponsiveMode.always;
        const onLoadResponsiveModeAndFirst = settings.responsiveMode === ResponsiveMode.onload && this._firstLoad;
        return alwaysResponsiveMode || onLoadResponsiveModeAndFirst;
    }

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

    public getAllStacks() {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMFASC52778');
        } else {
            const stacks: Stack[] = [];
            this.findAllStacksRecursive(stacks, this._groundItem);

            return stacks;
        }
    }

    /** @internal */
    private findFirstContentItemType(type: ItemType): ContentItem | undefined {
        if (this._groundItem === undefined) {
            throw new UnexpectedUndefinedError('LMFFCIT82446');
        } else {
            return this.findFirstContentItemTypeRecursive(type, this._groundItem);
        }
    }

    /** @internal */
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

    /** @internal */
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

    /** @internal */
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

    /** @internal */
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
    export type BeforeVirtualRectingEvent = (this: void, count: number) => void;
    export type AfterVirtualRectingEvent = (this: void) => void;

    /** @internal */
    export interface ConstructorParameters {
        constructorOrSubWindowLayoutConfig: LayoutConfig | undefined;
        isSubWindow: boolean;
        containerElement: HTMLElement | undefined;
    }

    /** @internal */
    export function createMaximisePlaceElement(document: Document): HTMLElement {
        const element = document.createElement('div');
        element.classList.add(DomConstants.ClassName.MaximisePlace);
        return element;
    }

    /** @internal */
    export function createTabDropPlaceholderElement(document: Document): HTMLElement {
        const element = document.createElement('div');
        element.classList.add(DomConstants.ClassName.DropTabPlaceholder);
        return element;
    }

    export interface Location {
        parentItem: ContentItem;
        index: number;
    }

    export interface LocationSelector {
        /** Specifies selector algorithm */
        typeId: LocationSelector.TypeId;
        /** Used by algorithm to determine index in found ContentItem */
        index?: number;
    }

    /** @public */
    export namespace LocationSelector {
        export const enum TypeId {
            /** Stack with focused Item. Index specifies offset from index of focused item (eg 1 is the position after focused item) */
            FocusedItem,
            /** Stack with focused Item. Index specfies ContentItems index */
            FocusedStack,
            /** First stack found in layout */
            FirstStack,
            /** First Row or Column found in layout (rows are searched first) */
            FirstRowOrColumn,
            /** First Row in layout */
            FirstRow,
            /** First Column in layout */
            FirstColumn,
            /** Finds a location if layout is empty. The found location will be the root ContentItem. */
            Empty,
            /** Finds root if layout is empty, otherwise a child under root */
            Root,
        }
    }

    export const defaultLocationSelectors: readonly LocationSelector[] = [
        { typeId: LocationSelector.TypeId.FocusedStack, index: undefined },
        { typeId: LocationSelector.TypeId.FirstStack, index: undefined },
        { typeId: LocationSelector.TypeId.FirstRowOrColumn, index: undefined },
        { typeId: LocationSelector.TypeId.Root, index: undefined },
    ];

    /**
     * LocationSelectors to try to get location next to existing focused item
     * @public
     */
    export const afterFocusedItemIfPossibleLocationSelectors: readonly LocationSelector[] = [
        { typeId: LocationSelector.TypeId.FocusedItem, index: 1 },
        { typeId: LocationSelector.TypeId.FirstStack, index: undefined },
        { typeId: LocationSelector.TypeId.FirstRowOrColumn, index: undefined },
        { typeId: LocationSelector.TypeId.Root, index: undefined },
    ];
}
