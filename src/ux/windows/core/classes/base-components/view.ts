/**
 * @fileoverview Module `src/ux/windows/core/classes/base-components/view.ts` providing view definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/classes/base-components/view.ts`，提供视图相关的定义与实现。
 */

import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

/**
 * Angular component `ɵOsBaseViewComponent` providing ɵos base view component presentation and interaction in `src/ux/windows/core/classes/base-components`.
 * @zh Angular 组件 `ɵOsBaseViewComponent`，提供ɵOs基础视图组件的视图渲染与交互逻辑（位于 `src/ux/windows/core/classes/base-components`）。
 */
@Component({
    template: '',
    standalone: false
})
export abstract class ɵOsBaseViewComponent implements AfterViewInit, OnDestroy {
    /**
     * Gets the current when view init (`whenViewInit$: Observable<boolean>`).
     * @zh 获取当前when视图初始化（`whenViewInit$: Observable<boolean>`）。
     */
    public get whenViewInit$(): Observable<boolean> {
        return this._whenViewInit$
            .asObservable()
            .pipe(first());
    }

    /**
     * Gets the current view destroyed (`viewDestroyed$: Observable<boolean>`).
     * @zh 获取当前视图已销毁（`viewDestroyed$: Observable<boolean>`）。
     */
    public get viewDestroyed$(): Observable<boolean> {
        return this._viewDestroyed$.asObservable();
    }

    /**
     * Gets the current is view init (`isViewInit: boolean`).
     * @zh 获取当前是否为视图初始化（`isViewInit: boolean`）。
     */
    public get isViewInit(): boolean {
        return this._isViewInit;
    }

    /**
     * Property `_isViewInit` (`boolean`) storing is view init.
     * @zh 属性 `_isViewInit`（类型：`boolean`），用于存储或配置是否为视图初始化。
     */
    private _isViewInit: boolean;
    /**
     * Property `_viewDestroyed$` (`Subject<boolean>`) storing view destroyed (default: `new Subject<boolean>()`).
     * @zh 属性 `_viewDestroyed$`（类型：`Subject<boolean>`），用于存储或配置视图已销毁（默认值：`new Subject<boolean>()`）。
     */
    private _viewDestroyed$ = new Subject<boolean>();
    /**
     * Property `_whenViewInit$` (`ReplaySubject<boolean>`) storing when view init (default: `new ReplaySubject<boolean>()`).
     * @zh 属性 `_whenViewInit$`（类型：`ReplaySubject<boolean>`），用于存储或配置when视图初始化（默认值：`new ReplaySubject<boolean>()`）。
     */
    private _whenViewInit$ = new ReplaySubject<boolean>();

    /**
     * Angular lifecycle hook invoked once after the component's view and child views are initialized.
     * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
     */
    public ngAfterViewInit(): void {
        this._isViewInit = true;
        this._whenViewInit$.next(true);
    }

    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    public ngOnDestroy(): void {
        this._viewDestroyed$.next(false);
        this._viewDestroyed$.complete();
        this._whenViewInit$.complete();
    }
}
