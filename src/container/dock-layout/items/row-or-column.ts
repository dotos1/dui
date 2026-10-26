/**
 * @fileoverview Module `src/container/dock-layout/items/row-or-column.ts` providing row or column definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/items/row-or-column.ts`，提供行or列相关的定义与实现。
 */

import { TranslateService } from '@dotos/dui/translator'
import { ComponentItemConfig, ItemConfig, RowOrColumnItemConfig, StackItemConfig } from '../config/config'
import { ResolvedRowOrColumnItemConfig, ResolvedStackItemConfig } from '../config/resolved-config'
import { Splitter } from '../controls/splitter'
import { AssertError, UnexpectedNullError } from '../errors/internal-error'
import { LayoutManager } from '../layout-manager'
import { DomConstants } from '../utils/dom-constants'
import { ItemType, JsonValue, SizeUnitEnum, WidthOrHeightPropertyName } from '../utils/types'
import {
    getElementHeight,
    getElementWidth,
    getElementWidthAndHeight,
    numberToPixels,
    pixelsToNumber,
    setElementHeight,
    setElementWidth
} from "../utils/utils"
import { ComponentItem } from './component-item'
import { ContentItem } from './content-item'

/**
 * Class `RowOrColumn` encapsulating row or column data structures and logic in `src/container/dock-layout/items`.
 * @public
 * @zh 类 `RowOrColumn`，封装 `src/container/dock-layout/items` 中的行Or列数据结构与处理逻辑。
 */
export class RowOrColumn extends ContentItem {
    /**
     * Property `_childElementContainer` (`HTMLElement`) storing child element container.
     * @internal
     * @zh 属性 `_childElementContainer`（类型：`HTMLElement`），用于存储或配置子级元素容器。
     */
    private readonly _childElementContainer: HTMLElement;
    /**
     * Property `_configType` (`'row' | 'column'`) storing config type.
     * @internal
     * @zh 属性 `_configType`（类型：`'row' | 'column'`），用于存储或配置配置类型。
     */
    private readonly _configType: 'row' | 'column';
    /**
     * Property `_isColumn` (`boolean`) storing is column.
     * @internal
     * @zh 属性 `_isColumn`（类型：`boolean`），用于存储或配置是否为列。
     */
    private readonly _isColumn: boolean;
    /**
     * Property `_splitterSize` (`number`) storing splitter size.
     * @internal
     * @zh 属性 `_splitterSize`（类型：`number`），用于存储或配置分割条尺寸。
     */
    private readonly _splitterSize: number;
    /**
     * Property `_splitterGrabSize` (`number`) storing splitter grab size.
     * @internal
     * @zh 属性 `_splitterGrabSize`（类型：`number`），用于存储或配置分割条Grab尺寸。
     */
    private readonly _splitterGrabSize: number;
    /**
     * Property `_dimension` (`WidthOrHeightPropertyName`) storing dimension.
     * @internal
     * @zh 属性 `_dimension`（类型：`WidthOrHeightPropertyName`），用于存储或配置维度。
     */
    private readonly _dimension: WidthOrHeightPropertyName;
    /**
     * Property `_splitter` (`Splitter[]`) storing splitter (default: `[]`).
     * @internal
     * @zh 属性 `_splitter`（类型：`Splitter[]`），用于存储或配置分割条（默认值：`[]`）。
     */
    private readonly _splitter: Splitter[] = [];
    /**
     * Property `_splitterPosition` (`number | null`) storing splitter position.
     * @internal
     * @zh 属性 `_splitterPosition`（类型：`number | null`），用于存储或配置分割条位置。
     */
    private _splitterPosition: number | null;
    /**
     * Property `_splitterMinPosition` (`number | null`) storing splitter min position.
     * @internal
     * @zh 属性 `_splitterMinPosition`（类型：`number | null`），用于存储或配置分割条最小值位置。
     */
    private _splitterMinPosition: number | null;
    /**
     * Property `_splitterMaxPosition` (`number | null`) storing splitter max position.
     * @internal
     * @zh 属性 `_splitterMaxPosition`（类型：`number | null`），用于存储或配置分割条最大值位置。
     */
    private _splitterMaxPosition: number | null;

