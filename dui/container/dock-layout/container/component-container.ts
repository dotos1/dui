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

/** @public */
export class ComponentContainer extends EventEmitter {
    /** @internal */
    private _componentType: JsonValue;
    /** @internal */
    private _boundComponent: ComponentContainer.BindableComponent;
    /** @internal */
    private _width: number;
    /** @internal */
    private _height: number;
    /** @internal */
    private _isClosable;
    /** @internal */
    private _initialState: JsonValue | undefined;
    /** @internal */
    private _state: JsonValue | undefined;
    /** @internal */
    private _visible;
    /** @internal */
    private _isShownWithZeroDimensions;
    /** @internal */
    private _tab: Tab;
    /** @internal */
    private _stackMaximised = false;
    /** @internal */
    private _logicalZIndex: LogicalZIndex;

    stateRequestEvent: ComponentContainer.StateRequestEventHandler | undefined;
    virtualRectingRequiredEvent: ComponentContainer.VirtualRectingRequiredEvent | undefined;
    virtualVisibilityChangeRequiredEvent: ComponentContainer.VirtualVisibilityChangeRequiredEvent | undefined;
    virtualZIndexChangeRequiredEvent: ComponentContainer.VirtualZIndexChangeRequiredEvent | undefined;

    get width(): number { return this._width; }
    get height(): number { return this._height; }
    get parent(): ComponentItem { return this._parent; }
    /** @internal @deprecated use {@link (ComponentContainer:class).componentType} */
    get componentName(): JsonValue { return this._componentType; }
    get componentType(): JsonValue { return this._componentType; }
    get virtual(): boolean { return this._boundComponent.virtual; }
    get component(): ComponentContainer.Component { return this._boundComponent.component; }
    get tab(): Tab { return this._tab; }
    get title(): string { return this._parent.title; }
    get layoutManager(): LayoutManager { return this._layoutManager; }
    get isHidden(): boolean { return !this._visible; }
    get visible(): boolean { return this._visible; }
    get state(): JsonValue | undefined { return this._state; }
    /** Return the initial component state */
    get initialState(): JsonValue | undefined { return this._initialState; }
    /** The inner DOM element where the container's content is intended to live in */
    get element(): HTMLElement { return this._element; }

    /** @internal */
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

    /** @internal */
    destroy(): void {
        this.releaseComponent();
        this.stateRequestEvent = undefined;
        this.emit('destroy');
    }

    /** @deprecated use {@link (ComponentContainer:class).element } */
    getElement(): HTMLElement {
        return this._element;
    }

    /**
     * Hides the container's component item (and hence, the container) if not already hidden.
     * Emits hide event prior to hiding the container.
     */
    hide(): void {
        this._hideEvent();
    }


    show(): void {
        this._showEvent();
    }

    focus(suppressEvent = false): void {
        this._focusEvent(suppressEvent);
    }

    blur(suppressEvent = false): void {
        this._blurEvent(suppressEvent);
    }

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


    close(): void {
        if (this._isClosable) {
            this.emit('close');
            this._parent.close();
        }
    }

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

    getState(): JsonValue | undefined {
        return this._state;
    }
    extendState(state: Record<string, unknown>): void {
        const extendedState = deepExtend(this._state as Record<string, unknown>, state);
        this.setState(extendedState as JsonValue);
    }

 
    setState(state: JsonValue): void {
        this._state = state;
        this._parent.emitBaseBubblingEvent('stateChanged');
    }


    setTitle(title: string): void {
        this._parent.setTitle(title);
    }

    /** @internal */
    setTab(tab: Tab): void {
        this._tab = tab;
        this.emit('tab', tab)
    }

    /** @internal */
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

    setBaseLogicalZIndex(): void {
        this.setLogicalZIndex(LogicalZIndex.base);
    }

    setLogicalZIndex(logicalZIndex: LogicalZIndex): void {
        if (logicalZIndex !== this._logicalZIndex) {
            this._logicalZIndex = logicalZIndex;

            this.notifyVirtualZIndexChangeRequired();
        }
    }

