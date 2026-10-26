/**
 * @fileoverview Module `src/ux/windows/window/classes/dynamic-window-ref.ts` providing dynamic window ref definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/classes/dynamic-window-ref.ts`，提供动态窗口引用相关的定义与实现。
 */

import { ComponentRef } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ɵIdGenerator } from '../../core/helpers/id-generator.helper';
import { DraggableDirective } from '../../drag-and-drop';
import { ResizableDirective } from '../../resizer';
import { ɵDynamicWindowComponent } from '../components';
import { DynamicWindowConfig, DynamicWindowRef } from '../interfaces';

/**
 * Class `ɵDynamicWindowRefModel` encapsulating ɵdynamic window ref model data structures and logic in `src/ux/windows/window/classes`.
 * @internal
 * @zh 类 `ɵDynamicWindowRefModel`，封装 `src/ux/windows/window/classes` 中的ɵDynamic窗口引用模型数据结构与处理逻辑。
 */
export class ɵDynamicWindowRefModel implements DynamicWindowRef {
    /**
     * Gets the current is hidden (`isHidden$: Observable<boolean>`).
     * @zh 获取当前是否为隐藏（`isHidden$: Observable<boolean>`）。
     */
    public get isHidden$(): Observable<boolean> {
        return this._isHidden$.asObservable();
    }

    /**
     * Gets the current is hidden (`isHidden: boolean`).
     * @zh 获取当前是否为隐藏（`isHidden: boolean`）。
     */
    public get isHidden(): boolean {
        return this._isHidden$.getValue();
    }

    /**
     * Gets the current before hidden (`beforeHidden$: Observable<unknown>`).
     * @zh 获取当前之前隐藏（`beforeHidden$: Observable<unknown>`）。
     */
    public get beforeHidden$(): Observable<unknown> {
        return this._beforeHidden$.asObservable();
    }

    /**
     * Gets the current is fullscreen (`isFullscreen$: Observable<boolean>`).
     * @zh 获取当前是否为全屏（`isFullscreen$: Observable<boolean>`）。
     */
    public get isFullscreen$(): Observable<boolean> {
        return this._isFullscreen$.asObservable();
    }

    /**
     * Gets the current is fullscreen (`isFullscreen: boolean`).
     * @zh 获取当前是否为全屏（`isFullscreen: boolean`）。
     */
    public get isFullscreen(): boolean {
        return this._isFullscreen$.getValue();
    }

    /**
     * Gets the current is active (`isActive$: Observable<boolean>`).
     * @zh 获取当前是否为激活（`isActive$: Observable<boolean>`）。
     */
    public get isActive$(): Observable<boolean> {
        return this._isActive$.asObservable();
    }

    /**
     * Gets the current is active (`isActive: boolean`).
     * @zh 获取当前是否为激活（`isActive: boolean`）。
     */
    public get isActive(): boolean {
        return this._isActive$.getValue();
    }

    /**
     * Gets the current order index (`orderIndex$: Observable<number>`).
     * @zh 获取当前顺序索引（`orderIndex$: Observable<number>`）。
     */
    public get orderIndex$(): Observable<number> {
        return this._orderIndex$.asObservable();
    }

    /**
     * Gets the current after closed (`afterClosed$: Observable<any>`).
     * @zh 获取当前之后是否关闭（`afterClosed$: Observable<any>`）。
     */
    public get afterClosed$() {
        return this._afterClosed$.asObservable();
    }

    /**
     * Gets the current config (`config$: Observable<DynamicWindowConfig>`).
     * @zh 获取当前配置（`config$: Observable<DynamicWindowConfig>`）。
     */
    public get config$(): Observable<DynamicWindowConfig> {
        return this._config$.asObservable();
    }

    /**
     * Gets the current config (`config: DynamicWindowConfig`).
     * @zh 获取当前配置（`config: DynamicWindowConfig`）。
     */
    public get config(): DynamicWindowConfig {
        return this._config$.getValue();
    }

