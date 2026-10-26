/**
 * @fileoverview Module `src/container/dock-layout/container/component-container.ts` providing component container definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/container/component-container.ts`，提供组件容器相关的定义与实现。
 */

import { TranslateService } from '@dotos/dui/translator';
import { ComponentItemConfig, ItemConfig } from '../config/config';
import { ResolvedComponentItemConfig } from '../config/resolved-config';
import { Tab } from '../controls/tab';
import { AssertError, UnexpectedNullError } from '../errors/internal-error';
import { ComponentItem } from '../items/component-item';
import { ContentItem } from '../items/content-item';
import { LayoutManager } from '../layout-manager';
import { EventEmitter } from '../utils/event-emitter';
import { JsonValue, LogicalZIndex, LogicalZIndexToDefaultMap } from '../utils/types';
import { deepExtend, setElementHeight, setElementWidth } from '../utils/utils';

/**
 * Class `ComponentContainer` encapsulating component container data structures and logic in `src/container/dock-layout/container`.
 * @public
 * @zh 类 `ComponentContainer`，封装 `src/container/dock-layout/container` 中的组件容器数据结构与处理逻辑。
 */
export class ComponentContainer extends EventEmitter {
    /**
     * Property `_componentType` (`JsonValue`) storing component type.
     * @internal
     * @zh 属性 `_componentType`（类型：`JsonValue`），用于存储或配置组件类型。
     */
    private _componentType: JsonValue;
    /**
     * Property `_boundComponent` (`ComponentContainer.BindableComponent`) storing bound component.
     * @internal
     * @zh 属性 `_boundComponent`（类型：`ComponentContainer.BindableComponent`），用于存储或配置已绑定组件。
     */
    private _boundComponent: ComponentContainer.BindableComponent;
    /**
     * Property `_width` (`number`) storing width.
     * @internal
     * @zh 属性 `_width`（类型：`number`），用于存储或配置宽度。
     */
    private _width: number;
    /**
     * Property `_height` (`number`) storing height.
     * @internal
     * @zh 属性 `_height`（类型：`number`），用于存储或配置高度。
     */
    private _height: number;
    /**
     * Property `_isClosable` (`any`) storing is closable.
     * @internal
     * @zh 属性 `_isClosable`（类型：`any`），用于存储或配置是否为是否可关闭。
     */
    private _isClosable;
    /**
     * Property `_initialState` (`JsonValue | undefined`) storing initial state.
     * @internal
     * @zh 属性 `_initialState`（类型：`JsonValue | undefined`），用于存储或配置初始状态。
     */
    private _initialState: JsonValue | undefined;
    /**
     * Property `_state` (`JsonValue | undefined`) storing state.
     * @internal
     * @zh 属性 `_state`（类型：`JsonValue | undefined`），用于存储或配置状态。
     */
    private _state: JsonValue | undefined;
    /**
     * Property `_visible` (`any`) storing visible.
     * @internal
     * @zh 属性 `_visible`（类型：`any`），用于存储或配置可见。
     */
    private _visible;
    /**
     * Property `_isShownWithZeroDimensions` (`any`) storing is shown with zero dimensions.
     * @internal
     * @zh 属性 `_isShownWithZeroDimensions`（类型：`any`），用于存储或配置是否为已显示带有Zero维度列表。
     */
    private _isShownWithZeroDimensions;
    /**
     * Property `_tab` (`Tab`) storing tab.
     * @internal
     * @zh 属性 `_tab`（类型：`Tab`），用于存储或配置选项卡。
     */
    private _tab: Tab;
    /**
     * Property `_stackMaximised` (`boolean`) storing stack maximised (default: `false`).
     * @internal
     * @zh 属性 `_stackMaximised`（类型：`boolean`），用于存储或配置栈最大化（默认值：`false`）。
     */
    private _stackMaximised = false;
    /**
     * Property `_logicalZIndex` (`LogicalZIndex`) storing logical z index.
     * @internal
     * @zh 属性 `_logicalZIndex`（类型：`LogicalZIndex`），用于存储或配置logicalZ坐标索引。
     */
    private _logicalZIndex: LogicalZIndex;