    /**
     * Creates an instance of `RowOrColumn` and initializes its dependencies and internal state.
     * @internal
     * @zh 创建 `RowOrColumn` 实例，并初始化其依赖项与内部状态。
     */
    constructor(private translator:TranslateService,isColumn: boolean, layoutManager: LayoutManager, config: ResolvedRowOrColumnItemConfig,
        /** @internal */
        private _rowOrColumnParent: ContentItem
    ) {
        super(layoutManager, config, _rowOrColumnParent, RowOrColumn.createElement(document, isColumn));

        this.isRow = !isColumn;
        this.isColumn = isColumn;
        this.translator=translator;

        this._childElementContainer = this.element;
        this._splitterSize = layoutManager.layoutConfig.dimensions.borderWidth;
        this._splitterGrabSize = layoutManager.layoutConfig.dimensions.borderGrabWidth;
        this._isColumn = isColumn;
        this._dimension = isColumn ? 'height' : 'width';
        this._splitterPosition = null;
        this._splitterMinPosition = null;
        this._splitterMaxPosition = null;

        switch (config.type) {
            case ItemType.row:
            case ItemType.column:
                this._configType = config.type;
                break;
            default:
                throw new AssertError('ROCCCT00925');
        }
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
     * @param itemConfig - item config parameter (`RowOrColumnItemConfig | StackItemConfig | ComponentItemConfi...`) / 条目配置参数（`RowOrColumnItemConfig | StackItemConfig | ComponentItemConfi...`）
     * @param index - index parameter (`number`) / 索引参数（`number`）
     * @returns Result of type `ContentItem` / 类型为 `ContentItem` 的返回值
     */
    newItem(itemConfig: RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig,  index?: number): ContentItem {
        index = this.addItem(itemConfig, index);
        const createdItem = this.contentItems[index];

        if (ContentItem.isStack(createdItem) && (ItemConfig.isComponent(itemConfig))) {
            // createdItem is a Stack which was created to hold wanted component.  Return component
            return createdItem.contentItems[0];
        } else {
            return createdItem;
        }
    }

    /**
     * Executes `addItem` to handle add item.
     * @zh 执行 `addItem`，用于添加条目。
     * @param itemConfig - item config parameter (`RowOrColumnItemConfig | StackItemConfig | ComponentItemConfi...`) / 条目配置参数（`RowOrColumnItemConfig | StackItemConfig | ComponentItemConfi...`）
     * @param index - index parameter (`number`) / 索引参数（`number`）
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    addItem(itemConfig: RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig,
        index?: number
    ): number {
        this.layoutManager.checkMinimiseMaximisedStack();
        const resolvedItemConfig = ItemConfig.resolve( this.translator,itemConfig, false);
        const contentItem = this.layoutManager.createAndInitContentItem(resolvedItemConfig, this);
        return this.addChild(contentItem, index, false);
    }

    /**
     * Add a new contentItem to the Row or Column
     *
     * @param contentItem -
     * @param index - The position of the new item within the Row or Column.
     *                If no index is provided the item will be added to the end
     * @param suspendResize - If true the items won't be resized. This will leave the item in
     *                        an inconsistent state and is only intended to be used if multiple
     *                        children need to be added in one go and resize is called afterwards
     *
     * @returns

     * @zh 执行 `addChild`，用于添加子级。
     */
    override addChild(contentItem: ContentItem, index?: number, suspendResize?: boolean): number {

        // contentItem = this.layoutManager._$normalizeContentItem(contentItem, this);

        if (index === undefined) {
            index = this.contentItems.length;
        }

        if (this.contentItems.length > 0) {
            const splitterElement = this.createSplitter(Math.max(0, index - 1)).element;

            if (index > 0) {
                this.contentItems[index - 1].element.insertAdjacentElement('afterend', splitterElement);
                splitterElement.insertAdjacentElement('afterend', contentItem.element);
            } else {
                this.contentItems[0].element.insertAdjacentElement('beforebegin', splitterElement);
                splitterElement.insertAdjacentElement('beforebegin', contentItem.element);
            }
        } else {
            this._childElementContainer.appendChild(contentItem.element);
        }

        super.addChild(contentItem, index);

        const newItemSize = (1 / this.contentItems.length) * 100;

        if (suspendResize === true) {
            this.emitBaseBubblingEvent('stateChanged');
            return index;
        }

        for (let i = 0; i < this.contentItems.length; i++) {
            const indexedContentItem = this.contentItems[i];
            if (indexedContentItem === contentItem) {
                contentItem.size = newItemSize;
            } else {
                const itemSize = indexedContentItem.size *= (100 - newItemSize) / 100;
                indexedContentItem.size = itemSize;
            }
        }

        this.updateSize(false);
        this.emitBaseBubblingEvent('stateChanged');

        return index;
    }


    /**
     * Executes `removeChild` to handle remove child.
     * @zh 执行 `removeChild`，用于移除子级。
     * @param contentItem - content item parameter (`ContentItem`) / 内容条目参数（`ContentItem`）
     * @param keepChild - keep child parameter (`boolean`) / keep子级参数（`boolean`）
     */
    override removeChild(contentItem: ContentItem, keepChild: boolean): void {
        const index = this.contentItems.indexOf(contentItem);
        const splitterIndex = Math.max(index - 1, 0);

        if (index === -1) {
            throw new Error('Can\'t remove child. ContentItem is not child of this Row or Column');
        }

        /**
         * Remove the splitter before the item or after if the item happens
         * to be the first in the row/column
         */
        if (this._splitter[splitterIndex]) {
            this._splitter[splitterIndex].destroy();
            this._splitter.splice(splitterIndex, 1);
        }

        super.removeChild(contentItem, keepChild);

        if (this.contentItems.length === 1 && this.isClosable === true) {
            const childItem = this.contentItems[0];
            this.contentItems.length = 0;
            this._rowOrColumnParent.replaceChild(this, childItem, true);
        } else {
            this.updateSize(false);
            this.emitBaseBubblingEvent('stateChanged');
        }
    }

    /**
     * Replaces a child of this Row or Column with another contentItem

     * @zh 执行 `replaceChild`，用于替换子级。
     */
    override replaceChild(oldChild: ContentItem, newChild: ContentItem): void {
        const size = oldChild.size;
        super.replaceChild(oldChild, newChild);
        newChild.size = size;
        this.updateSize(false);
        this.emitBaseBubblingEvent('stateChanged');
    }

    /**
     * Called whenever the dimensions of this item or one of its parents change

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
     * Invoked recursively by the layout manager. ContentItem.init appends
     * the contentItem's DOM elements to the container, RowOrColumn init adds splitters
     * in between them
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

        for (let i = 0; i < this.contentItems.length - 1; i++) {
            this.contentItems[i].element.insertAdjacentElement('afterend', this.createSplitter(i).element);
        }

        this.initContentItems();
    }

    /**
     * Executes `toConfig` to handle to config.
     * @zh 执行 `toConfig`，用于转换为配置。
     * @returns Result of type `ResolvedRowOrColumnItemConfig` / 类型为 `ResolvedRowOrColumnItemConfig` 的返回值
     */
    toConfig(): ResolvedRowOrColumnItemConfig {
        const result: ResolvedRowOrColumnItemConfig = {
            type: this.type as 'row' | 'column',
            content: this.calculateConfigContent() as (ResolvedRowOrColumnItemConfig | ResolvedStackItemConfig)[],
            size: this.size,
            sizeUnit: this.sizeUnit,
            minSize: this.minSize,
            minSizeUnit: this.minSizeUnit,
            id: this.id,
            isClosable: this.isClosable,
        }
        return result;
    }

    /**
     * Executes `setParent` to handle set parent.
     * @internal
     * @zh 执行 `setParent`，用于集合父级。
     */
    protected override setParent(parent: ContentItem): void {
        this._rowOrColumnParent = parent;
        super.setParent(parent);
    }

    /**
     * Executes `updateNodeSize` to handle update node size.
     * @internal
     * @zh 执行 `updateNodeSize`，用于更新节点尺寸。
     */
    private updateNodeSize(): void {
        if (this.contentItems.length > 0) {
            this.calculateRelativeSizes();
            this.setAbsoluteSizes();
        }
        this.emitBaseBubblingEvent('stateChanged');
        this.emit('resize');
    }

    /**
     * Turns the relative sizes calculated by calculateRelativeSizes into
     * absolute pixel values and applies them to the children's DOM elements
     *
     * Assigns additional pixels to counteract Math.floor
     * @internal

     * @zh 执行 `setAbsoluteSizes`，用于集合Absolute尺寸列表。
     */
    private setAbsoluteSizes() {
        const absoluteSizes = this.calculateAbsoluteSizes();

        for (let i = 0; i < this.contentItems.length; i++) {
            if (absoluteSizes.additionalPixel - i > 0) {
                absoluteSizes.itemSizes[i]++;
            }

            if (this._isColumn) {
                setElementWidth(this.contentItems[i].element, absoluteSizes.crossAxisSize);
                setElementHeight(this.contentItems[i].element, absoluteSizes.itemSizes[i]);
            } else {
                setElementWidth(this.contentItems[i].element, absoluteSizes.itemSizes[i]);
                setElementHeight(this.contentItems[i].element, absoluteSizes.crossAxisSize);
            }
        }
    }

    /**
     * Calculates the absolute sizes of all of the children of this Item.
     * @returns Set with absolute sizes and additional pixels.
     * @internal

     * @zh 执行 `calculateAbsoluteSizes`，用于计算Absolute尺寸列表。
     */
    private calculateAbsoluteSizes(): RowOrColumn.AbsoluteSizes {
        const totalSplitterSize = (this.contentItems.length - 1) * this._splitterSize;
        const { width: elementWidth, height: elementHeight } = getElementWidthAndHeight(this.element);

        let totalSize: number;
        let crossAxisSize: number;
        if (this._isColumn) {
            totalSize = elementHeight - totalSplitterSize;
            crossAxisSize = elementWidth;
        } else {
            totalSize = elementWidth - totalSplitterSize;
            crossAxisSize = elementHeight;
        }

        let totalAssigned = 0;
        const itemSizes = [];

        for (let i = 0; i < this.contentItems.length; i++) {
            const contentItem = this.contentItems[i];
            let itemSize: number;
            if (contentItem.sizeUnit === SizeUnitEnum.Percent) {
                itemSize = Math.floor(totalSize * (contentItem.size / 100));
            } else {
                throw new AssertError('ROCCAS6692');
            }

            totalAssigned += itemSize;
            itemSizes.push(itemSize);
        }

        const additionalPixel = Math.floor(totalSize - totalAssigned);

        return {
            itemSizes,
            additionalPixel,
            totalSize,
            crossAxisSize,
        };
    }

    /**
     * Calculates the relative sizes of all children of this Item. The logic
     * is as follows:
     *
     * - Add up the total size of all items that have a configured size
     *
     * - If the total == 100 (check for floating point errors)
     *        Excellent, job done
     *
     * - If the total is \> 100,
     *        set the size of items without set dimensions to 1/3 and add this to the total
     *        set the size off all items so that the total is hundred relative to their original size
     *
     * - If the total is \< 100
     *        If there are items without set dimensions, distribute the remainder to 100 evenly between them
     *        If there are no items without set dimensions, increase all items sizes relative to
     *        their original size so that they add up to 100
     *
     * @internal

     * @zh 执行 `calculateRelativeSizes`，用于计算Relative尺寸列表。
     */
    private calculateRelativeSizes() {

        let total = 0;
        const itemsWithFractionalSize: ContentItem[] = [];
        let totalFractionalSize = 0;

        for (let i = 0; i < this.contentItems.length; i++) {
            const contentItem = this.contentItems[i];
            const sizeUnit = contentItem.sizeUnit;
            switch (sizeUnit) {
                case SizeUnitEnum.Percent: {
                    total += contentItem.size;
                    break;
                }
                case SizeUnitEnum.Fractional: {
                    itemsWithFractionalSize.push(contentItem);
                    totalFractionalSize += contentItem.size;
                    break;
                }
                default:
                    throw new AssertError('ROCCRS49110', JSON.stringify(contentItem));
            }
        }

        /**
         * Everything adds up to hundred, all good :-)
         */
        if (Math.round(total) === 100) {
            this.respectMinItemSize();
            return;
        } else {
            /**
             * Allocate the remaining size to the items with a fractional size
             */
            if (Math.round(total) < 100 && itemsWithFractionalSize.length > 0) {
                const fractionalAllocatedSize = 100 - total;
                for (let i = 0; i < itemsWithFractionalSize.length; i++) {
                    const contentItem = itemsWithFractionalSize[i];
                    contentItem.size = fractionalAllocatedSize * (contentItem.size / totalFractionalSize);
                    contentItem.sizeUnit = SizeUnitEnum.Percent;
                }
                this.respectMinItemSize();
                return;
            } else {

                /**
                 * If the total is > 100, but there are also items with a fractional size, assign another 50%
                 * to the fractional items
                 *
                 * This will be reset in the next step
                 */
                if (Math.round(total) > 100 && itemsWithFractionalSize.length > 0) {
                    for (let i = 0; i < itemsWithFractionalSize.length; i++) {
                        const contentItem = itemsWithFractionalSize[i];
                        contentItem.size = 50 * (contentItem.size / totalFractionalSize);
                        contentItem.sizeUnit = SizeUnitEnum.Percent;
                    }
                    total += 50;
                }

                /**
                 * Set every items size relative to 100 relative to its size to total
                 */
                for (let i = 0; i < this.contentItems.length; i++) {
                    const contentItem = this.contentItems[i];
                    contentItem.size = (contentItem.size / total) * 100;
                }

                this.respectMinItemSize();
            }
        }
    }

    /**
     * Adjusts the column widths to respect the dimensions minItemWidth if set.
     * @internal

     * @zh 执行 `respectMinItemSize`，用于respect最小值条目尺寸。
     */
    private respectMinItemSize() {
        interface Entry {
            /**
             * Property `size` (`number`) storing size.
             * @zh 属性 `size`（类型：`number`），用于存储或配置尺寸。
             */
            size: number;
        }

        const minItemSize = this.calculateContentItemMinSize(this);

        if (minItemSize <= 0 || this.contentItems.length <= 1) {
            return;
        } else {
            let totalOverMin = 0;
            let totalUnderMin = 0;
            const entriesOverMin: Entry[] = [];
            const allEntries: Entry[] = [];

            const absoluteSizes = this.calculateAbsoluteSizes();

            /**
             * Figure out how much we are under the min item size total and how much room we have to use.
             */
            for (let i = 0; i < absoluteSizes.itemSizes.length; i++) {
                const itemSize = absoluteSizes.itemSizes[i];

                let entry: Entry;
                if (itemSize < minItemSize) {
                    totalUnderMin += minItemSize - itemSize;
                    entry = {
                        size: minItemSize
                    };

                } else {
                    totalOverMin += itemSize - minItemSize;
                    entry = {
                        size: itemSize
                    };
                    entriesOverMin.push(entry);
                }

                allEntries.push(entry);
            }

            /**
             * If there is nothing under min, or there is not enough over to make up the difference, do nothing.
             */
            if (totalUnderMin === 0 || totalUnderMin > totalOverMin) {
                return;
            } else {
                /**
                 * Evenly reduce all columns that are over the min item width to make up the difference.
                 */
                const reducePercent = totalUnderMin / totalOverMin;
                let remainingSize = totalUnderMin;
                for (let i = 0; i < entriesOverMin.length; i++) {
                    const entry = entriesOverMin[i];
                    const reducedSize = Math.round((entry.size - minItemSize) * reducePercent);
                    remainingSize -= reducedSize;
                    entry.size -= reducedSize;
                }

                /**
                 * Take anything remaining from the last item.
                 */
                if (remainingSize !== 0) {
                    allEntries[allEntries.length - 1].size -= remainingSize;
                }

                /**
                 * Set every items size relative to 100 relative to its size to total
                 */
                for (let i = 0; i < this.contentItems.length; i++) {
                    const contentItem = this.contentItems[i];
                    contentItem.size = (allEntries[i].size / absoluteSizes.totalSize) * 100;
                }
            }
        }
    }

    /**
     * Instantiates a new Splitter, binds events to it and adds
     * it to the array of splitters at the position specified as the index argument
     *
     * What it doesn't do though is append the splitter to the DOM
     *
     * @param index - The position of the splitter
     *
     * @returns
     * @internal

     * @zh 执行 `createSplitter`，用于创建分割条。
     */
    private createSplitter(index: number): Splitter {
        const splitter = new Splitter(this._isColumn, this._splitterSize, this._splitterGrabSize);
        splitter.on('drag', (offsetX, offsetY) => this.onSplitterDrag(splitter, offsetX, offsetY));
        splitter.on('dragStop', () => this.onSplitterDragStop(splitter));
        splitter.on('dragStart', () => this.onSplitterDragStart(splitter));
        this._splitter.splice(index, 0, splitter);
        return splitter;
    }

    /**
     * Locates the instance of Splitter in the array of
     * registered splitters and returns a map containing the contentItem
     * before and after the splitters, both of which are affected if the
     * splitter is moved
     *
     * @returns A map of contentItems that the splitter affects
     * @internal

     * @zh 执行 `getSplitItems`，用于获取分割面板条目列表。
     */
    private getSplitItems(splitter: Splitter) {
        const index = this._splitter.indexOf(splitter);

        return {
            before: this.contentItems[index],
            after: this.contentItems[index + 1]
        };
    }

    /**
     * Executes `calculateContentItemMinSize` to handle calculate content item min size.
     * @zh 执行 `calculateContentItemMinSize`，用于计算内容条目最小值尺寸。
     * @param contentItem - content item parameter (`ContentItem`) / 内容条目参数（`ContentItem`）
     */
    private calculateContentItemMinSize(contentItem: ContentItem) {
        const minSize = contentItem.minSize;
        if (minSize !== undefined) {
            if (contentItem.minSizeUnit === SizeUnitEnum.Pixel) {
                return minSize;
            } else {
                throw new AssertError('ROCGMD98831', JSON.stringify(contentItem));
            }
        } else {
            const dimensions = this.layoutManager.layoutConfig.dimensions;
            return this._isColumn ? dimensions.defaultMinItemHeight : dimensions.defaultMinItemWidth;
        }
    }

    /**
     * Gets the minimum dimensions for the given item configuration array
     * @internal

     * @zh 执行 `calculateContentItemsTotalMinSize`，用于计算内容条目列表总计最小值尺寸。
     */
    private calculateContentItemsTotalMinSize(contentItems: readonly ContentItem[]) {
        let totalMinSize = 0;

        for (const contentItem of contentItems) {
            totalMinSize += this.calculateContentItemMinSize(contentItem);
        }

        return totalMinSize;
    }

    /**
     * Invoked when a splitter's dragListener fires dragStart. Calculates the splitters
     * movement area once (so that it doesn't need calculating on every mousemove event)
     * @internal

     * @zh 执行 `onSplitterDragStart`，用于当分割条拖拽开始。
     */
    private onSplitterDragStart(splitter: Splitter) {
        const items = this.getSplitItems(splitter);

        const beforeWidth = pixelsToNumber(items.before.element.style[this._dimension]);
        const afterSize = pixelsToNumber(items.after.element.style[this._dimension]);
        const beforeMinSize = this.calculateContentItemsTotalMinSize(items.before.contentItems);
        const afterMinSize = this.calculateContentItemsTotalMinSize(items.after.contentItems);

        this._splitterPosition = 0;
        this._splitterMinPosition = -1 * (beforeWidth - beforeMinSize);
        this._splitterMaxPosition = afterSize - afterMinSize;
    }

    /**
     * Invoked when a splitter's DragListener fires drag. Updates the splitter's DOM position,
     * but not the sizes of the elements the splitter controls in order to minimize resize events
     *
     * @param splitter -
     * @param offsetX - Relative pixel values to the splitter's original position. Can be negative
     * @param offsetY - Relative pixel values to the splitter's original position. Can be negative
     * @internal

     * @zh 执行 `onSplitterDrag`，用于当分割条拖拽。
     */
    private onSplitterDrag(splitter: Splitter, offsetX: number, offsetY: number) {
        let offset = this._isColumn ? offsetY : offsetX;

        if (this._splitterMinPosition === null || this._splitterMaxPosition === null) {
            throw new UnexpectedNullError('ROCOSD59226');
        }
        offset = Math.max(offset, this._splitterMinPosition);
        offset = Math.min(offset, this._splitterMaxPosition);

        this._splitterPosition = offset;
        const offsetPixels = numberToPixels(offset);
        if (this._isColumn) {
            splitter.element.style.top = offsetPixels;
        } else {
            splitter.element.style.left = offsetPixels;
        }
    }

    /**
     * Invoked when a splitter's DragListener fires dragStop. Resets the splitters DOM position,
     * and applies the new sizes to the elements before and after the splitter and their children
     * on the next animation frame
     * @internal

     * @zh 执行 `onSplitterDragStop`，用于当分割条拖拽停止。
     */
    private onSplitterDragStop(splitter: Splitter) {
        if (this._splitterPosition === null) {
            throw new UnexpectedNullError('ROCOSDS66932');
        } else {
            const items = this.getSplitItems(splitter);
            const sizeBefore = pixelsToNumber(items.before.element.style[this._dimension]);
            const sizeAfter = pixelsToNumber(items.after.element.style[this._dimension]);
            const splitterPositionInRange = (this._splitterPosition + sizeBefore) / (sizeBefore + sizeAfter);
            const totalRelativeSize = items.before.size + items.after.size;

            items.before.size = splitterPositionInRange * totalRelativeSize;
            items.after.size = (1 - splitterPositionInRange) * totalRelativeSize;

            splitter.element.style.top = numberToPixels(0);
            splitter.element.style.left = numberToPixels(0);

            globalThis.requestAnimationFrame(() => this.updateSize(false));
        }
    }
}

/** @public */
export namespace RowOrColumn {
    /**
     * Interface `AbsoluteSizes` defining the contract and properties for absolute sizes.
     * @internal
     * @zh 接口 `AbsoluteSizes`，定义Absolute尺寸列表的数据结构契约与属性规范。
     */
    export interface AbsoluteSizes {
        /**
         * Property `itemSizes` (`number[]`) storing item sizes.
         * @zh 属性 `itemSizes`（类型：`number[]`），用于存储或配置条目尺寸列表。
         */
        itemSizes: number[],
        /**
         * Property `additionalPixel` (`number`) storing additional pixel.
         * @zh 属性 `additionalPixel`（类型：`number`），用于存储或配置additional像素。
         */
        additionalPixel: number,
        /**
         * Property `totalSize` (`number`) storing total size.
         * @zh 属性 `totalSize`（类型：`number`），用于存储或配置总计尺寸。
         */
        totalSize: number,
        /**
         * Property `crossAxisSize` (`number`) storing cross axis size.
         * @zh 属性 `crossAxisSize`（类型：`number`），用于存储或配置cross坐标轴尺寸。
         */
        crossAxisSize: number
    }

