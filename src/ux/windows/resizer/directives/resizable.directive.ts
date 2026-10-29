/**
 * @fileoverview Module `src/ux/windows/resizer/directives/resizable.directive.ts` providing resizable directive definitions and implementation.
 * @zh 模块文件 `src/ux/windows/resizer/directives/resizable.directive.ts`，提供是否可调尺寸指令相关的定义与实现。
 */

import { DOCUMENT } from '@angular/common';
import {
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    Output
} from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ɵCommonCssClassEnum } from '../../core/enums';
import { ɵPointerHelper } from '../../core/helpers';

import { ɵBaseResizer, ɵResizerConfigModel, ɵResizerFactory } from '../classes';
import { ɵRESIZERS_ARRAY } from '../data';
import {
    ResizerEnum, ɵResizerCssClassEnum as CssClass, ɵResizerElementTagEnum as ElementTag
} from '../enums';
import { ResizeInfo, ResizerConfig } from '../interfaces';

/**
 * Angular directive `ResizableDirective` (selector: '[osResizable]') attaching resizable directive behavior to host DOM elements.
 * @zh Angular 指令 `ResizableDirective`（selector: '[osResizable]'），为宿主 DOM 元素附加是否可调尺寸指令行为。
 */
@Directive({
    selector: '[osResizable]',
    providers: [
        ɵResizerFactory
    ]
})
export class ResizableDirective implements OnChanges, AfterViewInit, OnDestroy {
    /**
     * Configuration of resizing
     * @zh 输入属性 `osResizable`（类型：`ResizerConfig | undefined | ''`），用于配置参数列表。
     */
    @Input('osResizable')
    public parameters: ResizerConfig | undefined | '';

    /**
     * Fires when the resizable element init
     * @zh 输出事件 `osResizableElementInit`（类型：`EventEmitter<HTMLElement>`），当触发os是否可调尺寸元素初始化时向外发出事件。
     */
    @Output()
    public osResizableElementInit: EventEmitter<HTMLElement> = new EventEmitter();

    /**
     * Fires when the resizers wrapper element init
     * @zh 输出事件 `osResizersWrapperElementInit`（类型：`EventEmitter<HTMLElement>`），当触发os尺寸调整器包装器元素初始化时向外发出事件。
     */
    @Output()
    public osResizersWrapperElementInit: EventEmitter<HTMLElement> = new EventEmitter();

    /**
     * Fires when calls mousedown handler over resizableElement
     * @zh 输出事件 `osResizeStart`（类型：`EventEmitter<ResizeInfo>`），当触发os调整尺寸开始时向外发出事件。
     */
    @Output()
    public osResizeStart: EventEmitter<ResizeInfo> = new EventEmitter();

    /**
     * Fires when the `mousemove` is called
     * @zh 输出事件 `osResizing`（类型：`EventEmitter<ResizeInfo>`），当触发os调整尺寸中时向外发出事件。
     */
    @Output()
    public osResizing: EventEmitter<ResizeInfo> = new EventEmitter();

    /**
     * Fires when the `mouseup` is called and after all internal handlers removed
     * @zh 输出事件 `osResizeEnd`（类型：`EventEmitter<ResizeInfo>`），当触发os调整尺寸结束时向外发出事件。
     */
    @Output()
    public osResizeEnd: EventEmitter<ResizeInfo> = new EventEmitter();

    /**
     * Target resizable HTML element
     * @zh 获取当前是否可调尺寸元素（`resizableElement: HTMLElement`）。
     */
    public get resizableElement(): HTMLElement {
        return this._resizableElement;
    }

    /**
     * Target resizer
     * @zh 获取当前尺寸调整器（`resizer: ɵBaseResizer`）。
     */
    public get resizer(): ɵBaseResizer {
        return this._resizer;
    }

    /**
     * Configuration of resizing
     * @zh 获取当前配置（`config: ɵResizerConfigModel`）。
     */
    public get config(): ɵResizerConfigModel {
        return this._config;
    }

    /**
     * Property `_resizableElement` (`HTMLElement`) storing resizable element.
     * @zh 属性 `_resizableElement`（类型：`HTMLElement`），用于存储或配置是否可调尺寸元素。
     */
    private _resizableElement: HTMLElement;
    /**
     * Property `_resizersWrapperElement` (`HTMLElement`) storing resizers wrapper element.
     * @zh 属性 `_resizersWrapperElement`（类型：`HTMLElement`），用于存储或配置尺寸调整器包装器元素。
     */
    private _resizersWrapperElement: HTMLElement;
    /**
     * Property `_resizer` (`ɵBaseResizer`) storing resizer.
     * @zh 属性 `_resizer`（类型：`ɵBaseResizer`），用于存储或配置尺寸调整器。
     */
    private _resizer: ɵBaseResizer;
    /**
     * Property `_config` (`ɵResizerConfigModel`) storing config (default: `new ɵResizerConfigModel()`).
     * @zh 属性 `_config`（类型：`ɵResizerConfigModel`），用于存储或配置配置（默认值：`new ɵResizerConfigModel()`）。
     */
    private _config = new ɵResizerConfigModel();
    /**
     * Property `_whenViewInit$` (`ReplaySubject<unknown>`) storing when view init (default: `new ReplaySubject()`).
     * @zh 属性 `_whenViewInit$`（类型：`ReplaySubject<unknown>`），用于存储或配置when视图初始化（默认值：`new ReplaySubject()`）。
     */
    private _whenViewInit$ = new ReplaySubject();