    /**
     * Property `stateRequestEvent` (`ComponentContainer.StateRequestEventHandler | undefined`) storing state request event.
     * @zh 属性 `stateRequestEvent`（类型：`ComponentContainer.StateRequestEventHandler | undefined`），用于存储或配置状态请求事件。
     */
    stateRequestEvent: ComponentContainer.StateRequestEventHandler | undefined;
    /**
     * Property `virtualRectingRequiredEvent` (`ComponentContainer.VirtualRectingRequiredEvent | undefined`) storing virtual recting required event.
     * @zh 属性 `virtualRectingRequiredEvent`（类型：`ComponentContainer.VirtualRectingRequiredEvent | undefined`），用于存储或配置虚拟滚动矩形必填事件。
     */
    virtualRectingRequiredEvent: ComponentContainer.VirtualRectingRequiredEvent | undefined;
    /**
     * Property `virtualVisibilityChangeRequiredEvent` (`ComponentContainer.VirtualVisibilityChangeRequiredEvent | undefined`) storing virtual visibility change required event.
     * @zh 属性 `virtualVisibilityChangeRequiredEvent`（类型：`ComponentContainer.VirtualVisibilityChangeRequiredEvent | undefined`），用于存储或配置虚拟滚动Visibility变更必填事件。
     */
    virtualVisibilityChangeRequiredEvent: ComponentContainer.VirtualVisibilityChangeRequiredEvent | undefined;
    /**
     * Property `virtualZIndexChangeRequiredEvent` (`ComponentContainer.VirtualZIndexChangeRequiredEvent | undefined`) storing virtual z index change required event.
     * @zh 属性 `virtualZIndexChangeRequiredEvent`（类型：`ComponentContainer.VirtualZIndexChangeRequiredEvent | undefined`），用于存储或配置虚拟滚动Z坐标索引变更必填事件。
     */
    virtualZIndexChangeRequiredEvent: ComponentContainer.VirtualZIndexChangeRequiredEvent | undefined;

    /**
     * Gets the current width (`width: number`).
     * @zh 获取当前宽度（`width: number`）。
     */
    get width(): number { return this._width; }
    /**
     * Gets the current height (`height: number`).
     * @zh 获取当前高度（`height: number`）。
     */
    get height(): number { return this._height; }
    /**
     * Gets the current parent (`parent: ComponentItem`).
     * @zh 获取当前父级（`parent: ComponentItem`）。
     */
    get parent(): ComponentItem { return this._parent; }
    /**
     * @internal @deprecated use {@link (ComponentContainer:class).componentType}
     * @zh 获取当前组件名称（`componentName: JsonValue`）。
     */
    get componentName(): JsonValue { return this._componentType; }
    /**
     * Gets the current component type (`componentType: JsonValue`).
     * @zh 获取当前组件类型（`componentType: JsonValue`）。
     */
    get componentType(): JsonValue { return this._componentType; }
    /**
     * Gets the current virtual (`virtual: boolean`).
     * @zh 获取当前虚拟滚动（`virtual: boolean`）。
     */
    get virtual(): boolean { return this._boundComponent.virtual; }
    /**
     * Gets the current component (`component: ComponentContainer.Component`).
     * @zh 获取当前组件（`component: ComponentContainer.Component`）。
     */
    get component(): ComponentContainer.Component { return this._boundComponent.component; }
    /**
     * Gets the current tab (`tab: Tab`).
     * @zh 获取当前选项卡（`tab: Tab`）。
     */
    get tab(): Tab { return this._tab; }
    /**
     * Gets the current title (`title: string`).
     * @zh 获取当前标题（`title: string`）。
     */
    get title(): string { return this._parent.title; }
    /**
     * Gets the current layout manager (`layoutManager: LayoutManager`).
     * @zh 获取当前布局管理器（`layoutManager: LayoutManager`）。
     */
    get layoutManager(): LayoutManager { return this._layoutManager; }
    /**
     * Gets the current is hidden (`isHidden: boolean`).
     * @zh 获取当前是否为隐藏（`isHidden: boolean`）。
     */
    get isHidden(): boolean { return !this._visible; }
    /**
     * Gets the current visible (`visible: boolean`).
     * @zh 获取当前可见（`visible: boolean`）。
     */
    get visible(): boolean { return this._visible; }
    /**
     * Gets the current state (`state: JsonValue | undefined`).
     * @zh 获取当前状态（`state: JsonValue | undefined`）。
     */
    get state(): JsonValue | undefined { return this._state; }
    /**
     * Return the initial component state
     * @zh 获取当前初始状态（`initialState: JsonValue | undefined`）。
     */
    get initialState(): JsonValue | undefined { return this._initialState; }
    /**
     * The inner DOM element where the container's content is intended to live in
     * @zh 获取当前元素（`element: HTMLElement`）。
     */
    get element(): HTMLElement { return this._element; }

