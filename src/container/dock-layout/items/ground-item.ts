/**
 * @fileoverview Module `src/container/dock-layout/items/ground-item.ts` providing ground item definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/items/ground-item.ts`，提供ground条目相关的定义与实现。
 */

import { TranslateService } from '@dotos/dui/translator';
import { ComponentItemConfig, ItemConfig, RowOrColumnItemConfig, StackItemConfig } from '../config/config';
import { ResolvedComponentItemConfig, ResolvedGroundItemConfig, ResolvedHeaderedItemConfig, ResolvedItemConfig, ResolvedRootItemConfig, ResolvedStackItemConfig } from '../config/resolved-config';
import { AssertError, UnexpectedNullError } from '../errors/internal-error';
import { LayoutManager } from '../layout-manager';
import { DomConstants } from '../utils/dom-constants';
import { AreaLinkedRect, ItemType, SizeUnitEnum } from '../utils/types';
import { getElementWidthAndHeight, setElementHeight, setElementWidth } from '../utils/utils';
import { ComponentItem } from './component-item';
import { ComponentParentableItem } from './component-parentable-item';
import { ContentItem } from './content-item';
import { RowOrColumn } from './row-or-column';

/**
 * GroundItem is the ContentItem whose one child is the root ContentItem (Root is planted in Ground).
 * (Previously it was called root however this was incorrect as its child is the root item)
 * There is only one instance of GroundItem and it is automatically created by the Layout Manager
 * @internal

 * @zh 类 `GroundItem`，封装 `src/container/dock-layout/items` 中的Ground条目数据结构与处理逻辑。
 */
export class GroundItem extends ComponentParentableItem {
    /**
     * Property `_childElementContainer` (`HTMLElement`) storing child element container.
     * @zh 属性 `_childElementContainer`（类型：`HTMLElement`），用于存储或配置子级元素容器。
     */
    private readonly _childElementContainer: HTMLElement;
    /**
     * Property `_containerElement` (`HTMLElement`) storing container element.
     * @zh 属性 `_containerElement`（类型：`HTMLElement`），用于存储或配置容器元素。
     */
    private readonly _containerElement: HTMLElement;

    /**
     * Creates an instance of `GroundItem` and initializes its dependencies and internal state.
     * @zh 创建 `GroundItem` 实例，并初始化其依赖项与内部状态。
     * @param translator - Injected or initial translator (`TranslateService`) / 注入或传入的翻译器（`TranslateService`）
     * @param layoutManager - Injected or initial layout manager (`LayoutManager`) / 注入或传入的布局管理器（`LayoutManager`）
     * @param rootItemConfig - Injected or initial root item config (`ResolvedRootItemConfig | undefined`) / 注入或传入的根节点条目配置（`ResolvedRootItemConfig | undefined`）
     * @param containerElement - Injected or initial container element (`HTMLElement`) / 注入或传入的容器元素（`HTMLElement`）
     */
    constructor(private translator:TranslateService,layoutManager: LayoutManager, rootItemConfig: ResolvedRootItemConfig | undefined, containerElement: HTMLElement) {

        super(layoutManager, ResolvedGroundItemConfig.create(rootItemConfig), null, GroundItem.createElement(document));

        this.isGround = true;
        this.translator=translator;
        this._childElementContainer = this.element;
        this._containerElement = containerElement;

        // insert before any pre-existing content elements
        let before = null;
        while (true) {
            const prev: ChildNode | null =
                before ? before.previousSibling : this._containerElement.lastChild;
            if (prev instanceof Element
                && prev.classList.contains(DomConstants.ClassName.Content)) {
                before = prev;
            } else {
                break;
            }
        }
        this._containerElement.insertBefore(this.element, before);
    }

    /**
     * Executes `init` to handle init.
     * @zh 执行 `init`，用于初始化。
     */
    override init(): void {
        if (this.isInitialised === true) return;

        this.updateNodeSize();

        for (let i = 0; i < this.contentItems.length; i++) {
            this._childElementContainer.appendChild(this.contentItems[i].element);
        }

        super.init();

        this.initContentItems();
    }

    /**
     * Loads a new Layout
     * Internal only.  To load a new layout with API, use {@link (LayoutManager:class).loadLayout}

     * @zh 执行 `loadRoot`，用于加载根节点。
     */
    loadRoot(rootItemConfig: ResolvedRootItemConfig | undefined): void {
        // Remove existing root if it exists
        this.clearRoot();

        if (rootItemConfig !== undefined) {
            const rootContentItem = this.layoutManager.createAndInitContentItem(rootItemConfig, this);
            this.addChild(rootContentItem, 0);
        }
    }

