/**
 * @fileoverview Module `src/ux/windows/window/services/shared-config.service.ts` providing shared config service definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/services/shared-config.service.ts`，提供共享配置服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ɵRESIZERS_ARRAY } from '../../resizer';
import { ɵDynamicWindowConfigModel } from '../classes/dynamic-window-config';
import { ɵMergeConfigs } from '../helpers';
import { DynamicWindowConfig } from '../interfaces';

/**
 * Allows manipulation with shared config for all windows
 * @zh 可注入的 Angular 服务 `DynamicWindowSharedConfigService`，管理 `src/ux/windows/window/services` 中的动态窗口共享配置服务状态与业务操作。
 */
@Injectable({
    providedIn: 'root'
})
export class DynamicWindowSharedConfigService {
    /**
     * Contains shared config
     * @zh 获取当前数据（`data$: Observable<DynamicWindowConfig>`）。
     */
    public get data$(): Observable<DynamicWindowConfig> {
        return this._data$.asObservable();
    }

    /**
     * Contains shared config
     * @zh 获取当前数据（`data: DynamicWindowConfig`）。
     */
    public get data(): DynamicWindowConfig {
        return this._data$.getValue();
    }

    /**
     * Property `_data$` (`BehaviorSubject<DynamicWindowConfig<unknown, unknown>>`) storing data.
     * @zh 属性 `_data$`（类型：`BehaviorSubject<DynamicWindowConfig<unknown, unknown>>`），用于存储或配置数据。
     */
    private readonly _data$ = new BehaviorSubject<DynamicWindowConfig>(
        new ɵDynamicWindowConfigModel({
            title: 'OS dynamic window',
            minWidth: 275,
            minHeight: 175,
            maxWidth: Infinity,
            maxHeight: Infinity,
            fullscreenOffset: {
                top: '0px',
                bottom: '0px',
                left: '0px',
                right: '0px'
            },
            hidesInto: {
                x: '50%',
                y: '100%'
            },
            allowedResizers: [...ɵRESIZERS_ARRAY],
            isFullscreenByDefault: false,
            isHiddenByDefault: false,
            isAllowHide: true,
            isAllowFullscreen: true,
            isAllowClose: true,
            isAlwaysOnTop: false,
            isToggleFullscreenByDblClickOnTitleBar: true,
            isExitFullscreenByDragTitleBar: true,
            isTitleBarVisible: true,
            style: {},
            styleClass: '',
            titleBarStyle: {},
            titleBarStyleClass: '',
            scrollViewStyle: {},
            scrollViewStyleClass: ''
        })
    );

    /**
     * Overrides some part of config on the new one
     * @zh 执行 `update`，用于更新。
     */
    public update(config: DynamicWindowConfig): void {
        this._data$.next(ɵMergeConfigs(config, this.data));
    }

    /**
     * Cleans the shared config completely
     * @zh 执行 `clear`，用于清空。
     */
    public clear(): void {
        this._data$.next({});
    }
}