    /**
     * Executes `getElementDimensionSize` to handle get element dimension size.
     * @internal
     * @zh 执行 `getElementDimensionSize`，用于获取元素维度尺寸。
     */
    export function getElementDimensionSize(element: HTMLElement, dimension: WidthOrHeightPropertyName): number {
        if (dimension === 'width') {
            return getElementWidth(element);
        } else {
            return getElementHeight(element);
        }
    }

    /**
     * Executes `setElementDimensionSize` to handle set element dimension size.
     * @internal
     * @zh 执行 `setElementDimensionSize`，用于集合元素维度尺寸。
     */
    export function setElementDimensionSize(element: HTMLElement, dimension: WidthOrHeightPropertyName, value: number): void {
        if (dimension === 'width') {
            return setElementWidth(element, value);
        } else {
            return setElementHeight(element, value);
        }
    }

    /**
     * Executes `createElement` to handle create element.
     * @internal
     * @zh 执行 `createElement`，用于创建元素。
     */
    export function createElement(document: Document, isColumn: boolean): HTMLDivElement {
        const element = document.createElement('div');
        element.classList.add(DomConstants.ClassName.Item);
        if (isColumn) {
            element.classList.add(DomConstants.ClassName.Column);
        } else {
            element.classList.add(DomConstants.ClassName.Row);
        }
        return element;
    }
}