    /**
     * Creates an instance of `ComponentContainer` and initializes its dependencies and internal state.
     * @internal
     * @zh 创建 `ComponentContainer` 实例，并初始化其依赖项与内部状态。
     */
    constructor(
        private translator:TranslateService,
        /** @internal */
        private readonly _config: ResolvedComponentItemConfig,
        /** @internal */
        private readonly _parent: ComponentItem,
        /** @internal */
        private readonly _layoutManager: LayoutManager,
        /** @internal */
        private readonly _element: HTMLElement,
        /** @internal */
        private readonly _updateItemConfigEvent: ComponentContainer.UpdateItemConfigEventHandler,
        /** @internal */
        private readonly _showEvent: ComponentContainer.ShowEventHandler,
        /** @internal */
        private readonly _hideEvent: ComponentContainer.HideEventHandler,
        /** @internal */
        private readonly _focusEvent: ComponentContainer.FocusEventHandler,
        /** @internal */
        private readonly _blurEvent: ComponentContainer.BlurEventHandler,
    ) {
        super();

        this._width = 0;
        this._height = 0;
        this._visible = true;
        this._isShownWithZeroDimensions = true;
        this.translator=translator;

        this._componentType = _config.componentType;
        this._isClosable = _config.isClosable;
        this._initialState = _config.componentState;
        this._state = this._initialState;

        this._boundComponent = this.layoutManager.bindComponent(this.translator,this, _config);

        this.updateElementPositionPropertyFromBoundComponent();
    }

    /**
     * Executes `destroy` to handle destroy.
     * @internal
     * @zh 执行 `destroy`，用于销毁。
     */
    destroy(): void {
        this.releaseComponent();
        this.stateRequestEvent = undefined;
        this.emit('destroy');
    }

    /**
     * @deprecated use {@link (ComponentContainer:class).element }
     * @zh 执行 `getElement`，用于获取元素。
     */
    getElement(): HTMLElement {
        return this._element;
    }

    /**
     * Hides the container's component item (and hence, the container) if not already hidden.
     * Emits hide event prior to hiding the container.

     * @zh 执行 `hide`，用于隐藏。
     */
    hide(): void {
        this._hideEvent();
    }


    /**
     * Executes `show` to handle show.
     * @zh 执行 `show`，用于显示。
     */
    show(): void {
        this._showEvent();
    }

    /**
     * Executes `focus` to handle focus.
     * @zh 执行 `focus`，用于聚焦。
     * @param suppressEvent - suppress event parameter (`any`) / suppress事件参数（`any`）
     */
    focus(suppressEvent = false): void {
        this._focusEvent(suppressEvent);
    }

    /**
     * Executes `blur` to handle blur.
     * @zh 执行 `blur`，用于失焦。
     * @param suppressEvent - suppress event parameter (`any`) / suppress事件参数（`any`）
     */
    blur(suppressEvent = false): void {
        this._blurEvent(suppressEvent);
    }

