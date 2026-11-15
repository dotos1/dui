/**
 * @fileoverview Module `src/container/dock-layout/items/content-item.ts` providing content item definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/items/content-item.ts`，提供内容条目相关的定义与实现。
 */

import { uuid } from '@dotos1/dui/util'
import { ResolvedItemConfig } from '../config/resolved-config'
import { BrowserPopout } from '../controls/browser-popout'
import { AssertError, UnexpectedNullError } from '../errors/internal-error'
import { LayoutManager } from '../layout-manager'
import { EventEmitter } from '../utils/event-emitter'
import { AreaLinkedRect, ItemType, SizeUnitEnum } from '../utils/types'
import { getUniqueId, setElementDisplayVisibility } from '../utils/utils'
import { ComponentItem } from './component-item'
import { ComponentParentableItem } from './component-parentable-item'
import { Stack } from './stack'

/**
 * This is the baseclass that all content items inherit from.
 * Most methods provide a subset of what the sub-classes do.
 *
 * It also provides a number of functions for tree traversal
 * @public

 * @zh 类 `ContentItem`，封装 `src/container/dock-layout/items` 中的内容条目数据结构与处理逻辑。
 */

export abstract class ContentItem extends EventEmitter {
    /**
     * Property `_type` (`ItemType`) storing type.
     * @internal
     * @zh 属性 `_type`（类型：`ItemType`），用于存储或配置类型。
     */
    private _type: ItemType;
    /**
     * Property `_id` (`string`) storing id.
     * @internal
     * @zh 属性 `_id`（类型：`string`），用于存储或配置唯一标识。
     */
    private _id: string;
    /**
     * Property `_popInParentIds` (`string[]`) storing pop in parent ids (default: `[]`).
     * @internal
     * @zh 属性 `_popInParentIds`（类型：`string[]`），用于存储或配置弹出在父级标识列表（默认值：`[]`）。
     */
    private _popInParentIds: string[] = [];
    /**
     * Property `_contentItems` (`ContentItem[]`) storing content items.
     * @internal
     * @zh 属性 `_contentItems`（类型：`ContentItem[]`），用于存储或配置内容条目列表。
     */
    private _contentItems: ContentItem[];
    /**
     * Property `_isClosable` (`any`) storing is closable.
     * @internal
     * @zh 属性 `_isClosable`（类型：`any`），用于存储或配置是否为是否可关闭。
     */
    private _isClosable;
    /**
     * Property `_pendingEventPropagations` (`Record<string, unknown>`) storing pending event propagations.
     * @internal
     * @zh 属性 `_pendingEventPropagations`（类型：`Record<string, unknown>`），用于存储或配置等待中事件事件冒泡。
     */
    private _pendingEventPropagations: Record<string, unknown>;
    /**
     * Property `_throttledEvents` (`string[]`) storing throttled events.
     * @internal
     * @zh 属性 `_throttledEvents`（类型：`string[]`），用于存储或配置已节流事件集合。
     */
    private _throttledEvents: string[];
    /**
     * Property `_isInitialised` (`any`) storing is initialised.
     * @internal
     * @zh 属性 `_isInitialised`（类型：`any`），用于存储或配置是否为Initialised。
     */
    private _isInitialised;

    /**
     * Property `size` (`number`) storing size.
     * @internal
     * @zh 属性 `size`（类型：`number`），用于存储或配置尺寸。
     */
    size: number;
    /**
     * Property `sizeUnit` (`SizeUnitEnum`) storing size unit.
     * @internal
     * @zh 属性 `sizeUnit`（类型：`SizeUnitEnum`），用于存储或配置尺寸Unit。
     */
    sizeUnit: SizeUnitEnum;
    /**
     * Property `minSize` (`number`) storing min size.
     * @internal
     * @zh 属性 `minSize`（类型：`number`），用于存储或配置最小值尺寸。
     */
    minSize: number | undefined;
    /**
     * Property `minSizeUnit` (`SizeUnitEnum`) storing min size unit.
     * @internal
     * @zh 属性 `minSizeUnit`（类型：`SizeUnitEnum`），用于存储或配置最小值尺寸Unit。
     */
    minSizeUnit: SizeUnitEnum;

