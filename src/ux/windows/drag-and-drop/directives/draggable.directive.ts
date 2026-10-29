/**
 * @fileoverview Module `src/ux/windows/drag-and-drop/directives/draggable.directive.ts` providing draggable directive definitions and implementation.
 * @zh 模块文件 `src/ux/windows/drag-and-drop/directives/draggable.directive.ts`，提供是否可拖拽指令相关的定义与实现。
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
import { Observable, ReplaySubject } from 'rxjs';
import { ɵPointerHelper } from '../../core/helpers/pointer.helper';

import { ɵBaseDragStrategyImpl, ɵDraggerConfigModel, ɵDragStrategyFactory } from '../classes';
import { ɵDraggerCssClassEnum as CssClass } from '../enums';
import { DraggerConfig, DragInfo } from '../interfaces';

/**
 * Makes HTML element draggable by mouse
 * @zh Angular 指令 `DraggableDirective`（selector: '[osDraggable]'），为宿主 DOM 元素附加是否可拖拽指令行为。
 */
@Directive({
    selector: '[osDraggable]'
})
export class DraggableDirective implements OnChanges, AfterViewInit, OnDestroy {
    /**
     * Configuration of dragging
     * @zh 输入属性 `osDraggable`（类型：`DraggerConfig | undefined | ''`），用于配置参数列表。
     */
    @Input('osDraggable')
    public parameters: DraggerConfig | undefined | '' ;

    /**
     * Fires when the draggable element init
     * @zh 输出事件 `osDraggableElementInit`（类型：`EventEmitter<HTMLElement>`），当触发os是否可拖拽元素初始化时向外发出事件。
     */
    @Output()
    public osDraggableElementInit: EventEmitter<HTMLElement> = new EventEmitter();

    /**
     * Fires when the movable element init
     * @zh 输出事件 `osMovableElementInit`（类型：`EventEmitter<HTMLElement>`），当触发os是否可移动元素初始化时向外发出事件。
     */
    @Output()
    public osMovableElementInit: EventEmitter<HTMLElement> = new EventEmitter();

    /**
     * Fires when calls mousedown handler over draggableElement
     * @zh 输出事件 `osDragStart`（类型：`EventEmitter<DragInfo>`），当触发os拖拽开始时向外发出事件。
     */
    @Output()
    public osDragStart: EventEmitter<DragInfo> = new EventEmitter();

    /**
     * Fires when the `mousemove` is called
     * @zh 输出事件 `osDragging`（类型：`EventEmitter<DragInfo>`），当触发os拖拽中时向外发出事件。
     */
    @Output()
    public osDragging: EventEmitter<DragInfo> = new EventEmitter();

    /**
     * Fires when the `mouseup` is called and after all internal handlers removed
     * @zh 输出事件 `osDragEnd`（类型：`EventEmitter<DragInfo>`），当触发os拖拽结束时向外发出事件。
     */
    @Output()
    public osDragEnd: EventEmitter<DragInfo> = new EventEmitter();

    /**
     * Target draggable HTML element
     * @zh 获取当前是否可拖拽元素（`draggableElement: HTMLElement`）。
     */
    public get draggableElement(): HTMLElement {
        return this._draggableElement;
    }

    /**
     * Target movable HTML element
     * @zh 获取当前是否可移动元素（`movableElement: HTMLElement`）。
     */
    public get movableElement(): HTMLElement {
        return this._movableElement;
    }

    /**
     * Target dragging strategy
     * @zh 获取当前策略（`strategy: ɵBaseDragStrategyImpl`）。
     */
    public get strategy(): ɵBaseDragStrategyImpl {
        return this._strategy;
    }

    /**
     * Configuration of dragging
     * @zh 获取当前配置（`config: DraggerConfig`）。
     */
    public get config(): DraggerConfig {
        return this._config;
    }

    /**
     * Gets the current when view init (`whenViewInit$: Observable<unknown>`).
     * @internal
     * @zh 获取当前when视图初始化（`whenViewInit$: Observable<unknown>`）。
     */
    public get whenViewInit$(): Observable<unknown> {
        return this._whenViewInit$.asObservable();
    }