    /**
     * Executes `setSize` to handle set size.
     * @zh 执行 `setSize`，用于集合尺寸。
     * @param width - width parameter (`number`) / 宽度参数（`number`）
     * @param height - height parameter (`number`) / 高度参数（`number`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    setSize(width: number, height: number): boolean {
        let ancestorItem: ContentItem | null = this._parent;
        if (ancestorItem.isColumn || ancestorItem.isRow || ancestorItem.parent === null) {
            throw new AssertError('ICSSPRC', 'ComponentContainer cannot have RowColumn Parent');
        } else {
            let ancestorChildItem: ContentItem;
            do {
                ancestorChildItem = ancestorItem;
                ancestorItem = ancestorItem.parent;
            } while (ancestorItem !== null && !ancestorItem.isColumn && !ancestorItem.isRow);

            if (ancestorItem === null) {
                // no Row or Column found
                return false;
            } else {
                // ancestorItem is Row or Column
                const direction = ancestorItem.isColumn ? 'height' : 'width';
                const currentSize = this[direction];
                if (currentSize === null) {
                    throw new UnexpectedNullError('ICSSCS11194');
                } else {
                    const newSize = direction === 'height' ? height : width;

                    const totalPixel = currentSize * (1 / (ancestorChildItem.size / 100));
                    const percentage = (newSize / totalPixel) * 100;
                    const delta = (ancestorChildItem.size - percentage) / (ancestorItem.contentItems.length - 1);

                    for (let i = 0; i < ancestorItem.contentItems.length; i++) {
                        const ancestorItemContentItem = ancestorItem.contentItems[i];
                        if (ancestorItemContentItem === ancestorChildItem) {
                            ancestorItemContentItem.size = percentage;
                        } else {
                            ancestorItemContentItem.size += delta;
                        }
                    }

                    ancestorItem.updateSize(false);

                    return true;
                }
            }
        }
    }


    /**
     * Executes `close` to handle close.
     * @zh 执行 `close`，用于关闭。
     */
    close(): void {
        if (this._isClosable) {
            this.emit('close');
            this._parent.close();
        }
    }

    /**
     * Executes `replaceComponent` to handle replace component.
     * @zh 执行 `replaceComponent`，用于替换组件。
     * @param itemConfig - item config parameter (`ComponentItemConfig`) / 条目配置参数（`ComponentItemConfig`）
     */
    replaceComponent(itemConfig: ComponentItemConfig): void {
        this.releaseComponent();

        if (!ItemConfig.isComponent(itemConfig)) {
            throw new Error('ReplaceComponent not passed a component ItemConfig')
        } else {
            const config = ComponentItemConfig.resolve(this.translator,itemConfig, false);
            this._initialState = config.componentState;
            this._state = this._initialState;
            this._componentType = config.componentType;

            this._updateItemConfigEvent(config);

            this._boundComponent = this.layoutManager.bindComponent(this.translator,this, config);
            this.updateElementPositionPropertyFromBoundComponent();

            if (this._boundComponent.virtual) {
                if (this.virtualVisibilityChangeRequiredEvent !== undefined) {
                    this.virtualVisibilityChangeRequiredEvent(this, this._visible);
                }
                if (this.virtualRectingRequiredEvent !== undefined) {
                    this._layoutManager.fireBeforeVirtualRectingEvent(1);
                    try {
                        this.virtualRectingRequiredEvent(this, this._width, this._height);
                    } finally {
                        this._layoutManager.fireAfterVirtualRectingEvent();
                    }
                }
                this.setBaseLogicalZIndex();
            }

            this.emit('stateChanged');
        }
    }

    /**
     * Executes `getState` to handle get state.
     * @zh 执行 `getState`，用于获取状态。
     * @returns Result of type `JsonValue | undefined` / 类型为 `JsonValue | undefined` 的返回值
     */
    getState(): JsonValue | undefined {
        return this._state;
    }
    /**
     * Executes `extendState` to handle extend state.
     * @zh 执行 `extendState`，用于extend状态。
     * @param state - state parameter (`Record<string, unknown>`) / 状态参数（`Record<string, unknown>`）
     */
    extendState(state: Record<string, unknown>): void {
        const extendedState = deepExtend(this._state as Record<string, unknown>, state);
        this.setState(extendedState as JsonValue);
    }

 
    /**
     * Executes `setState` to handle set state.
     * @zh 执行 `setState`，用于集合状态。
     * @param state - state parameter (`JsonValue`) / 状态参数（`JsonValue`）
     */
    setState(state: JsonValue): void {
        this._state = state;
        this._parent.emitBaseBubblingEvent('stateChanged');
    }


    /**
     * Executes `setTitle` to handle set title.
     * @zh 执行 `setTitle`，用于集合标题。
     * @param title - title parameter (`string`) / 标题参数（`string`）
     */
    setTitle(title: string): void {
        this._parent.setTitle(title);
    }

    /**
     * Executes `setTab` to handle set tab.
     * @internal
     * @zh 执行 `setTab`，用于集合选项卡。
     */
    setTab(tab: Tab): void {
        this._tab = tab;
        this.emit('tab', tab)
    }