    /**
     * Gets the current id (`id: string`).
     * @zh 获取当前唯一标识（`id: string`）。
     */
    public get id(): string {
        return this._id;
    }

    /**
     * Gets the current window element (`windowElement: HTMLElement`).
     * @zh 获取当前窗口元素（`windowElement: HTMLElement`）。
     */
    public get windowElement(): HTMLElement {
        return this._windowElement;
    }

    /**
     * Gets the current component ref (`componentRef: ComponentRef<ɵDynamicWindowComponent>`).
     * @zh 获取当前组件引用（`componentRef: ComponentRef<ɵDynamicWindowComponent>`）。
     */
    public get componentRef(): ComponentRef<ɵDynamicWindowComponent> {
        return this._componentRef;
    }

    /**
     * Gets the current draggable directive (`draggableDirective: DraggableDirective`).
     * @zh 获取当前是否可拖拽指令（`draggableDirective: DraggableDirective`）。
     */
    public get draggableDirective(): DraggableDirective {
        return this._draggableDirective;
    }

    /**
     * Gets the current resizable directive (`resizableDirective: ResizableDirective`).
     * @zh 获取当前是否可调尺寸指令（`resizableDirective: ResizableDirective`）。
     */
    public get resizableDirective(): ResizableDirective {
        return this._resizableDirective;
    }

    /**
     * Property `_config$` (`BehaviorSubject`) storing config.
     * @zh 属性 `_config$`（类型：`BehaviorSubject`），用于存储或配置配置。
     */
    private readonly _config$ = new BehaviorSubject<DynamicWindowConfig>({});
    /**
     * Property `_isHidden$` (`BehaviorSubject`) storing is hidden (default: `new BehaviorSubject<boolean>(false)`).
     * @zh 属性 `_isHidden$`（类型：`BehaviorSubject`），用于存储或配置是否为隐藏（默认值：`new BehaviorSubject<boolean>(false)`）。
     */
    private readonly _isHidden$ = new BehaviorSubject<boolean>(false);
    /**
     * Property `_isFullscreen$` (`BehaviorSubject`) storing is fullscreen (default: `new BehaviorSubject<boolean>(false)`).
     * @zh 属性 `_isFullscreen$`（类型：`BehaviorSubject`），用于存储或配置是否为全屏（默认值：`new BehaviorSubject<boolean>(false)`）。
     */
    private readonly _isFullscreen$ = new BehaviorSubject<boolean>(false);
    /**
     * Property `_isActive$` (`BehaviorSubject`) storing is active (default: `new BehaviorSubject<boolean>(true)`).
     * @zh 属性 `_isActive$`（类型：`BehaviorSubject`），用于存储或配置是否为激活（默认值：`new BehaviorSubject<boolean>(true)`）。
     */
    private readonly _isActive$ = new BehaviorSubject<boolean>(true);
    /**
     * Property `_orderIndex$` (`BehaviorSubject`) storing order index (default: `new BehaviorSubject<number>(0)`).
     * @zh 属性 `_orderIndex$`（类型：`BehaviorSubject`），用于存储或配置顺序索引（默认值：`new BehaviorSubject<number>(0)`）。
     */
    private readonly _orderIndex$ = new BehaviorSubject<number>(0);
    /**
     * Property `_beforeHidden$` (`Subject`) storing before hidden (default: `new Subject<unknown>()`).
     * @zh 属性 `_beforeHidden$`（类型：`Subject`），用于存储或配置之前隐藏（默认值：`new Subject<unknown>()`）。
     */
    private readonly _beforeHidden$ = new Subject<unknown>();
    /**
     * Property `_afterClosed$` (`Subject`) storing after closed (default: `new Subject<unknown>()`).
     * @zh 属性 `_afterClosed$`（类型：`Subject`），用于存储或配置之后是否关闭（默认值：`new Subject<unknown>()`）。
     */
    private readonly _afterClosed$ = new Subject<unknown>();

