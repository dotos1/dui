/**
 * @fileoverview Module `src/ux/windows/window/states/window-references.state.ts` providing window references state definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/states/window-references.state.ts`，提供窗口引用状态相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ɵDynamicWindowRefModel } from '../classes';

/**
 * Injectable Angular service `ɵWindowReferencesState` managing ɵwindow references state state and operations in `src/ux/windows/window/states`.
 * @internal
 * @zh 可注入的 Angular 服务 `ɵWindowReferencesState`，管理 `src/ux/windows/window/states` 中的ɵWindow引用状态状态与业务操作。
 */
@Injectable({
    providedIn: 'root'
})
export class ɵWindowReferencesState {
    /**
     * Gets the current data (`data$: Observable<ɵDynamicWindowRefModel[]>`).
     * @zh 获取当前数据（`data$: Observable<ɵDynamicWindowRefModel[]>`）。
     */
    public get data$(): Observable<ɵDynamicWindowRefModel[]> {
        return this._data$.asObservable();
    }

    /**
     * Gets the current data (`data: ɵDynamicWindowRefModel[]`).
     * @zh 获取当前数据（`data: ɵDynamicWindowRefModel[]`）。
     */
    public get data(): ɵDynamicWindowRefModel[] {
        return this._data$.getValue();
    }

    /**
     * Property `_data$` (`BehaviorSubject`) storing data.
     * @zh 属性 `_data$`（类型：`BehaviorSubject`），用于存储或配置数据。
     */
    private readonly _data$ = new BehaviorSubject<ɵDynamicWindowRefModel[]>([]);

    /**
     * Property `windowRefMap` (`Map<string, ɵDynamicWindowRefModel>`) storing window ref map (default: `new Map()`).
     * @zh 属性 `windowRefMap`（类型：`Map<string, ɵDynamicWindowRefModel>`），用于存储或配置窗口引用映射表（默认值：`new Map()`）。
     */
    private readonly windowRefMap: Map<string, ɵDynamicWindowRefModel> = new Map();

    /**
     * Executes `getById` to handle get by id.
     * @zh 执行 `getById`，用于获取按唯一标识。
     * @param id - id parameter (`string`) / 唯一标识参数（`string`）
     * @returns Result of type `ɵDynamicWindowRefModel` / 类型为 `ɵDynamicWindowRefModel` 的返回值
     */
    public getById(id: string): ɵDynamicWindowRefModel {
        return this.windowRefMap.get(id);
    }

    /**
     * Executes `add` to handle add.
     * @zh 执行 `add`，用于添加。
     * @param windowRef - window ref parameter (`ɵDynamicWindowRefModel`) / 窗口引用参数（`ɵDynamicWindowRefModel`）
     */
    public add(windowRef: ɵDynamicWindowRefModel): void {
        this.windowRefMap.set(windowRef.id, windowRef);
        this._data$.next([...this.data, windowRef]);
    }

    /**
     * Executes `remove` to handle remove.
     * @zh 执行 `remove`，用于移除。
     * @param windowRef - window ref parameter (`ɵDynamicWindowRefModel`) / 窗口引用参数（`ɵDynamicWindowRefModel`）
     */
    public remove(windowRef: ɵDynamicWindowRefModel): void {
        const targetWindowRefIndex = this.data.indexOf(windowRef);

        this.data.splice(targetWindowRefIndex, 1);
        this.windowRefMap.delete(windowRef.id);
        this._data$.next([...this.data]);
    }
}