    /**
     * Executes `setVisibility` to handle set visibility.
     * @internal
     * @zh 执行 `setVisibility`，用于集合Visibility。
     */
    setVisibility(value: boolean): void {
        if (this._boundComponent.virtual) {
            if (this.virtualVisibilityChangeRequiredEvent !== undefined) {
                this.virtualVisibilityChangeRequiredEvent(this, value);
            }
        }

        if (value) {
            if (!this._visible) {
                this._visible = true;
                if (this._height === 0 && this._width === 0) {
                    this._isShownWithZeroDimensions = true;
                } else {
                    this._isShownWithZeroDimensions = false;
                    this.setSizeToNodeSize(this._width, this._height, true);
                    this.emitShow();
                }
            } else {
                if (this._isShownWithZeroDimensions && (this._height !== 0 || this._width !== 0)) {
                    this._isShownWithZeroDimensions = false;
                    this.setSizeToNodeSize(this._width, this._height, true);
                    this.emitShow();
                }
            }
        } else {
            if (this._visible) {
                this._visible = false;
                this._isShownWithZeroDimensions = false;
                this.emitHide();
            }
        }
    }

    /**
     * Executes `setBaseLogicalZIndex` to handle set base logical z index.
     * @zh 执行 `setBaseLogicalZIndex`，用于集合基础LogicalZ坐标索引。
     */
    setBaseLogicalZIndex(): void {
        this.setLogicalZIndex(LogicalZIndex.base);
    }

    /**
     * Executes `setLogicalZIndex` to handle set logical z index.
     * @zh 执行 `setLogicalZIndex`，用于集合LogicalZ坐标索引。
     * @param logicalZIndex - logical z index parameter (`LogicalZIndex`) / logicalZ坐标索引参数（`LogicalZIndex`）
     */
    setLogicalZIndex(logicalZIndex: LogicalZIndex): void {
        if (logicalZIndex !== this._logicalZIndex) {
            this._logicalZIndex = logicalZIndex;

            this.notifyVirtualZIndexChangeRequired();
        }
    }

    /**
     * Executes `enterDragMode` to handle enter drag mode.
     * @zh 执行 `enterDragMode`，用于进入拖拽模式。
     * @param width - width parameter (`number`) / 宽度参数（`number`）
     * @param height - height parameter (`number`) / 高度参数（`number`）
     */
    enterDragMode(width: number, height: number): void {
        this._width = width;
        this._height = height;
        setElementWidth(this._element, width);
        setElementHeight(this._element, height);

        this.setLogicalZIndex(LogicalZIndex.drag);

        this.drag();
    }

    /**
     * Executes `exitDragMode` to handle exit drag mode.
     * @internal
     * @zh 执行 `exitDragMode`，用于exit拖拽模式。
     */
    exitDragMode(): void {
        this.setBaseLogicalZIndex();
    }

    /**
     * Executes `enterStackMaximised` to handle enter stack maximised.
     * @internal
     * @zh 执行 `enterStackMaximised`，用于进入栈最大化。
     */
    enterStackMaximised(): void {
        this._stackMaximised = true;
        this.setLogicalZIndex(LogicalZIndex.stackMaximised);
    }

    /**
     * Executes `exitStackMaximised` to handle exit stack maximised.
     * @internal
     * @zh 执行 `exitStackMaximised`，用于exit栈最大化。
     */
    exitStackMaximised(): void {
        this.setBaseLogicalZIndex();
        this._stackMaximised = false;
    }

    /**
     * Executes `drag` to handle drag.
     * @internal
     * @zh 执行 `drag`，用于拖拽。
     */
    drag(): void {
        if (this._boundComponent.virtual) {
            if (this.virtualRectingRequiredEvent !== undefined) {
                this._layoutManager.fireBeforeVirtualRectingEvent(1);
                try {
                    this.virtualRectingRequiredEvent(this, this._width, this._height);
                } finally {
                    this._layoutManager.fireAfterVirtualRectingEvent();
                }
            }
        }
    }

    /**
     * Executes `setSizeToNodeSize` to handle set size to node size.
     * @zh 执行 `setSizeToNodeSize`，用于集合尺寸转换为节点尺寸。
     * @param width - width parameter (`number`) / 宽度参数（`number`）
     * @param height - height parameter (`number`) / 高度参数（`number`）
     * @param force - force parameter (`boolean`) / force参数（`boolean`）
     */
    setSizeToNodeSize(width: number, height: number, force: boolean): void {
        if (width !== this._width || height !== this._height || force) {
            this._width = width;
            this._height = height;
            setElementWidth(this._element, width);
            setElementHeight(this._element, height);

            if (this._boundComponent.virtual) {
                this.addVirtualSizedContainerToLayoutManager();
            } else {
                this.emit('resize');
                this.checkShownFromZeroDimensions();
            }
        }
    }