    enterDragMode(width: number, height: number): void {
        this._width = width;
        this._height = height;
        setElementWidth(this._element, width);
        setElementHeight(this._element, height);

        this.setLogicalZIndex(LogicalZIndex.drag);

        this.drag();
    }

    /** @internal */
    exitDragMode(): void {
        this.setBaseLogicalZIndex();
    }

    /** @internal */
    enterStackMaximised(): void {
        this._stackMaximised = true;
        this.setLogicalZIndex(LogicalZIndex.stackMaximised);
    }

    /** @internal */
    exitStackMaximised(): void {
        this.setBaseLogicalZIndex();
        this._stackMaximised = false;
    }

    /** @internal */
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

    /** @internal */
    notifyVirtualRectingRequired(): void {
        if (this.virtualRectingRequiredEvent !== undefined) {
            this.virtualRectingRequiredEvent(this, this._width, this._height);
            this.emit('resize');
            this.checkShownFromZeroDimensions();
        }
    }

    /** @internal */
    private notifyVirtualZIndexChangeRequired(): void {
        if (this.virtualZIndexChangeRequiredEvent !== undefined) {
            const logicalZIndex = this._logicalZIndex;
            const defaultZIndex = LogicalZIndexToDefaultMap[logicalZIndex];
            this.virtualZIndexChangeRequiredEvent(this, logicalZIndex, defaultZIndex);
        }
    }

    /** @internal */
    private updateElementPositionPropertyFromBoundComponent() {
        if (this._boundComponent.virtual) {
            this._element.style.position = 'static';
        } else {
            this._element.style.position = ''; // set it back to attribute value
        }
    }

    /** @internal */
    private addVirtualSizedContainerToLayoutManager() {
        this._layoutManager.beginVirtualSizedContainerAdding();
        try {
            this._layoutManager.addVirtualSizedContainer(this);
        } finally {
            this._layoutManager.endVirtualSizedContainerAdding();
        }
    }

    /** @internal */
    private checkShownFromZeroDimensions() {
        if (this._isShownWithZeroDimensions && (this._height !== 0 || this._width !== 0)) {
            this._isShownWithZeroDimensions = false;
            this.emitShow();
        }
    }

    /** @internal */
    private emitShow(): void {
        this.emit('shown');
        this.emit('show');
    }

    /** @internal */
    private emitHide(): void {
        this.emit('hide');
    }

    /** @internal */
    private releaseComponent() {
        if (this._stackMaximised) {
            this.exitStackMaximised();
        }
        this.emit('beforeComponentRelease', this._boundComponent.component);
        this.layoutManager.unbindComponent(this, this._boundComponent.virtual, this._boundComponent.component);
    }
}

/** @public @deprecated use {@link ComponentContainer} */
export type ItemContainer = ComponentContainer;

/** @public */
export namespace ComponentContainer {
    export type Component = unknown;

    export interface BindableComponent {
        component: Component;
        virtual: boolean;
    }

    export type StateRequestEventHandler = (this: void) => JsonValue | undefined;
    export type VirtualRectingRequiredEvent = (this: void, container: ComponentContainer, width: number, height: number) => void;
    export type VirtualVisibilityChangeRequiredEvent = (this: void, container: ComponentContainer, visible: boolean) => void;
    export type VirtualZIndexChangeRequiredEvent =
        (this: void, container: ComponentContainer, logicalZIndex: LogicalZIndex, defaultZIndex: string) => void;
    /** @internal */
    export type ShowEventHandler = (this: void) => void;
    /** @internal */
    export type HideEventHandler = (this: void) => void;
    /** @internal */
    export type FocusEventHandler = (this: void, suppressEvent: boolean) => void;
    /** @internal */
    export type BlurEventHandler = (this: void, suppressEvent: boolean) => void;
    /** @internal */
    export type UpdateItemConfigEventHandler = (itemConfig: ResolvedComponentItemConfig) => void;
}