    /**
     * Property `_id` (`any`) storing id (default: `ɵIdGenerator.generate()`).
     * @zh 属性 `_id`（类型：`any`），用于存储或配置唯一标识（默认值：`ɵIdGenerator.generate()`）。
     */
    private readonly _id = ɵIdGenerator.generate();
    /**
     * Property `_windowElement` (`HTMLElement`) storing window element.
     * @zh 属性 `_windowElement`（类型：`HTMLElement`），用于存储或配置窗口元素。
     */
    private _windowElement: HTMLElement;
    /**
     * Property `_draggableDirective` (`DraggableDirective`) storing draggable directive.
     * @zh 属性 `_draggableDirective`（类型：`DraggableDirective`），用于存储或配置是否可拖拽指令。
     */
    private _draggableDirective: DraggableDirective;
    /**
     * Property `_resizableDirective` (`ResizableDirective`) storing resizable directive.
     * @zh 属性 `_resizableDirective`（类型：`ResizableDirective`），用于存储或配置是否可调尺寸指令。
     */
    private _resizableDirective: ResizableDirective;
    /**
     * Property `_componentRef` (`ComponentRef<ɵDynamicWindowComponent>`) storing component ref.
     * @zh 属性 `_componentRef`（类型：`ComponentRef<ɵDynamicWindowComponent>`），用于存储或配置组件引用。
     */
    private _componentRef: ComponentRef<ɵDynamicWindowComponent>;

    /**
     * Executes `init` to handle init.
     * @zh 执行 `init`，用于初始化。
     * @param config - config parameter (`DynamicWindowConfig`) / 配置参数（`DynamicWindowConfig`）
     */
    public init(config: DynamicWindowConfig): void {
        this.updateConfig(config);
        this.setIsHiddenState(config.isHiddenByDefault);
        this.setIsFullscreenState(config.isFullscreenByDefault);
    }

    /**
     * Executes `updateConfig` to handle update config.
     * @zh 执行 `updateConfig`，用于更新配置。
     * @param config - config parameter (`DynamicWindowConfig`) / 配置参数（`DynamicWindowConfig`）
     */
    public updateConfig(config: DynamicWindowConfig): void {
        this._config$.next({ ...this.config, ...config });
    }

    /**
     * Executes `hide` to handle hide.
     * @zh 执行 `hide`，用于隐藏。
     */
    public hide(): void {
        if (!this.isHidden) {
            this._beforeHidden$.next(false);
            this._isHidden$.next(true);
            this.makeInactive();
        }
    }

    /**
     * Executes `show` to handle show.
     * @zh 执行 `show`，用于显示。
     */
    public show(): void {
        if (this.isHidden) {
            this._isHidden$.next(false);
            this.makeActive();
        }
    }

    /**
     * Executes `toggleVisibility` to handle toggle visibility.
     * @zh 执行 `toggleVisibility`，用于开关Visibility。
     */
    public toggleVisibility(): void {
        (this.isHidden) ? this.show() : this.hide();
    }

    /**
     * Executes `setIsHiddenState` to handle set is hidden state.
     * @zh 执行 `setIsHiddenState`，用于集合是否为隐藏状态。
     * @param state - state parameter (`boolean`) / 状态参数（`boolean`）
     */
    public setIsHiddenState(state: boolean): void {
        (state) ? this.hide() : this.show();
    }

    /**
     * Executes `goFullscreen` to handle go fullscreen.
     * @zh 执行 `goFullscreen`，用于go全屏。
     */
    public goFullscreen(): void {
        if (!this.isFullscreen) {
            this._isFullscreen$.next(true);
        }
    }

    /**
     * Executes `goWindowed` to handle go windowed.
     * @zh 执行 `goWindowed`，用于go已窗口。
     */
    public goWindowed(): void {
        if (this.isFullscreen) {
            this._isFullscreen$.next(false);
        }
    }

