/**
 * @fileoverview Module `src/ux/windows/window/services/dynamic-window-references.service.ts` providing dynamic window references service definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/services/dynamic-window-references.service.ts`，提供动态窗口引用服务相关的定义与实现。
 */

import { Injectable, OnDestroy } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { ɵDynamicWindowConfigModel, ɵDynamicWindowRefModel } from '../classes';
import { DynamicWindowConfig as IDynamicWindowConfig } from '../interfaces';
import { ɵWindowReferencesState } from '../states';
import { ɵDynamicWindowActivityService } from './dynamic-window-activity.service';
import { ɵDynamicWindowRefOrderingService } from './dynamic-window-ref-ordering.service';
import { ɵDynamicWindowsDefaultCoordinatesService } from './dynamic-windows-coordinates.service';

/**
 * Injectable Angular service `ɵDynamicWindowReferencesService` managing ɵdynamic window references service state and operations in `src/ux/windows/window/services`.
 * @internal
 * @zh 可注入的 Angular 服务 `ɵDynamicWindowReferencesService`，管理 `src/ux/windows/window/services` 中的ɵDynamic窗口引用服务状态与业务操作。
 */
@Injectable({
    providedIn: 'root'
})
export class ɵDynamicWindowReferencesService implements OnDestroy {
    /**
     * Gets the current data (`data$: Observable<ɵDynamicWindowRefModel[]>`).
     * @zh 获取当前数据（`data$: Observable<ɵDynamicWindowRefModel[]>`）。
     */
    public get data$(): Observable<ɵDynamicWindowRefModel[]> {
        return this.state.data$;
    }

    /**
     * Gets the current data (`data: ɵDynamicWindowRefModel[]`).
     * @zh 获取当前数据（`data: ɵDynamicWindowRefModel[]`）。
     */
    public get data(): ɵDynamicWindowRefModel[] {
        return [...this.state.data];
    }

    /**
     * Property `destroyed$` (`Subject`) storing destroyed (default: `new Subject()`).
     * @zh 属性 `destroyed$`（类型：`Subject`），用于存储或配置已销毁（默认值：`new Subject()`）。
     */
    private destroyed$ = new Subject();

    /**
     * Creates an instance of `ɵDynamicWindowReferencesService` and initializes its dependencies and internal state.
     * @zh 创建 `ɵDynamicWindowReferencesService` 实例，并初始化其依赖项与内部状态。
     * @param state - Injected or initial state (`ɵWindowReferencesState`) / 注入或传入的状态（`ɵWindowReferencesState`）
     * @param activityService - Injected or initial activity service (`ɵDynamicWindowActivityService`) / 注入或传入的activity服务（`ɵDynamicWindowActivityService`）
     * @param orderingService - Injected or initial ordering service (`ɵDynamicWindowRefOrderingService`) / 注入或传入的顺序服务（`ɵDynamicWindowRefOrderingService`）
     * @param defaultCoordinatesService - Injected or initial default coordinates service (`ɵDynamicWindowsDefaultCoordinatesService`) / 注入或传入的默认坐标服务（`ɵDynamicWindowsDefaultCoordinatesService`）
     */
    constructor(
        private readonly state: ɵWindowReferencesState,
        private readonly activityService: ɵDynamicWindowActivityService,
        private readonly orderingService: ɵDynamicWindowRefOrderingService,
        private readonly defaultCoordinatesService: ɵDynamicWindowsDefaultCoordinatesService
    ) {}

    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Executes `register` to handle register.
     * @zh 执行 `register`，用于注册。
     * @param windowRef - window ref parameter (`ɵDynamicWindowRefModel`) / 窗口引用参数（`ɵDynamicWindowRefModel`）
     * @param config - config parameter (`IDynamicWindowConfig`) / 配置参数（`IDynamicWindowConfig`）
     */
    public register(windowRef: ɵDynamicWindowRefModel, config: IDynamicWindowConfig): void {
        windowRef.init(new ɵDynamicWindowConfigModel(config));
        this.state.add(windowRef);
        this.defaultCoordinatesService.applyIfSpecificAbsent(windowRef);
        this.initHighestWindowActivityObserver(windowRef);
        this.initIsActiveStateObserver(windowRef);
    }

    /**
     * Executes `remove` to handle remove.
     * @zh 执行 `remove`，用于移除。
     * @param windowRef - window ref parameter (`ɵDynamicWindowRefModel`) / 窗口引用参数（`ɵDynamicWindowRefModel`）
     */
    public remove(windowRef: ɵDynamicWindowRefModel): void {
        this.orderingService.remove(windowRef.id);
        this.state.remove(windowRef);
    }

    /**
     * Executes `initHighestWindowActivityObserver` to handle init highest window activity observer.
     * @zh 执行 `initHighestWindowActivityObserver`，用于初始化Highest窗口Activity观察者。
     * @param windowRef - window ref parameter (`ɵDynamicWindowRefModel`) / 窗口引用参数（`ɵDynamicWindowRefModel`）
     */
    private initHighestWindowActivityObserver(windowRef: ɵDynamicWindowRefModel): void {
        merge(
            windowRef.isHidden$.pipe(filter(Boolean)),
            windowRef.afterClosed$
        )
            .pipe(
                map(() => this.orderingService.getHighestOpened()),
                takeUntil(this.destroyed$)
            )
            .subscribe((highestWindow) => highestWindow?.makeActive());
    }

    /**
     * Executes `initIsActiveStateObserver` to handle init is active state observer.
     * @zh 执行 `initIsActiveStateObserver`，用于初始化是否为激活状态观察者。
     * @param windowRef - window ref parameter (`ɵDynamicWindowRefModel`) / 窗口引用参数（`ɵDynamicWindowRefModel`）
     */
    private initIsActiveStateObserver(windowRef: ɵDynamicWindowRefModel): void {
        windowRef.isActive$
            .pipe(
                filter(Boolean),
                takeUntil(this.destroyed$)
            )
            .subscribe(() => {
                this.orderingService.moveToTop(windowRef.id);
                this.orderingService.updateForAll();
                this.activityService.makeAllInactiveExceptSpecificId(windowRef.id);
            });
    }
}