    /**
     * Executes `clearRoot` to handle clear root.
     * @zh 执行 `clearRoot`，用于清空根节点。
     */
    clearRoot(): void {
        // Remove existing root if it exists
        const contentItems = this.contentItems;
        switch (contentItems.length) {
            case 0: {
                return;
            }
            case 1: {
                const existingRootContentItem = contentItems[0];
                existingRootContentItem.remove();
                return;
            }
            default: {
                throw new AssertError('GILR07721');
            }
        }
    }

    /**
     * Adds a ContentItem child to root ContentItem.
     * Internal only.  To load a add with API, use {@link (LayoutManager:class).addItem}
     * @returns -1 if added as root otherwise index in root ContentItem's content

     * @zh 执行 `addItem`，用于添加条目。
     */
    addItem(itemConfig: RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig,
        index?: number
    ): number {
        this.layoutManager.checkMinimiseMaximisedStack();

        const resolvedItemConfig = ItemConfig.resolve(this.translator,itemConfig, false);
        let parent: ContentItem;
        if (this.contentItems.length > 0) {
            parent = this.contentItems[0];
        } else {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            parent = this;
        }
        if (parent.isComponent) {
            throw new Error('Cannot add item as child to ComponentItem');
        } else {
            const contentItem = this.layoutManager.createAndInitContentItem(resolvedItemConfig, parent);
            index = parent.addChild(contentItem, index);
            return (parent === this) ? -1 : index;
        }
    }

    /**
     * Executes `loadComponentAsRoot` to handle load component as root.
     * @zh 执行 `loadComponentAsRoot`，用于加载组件As根节点。
     * @param itemConfig - item config parameter (`ComponentItemConfig`) / 条目配置参数（`ComponentItemConfig`）
     */
    loadComponentAsRoot(itemConfig: ComponentItemConfig): void {
        // Remove existing root if it exists
        this.clearRoot();

        const resolvedItemConfig = ItemConfig.resolve(this.translator,itemConfig, false) as ResolvedComponentItemConfig;

        if (resolvedItemConfig.maximised) {
            throw new Error('Root Component cannot be maximised');
        } else {
            const rootContentItem = new ComponentItem(this.translator,this.layoutManager, resolvedItemConfig, this);
            rootContentItem.init();
            this.addChild(rootContentItem, 0);
        }
    }

    /**
     * Adds a Root ContentItem.
     * Internal only.  To replace Root ContentItem with API, use {@link (LayoutManager:class).loadLayout}

     * @zh 执行 `addChild`，用于添加子级。
     */
    override addChild(contentItem: ContentItem, index?: number): number {
        if (this.contentItems.length > 0) {
            throw new Error('Ground node can only have a single child');
        } else {
            // contentItem = this.layoutManager._$normalizeContentItem(contentItem, this);
            this._childElementContainer.appendChild(contentItem.element);
            index = super.addChild(contentItem, index);

            this.updateSize(false);
            this.emitBaseBubblingEvent('stateChanged');

            return index;
        }
    }

    /**
     * Executes `calculateConfigContent` to handle calculate config content.
     * @internal
     * @zh 执行 `calculateConfigContent`，用于计算配置内容。
     */
    override calculateConfigContent(): ResolvedRootItemConfig[] {
        const contentItems = this.contentItems;
        const count = contentItems.length;
        const result = new Array<ResolvedRootItemConfig>(count);
        for (let i = 0; i < count; i++) {
            const item = contentItems[i];
            const itemConfig = item.toConfig();
            if (ResolvedRootItemConfig.isRootItemConfig(itemConfig)) {
                result[i] = itemConfig;
            } else {
                throw new AssertError('RCCC66832');
            }
        }
        return result;
    }

    /**
     * Executes `setSize` to handle set size.
     * @internal
     * @zh 执行 `setSize`，用于集合尺寸。
     */
    setSize(width: number, height: number): void {
        if (width === undefined || height === undefined) {
            this.updateSize(false); // For backwards compatibility with v1.x API
        } else {
            setElementWidth(this.element, width);
            setElementHeight(this.element, height);

            // GroundItem can be empty
            if (this.contentItems.length > 0) {
                setElementWidth(this.contentItems[0].element, width);
                setElementHeight(this.contentItems[0].element, height);
            }

            this.updateContentItemsSize(false);
        }
    }