    /**
     * Creates an instance of `ResizableDirective` and initializes its dependencies and internal state.
     * @zh 创建 `ResizableDirective` 实例，并初始化其依赖项与内部状态。
     * @param document - Injected or initial document (`Document`) / 注入或传入的文档对象（`Document`）
     * @param hostRef - Injected or initial host ref (`ElementRef<HTMLElement>`) / 注入或传入的宿主引用（`ElementRef<HTMLElement>`）
     * @param resizerFactory - Injected or initial resizer factory (`ɵResizerFactory`) / 注入或传入的尺寸调整器工厂（`ɵResizerFactory`）
     */
    constructor(
        @Inject(DOCUMENT) private readonly document: Document,
        private readonly hostRef: ElementRef<HTMLElement>,
        private readonly resizerFactory: ɵResizerFactory
    ) {}

    /**
     * Angular lifecycle hook invoked when data-bound input properties change.
     * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
     */
    public ngOnChanges(): void {
        this.updateConfigWithoutChanges(this.parameters as ResizerConfig);
        this.onConfigChanged();
    }

    /**
     * Angular lifecycle hook invoked once after the component's view and child views are initialized.
     * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
     */
    public ngAfterViewInit(): void {
        this.initResizersWrapperElement();
        this._whenViewInit$.next(true);
    }

    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    public ngOnDestroy(): void {
        this.document.removeEventListener('mousemove', this.onPointerMove);
        this.document.removeEventListener('mouseup', this.onPointerUp);
        this._whenViewInit$.complete();
    }

    /**
     * Updates config without affecting any logic, like some internal initialization of different things
     * @zh 执行 `updateConfigWithoutChanges`，用于更新配置不含变更集合。
     */
    public updateConfigWithoutChanges(config: ResizerConfig): void {
        this._config = { ...this._config, ...config };
    }

    /**
     * Executes `onConfigChanged` to handle on config changed.
     * @zh 执行 `onConfigChanged`，用于当配置已变更。
     */
    private onConfigChanged(): void {
        this._whenViewInit$
            .pipe(first())
            .subscribe(() => {
                this.initResizableElement();
                this.updateResizersWrapperDomPlacement();
                this.updateResizersWrapperActivity();
                this.initResizerElements();
            });
    }

    /**
     * Executes `initResizableElement` to handle init resizable element.
     * @zh 执行 `initResizableElement`，用于初始化是否可调尺寸元素。
     */
    private initResizableElement(): void {
        this._resizableElement?.classList.remove(CssClass.Resizable);

        this._resizableElement = this.config?.targetElement ?? this.hostRef.nativeElement;

        this._resizableElement?.classList.add(CssClass.Resizable);
        this.osResizableElementInit.emit(this._resizableElement);
    }

    /**
     * Executes `initResizersWrapperElement` to handle init resizers wrapper element.
     * @zh 执行 `initResizersWrapperElement`，用于初始化尺寸调整器包装器元素。
     */
    private initResizersWrapperElement(): void {
        this._resizersWrapperElement = this.document.createElement(ElementTag.Resizers);

        this.osResizersWrapperElementInit.emit(this._resizersWrapperElement);
    }

    /**
     * Executes `initResizerElements` to handle init resizer elements.
     * @zh 执行 `initResizerElements`，用于初始化尺寸调整器元素列表。
     */
    private initResizerElements(): void {
        ɵRESIZERS_ARRAY.forEach((resizer) => {
            const targetExisting = this._resizersWrapperElement.querySelector(`.${resizer}`);
            const isTargetAllowed = this.config.allowedResizers.includes(resizer);

            if (targetExisting && !isTargetAllowed) {
                // If target (already existing) resizer became forbidden
                this._resizersWrapperElement.removeChild(targetExisting);
            } else if (!targetExisting && isTargetAllowed) {
                // If target resizer absent but became allowed
                this.createResizer(resizer);
            }
        });
    }

    /**
     * Executes `createResizer` to handle create resizer.
     * @zh 执行 `createResizer`，用于创建尺寸调整器。
     * @param resizer - resizer parameter (`ResizerEnum`) / 尺寸调整器参数（`ResizerEnum`）
     */
    private createResizer(resizer: ResizerEnum): void {
        const resizerElement = this.document.createElement(ElementTag.Resizer);

        const pointerDownHandler = (event): void => {
            this.onPointerDown(event, resizer);
        };

        resizerElement.classList.add(resizer);
        resizerElement.addEventListener('mousedown', pointerDownHandler);
        resizerElement.addEventListener('touchstart', pointerDownHandler);
        resizerElement.addEventListener('touchmove', this.onPointerMove, { passive: false });
        resizerElement.addEventListener('touchend', this.onPointerUp);
        this._resizersWrapperElement.appendChild(resizerElement);
    }