    /**
     * Executes `notifyVirtualRectingRequired` to handle notify virtual recting required.
     * @internal
     * @zh 执行 `notifyVirtualRectingRequired`，用于通知虚拟滚动矩形必填。
     */
    notifyVirtualRectingRequired(): void {
        if (this.virtualRectingRequiredEvent !== undefined) {
            this.virtualRectingRequiredEvent(this, this._width, this._height);
            this.emit('resize');
            this.checkShownFromZeroDimensions();
        }
    }

    /**
     * Executes `notifyVirtualZIndexChangeRequired` to handle notify virtual z index change required.
     * @internal
     * @zh 执行 `notifyVirtualZIndexChangeRequired`，用于通知虚拟滚动Z坐标索引变更必填。
     */
    private notifyVirtualZIndexChangeRequired(): void {
        if (this.virtualZIndexChangeRequiredEvent !== undefined) {
            const logicalZIndex = this._logicalZIndex;
            const defaultZIndex = LogicalZIndexToDefaultMap[logicalZIndex];
            this.virtualZIndexChangeRequiredEvent(this, logicalZIndex, defaultZIndex);
        }
    }

    /**
     * Executes `updateElementPositionPropertyFromBoundComponent` to handle update element position property from bound component.
     * @internal
     * @zh 执行 `updateElementPositionPropertyFromBoundComponent`，用于更新元素位置属性从已绑定组件。
     */
    private updateElementPositionPropertyFromBoundComponent() {
        if (this._boundComponent.virtual) {
            this._element.style.position = 'static';
        } else {
            this._element.style.position = ''; // set it back to attribute value
        }
    }

    /**
     * Executes `addVirtualSizedContainerToLayoutManager` to handle add virtual sized container to layout manager.
     * @internal
     * @zh 执行 `addVirtualSizedContainerToLayoutManager`，用于添加虚拟滚动已尺寸容器转换为布局管理器。
     */
    private addVirtualSizedContainerToLayoutManager() {
        this._layoutManager.beginVirtualSizedContainerAdding();
        try {
            this._layoutManager.addVirtualSizedContainer(this);
        } finally {
            this._layoutManager.endVirtualSizedContainerAdding();
        }
    }

    /**
     * Executes `checkShownFromZeroDimensions` to handle check shown from zero dimensions.
     * @internal
     * @zh 执行 `checkShownFromZeroDimensions`，用于检查已显示从Zero维度列表。
     */
    private checkShownFromZeroDimensions() {
        if (this._isShownWithZeroDimensions && (this._height !== 0 || this._width !== 0)) {
            this._isShownWithZeroDimensions = false;
            this.emitShow();
        }
    }

    /**
     * Executes `emitShow` to handle emit show.
     * @internal
     * @zh 执行 `emitShow`，用于发出显示。
     */
    private emitShow(): void {
        this.emit('shown');
        this.emit('show');
    }

    /**
     * Executes `emitHide` to handle emit hide.
     * @internal
     * @zh 执行 `emitHide`，用于发出隐藏。
     */
    private emitHide(): void {
        this.emit('hide');
    }

    /**
     * Executes `releaseComponent` to handle release component.
     * @internal
     * @zh 执行 `releaseComponent`，用于release组件。
     */
    private releaseComponent() {
        if (this._stackMaximised) {
            this.exitStackMaximised();
        }
        this.emit('beforeComponentRelease', this._boundComponent.component);
        this.layoutManager.unbindComponent(this, this._boundComponent.virtual, this._boundComponent.component);
    }
}

/**
 * @public @deprecated use {@link ComponentContainer}
 * @zh 类型别名 `ItemContainer`，表示条目容器（`ComponentContainer`）。
 */
export type ItemContainer = ComponentContainer;

/** @public */
export namespace ComponentContainer {
    /**
     * Type alias `Component` representing component (`unknown`).
     * @zh 类型别名 `Component`，表示组件（`unknown`）。
     */
    export type Component = unknown;