    /**
     * Executes `updateSize` to handle update size.
     * @zh 执行 `updateSize`，用于更新尺寸。
     * @param force - force parameter (`boolean`) / force参数（`boolean`）
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
     * Executes `createSideAreas` to handle create side areas.
     * @zh 执行 `createSideAreas`，用于创建Side区域集合。
     * @returns Result of type `GroundItem.Area[]` / 类型为 `GroundItem.Area[]` 的返回值
     */
    createSideAreas(): GroundItem.Area[] {
        const areaSize = 50;

        const oppositeSides = GroundItem.Area.oppositeSides;
        const result = new Array<GroundItem.Area>(Object.keys(oppositeSides).length);
        let idx = 0;

        for (const key in oppositeSides) {
            const side = key as keyof GroundItem.Area.Sides;
            const area = this.getElementArea() as GroundItem.Area;
            if (area === null) {
                throw new UnexpectedNullError('RCSA77553');
            } else {
                area.side = side;
                if (oppositeSides[side][1] === '2' )
                    area[side] = area[oppositeSides[side]] - areaSize;
                else
                    area[side] = area[oppositeSides[side]] + areaSize;
                area.surface = (area.x2 - area.x1) * (area.y2 - area.y1);
                result[idx++] = area;
            }
        }

        return result;
    }

    /**
     * Executes `highlightDropZone` to handle highlight drop zone.
     * @zh 执行 `highlightDropZone`，用于highlight放置区域(NgZone)。
     * @param x - x parameter (`number`) / X坐标参数（`number`）
     * @param y - y parameter (`number`) / Y坐标参数（`number`）
     * @param area - area parameter (`AreaLinkedRect`) / 区域参数（`AreaLinkedRect`）
     */
    override highlightDropZone(x: number, y: number, area: AreaLinkedRect): void {
        this.layoutManager.tabDropPlaceholder.remove();
        super.highlightDropZone(x, y, area);
    }

    /**
     * Executes `onDrop` to handle on drop.
     * @zh 执行 `onDrop`，用于当放置。
     * @param contentItem - content item parameter (`ContentItem`) / 内容条目参数（`ContentItem`）
     * @param area - area parameter (`GroundItem.Area`) / 区域参数（`GroundItem.Area`）
     */
    override onDrop(contentItem: ContentItem, area: GroundItem.Area): void {

        if (contentItem.isComponent) {
            const itemConfig = ResolvedStackItemConfig.createDefault();
            // since ResolvedItemConfig.contentItems not set up, we need to add header from Component
            const component = contentItem as ComponentItem;
            itemConfig.header = ResolvedHeaderedItemConfig.Header.createCopy(component.headerConfig);
            const stack = this.layoutManager.createAndInitContentItem(itemConfig, this);
            stack.addChild(contentItem);
            contentItem = stack;
        }

        if (this.contentItems.length === 0) {
            this.addChild(contentItem);
        } else {
            /*
             * If the contentItem that's being dropped is not dropped on a Stack (cases which just passed above and
             * which would wrap the contentItem in a Stack) we need to check whether contentItem is a RowOrColumn.
             * If it is, we need to re-wrap it in a Stack like it was when it was dragged by its Tab (it was dragged!).
             */
            if(contentItem.type === ItemType.row || contentItem.type === ItemType.column){
                const itemConfig = ResolvedStackItemConfig.createDefault();
                const stack = this.layoutManager.createContentItem(itemConfig, this);
                stack.addChild(contentItem)
                contentItem = stack
            }

            const type = area.side[0] == 'x' ? ItemType.row : ItemType.column;
            const insertBefore = area.side[1] == '2';
            const column = this.contentItems[0];
            if (!(column instanceof RowOrColumn) || column.type !== type) {
                const itemConfig = ResolvedItemConfig.createDefault(type);
                const rowOrColumn = this.layoutManager.createContentItem(itemConfig, this);
                this.replaceChild(column, rowOrColumn);
                rowOrColumn.addChild(contentItem, insertBefore ? 0 : undefined, true);
                rowOrColumn.addChild(column, insertBefore ? undefined : 0, true);
                column.size = 50;
                contentItem.size = 50;
                contentItem.sizeUnit = SizeUnitEnum.Percent;
                rowOrColumn.updateSize(false);
            } else {
                const sibling = column.contentItems[insertBefore ? 0 : column.contentItems.length - 1]
                column.addChild(contentItem, insertBefore ? 0 : undefined, true);
                sibling.size *= 0.5;
                contentItem.size = sibling.size;
                contentItem.sizeUnit = SizeUnitEnum.Percent;
                column.updateSize(false);
            }
        }
    }