    /**
     * Property `isGround` (`boolean`) storing is ground.
     * @zh 属性 `isGround`（类型：`boolean`），用于存储或配置是否为Ground。
     */
    isGround: boolean
    /**
     * Property `isRow` (`boolean`) storing is row.
     * @zh 属性 `isRow`（类型：`boolean`），用于存储或配置是否为行。
     */
    isRow: boolean
    /**
     * Property `isColumn` (`boolean`) storing is column.
     * @zh 属性 `isColumn`（类型：`boolean`），用于存储或配置是否为列。
     */
    isColumn: boolean
    /**
     * Property `isStack` (`boolean`) storing is stack.
     * @zh 属性 `isStack`（类型：`boolean`），用于存储或配置是否为栈。
     */
    isStack: boolean
    /**
     * Property `isComponent` (`boolean`) storing is component.
     * @zh 属性 `isComponent`（类型：`boolean`），用于存储或配置是否为组件。
     */
    isComponent: boolean

    /**
     * Gets the current type (`type: ItemType`).
     * @zh 获取当前类型（`type: ItemType`）。
     */
    get type(): ItemType { return this._type; }
    /**
     * Gets the current id (`id: string`).
     * @zh 获取当前唯一标识（`id: string`）。
     */
    get id(): string { return this._id; }
    /**
     * Sets the id (`id`).
     * @zh 设置唯一标识（`id`）。
     * @param value - New id value (`string`) / 新的唯一标识值（`string`）
     */
    set id(value: string) { this._id = value; }
    /**
     * Gets the current pop in parent ids (`popInParentIds: string[]`).
     * @internal
     * @zh 获取当前弹出在父级标识列表（`popInParentIds: string[]`）。
     */
    get popInParentIds(): string[] { return this._popInParentIds; }
    /**
     * Gets the current parent (`parent: ContentItem | null`).
     * @zh 获取当前父级（`parent: ContentItem | null`）。
     */
    get parent(): ContentItem | null { return this._parent; }
    /**
     * Gets the current content items (`contentItems: ContentItem[]`).
     * @zh 获取当前内容条目列表（`contentItems: ContentItem[]`）。
     */
    get contentItems(): ContentItem[] { return this._contentItems; }
    /**
     * Gets the current is closable (`isClosable: boolean`).
     * @zh 获取当前是否为是否可关闭（`isClosable: boolean`）。
     */
    get isClosable(): boolean { return this._isClosable; }
    /**
     * Gets the current element (`element: HTMLElement`).
     * @zh 获取当前元素（`element: HTMLElement`）。
     */
    get element(): HTMLElement { return this._element; }
    /**
     * Gets the current is initialised (`isInitialised: boolean`).
     * @zh 获取当前是否为Initialised（`isInitialised: boolean`）。
     */
    get isInitialised(): boolean { return this._isInitialised; }