    /**
     * Property `_draggableElement` (`HTMLElement`) storing draggable element.
     * @zh 属性 `_draggableElement`（类型：`HTMLElement`），用于存储或配置是否可拖拽元素。
     */
    private _draggableElement: HTMLElement;
    /**
     * Property `_movableElement` (`HTMLElement`) storing movable element.
     * @zh 属性 `_movableElement`（类型：`HTMLElement`），用于存储或配置是否可移动元素。
     */
    private _movableElement: HTMLElement;
    /**
     * Property `_strategy` (`ɵBaseDragStrategyImpl`) storing strategy.
     * @zh 属性 `_strategy`（类型：`ɵBaseDragStrategyImpl`），用于存储或配置策略。
     */
    private _strategy: ɵBaseDragStrategyImpl;
    /**
     * Property `_config` (`ɵDraggerConfigModel`) storing config (default: `new ɵDraggerConfigModel()`).
     * @zh 属性 `_config`（类型：`ɵDraggerConfigModel`），用于存储或配置配置（默认值：`new ɵDraggerConfigModel()`）。
     */
    private _config = new ɵDraggerConfigModel();
    /**
     * Property `_whenViewInit$` (`ReplaySubject<unknown>`) storing when view init (default: `new ReplaySubject()`).
     * @zh 属性 `_whenViewInit$`（类型：`ReplaySubject<unknown>`），用于存储或配置when视图初始化（默认值：`new ReplaySubject()`）。
     */
    private _whenViewInit$ = new ReplaySubject();

    /**
     * Creates an instance of `DraggableDirective` and initializes its dependencies and internal state.
     * @zh 创建 `DraggableDirective` 实例，并初始化其依赖项与内部状态。
     * @param document - Injected or initial document (`Document`) / 注入或传入的文档对象（`Document`）
     * @param hostRef - Injected or initial host ref (`ElementRef<HTMLElement>`) / 注入或传入的宿主引用（`ElementRef<HTMLElement>`）
     */
    constructor(
        @Inject(DOCUMENT) private readonly document: Document,
        private readonly hostRef: ElementRef<HTMLElement>
    ) {}

    /**
     * Angular lifecycle hook invoked when data-bound input properties change.
     * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
     */
    public ngOnChanges(): void {
        this.update();
    }

    /**
     * Angular lifecycle hook invoked once after the component's view and child views are initialized.
     * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
     */
    public ngAfterViewInit(): void {
        this._whenViewInit$.next(undefined);
    }

    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    public ngOnDestroy(): void {
        this._draggableElement?.removeEventListener('mousedown', this.onPointerDown);
        this._draggableElement?.removeEventListener('touchstart', this.onPointerDown);
        this._draggableElement?.removeEventListener('touchmove', this.onPointerMove);
        this._draggableElement?.removeEventListener('touchend', this.onPointerUp);
        this.document.removeEventListener('mousemove', this.onPointerMove);
        this.document.removeEventListener('mouseup', this.onPointerUp);
        this._whenViewInit$.complete();
    }

    /**
     * Updates config without affecting any logic, like some internal initialization of different things
     * @zh 执行 `updateConfigWithoutChanges`，用于更新配置不含变更集合。
     */
    public updateConfigWithoutChanges(config: DraggerConfig): void {
        this._config = { ...this._config, ...config };
    }

    /**
     * Executes `update` to handle update.
     * @zh 执行 `update`，用于更新。
     */
    private update(): void {
        this.updateConfigWithoutChanges(this.parameters as DraggerConfig);
        this.initMovableElement();
        this.initDraggableElement();
        this.initStrategy();
    }

    /**
     * Executes `updateMovableElementPosition` to handle update movable element position.
     * @zh 执行 `updateMovableElementPosition`，用于更新是否可移动元素位置。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     */
    private updateMovableElementPosition(event: PointerEvent | TouchEvent): void {
        if (this._movableElement && this.config.isAllowMoveElement) {
          let x= ɵPointerHelper.getClientX(event);
          let y=ɵPointerHelper.getClientY(event);
          if(x<0||y<0||x>this.config.maxX||y>this.config.maxY){
            return;
          }else{
            this._strategy.updateElementPosition(event);
          }
        }
    }

    /**
     * Executes `initStrategy` to handle init strategy.
     * @zh 执行 `initStrategy`，用于初始化策略。
     */
    private initStrategy(): void {
        if (ɵDragStrategyFactory.isDifferent(this._config.strategy, this)) {
            this._strategy = ɵDragStrategyFactory.create(this._config.strategy, this);
        }
    }