    // No ContentItem can dock with groundItem.  However Stack can have a GroundItem parent and Stack requires that
    // its parent implement dock() function.  Accordingly this function is implemented but throws an exception as it should
    // never be called
    /**
     * Executes `dock` to handle dock.
     * @zh 执行 `dock`，用于停靠面板。
     */
    dock(): void {
        throw new AssertError('GID87731');
    }

    // No ContentItem can dock with groundItem.  However Stack can have a GroundItem parent and Stack requires that
    // its parent implement validateDocking() function.  Accordingly this function is implemented but throws an exception as it should
    // never be called
    /**
     * Executes `validateDocking` to handle validate docking.
     * @zh 执行 `validateDocking`，用于校验停靠面板。
     */
    validateDocking(): void {
        throw new AssertError('GIVD87732');
    }

    /**
     * Executes `getAllContentItems` to handle get all content items.
     * @zh 执行 `getAllContentItems`，用于获取全部内容条目列表。
     * @returns Result of type `ContentItem[]` / 类型为 `ContentItem[]` 的返回值
     */
    getAllContentItems(): ContentItem[] {
        const result: ContentItem[] = [this];
        this.deepGetAllContentItems(this.contentItems, result);
        return result;
    }

    /**
     * Executes `getConfigMaximisedItems` to handle get config maximised items.
     * @zh 执行 `getConfigMaximisedItems`，用于获取配置最大化条目列表。
     * @returns Result of type `ContentItem[]` / 类型为 `ContentItem[]` 的返回值
     */
    getConfigMaximisedItems(): ContentItem[] {
        const result: ContentItem[] = [];
        this.deepFilterContentItems(this.contentItems, result, (item) => {
            if (ContentItem.isStack(item) && item.initialWantMaximise) {
                return true;
            } else {
                if (ContentItem.isComponentItem(item) && item.initialWantMaximise) {
                    return true;
                } else {
                    return false;
                }
            }
        });

        return result;
    }

    /**
     * Executes `getItemsByPopInParentId` to handle get items by pop in parent id.
     * @zh 执行 `getItemsByPopInParentId`，用于获取条目列表按弹出在父级唯一标识。
     * @param popInParentId - pop in parent id parameter (`string`) / 弹出在父级唯一标识参数（`string`）
     * @returns Result of type `ContentItem[]` / 类型为 `ContentItem[]` 的返回值
     */
    getItemsByPopInParentId(popInParentId: string): ContentItem[] {
        const result: ContentItem[] = [];
        this.deepFilterContentItems(this.contentItems, result, (item) => item.popInParentIds.includes(popInParentId));
        return result;
    }