    /**
     * Executes `isStack` to handle is stack.
     * @zh 执行 `isStack`，用于是否为栈。
     * @param item - item parameter (`ContentItem`) / 条目参数（`ContentItem`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    static isStack(item: ContentItem): item is Stack {
        return item.isStack;
    }

    /**
     * Executes `isComponentItem` to handle is component item.
     * @zh 执行 `isComponentItem`，用于是否为组件条目。
     * @param item - item parameter (`ContentItem`) / 条目参数（`ContentItem`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    static isComponentItem(item: ContentItem): item is ComponentItem {
        return item.isComponent;
    }

    /**
     * Executes `isComponentParentableItem` to handle is component parentable item.
     * @zh 执行 `isComponentParentableItem`，用于是否为组件Parentable条目。
     * @param item - item parameter (`ContentItem`) / 条目参数（`ContentItem`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    static isComponentParentableItem(item: ContentItem): item is ComponentParentableItem {
        return item.isStack || item.isGround;
    }

    /**
     * Creates an instance of `ContentItem` and initializes its dependencies and internal state.
     * @internal
     * @zh 创建 `ContentItem` 实例，并初始化其依赖项与内部状态。
     */
    constructor(public readonly layoutManager: LayoutManager,
        config: ResolvedItemConfig,
        /** @internal */
        private _parent: ContentItem | null,
        /** @internal */
        private readonly _element: HTMLElement
    ) {
        super();

        this._type = config.type;
        this._id = config.id!=''?config.id:uuid();

        this._isInitialised = false;
        this.isGround = false;
        this.isRow = false;
        this.isColumn = false;
        this.isStack = false;
        this.isComponent = false;

        this.size = config.size;
        this.sizeUnit = config.sizeUnit;
        this.minSize = config.minSize;
        this.minSizeUnit = config.minSizeUnit;

        this._isClosable = config.isClosable;

        this._pendingEventPropagations = {};
        this._throttledEvents = ['stateChanged'];

        this._contentItems = this.createContentItems(config.content);
    }

    /**
     * Updaters the size of the component and its children, called recursively
     * @param force - In some cases the size is not updated if it has not changed. In this case, events
     * (such as ComponentContainer.virtualRectingRequiredEvent) are not fired. Setting force to true, ensures the size is updated regardless, and
     * the respective events are fired. This is sometimes necessary when a component's size has not changed but it has become visible, and the
     * relevant events need to be fired.
     * @internal

     * @zh 执行 `updateSize`，用于更新尺寸。
     */
    abstract updateSize(force: boolean): void;

    /**
     * Removes a child node (and its children) from the tree
     * @param contentItem - The child item to remove
     * @param keepChild - Whether to destroy the removed item

     * @zh 执行 `removeChild`，用于移除子级。
     */
    removeChild(contentItem: ContentItem, keepChild = false): void {
        /*
         * Get the position of the item that's to be removed within all content items this node contains
         */
        const index = this._contentItems.indexOf(contentItem);

        /*
         * Make sure the content item to be removed is actually a child of this item
         */
        if (index === -1) {
            throw new Error('Can\'t remove child item. Unknown content item');
        }

        /**
		 * Call destroy on the content item.
		 * All children are destroyed as well
		 */
        if (!keepChild) {
			this._contentItems[index].destroy();
        }

        /**
         * Remove the content item from this nodes array of children
         */
        this._contentItems.splice(index, 1);

        /**
         * If this node still contains other content items, adjust their size
         */
        if (this._contentItems.length > 0) {
            this.updateSize(false);
        } else {
            /**
             * If this was the last content item, remove this node as well
             */
            if (!this.isGround && this._isClosable === true) {
                if (this._parent === null) {
                    throw new UnexpectedNullError('CIUC00874');
                } else {
                    this._parent.removeChild(this);
                }
            }
        }
    }

