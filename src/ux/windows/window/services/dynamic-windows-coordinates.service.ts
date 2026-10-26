/**
 * @fileoverview Module `src/ux/windows/window/services/dynamic-windows-coordinates.service.ts` providing dynamic windows coordinates service definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/services/dynamic-windows-coordinates.service.ts`，提供动态多窗口坐标服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { ɵIsNumber } from '../../core';
import { ɵDynamicWindowRefModel } from '../classes';

/**
 * Injectable Angular service `ɵDynamicWindowsDefaultCoordinatesService` managing ɵdynamic windows default coordinates service state and operations in `src/ux/windows/window/services`.
 * @internal
 * @zh 可注入的 Angular 服务 `ɵDynamicWindowsDefaultCoordinatesService`，管理 `src/ux/windows/window/services` 中的ɵDynamic多窗口默认坐标服务状态与业务操作。
 */
@Injectable({
    providedIn: 'root'
})
export class ɵDynamicWindowsDefaultCoordinatesService {
    /**
     * Property `base` (`number`) storing base (default: `96`).
     * @zh 属性 `base`（类型：`number`），用于存储或配置基础（默认值：`96`）。
     */
    private readonly base = 96;
    /**
     * Property `multiplier` (`number`) storing multiplier (default: `32`).
     * @zh 属性 `multiplier`（类型：`number`），用于存储或配置multiplier（默认值：`32`）。
     */
    private readonly multiplier = 32;
    /**
     * Property `maxAmountOfWindows` (`number`) storing max amount of windows (default: `8`).
     * @zh 属性 `maxAmountOfWindows`（类型：`number`），用于存储或配置最大值Amount的多窗口（默认值：`8`）。
     */
    private readonly maxAmountOfWindows = 8;
    /**
     * Property `currentAmountOfWindows` (`number`) storing current amount of windows (default: `0`).
     * @zh 属性 `currentAmountOfWindows`（类型：`number`），用于存储或配置当前Amount的多窗口（默认值：`0`）。
     */
    private currentAmountOfWindows = 0;

    /**
     * Executes `applyIfSpecificAbsent` to handle apply if specific absent.
     * @zh 执行 `applyIfSpecificAbsent`，用于应用IfSpecificAbsent。
     * @param windowRef - window ref parameter (`ɵDynamicWindowRefModel`) / 窗口引用参数（`ɵDynamicWindowRefModel`）
     */
    public applyIfSpecificAbsent(windowRef: ɵDynamicWindowRefModel): void {
        if (!ɵIsNumber(windowRef.config.x) || !ɵIsNumber(windowRef.config.y)) {
            this.resetCurrentAmountOfWindowsIfExceedsMax();
            const targetPosition = this.calculate();
            this.currentAmountOfWindows++;
            windowRef.updateConfig({
                x: (windowRef.config.x ?? targetPosition),
                y: (windowRef.config.y ?? targetPosition)
            });
        }
    }

    /**
     * Executes `resetCurrentAmountOfWindowsIfExceedsMax` to handle reset current amount of windows if exceeds max.
     * @zh 执行 `resetCurrentAmountOfWindowsIfExceedsMax`，用于重置当前Amount的多窗口IfExceeds最大值。
     */
    private resetCurrentAmountOfWindowsIfExceedsMax(): void {
        if (this.currentAmountOfWindows >= this.maxAmountOfWindows) {
            this.currentAmountOfWindows = 0;
        }
    }

    /**
     * Executes `calculate` to handle calculate.
     * @zh 执行 `calculate`，用于计算。
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    private calculate(): number {
        return (this.base + (this.multiplier * this.currentAmountOfWindows));
    }
}
