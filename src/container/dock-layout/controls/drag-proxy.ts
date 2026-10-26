/**
 * @fileoverview Module `src/container/dock-layout/controls/drag-proxy.ts` providing drag proxy definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/controls/drag-proxy.ts`，提供拖拽proxy相关的定义与实现。
 */

import { UnexpectedNullError, UnexpectedUndefinedError } from '../errors/internal-error';
import { ComponentItem } from '../items/component-item';
import { ContentItem } from '../items/content-item';
import { Stack } from '../items/stack';
import { LayoutManager } from '../layout-manager';
import { DomConstants } from '../utils/dom-constants';
import { DragListener } from '../utils/drag-listener';
import { EventEmitter } from '../utils/event-emitter';
import { Side } from '../utils/types';
import {
    numberToPixels
} from '../utils/utils';


/**
 * Class `DragProxy` encapsulating drag proxy data structures and logic in `src/container/dock-layout/controls`.
 * @zh 类 `DragProxy`，封装 `src/container/dock-layout/controls` 中的拖拽Proxy数据结构与处理逻辑。
 */
export class DragProxy extends EventEmitter {
    /**
     * Property `_area` (`ContentItem.Area | null`) storing area (default: `null`).
     * @zh 属性 `_area`（类型：`ContentItem.Area | null`），用于存储或配置区域（默认值：`null`）。
     */
    private _area: ContentItem.Area | null = null;
    /**
     * Property `_lastValidArea` (`ContentItem.Area | null`) storing last valid area (default: `null`).
     * @zh 属性 `_lastValidArea`（类型：`ContentItem.Area | null`），用于存储或配置末尾有效区域（默认值：`null`）。
     */
    private _lastValidArea: ContentItem.Area | null = null;
    /**
     * Property `_minX` (`number`) storing min x.
     * @zh 属性 `_minX`（类型：`number`），用于存储或配置最小值X坐标。
     */
    private _minX: number;
    /**
     * Property `_minY` (`number`) storing min y.
     * @zh 属性 `_minY`（类型：`number`），用于存储或配置最小值Y坐标。
     */
    private _minY: number;
    /**
     * Property `_maxX` (`number`) storing max x.
     * @zh 属性 `_maxX`（类型：`number`），用于存储或配置最大值X坐标。
     */
    private _maxX: number;
    /**
     * Property `_maxY` (`number`) storing max y.
     * @zh 属性 `_maxY`（类型：`number`），用于存储或配置最大值Y坐标。
     */
    private _maxY: number;
    /**
     * Property `_sided` (`boolean`) storing sided.
     * @zh 属性 `_sided`（类型：`boolean`），用于存储或配置sided。
     */
    private _sided: boolean;
    /**
     * Property `_element` (`HTMLElement`) storing element.
     * @zh 属性 `_element`（类型：`HTMLElement`），用于存储或配置元素。
     */
    private _element: HTMLElement;
    /**
     * Property `_proxyContainerElement` (`HTMLElement`) storing proxy container element.
     * @zh 属性 `_proxyContainerElement`（类型：`HTMLElement`），用于存储或配置proxy容器元素。
     */
    private _proxyContainerElement: HTMLElement;
    /**
     * Property `_componentItemFocused` (`boolean`) storing component item focused.
     * @zh 属性 `_componentItemFocused`（类型：`boolean`），用于存储或配置组件条目已聚焦。
     */
    private _componentItemFocused: boolean;

    /**
     * Gets the current element (`element: HTMLElement`).
     * @zh 获取当前元素（`element: HTMLElement`）。
     */
    get element(): HTMLElement { return this._element; }