    /**
     * Executes `initDraggableElement` to handle init draggable element.
     * @zh 执行 `initDraggableElement`，用于初始化是否可拖拽元素。
     */
    private initDraggableElement(): void {
        this._draggableElement?.removeEventListener('mousedown', this.onPointerDown);
        this._draggableElement?.removeEventListener('touchstart', this.onPointerDown);
        this._draggableElement?.classList.remove(CssClass.Draggable);

        this._draggableElement = (this.config?.draggableElement ?? this.hostRef.nativeElement);

        this._draggableElement?.classList.add(CssClass.Draggable);
        this._draggableElement.addEventListener('mousedown', this.onPointerDown);
        this._draggableElement.addEventListener('touchstart', this.onPointerDown);
        this.osDraggableElementInit.emit(this._draggableElement);
    }

    /**
     * Executes `initMovableElement` to handle init movable element.
     * @zh 执行 `initMovableElement`，用于初始化是否可移动元素。
     */
    private initMovableElement(): void {
        this._movableElement?.classList.remove(CssClass.Movable);

        this._movableElement = this.config?.movableElement ?? this.hostRef.nativeElement;

        this._movableElement?.classList.add(CssClass.Movable);
        this.osMovableElementInit.emit(this._movableElement);
    }

    /**
     * Property `onPointerDown` (`(event: any) => void`) storing on pointer down.
     * @zh 属性 `onPointerDown`（类型：`(event: any) => void`），用于存储或配置当指针向下。
     */
    private readonly onPointerDown = (event): void => {
        if (!this.isDragAllowed(event)) {
            return;
        }

        const dragInfo = this.getDragInfo(event);

        event.preventDefault();
        this.osDragStart.emit(dragInfo);
        this._movableElement.classList.add(CssClass.Dragging);
        this._strategy.registerMouseDown(dragInfo);
        this._draggableElement.addEventListener('touchmove', this.onPointerMove);
        this._draggableElement.addEventListener('touchend', this.onPointerUp);
        this.document.addEventListener('mousemove', this.onPointerMove);
        this.document.addEventListener('mouseup', this.onPointerUp);
    };

    /**
     * Property `onPointerMove` (`(event: any) => void`) storing on pointer move.
     * @zh 属性 `onPointerMove`（类型：`(event: any) => void`），用于存储或配置当指针移动。
     */
    private readonly onPointerMove = (event): void => {
        const dragInfo = this.getDragInfo(event);

        event.preventDefault();

        if (this.config.mouseMoveHandler) {
            this.config.mouseMoveHandler(dragInfo);
        } else {
            this.updateMovableElementPosition(event);
        }

        this.osDragging.emit(this.getDragInfo(event));
    };

    /**
     * Property `onPointerUp` (`(event: any) => void`) storing on pointer up.
     * @zh 属性 `onPointerUp`（类型：`(event: any) => void`），用于存储或配置当指针向上。
     */
    private readonly onPointerUp = (event): void => {
        event.preventDefault();
        this._movableElement.classList.remove(CssClass.Dragging);
        this._draggableElement.removeEventListener('touchmove', this.onPointerMove);
        this._draggableElement.removeEventListener('touchend', this.onPointerUp);
        this.document.removeEventListener('mousemove', this.onPointerMove);
        this.document.removeEventListener('mouseup', this.onPointerUp);
        this.osDragEnd.emit(this.getDragInfo(event));
    };

    /**
     * Executes `getDragInfo` to handle get drag info.
     * @zh 执行 `getDragInfo`，用于获取拖拽信息。
     * @param originalEvent - original event parameter (`PointerEvent | TouchEvent`) / 原始事件参数（`PointerEvent | TouchEvent`）
     * @returns Result of type `DragInfo` / 类型为 `DragInfo` 的返回值
     */
    private getDragInfo(originalEvent: PointerEvent | TouchEvent): DragInfo {
        return {
            movableElement: this._movableElement,
            originalEvent
        };
    }

    /**
     * Executes `isDragAllowed` to handle is drag allowed.
     * @zh 执行 `isDragAllowed`，用于是否为拖拽允许的。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    private isDragAllowed(event: PointerEvent | TouchEvent): boolean {
        const isMouseButtonAvailable = ɵPointerHelper.isPointerEvent(event) ?
            this.config.allowedMouseButtons?.includes(event.button) :
            (event.touches.length === 1);

        return (
            this.config.isEnabled &&
            isMouseButtonAvailable &&
            !this.config.childElementsBlackList?.includes(event.target as HTMLElement)
        );
    }
}