    /**
     * Executes `updateResizersWrapperDomPlacement` to handle update resizers wrapper dom placement.
     * @zh 执行 `updateResizersWrapperDomPlacement`，用于更新尺寸调整器包装器DOM节点Placement。
     */
    private updateResizersWrapperDomPlacement(): void {
        if (
            this._resizersWrapperElement &&
            (this._resizersWrapperElement.parentElement !== this._resizableElement)
        ) {
            this._resizersWrapperElement.remove();

            this._resizableElement.appendChild(this._resizersWrapperElement);
        }
    }

    /**
     * Executes `updateResizersWrapperActivity` to handle update resizers wrapper activity.
     * @zh 执行 `updateResizersWrapperActivity`，用于更新尺寸调整器包装器Activity。
     */
    private updateResizersWrapperActivity(): void {
        const classList = this._resizersWrapperElement.classList;
        const action: keyof DOMTokenList = (this.config.isEnabled) ? 'add' : 'remove';
        classList[action](ɵCommonCssClassEnum.Active);
    }

    /**
     * Property `onPointerDown` (`(event: PointerEvent | TouchEvent, resizerId: ResizerEnum) => void`) storing on pointer down.
     * @zh 属性 `onPointerDown`（类型：`(event: PointerEvent | TouchEvent, resizerId: ResizerEnum) => void`），用于存储或配置当指针向下。
     */
    private readonly onPointerDown = (
        event: PointerEvent | TouchEvent,
        resizerId: ResizerEnum
    ): void => {
        if (!this.isResizeAllowed(event)) {
            return;
        }

        const resizeInfo = this.getResizeInfo(event);
        this._resizer = this.resizerFactory.create(resizerId, this);

        event.stopPropagation();
        this.osResizeStart.emit(resizeInfo);
        this._resizer.init(this._resizableElement, event);
        this._resizableElement.classList.add(CssClass.Resizing);
        this.document.addEventListener('mousemove', this.onPointerMove);
        this.document.addEventListener('mouseup', this.onPointerUp);
    }

    /**
     * Property `onPointerMove` (`(event: any) => void`) storing on pointer move.
     * @zh 属性 `onPointerMove`（类型：`(event: any) => void`），用于存储或配置当指针移动。
     */
    private readonly onPointerMove = (event): void => {
        const resizeInfo = this.getResizeInfo(event);

        if (this.config.mouseMoveHandler) {
            this.config.mouseMoveHandler(resizeInfo);
        } else {
            this._resizer.resizeElement(event);
        }

        event.stopPropagation();

        if (event.cancelable) {
            event.preventDefault();
        }
        this.osResizing.emit(resizeInfo);
    };

    /**
     * Property `onPointerUp` (`(event: any) => void`) storing on pointer up.
     * @zh 属性 `onPointerUp`（类型：`(event: any) => void`），用于存储或配置当指针向上。
     */
    private readonly onPointerUp = (event): void => {
        this._resizableElement.classList.remove(CssClass.Resizing);
        this.document.removeEventListener('mousemove', this.onPointerMove);
        // 复制粘贴笔误：这里应该是 removeEventListener，写成了 addEventListener，
        // 导致每次拖拽结束都在 document 上永久留一个 mouseup 监听
        this.document.removeEventListener('mouseup', this.onPointerUp);
        event.stopPropagation();
        this.osResizeEnd.emit(this.getResizeInfo(event));
    };

    /**
     * Executes `getResizeInfo` to handle get resize info.
     * @zh 执行 `getResizeInfo`，用于获取调整尺寸信息。
     * @param originalEvent - original event parameter (`PointerEvent | TouchEvent`) / 原始事件参数（`PointerEvent | TouchEvent`）
     * @returns Result of type `ResizeInfo` / 类型为 `ResizeInfo` 的返回值
     */
    private getResizeInfo(originalEvent: PointerEvent | TouchEvent): ResizeInfo {
        return {
            resizableElement: this._resizableElement,
            originalEvent
        };
    }

    /**
     * Executes `isResizeAllowed` to handle is resize allowed.
     * @zh 执行 `isResizeAllowed`，用于是否为调整尺寸允许的。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    private isResizeAllowed(event: PointerEvent | TouchEvent): boolean {
        const isMouseButtonAvailable = ɵPointerHelper.isPointerEvent(event) ?
            this.config.allowedMouseButtons?.includes(event.button) :
            (event.touches.length === 1);

        return (this.config.isEnabled && isMouseButtonAvailable);
    }
}