    /**
     * @param x - The initial x position
     * @param y - The initial y position
     * @internal

     * @zh 创建 `DragProxy` 实例，并初始化其依赖项与内部状态。
     */
    constructor(x: number, y: number,
        private readonly _dragListener: DragListener,
        private readonly _layoutManager: LayoutManager,
        private readonly _componentItem: ComponentItem,
        private readonly _originalParent: ContentItem) {

        super();

        this._dragListener.on('drag', (offsetX, offsetY, event) => this.onDrag(offsetX, offsetY, event));
        this._dragListener.on('dragStop', () => this.onDrop());

        this.createDragProxyElements(x, y);

        if (this._componentItem.parent === null) {
            // Note that _contentItem will have dummy GroundItem as parent if initiated by a external drag source
            throw new UnexpectedNullError('DPC10097');
        }

        this._componentItemFocused = this._componentItem.focused;
        if (this._componentItemFocused) {
            this._componentItem.blur();
        }
        this._componentItem.parent.removeChild(this._componentItem, true);

        this.setDimensions();

        document.body.appendChild(this._element);

        this.determineMinMaxXY();
        this._layoutManager.calculateItemAreas();
        this.setDropPosition(x, y);
    }

    /**
     * Create Stack-like structure to contain the dragged component
     * @zh 执行 `createDragProxyElements`，用于创建拖拽Proxy元素列表。
     */
    private createDragProxyElements(initialX: number, initialY: number): void {
        this._element = document.createElement('div');
        this._element.classList.add(DomConstants.ClassName.DragProxy);
        const headerElement = document.createElement('div');
        headerElement.classList.add(DomConstants.ClassName.Header);
        const tabsElement = document.createElement('div');
        tabsElement.classList.add(DomConstants.ClassName.Tabs);
        const tabElement = document.createElement('div');
        tabElement.classList.add(DomConstants.ClassName.Tab);
        const titleElement = document.createElement('span');
        titleElement.classList.add(DomConstants.ClassName.Title);
        tabElement.appendChild(titleElement);
        tabsElement.appendChild(tabElement);
        headerElement.appendChild(tabsElement);

        this._proxyContainerElement = document.createElement('div');
        this._proxyContainerElement.classList.add(DomConstants.ClassName.Content);

        this._element.appendChild(headerElement);
        this._element.appendChild(this._proxyContainerElement);

        if (this._originalParent instanceof Stack && this._originalParent.headerShow) {
            this._sided = this._originalParent.headerLeftRightSided;
            this._element.classList.add('lm_' + this._originalParent.headerSide);
            if ([Side.right, Side.bottom].indexOf(this._originalParent.headerSide) >= 0) {
                this._proxyContainerElement.insertAdjacentElement('afterend', headerElement);
            }
        }
        this._element.style.left = numberToPixels(initialX);
        this._element.style.top = numberToPixels(initialY);
        tabElement.setAttribute('title', this._componentItem.title);
        titleElement.insertAdjacentText('afterbegin', this._componentItem.title);
        this._proxyContainerElement.appendChild(this._componentItem.element);
    }

    /**
     * Executes `determineMinMaxXY` to handle determine min max xy.
     * @zh 执行 `determineMinMaxXY`，用于determine最小值最大值XY坐标。
     */
    private determineMinMaxXY(): void {
        const groundItem = this._layoutManager.groundItem;
        if (groundItem === undefined) {
            throw new UnexpectedUndefinedError('DPDMMXY73109');
        } else {
            const groundElement = groundItem.element;
            const rect = groundElement.getBoundingClientRect();
            this._minX = rect.left + document.body.scrollLeft;
            this._minY = rect.top + document.body.scrollTop;
            this._maxX = this._minX + rect.width;
            this._maxY = this._minY + rect.height;
        }
    }

    /**
     * Callback on every mouseMove event during a drag. Determines if the drag is
     * still within the valid drag area and calls the layoutManager to highlight the
     * current drop area
     *
     * @param offsetX - The difference from the original x position in px
     * @param offsetY - The difference from the original y position in px
     * @param event -
     * @internal

     * @zh 执行 `onDrag`，用于当拖拽。
     */
    private onDrag(offsetX: number, offsetY: number, event: PointerEvent) {

        const x = event.pageX;
        const y = event.pageY;

        this.setDropPosition(x, y);
        this._componentItem.drag();
    }

