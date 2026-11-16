/**
 * @fileoverview Module `src/container/dock-layout/controls/drag-source.ts` providing drag source definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/controls/drag-source.ts`，提供拖拽源相关的定义与实现。
 */

import { TranslateService } from '@dotos1/dui/translator';
import { ComponentItemConfig as ConfigComponentItemConfig } from '../config/config'; // remove alias in version 3
import { ResolvedRowOrColumnItemConfig } from "../config/resolved-config";
import { UnexpectedNullError } from '../errors/internal-error';
import { ComponentItem } from '../items/component-item';
import { GroundItem } from '../items/ground-item';
import { LayoutManager } from '../layout-manager';
import { DragListener } from '../utils/drag-listener';
import { JsonValue } from '../utils/types';
import { DragProxy } from './drag-proxy';

/**
 * Allows for any DOM item to create a component on drag
 * start to be dragged into the Layout
 * @public

 * @zh 类 `DragSource`，封装 `src/container/dock-layout/controls` 中的拖拽源数据结构与处理逻辑。
 */
export class DragSource {
    /**
     * Property `_dragListener` (`DragListener`) storing drag listener.
     * @internal
     * @zh 属性 `_dragListener`（类型：`DragListener`），用于存储或配置拖拽监听器。
     */
    private _dragListener: DragListener | null;
    /**
     * Property `_dummyGroundContainer` (`HTMLElement`) storing dummy ground container.
     * @internal
     * @zh 属性 `_dummyGroundContainer`（类型：`HTMLElement`），用于存储或配置dummyGround容器。
     */
    private _dummyGroundContainer: HTMLElement;
    /**
     * Property `_dummyGroundContentItem` (`GroundItem`) storing dummy ground content item.
     * @internal
     * @zh 属性 `_dummyGroundContentItem`（类型：`GroundItem`），用于存储或配置dummyGround内容条目。
     */
    private _dummyGroundContentItem: GroundItem;

    /**
     * Creates an instance of `DragSource` and initializes its dependencies and internal state.
     * @internal
     * @zh 创建 `DragSource` 实例，并初始化其依赖项与内部状态。
     */
    constructor(
        private translator:TranslateService,
        /** @internal */
        private _layoutManager: LayoutManager,
        /** @internal */
        private readonly _element: HTMLElement,
        /** @internal */
        private readonly _extraAllowableChildTargets: HTMLElement[],
        /** @internal @deprecated replace with componentItemConfigOrFtn in version 3 */
        private _componentTypeOrFtn: JsonValue | (() => (DragSource.ComponentItemConfig | ConfigComponentItemConfig)),
        /** @internal @deprecated remove in version 3 */
        private _componentState: JsonValue | undefined,
        /** @internal @deprecated remove in version 3 */
        private _title: string | undefined,
        /** @internal @deprecated remove in version 3 */
        private _id: string | undefined
    ) {
        this._dragListener = null;

        this.translator=translator;

        this._dummyGroundContainer = document.createElement('div');

        const dummyRootItemConfig = ResolvedRowOrColumnItemConfig.createDefault('row');
        this._dummyGroundContentItem = new GroundItem( this.translator,this._layoutManager, dummyRootItemConfig, this._dummyGroundContainer);

        this.createDragListener();
    }

	/**
	 * Disposes of the drag listeners so the drag source is not usable any more.
     * @internal

	 * @zh 执行 `destroy`，用于销毁。
	 */
	destroy(): void {
		this.removeDragListener();
    }

    /**
     * Called initially and after every drag
     * @internal

     * @zh 执行 `createDragListener`，用于创建拖拽监听器。
     */
    private createDragListener() {
        this.removeDragListener();

        this._dragListener = new DragListener(this._element, this._extraAllowableChildTargets);
        this._dragListener.on('dragStart', (x, y) => this.onDragStart(x, y));
        this._dragListener.on('dragStop', () => this.onDragStop());
    }