    /**
     * Sets up the tree structure for the newly added child
     * The responsibility for the actual DOM manipulations lies
     * with the concrete item
     *
     * @param contentItem -
     * @param index - If omitted item will be appended
     * @param suspendResize - Used by descendent implementations

     * @zh 执行 `addChild`，用于添加子级。
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addChild(contentItem: ContentItem, index?: number | null, suspendResize?: boolean): number {
        index ??= this._contentItems.length;

        this._contentItems.splice(index, 0, contentItem);
        contentItem.setParent(this);

        if (this._isInitialised === true && contentItem._isInitialised === false) {
            contentItem.init();
        }

        return index;
    }

    /**
     * Replaces oldChild with newChild
     * @param oldChild -
     * @param newChild -
     * @internal

     * @zh 执行 `replaceChild`，用于替换子级。
     */
    replaceChild(oldChild: ContentItem, newChild: ContentItem, destroyOldChild = false): void {
        // Do not try to replace ComponentItem - will not work
        const index = this._contentItems.indexOf(oldChild);
        const parentNode = oldChild._element.parentNode;

        if (index === -1) {
            throw new AssertError('CIRCI23232', 'Can\'t replace child. oldChild is not child of this');
        }

        if (parentNode === null) {
            throw new UnexpectedNullError('CIRCP23232');
        } else {
            parentNode.replaceChild(newChild._element, oldChild._element);

            /*
            * Optionally destroy the old content item
            */
            if (destroyOldChild === true) {
                oldChild._parent = null;
                oldChild.destroy(); // will now also destroy all children of oldChild
            }

            /*
            * Wire the new contentItem into the tree
            */
            this._contentItems[index] = newChild;
            newChild.setParent(this);
            // newChild inherits the sizes from the old child:
            newChild.size = oldChild.size;
            newChild.sizeUnit = oldChild.sizeUnit;
            newChild.minSize = oldChild.minSize;
            newChild.minSizeUnit = oldChild.minSizeUnit;

            //TODO This doesn't update the config... refactor to leave item nodes untouched after creation
            if (newChild._parent === null) {
                throw new UnexpectedNullError('CIRCNC45699');
            } else {
                if (newChild._parent._isInitialised === true && newChild._isInitialised === false) {
                    newChild.init();
                }

                this.updateSize(false);
            }
        }
    }


    /**
     * Executes `remove` to handle remove.
     * @zh 执行 `remove`，用于移除。
     */
    remove(): void {
        if (this._parent === null) {
            throw new UnexpectedNullError('CIR11110');
        } else {
            this._parent.removeChild(this);
        }
    }


    /**
     * Executes `popout` to handle popout.
     * @zh 执行 `popout`，用于弹出窗口。
     * @returns Result of type `BrowserPopout` / 类型为 `BrowserPopout` 的返回值
     */
    popout(): BrowserPopout {
        const parentId = getUniqueId();
        const browserPopout = this.layoutManager.createPopoutFromContentItem(this, undefined, parentId, undefined);
        this.emitBaseBubblingEvent('stateChanged');
        return browserPopout;
    }

    /**
     * Executes `toConfig` to handle to config.
     * @zh 执行 `toConfig`，用于转换为配置。
     * @returns Result of type `ResolvedItemConfig` / 类型为 `ResolvedItemConfig` 的返回值
     */
    abstract toConfig(): ResolvedItemConfig;

    /**
     * Executes `calculateConfigContent` to handle calculate config content.
     * @internal
     * @zh 执行 `calculateConfigContent`，用于计算配置内容。
     */
    calculateConfigContent(): ResolvedItemConfig[] {
        const contentItems = this._contentItems;
        const count = contentItems.length;
        const result = new Array<ResolvedItemConfig>(count);
        for (let i = 0; i < count; i++) {
            const item = contentItems[i];
            result[i] = item.toConfig();
        }
        return result;
    }

    /**
     * Executes `highlightDropZone` to handle highlight drop zone.
     * @internal
     * @zh 执行 `highlightDropZone`，用于高亮放置区域(NgZone)。
     */
    highlightDropZone(x: number, y: number, area: AreaLinkedRect): void {
        const dropTargetIndicator = this.layoutManager.dropTargetIndicator;
        if (dropTargetIndicator === null) {
            throw new UnexpectedNullError('ACIHDZ5593');
        } else {
            dropTargetIndicator.highlightArea(area, 1);
        }
    }

    /**
     * Executes `onDrop` to handle on drop.
     * @internal
     * @zh 执行 `onDrop`，用于当放置。
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onDrop(contentItem: ContentItem, area: ContentItem.Area): void {
        this.addChild(contentItem);
    }

    /**
     * Executes `show` to handle show.
     * @internal
     * @zh 执行 `show`，用于显示。
     */
    show(): void {
        this.layoutManager.beginSizeInvalidation();
        try {
            // Not sure why showAllActiveContentItems() was called. DockLayout seems to work fine without it.  Left commented code
            // in source in case a reason for it becomes apparent.
            // this.layoutManager.showAllActiveContentItems();
            setElementDisplayVisibility(this._element, true);
            // this.layoutManager.updateSizeFromContainer();

            for (let i = 0; i < this._contentItems.length; i++) {
                this._contentItems[i].show();
            }
        } finally {
            this.layoutManager.endSizeInvalidation();
        }
    }