    /**
     * Interface `BindableComponent` defining the contract and properties for bindable component.
     * @zh 接口 `BindableComponent`，定义Bindable组件的数据结构契约与属性规范。
     */
    export interface BindableComponent {
        /**
         * Property `component` (`Component`) storing component.
         * @zh 属性 `component`（类型：`Component`），用于存储或配置组件。
         */
        component: Component;
        /**
         * Property `virtual` (`boolean`) storing virtual.
         * @zh 属性 `virtual`（类型：`boolean`），用于存储或配置虚拟滚动。
         */
        virtual: boolean;
    }

    /**
     * Type alias `StateRequestEventHandler` representing state request event handler (`(this: void) => JsonValue | undefined`).
     * @zh 类型别名 `StateRequestEventHandler`，表示状态请求事件处理器（`(this: void) => JsonValue | undefined`）。
     */
    export type StateRequestEventHandler = (this: void) => JsonValue | undefined;
    /**
     * Type alias `VirtualRectingRequiredEvent` representing virtual recting required event (`(this: void, container: ComponentContainer, width: number, height: num...`).
     * @zh 类型别名 `VirtualRectingRequiredEvent`，表示虚拟滚动矩形必填事件（`(this: void, container: ComponentContainer, width: number, height: num...`）。
     */
    export type VirtualRectingRequiredEvent = (this: void, container: ComponentContainer, width: number, height: number) => void;
    /**
     * Type alias `VirtualVisibilityChangeRequiredEvent` representing virtual visibility change required event (`(this: void, container: ComponentContainer, visible: boolean) => void`).
     * @zh 类型别名 `VirtualVisibilityChangeRequiredEvent`，表示虚拟滚动Visibility变更必填事件（`(this: void, container: ComponentContainer, visible: boolean) => void`）。
     */
    export type VirtualVisibilityChangeRequiredEvent = (this: void, container: ComponentContainer, visible: boolean) => void;
    /**
     * Type alias `VirtualZIndexChangeRequiredEvent` representing virtual z index change required event (`(this: void, container: ComponentContainer, logicalZIndex: LogicalZInd...`).
     * @zh 类型别名 `VirtualZIndexChangeRequiredEvent`，表示虚拟滚动Z坐标索引变更必填事件（`(this: void, container: ComponentContainer, logicalZIndex: LogicalZInd...`）。
     */
    export type VirtualZIndexChangeRequiredEvent =
        (this: void, container: ComponentContainer, logicalZIndex: LogicalZIndex, defaultZIndex: string) => void;
    /**
     * Type alias `ShowEventHandler` representing show event handler (`(this: void) => void`).
     * @internal
     * @zh 类型别名 `ShowEventHandler`，表示显示事件处理器（`(this: void) => void`）。
     */
    export type ShowEventHandler = (this: void) => void;
    /**
     * Type alias `HideEventHandler` representing hide event handler (`(this: void) => void`).
     * @internal
     * @zh 类型别名 `HideEventHandler`，表示隐藏事件处理器（`(this: void) => void`）。
     */
    export type HideEventHandler = (this: void) => void;
    /**
     * Type alias `FocusEventHandler` representing focus event handler (`(this: void, suppressEvent: boolean) => void`).
     * @internal
     * @zh 类型别名 `FocusEventHandler`，表示聚焦事件处理器（`(this: void, suppressEvent: boolean) => void`）。
     */
    export type FocusEventHandler = (this: void, suppressEvent: boolean) => void;
    /**
     * Type alias `BlurEventHandler` representing blur event handler (`(this: void, suppressEvent: boolean) => void`).
     * @internal
     * @zh 类型别名 `BlurEventHandler`，表示失焦事件处理器（`(this: void, suppressEvent: boolean) => void`）。
     */
    export type BlurEventHandler = (this: void, suppressEvent: boolean) => void;
    /**
     * Type alias `UpdateItemConfigEventHandler` representing update item config event handler (`(itemConfig: ResolvedComponentItemConfig) => void`).
     * @internal
     * @zh 类型别名 `UpdateItemConfigEventHandler`，表示更新条目配置事件处理器（`(itemConfig: ResolvedComponentItemConfig) => void`）。
     */
    export type UpdateItemConfigEventHandler = (itemConfig: ResolvedComponentItemConfig) => void;
}
