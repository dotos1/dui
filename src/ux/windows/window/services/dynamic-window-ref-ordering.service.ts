/**
 * @fileoverview Module `src/ux/windows/window/services/dynamic-window-ref-ordering.service.ts` providing dynamic window ref ordering service definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/services/dynamic-window-ref-ordering.service.ts`，提供动态窗口引用顺序服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { ɵDynamicWindowRefModel } from '../classes';
import { ɵWindowReferencesState } from '../states';

/**
 * Injectable Angular service `ɵDynamicWindowRefOrderingService` managing ɵdynamic window ref ordering service state and operations in `src/ux/windows/window/services`.
 * @internal
 * @zh 可注入的 Angular 服务 `ɵDynamicWindowRefOrderingService`，管理 `src/ux/windows/window/services` 中的ɵDynamic窗口引用顺序服务状态与业务操作。
 */
@Injectable({
    providedIn: 'root'
})
export class ɵDynamicWindowRefOrderingService {

    /**
     * Property `windowOrderIds` (`string[]`) storing window order ids (default: `[]`).
     * @zh 属性 `windowOrderIds`（类型：`string[]`），用于存储或配置窗口顺序标识列表（默认值：`[]`）。
     */
    private readonly windowOrderIds: string[] = [];

    /**
     * Creates an instance of `ɵDynamicWindowRefOrderingService` and initializes its dependencies and internal state.
     * @zh 创建 `ɵDynamicWindowRefOrderingService` 实例，并初始化其依赖项与内部状态。
     * @param state - Injected or initial state (`ɵWindowReferencesState`) / 注入或传入的状态（`ɵWindowReferencesState`）
     */
    constructor(
        private readonly state: ɵWindowReferencesState
    ) {}

    /**
     * Executes `getIndex` to handle get index.
     * @zh 执行 `getIndex`，用于获取索引。
     * @param id - id parameter (`string`) / 唯一标识参数（`string`）
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    public getIndex(id: string): number {
        return this.windowOrderIds.indexOf(id);
    }

    /**
     * Executes `updateForAll` to handle update for all.
     * @zh 执行 `updateForAll`，用于更新用于全部。
     */
    public updateForAll(): void {
        this.state.data.forEach((windowRef) => {
            const orderIndex = this.getIndex(windowRef.id);

            windowRef.setOrderIndex(orderIndex);
        });
    }

    /**
     * Executes `remove` to handle remove.
     * @zh 执行 `remove`，用于移除。
     * @param id - id parameter (`string`) / 唯一标识参数（`string`）
     */
    public remove(id: string): void {
        const targetWindowOrderIdIndex = this.getIndex(id);

        if (targetWindowOrderIdIndex !== -1) {
            this.windowOrderIds.splice(targetWindowOrderIdIndex, 1);
        }
    }

    /**
     * Executes `moveToTop` to handle move to top.
     * @zh 执行 `moveToTop`，用于移动转换为顶部位置。
     * @param id - id parameter (`string`) / 唯一标识参数（`string`）
     */
    public moveToTop(id: string): void {
        this.remove(id);
        this.windowOrderIds.push(id);
    }

    /**
     * Executes `getHighestOpened` to handle get highest opened.
     * @zh 执行 `getHighestOpened`，用于获取Highest是否展开。
     * @returns Result of type `ɵDynamicWindowRefModel` / 类型为 `ɵDynamicWindowRefModel` 的返回值
     */
    public getHighestOpened(): ɵDynamicWindowRefModel | null {
        let index = (this.windowOrderIds.length - 1);
        while (index >= 0) {
            const currentWindowRefId = this.windowOrderIds[index];
            const currentWindowRef = this.state.getById(currentWindowRefId);
            if (!currentWindowRef.isHidden) {
                return currentWindowRef;
            }
            index--;
        }
        return null;
    }
}