    /**
     * Executes `toConfig` to handle to config.
     * @zh 执行 `toConfig`，用于转换为配置。
     * @returns Result of type `ResolvedItemConfig` / 类型为 `ResolvedItemConfig` 的返回值
     */
    toConfig(): ResolvedItemConfig {
        throw new Error('Cannot generate GroundItem config');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    /**
     * Executes `setActiveComponentItem` to handle set active component item.
     * @zh 执行 `setActiveComponentItem`，用于集合激活组件条目。
     * @param item - item parameter (`ComponentItem`) / 条目参数（`ComponentItem`）
     * @param focus - focus parameter (`boolean`) / 聚焦参数（`boolean`）
     * @param suppressFocusEvent - suppress focus event parameter (`boolean`) / suppress聚焦事件参数（`boolean`）
     */
    setActiveComponentItem(item: ComponentItem, focus: boolean, suppressFocusEvent: boolean): void {
        // only applicable if ComponentItem is root and then it always has focus
    }

    /**
     * Executes `updateNodeSize` to handle update node size.
     * @zh 执行 `updateNodeSize`，用于更新节点尺寸。
     */
    private updateNodeSize(): void {
        const { width, height } = getElementWidthAndHeight(this._containerElement);

        setElementWidth(this.element, width);
        setElementHeight(this.element, height);

        /*
         * GroundItem can be empty
         */
        if (this.contentItems.length > 0) {
            setElementWidth(this.contentItems[0].element, width);
            setElementHeight(this.contentItems[0].element, height);
        }
    }

    /**
     * Executes `deepGetAllContentItems` to handle deep get all content items.
     * @zh 执行 `deepGetAllContentItems`，用于deep获取全部内容条目列表。
     * @param content - content parameter (`readonly ContentItem[]`) / 内容参数（`readonly ContentItem[]`）
     * @param result - result parameter (`ContentItem[]`) / 结果参数（`ContentItem[]`）
     */
    private deepGetAllContentItems(content: readonly ContentItem[], result: ContentItem[]): void {
        for (let i = 0; i < content.length; i++) {
            const contentItem = content[i];
            result.push(contentItem);
            this.deepGetAllContentItems(contentItem.contentItems, result);
        }
    }

    /**
     * Executes `deepFilterContentItems` to handle deep filter content items.
     * @zh 执行 `deepFilterContentItems`，用于deep过滤内容条目列表。
     * @param content - content parameter (`readonly ContentItem[]`) / 内容参数（`readonly ContentItem[]`）
     * @param result - result parameter (`ContentItem[]`) / 结果参数（`ContentItem[]`）
     * @param checkAcceptFtn - check accept ftn parameter (`((this: void, item: ContentItem) => boolean)`) / 检查AcceptFtn参数（`((this: void, item: ContentItem) => boolean)`）
     */
    private deepFilterContentItems(content: readonly ContentItem[], result: ContentItem[],
        checkAcceptFtn: ((this: void, item: ContentItem) => boolean)
    ): void {
        for (let i = 0; i < content.length; i++) {
            const contentItem = content[i];
            if (checkAcceptFtn(contentItem)) {
                result.push(contentItem);
            }
            this.deepFilterContentItems(contentItem.contentItems, result, checkAcceptFtn);
        }
    }

}

/** @internal */
export namespace GroundItem {
    /**
     * Interface `Area` defining the contract and properties for area.
     * @zh 接口 `Area`，定义区域的数据结构契约与属性规范。
     */
    export interface Area extends ContentItem.Area {
        /**
         * Property `side` (`keyof typeof Area.Side`) storing side.
         * @zh 属性 `side`（类型：`keyof typeof Area.Side`），用于存储或配置side。
         */
        side: keyof typeof Area.Side;
    }

    export namespace Area {
        /**
         * Enumeration `Side` defining supported side constants.
         * @zh 枚举 `Side`，定义支持的Side常量集合。
         */
        export const enum Side {
            /**
             * Enum member `Side.y2` representing y2.
             * @zh 枚举项 `Side.y2`，表示y2。
             */
            y2,
            /**
             * Enum member `Side.x2` representing x2.
             * @zh 枚举项 `Side.x2`，表示x2。
             */
            x2,
            /**
             * Enum member `Side.y1` representing y1.
             * @zh 枚举项 `Side.y1`，表示y1。
             */
            y1,
            /**
             * Enum member `Side.x1` representing x1.
             * @zh 枚举项 `Side.x1`，表示x1。
             */
            x1,
        }

        /**
         * Type alias `Sides` representing sides (`{ [side in keyof typeof Side]: keyof typeof Side; }`).
         * @zh 类型别名 `Sides`，表示Sides（`{ [side in keyof typeof Side]: keyof typeof Side; }`）。
         */
        export type Sides = { [side in keyof typeof Side]: keyof typeof Side; }

        /**
         * Constant/variable `oppositeSides` defining opposite sides in `src/container/dock-layout/items`.
         * @zh 常量/变量 `oppositeSides`，定义 `src/container/dock-layout/items` 中的oppositeSides。
         */
        export const oppositeSides: Sides = {
            y2: 'y1',
            x2: 'x1',
            y1: 'y2',
            x1: 'x2',
        };
    }

    /**
     * Executes `createElement` to handle create element.
     * @zh 执行 `createElement`，用于创建元素。
     * @param document - document parameter (`Document`) / 文档对象参数（`Document`）
     * @returns Result of type `HTMLDivElement` / 类型为 `HTMLDivElement` 的返回值
     */
    export function createElement(document: Document): HTMLDivElement {
        const element = document.createElement('div');
        element.classList.add(DomConstants.ClassName.DockLayout);
        element.classList.add(DomConstants.ClassName.Item);
        element.classList.add(DomConstants.ClassName.Root);
        return element;
    }
}