    /**
     * Executes `toggleFullscreen` to handle toggle fullscreen.
     * @zh 执行 `toggleFullscreen`，用于开关全屏。
     */
    public toggleFullscreen(): void {
        (this.isFullscreen) ? this.goWindowed() : this.goFullscreen();
    }

    /**
     * Executes `setIsFullscreenState` to handle set is fullscreen state.
     * @zh 执行 `setIsFullscreenState`，用于集合是否为全屏状态。
     * @param state - state parameter (`boolean`) / 状态参数（`boolean`）
     */
    public setIsFullscreenState(state: boolean): void {
        (state) ? this.goFullscreen() : this.goWindowed();
    }

    /**
     * Executes `close` to handle close.
     * @zh 执行 `close`，用于关闭。
     * @param result - result parameter (`T`) / 结果参数（`T`）
     */
    public close<T = unknown>(result?: T): void {
        this._afterClosed$.next(result);
    }

    /**
     * Executes `makeActive` to handle make active.
     * @zh 执行 `makeActive`，用于生成激活。
     */
    public makeActive(): void {
        if (!this.isActive) {
            this._isActive$.next(true);
        }
    }

    /**
     * Executes `makeInactive` to handle make inactive.
     * @zh 执行 `makeInactive`，用于生成未激活。
     */
    public makeInactive(): void {
        if (this.isActive) {
            this._isActive$.next(false);
        }
    }

    /**
     * Executes `setOrderIndex` to handle set order index.
     * @zh 执行 `setOrderIndex`，用于集合顺序索引。
     * @param orderIndex - order index parameter (`number`) / 顺序索引参数（`number`）
     */
    public setOrderIndex(orderIndex: number): void {
        this._orderIndex$.next(orderIndex);
    }

    /**
     * Executes `setWindowElement` to handle set window element.
     * @zh 执行 `setWindowElement`，用于集合窗口元素。
     * @param element - element parameter (`HTMLElement`) / 元素参数（`HTMLElement`）
     */
    public setWindowElement(element: HTMLElement): void {
        if (this._windowElement) {
            throw new Error(`Can't change windowElement`);
        }
        this._windowElement = element;
    }

    /**
     * Executes `setComponentRef` to handle set component ref.
     * @zh 执行 `setComponentRef`，用于集合组件引用。
     * @param componentRef - component ref parameter (`ComponentRef<ɵDynamicWindowComponent>`) / 组件引用参数（`ComponentRef<ɵDynamicWindowComponent>`）
     */
    public setComponentRef(componentRef: ComponentRef<ɵDynamicWindowComponent>): void {
        if (this._componentRef) {
            throw new Error(`Can't change componentRef`);
        }
        componentRef.instance.windowRef=this;
        this._componentRef = componentRef;
    }

    /**
     * Executes `setDraggableDirective` to handle set draggable directive.
     * @zh 执行 `setDraggableDirective`，用于集合是否可拖拽指令。
     * @param directive - directive parameter (`DraggableDirective`) / 指令参数（`DraggableDirective`）
     */
    public setDraggableDirective(directive: DraggableDirective): void {
        if (this._draggableDirective) {
            throw new Error(`Can't change DraggableDirective`);
        }

        this._draggableDirective = directive;
    }

    /**
     * Executes `setResizableDirective` to handle set resizable directive.
     * @zh 执行 `setResizableDirective`，用于集合是否可调尺寸指令。
     * @param directive - directive parameter (`ResizableDirective`) / 指令参数（`ResizableDirective`）
     */
    public setResizableDirective(directive: ResizableDirective): void {
        if (this._resizableDirective) {
            throw new Error(`Can't change ResizableDirective`);
        }

        this._resizableDirective = directive;
    }

    /**
     * Executes `destroy` to handle destroy.
     * @zh 执行 `destroy`，用于销毁。
     */
    public destroy(): void {
        this._config$.complete();
        this._isHidden$.complete();
        this._isFullscreen$.complete();
        this._isActive$.complete();
        this._orderIndex$.complete();
        this._beforeHidden$.complete();
        this._afterClosed$.complete();
    }
}