    /**
     * Destroys this item ands its children
     * @internal

     * @zh 执行 `destroy`，用于销毁。
     */
    destroy(): void {
        for (let i = 0; i < this._contentItems.length; i++) {
            this._contentItems[i].destroy();
        }
        this._contentItems = [];

        this.emitBaseBubblingEvent('beforeItemDestroyed');
        this._element.remove();
        this.emitBaseBubblingEvent('itemDestroyed');
    }

    /**
     * Returns the area the component currently occupies
     * @internal

     * @zh 执行 `getElementArea`，用于获取元素区域。
     */
    getElementArea(element?: HTMLElement): ContentItem.Area | null {
        element = element ?? this._element;

        const rect = element.getBoundingClientRect();
        const top = rect.top + document.body.scrollTop;
        const left = rect.left + document.body.scrollLeft;

        const width = rect.width;
        const height = rect.height;

        return {
            x1: left,
            y1: top,
            x2: left + width,
            y2: top + height,
            surface: width * height,
            contentItem: this
        };
    }

    /**
     * Executes `init` to handle init.
     * @zh 执行 `init`，用于初始化。
     */
    init(): void {
        this._isInitialised = true;
        this.emitBaseBubblingEvent('itemCreated');
        this.emitUnknownBubblingEvent(this.type + 'Created');
    }

    /**
     * Executes `setParent` to handle set parent.
     * @internal
     * @zh 执行 `setParent`，用于集合父级。
     */
    protected setParent(parent: ContentItem): void {
        this._parent = parent;
    }

    /**
     * Executes `addPopInParentId` to handle add pop in parent id.
     * @internal
     * @zh 执行 `addPopInParentId`，用于添加弹出在父级唯一标识。
     */
    addPopInParentId(id: string): void {
        if (!this.popInParentIds.includes(id)) {
            this.popInParentIds.push(id);
        }
    }

    /**
     * Executes `initContentItems` to handle init content items.
     * @internal
     * @zh 执行 `initContentItems`，用于初始化内容条目列表。
     */
    protected initContentItems(): void {
        for (let i = 0; i < this._contentItems.length; i++) {
            this._contentItems[i].init();
        }
    }

    /**
     * Executes `hide` to handle hide.
     * @internal
     * @zh 执行 `hide`，用于隐藏。
     */
    protected hide(): void {
        this.layoutManager.beginSizeInvalidation();
        try {
            setElementDisplayVisibility(this._element, false);
            // this.layoutManager.updateSizeFromContainer();
        } finally {
            this.layoutManager.endSizeInvalidation();
        }
    }

    /**
     * Executes `updateContentItemsSize` to handle update content items size.
     * @internal
     * @zh 执行 `updateContentItemsSize`，用于更新内容条目列表尺寸。
     */
    protected updateContentItemsSize(force: boolean): void {
        for (let i = 0; i < this._contentItems.length; i++) {
            this._contentItems[i].updateSize(force);
        }
    }

    /**
     * creates all content items for this node at initialisation time
     * PLEASE NOTE, please see addChild for adding contentItems at runtime
     * @internal

     * @zh 执行 `createContentItems`，用于创建内容条目列表。
     */
    private createContentItems(content: readonly ResolvedItemConfig[]) {
        const count = content.length;
        const result = new Array<ContentItem>(count);
        for (let i = 0; i < content.length; i++) {
            result[i] = this.layoutManager.createContentItem(content[i], this);
        }
        return result;
    }