    /**
     * Callback for the DragListener's dragStart event
     *
     * @param x - The x position of the mouse on dragStart
     * @param y - The x position of the mouse on dragStart
     * @internal

     * @zh 执行 `onDragStart`，用于当拖拽开始。
     */
    private onDragStart(x: number, y: number) {
        const type = 'component';
        let dragSourceItemConfig: ConfigComponentItemConfig;

        if (typeof this._componentTypeOrFtn === "function") {
            const ftnDragSourceItemConfig = this._componentTypeOrFtn() as (DragSource.ComponentItemConfig | ConfigComponentItemConfig);
            // If the componentType property exists, then it is already a ComponentItemConfig so nothing to do
            if (DragSource.isDragSourceComponentItemConfig(ftnDragSourceItemConfig)) {
                dragSourceItemConfig = {
                    type,
                    componentState: ftnDragSourceItemConfig.state,
                    componentType: ftnDragSourceItemConfig.type,
                    title: ftnDragSourceItemConfig.title ?? this._title,
                };
            } else {
                dragSourceItemConfig = ftnDragSourceItemConfig;
            }
        } else {
            dragSourceItemConfig = {
                type,
                componentState: this._componentState,
                componentType: this._componentTypeOrFtn,
                title: this._title,
                id: this._id,
            };
        }

        // Create a dummy ContentItem only for drag purposes
        // All ContentItems (except for GroundItem) need a parent.  When dragging, the parent is not used.
        // Instead of allowing null parents (as Javascript version did), use a temporary dummy GroundItem parent and add ContentItem to that
        // If this does not work, need to create alternative GroundItem class

        const resolvedItemConfig = ConfigComponentItemConfig.resolve( this.translator,dragSourceItemConfig, false);

        const componentItem = new ComponentItem( this.translator,this._layoutManager, resolvedItemConfig, this._dummyGroundContentItem)
        this._dummyGroundContentItem.contentItems.push(componentItem);

        if (this._dragListener === null) {
            throw new UnexpectedNullError('DSODSD66746');
        } else {
            const dragProxy = new DragProxy(x, y, this._dragListener, this._layoutManager, componentItem , this._dummyGroundContentItem);

            const transitionIndicator = this._layoutManager.transitionIndicator;
            if (transitionIndicator === null) {
                throw new UnexpectedNullError('DSODST66746');
            } else {
                transitionIndicator.transitionElements(this._element, dragProxy.element);
            }
        }
    }

    /**
     * Executes `onDragStop` to handle on drag stop.
     * @internal
     * @zh 执行 `onDragStop`，用于当拖拽停止。
     */
    private onDragStop() {
        // if (this._dummyGroundContentItem === undefined) {
        //     throw new UnexpectedUndefinedError('DSODSDRU08116');
        // } else {
        //     this._dummyGroundContentItem._$destroy
        //     this._dummyGroundContentItem = undefined;
        // }
        this.createDragListener();
    }

    /**
	 * Called after every drag and when the drag source is being disposed of.
     * @internal

     * @zh 执行 `removeDragListener`，用于移除拖拽监听器。
     */
	private removeDragListener() {
		if (this._dragListener !== null ) {
            this._dragListener.destroy();
            this._dragListener = null;
		}
	}
}

/** @public */
export namespace DragSource {
    /**
     * @deprecated  use Config {@link (ComponentItemConfig:interface)}
     * @zh 接口 `ComponentItemConfig`，定义组件条目配置的数据结构契约与属性规范。
     */
    export interface ComponentItemConfig {
        /**
         * Property `type` (`JsonValue`) storing type.
         * @zh 属性 `type`（类型：`JsonValue`），用于存储或配置类型。
         */
        type: JsonValue,
        /**
         * Property `state` (`JsonValue`) storing state.
         * @zh 属性 `state`（类型：`JsonValue`），用于存储或配置状态。
         */
        state?: JsonValue,
        /**
         * Property `title` (`string`) storing title.
         * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
         */
        title?: string,
    }

    /**
     * @deprecated remove in version 3
     * @zh 执行 `isDragSourceComponentItemConfig`，用于是否为拖拽源组件条目配置。
     */
    export function isDragSourceComponentItemConfig(
        config: DragSource.ComponentItemConfig | ConfigComponentItemConfig
    ): config is DragSource.ComponentItemConfig {
        return !("componentType" in config);
    }
}
