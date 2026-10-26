/**
 * @fileoverview Module `src/ux/windows/window/services/dynamic-window-activity.service.ts` providing dynamic window activity service definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/services/dynamic-window-activity.service.ts`，提供动态窗口activity服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { ɵWindowReferencesState } from '../states';

/**
 * Injectable Angular service `ɵDynamicWindowActivityService` managing ɵdynamic window activity service state and operations in `src/ux/windows/window/services`.
 * @internal
 * @zh 可注入的 Angular 服务 `ɵDynamicWindowActivityService`，管理 `src/ux/windows/window/services` 中的ɵDynamic窗口Activity服务状态与业务操作。
 */
@Injectable({
    providedIn: 'root'
})
export class ɵDynamicWindowActivityService {
    /**
     * Creates an instance of `ɵDynamicWindowActivityService` and initializes its dependencies and internal state.
     * @zh 创建 `ɵDynamicWindowActivityService` 实例，并初始化其依赖项与内部状态。
     * @param state - Injected or initial state (`ɵWindowReferencesState`) / 注入或传入的状态（`ɵWindowReferencesState`）
     */
    constructor(
        private readonly state: ɵWindowReferencesState
    ) {}

    /**
     * Executes `makeAllInactiveExceptSpecificId` to handle make all inactive except specific id.
     * @zh 执行 `makeAllInactiveExceptSpecificId`，用于生成全部未激活ExceptSpecific唯一标识。
     * @param id - id parameter (`string`) / 唯一标识参数（`string`）
     */
    public makeAllInactiveExceptSpecificId(id: string): void {
        this.state.data.forEach((windowRef) => {
            if (windowRef.id !== id && windowRef.isActive) {
                windowRef.makeInactive();
            }
        });
    }
}