    /**
     * Called for every event on the item tree. Decides whether the event is a bubbling
     * event and propagates it to its parent
     *
     * @param name - The name of the event
     * @param event -
     * @internal

     * @zh 执行 `propagateEvent`，用于传播事件。
     */
    private propagateEvent(name: string, args: unknown[]) {
        if (args.length === 1) {
            const event = args[0];
            if (event instanceof EventEmitter.BubblingEvent &&
                event.isPropagationStopped === false &&
                this._isInitialised === true) {

                /**
                 * In some cases (e.g. if an element is created from a DragSource) it
                 * doesn't have a parent and is not a child of GroundItem. If that's the case
                 * propagate the bubbling event from the top level of the substree directly
                 * to the layoutManager
                 */
                if (this.isGround === false && this._parent) {
                    this._parent.emitUnknown(name, event);
                } else {
                    this.scheduleEventPropagationToLayoutManager(name, event);
                }
            }
        }
    }

    /**
     * Executes `tryBubbleEvent` to handle try bubble event.
     * @zh 执行 `tryBubbleEvent`，用于tryBubble事件。
     * @param name - name parameter (`string`) / 名称参数（`string`）
     * @param args - args parameter (`unknown[]`) / 参数列表参数（`unknown[]`）
     */
    override tryBubbleEvent(name: string, args: unknown[]): void {
        if (args.length === 1) {
            const event = args[0];
            if (event instanceof EventEmitter.BubblingEvent &&
                event.isPropagationStopped === false &&
                this._isInitialised === true
            ) {
                /**
                 * In some cases (e.g. if an element is created from a DragSource) it
                 * doesn't have a parent and is not a child of GroundItem. If that's the case
                 * propagate the bubbling event from the top level of the substree directly
                 * to the layoutManager
                 */
                if (this.isGround === false && this._parent) {
                    this._parent.emitUnknown(name, event);
                } else {
                    this.scheduleEventPropagationToLayoutManager(name, event);
                }
            }
        }
    }

    /**
     * All raw events bubble up to the Ground element. Some events that
     * are propagated to - and emitted by - the layoutManager however are
     * only string-based, batched and sanitized to make them more usable
     *
     * @param name - The name of the event
     * @internal

     * @zh 执行 `scheduleEventPropagationToLayoutManager`，用于计划表事件事件冒泡转换为布局管理器。
     */
    private scheduleEventPropagationToLayoutManager(name: string, event: EventEmitter.BubblingEvent) {
        if (this._throttledEvents.indexOf(name) === -1) {
            this.layoutManager.emitUnknown(name, event);
        } else {
            if (this._pendingEventPropagations[name] !== true) {
                this._pendingEventPropagations[name] = true;
                globalThis.requestAnimationFrame(() => this.propagateEventToLayoutManager(name, event));
            }
        }

    }

    /**
     * Callback for events scheduled by _scheduleEventPropagationToLayoutManager
     *
     * @param name - The name of the event
     * @internal

     * @zh 执行 `propagateEventToLayoutManager`，用于传播事件转换为布局管理器。
     */
    private propagateEventToLayoutManager(name: string, event: EventEmitter.BubblingEvent) {
        this._pendingEventPropagations[name] = false;
        this.layoutManager.emitUnknown(name, event);
    }
}

/** @public */
export namespace ContentItem {
    /**
     * Interface `Area` defining the contract and properties for area.
     * @internal
     * @zh 接口 `Area`，定义区域的数据结构契约与属性规范。
     */
    export interface Area extends AreaLinkedRect {
        /**
         * Property `surface` (`number`) storing surface.
         * @zh 属性 `surface`（类型：`number`），用于存储或配置surface。
         */
        surface: number;
        /**
         * Property `contentItem` (`ContentItem`) storing content item.
         * @zh 属性 `contentItem`（类型：`ContentItem`），用于存储或配置内容条目。
         */
        contentItem: ContentItem;
    }
}

/**
 * @public @deprecated Use {@link (ContentItem:class)}
 * @zh 类型别名 `AbstractContentItem`，表示Abstract内容条目（`ContentItem`）。
 */
export type AbstractContentItem = ContentItem;