    /**
     * Sets the target position, highlighting the appropriate area
     *
     * @param x - The x position in px
     * @param y - The y position in px
     *
     * @internal

     * @zh 执行 `setDropPosition`，用于集合放置位置。
     */
    private setDropPosition(x: number, y: number): void {
        if (this._layoutManager.layoutConfig.settings.constrainDragToContainer) {
            if (x <= this._minX) {
                x = Math.ceil(this._minX);
            } else if (x >= this._maxX) {
                x = Math.floor(this._maxX);
            }

            if (y <= this._minY) {
                y = Math.ceil(this._minY);
            } else if (y >= this._maxY) {
                y = Math.floor(this._maxY);
            }
        }

        this._element.style.left = numberToPixels(x);
        this._element.style.top = numberToPixels(y);
        this._area = this._layoutManager.getArea(x, y);

        if (this._area !== null) {
            this._lastValidArea = this._area;
            this._area.contentItem.highlightDropZone(x, y, this._area);
        }
    }

    /**
     * Callback when the drag has finished. Determines the drop area
     * and adds the child to it
     * @internal

     * @zh 执行 `onDrop`，用于当放置。
     */
    private onDrop(): void {
        const dropTargetIndicator = this._layoutManager.dropTargetIndicator;
        if (dropTargetIndicator === null) {
            throw new UnexpectedNullError('DPOD30011');
        } else {
            dropTargetIndicator.hide();
        }

        this._componentItem.exitDragMode();

        /*
         * Valid drop area found
         */
        let droppedComponentItem: ComponentItem | undefined;
        if (this._area !== null) {
            droppedComponentItem = this._componentItem;
            this._area.contentItem.onDrop(droppedComponentItem, this._area);

            /**
             * No valid drop area available at present, but one has been found before.
             * Use it
             */
        } else if (this._lastValidArea !== null) {
            droppedComponentItem = this._componentItem;
            const newParentContentItem = this._lastValidArea.contentItem;
            newParentContentItem.onDrop(droppedComponentItem, this._lastValidArea);

            /**
             * No valid drop area found during the duration of the drag. Return
             * content item to its original position if a original parent is provided.
             * (Which is not the case if the drag had been initiated by createDragSource)
             */
        } else if (this._originalParent) {
            droppedComponentItem = this._componentItem;
            this._originalParent.addChild(droppedComponentItem);

            /**
             * The drag didn't ultimately end up with adding the content item to
             * any container. In order to ensure clean up happens, destroy the
             * content item.
             */
        } else {
            this._componentItem.destroy(); // contentItem children are now destroyed as well
        }

        this._element.remove();

        this._layoutManager.emit('itemDropped', this._componentItem);

        if (this._componentItemFocused && droppedComponentItem !== undefined) {
            droppedComponentItem.focus();
        }
    }

    /**
     * Updates the Drag Proxy's dimensions
     * @internal

     * @zh 执行 `setDimensions`，用于集合维度列表。
     */
    private setDimensions() {
        const dimensions = this._layoutManager.layoutConfig.dimensions;
        if (dimensions === undefined) {
            throw new Error('DragProxy.setDimensions: dimensions undefined');
        }

        let width = dimensions.dragProxyWidth;
        let height = dimensions.dragProxyHeight;
        if (width === undefined || height === undefined) {
            throw new Error('DragProxy.setDimensions: width and/or height undefined');
        }

        const headerHeight = this._layoutManager.layoutConfig.header.show === false ? 0 : dimensions.headerHeight;
        this._element.style.width = numberToPixels(width);
        this._element.style.height = numberToPixels(height)
        width -= (this._sided ? headerHeight : 0);
        height -= (!this._sided ? headerHeight : 0);
        this._proxyContainerElement.style.width = numberToPixels(width);
        this._proxyContainerElement.style.height = numberToPixels(height);
        this._componentItem.enterDragMode(width, height);
        this._componentItem.show();
    }
}
