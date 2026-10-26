/**
 * @fileoverview Module `src/theme/core/mat-elevation.ts` providing mat elevation definitions and implementation.
 * @zh 模块文件 `src/theme/core/mat-elevation.ts`，提供Material层级阴影相关的定义与实现。
 */

import { Theme } from "../interfaces";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * Executes `matEvaluation` to handle mat evaluation.
 * @zh 执行 `matEvaluation`，用于MaterialEvaluation。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matEvaluation(theme:Theme): Object {
    const result: Object = {};
    const color='0, 0, 0';
    for (let z: number = 0; z <= 24; z++) {
        result[matElevationPrefix + z] = matElevation(z,color);
    }
    return result;
}

/**
 * Constant/variable `matElevationPrefix` defining mat elevation prefix in `src/theme/core`.
 * @zh 常量/变量 `matElevationPrefix`，定义 `src/theme/core` 中的Material层级阴影前缀。
 */
const matElevationPrefix: string = '.mat-elevation-z';

/**
 * Constant/variable `umbraMap` defining umbra map in `src/theme/core`.
 * @zh 常量/变量 `umbraMap`，定义 `src/theme/core` 中的umbra映射表。
 */
const umbraMap: Map<number, string> = new Map([
    [0, '0px 0px 0px 0px'],
    [1, '0px 2px 1px -1px'],
    [2, '0px 3px 1px -2px'],
    [3, '0px 3px 3px -2px'],
    [4, '0px 2px 4px -1px'],
    [5, '0px 3px 5px -1px'],
    [6, '0px 3px 5px -1px'],
    [7, '0px 4px 5px -2px'],
    [8, '0px 5px 5px -3px'],
    [9, '0px 5px 6px -3px'],
    [10, '0px 6px 6px -3px'],
    [11, '0px 6px 7px -4px'],
    [12, '0px 7px 8px -4px'],
    [13, '0px 7px 8px -4px'],
    [14, '0px 7px 9px -4px'],
    [15, '0px 8px 9px -5px'],
    [16, '0px 8px 10px -5px'],
    [17, '0px 8px 11px -5px'],
    [18, '0px 9px 11px -5px'],
    [19, '0px 9px 12px -6px'],
    [20, '0px 10px 13px -6px'],
    [21, '0px 10px 13px -6px'],
    [22, '0px 10px 14px -6px'],
    [23, '0px 11px 14px -7px'],
    [24, '0px 11px 15px -7px']
]);

/**
 * Constant/variable `penumbraMap` defining penumbra map in `src/theme/core`.
 * @zh 常量/变量 `penumbraMap`，定义 `src/theme/core` 中的penumbra映射表。
 */
const penumbraMap: Map<number, string> = new Map([
    [0, '0px 0px 0px 0px'],
    [1, '0px 1px 1px 0px'],
    [2, '0px 2px 2px 0px'],
    [3, '0px 3px 4px 0px'],
    [4, '0px 4px 5px 0px'],
    [5, '0px 5px 8px 0px'],
    [6, '0px 6px 10px 0px'],
    [7, '0px 7px 10px 1px'],
    [8, '0px 8px 10px 1px'],
    [9, '0px 9px 12px 1px'],
    [10, '0px 10px 14px 1px'],
    [11, '0px 11px 15px 1px'],
    [12, '0px 12px 17px 2px'],
    [13, '0px 13px 19px 2px'],
    [14, '0px 14px 21px 2px'],
    [15, '0px 15px 22px 2px'],
    [16, '0px 16px 24px 2px'],
    [17, '0px 17px 26px 2px'],
    [18, '0px 18px 28px 2px'],
    [19, '0px 19px 29px 2px'],
    [20, '0px 20px 31px 3px'],
    [21, '0px 21px 33px 3px'],
    [22, '0px 22px 35px 3px'],
    [23, '0px 23px 36px 3px'],
    [24, '0px 24px 38px 3px']
]);

/**
 * Constant/variable `ambientMap` defining ambient map in `src/theme/core`.
 * @zh 常量/变量 `ambientMap`，定义 `src/theme/core` 中的ambient映射表。
 */
const ambientMap: Map<number, string> = new Map([
    [0, '0px 0px 0px 0px'],
    [1, '0px 1px 3px 0px'],
    [2, '0px 1px 5px 0px'],
    [3, '0px 1px 8px 0px'],
    [4, '0px 1px 10px 0px'],
    [5, '0px 1px 14px 0px'],
    [6, '0px 1px 18px 0px'],
    [7, '0px 2px 16px 1px'],
    [8, '0px 3px 14px 2px'],
    [9, '0px 3px 16px 2px'],
    [10, '0px 4px 18px 3px'],
    [11, '0px 4px 20px 3px'],
    [12, '0px 5px 22px 4px'],
    [13, '0px 5px 24px 4px'],
    [14, '0px 5px 26px 4px'],
    [15, '0px 6px 28px 5px'],
    [16, '0px 6px 30px 5px'],
    [17, '0px 6px 32px 5px'],
    [18, '0px 7px 34px 6px'],
    [19, '0px 7px 36px 6px'],
    [20, '0px 8px 38px 7px'],
    [21, '0px 8px 40px 7px'],
    [22, '0px 8px 42px 7px'],
    [23, '0px 9px 44px 8px'],
    [24, '0px 9px 46px 8px']
]);

/**
 * Executes `matElevation` to handle mat elevation.
 * @zh 执行 `matElevation`，用于Material层级阴影。
 * @param zValue - z value parameter (`number`) / Z坐标值参数（`number`）
 * @param color - color parameter (`string`) / 颜色参数（`string`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function matElevation(zValue: number, color: string = '0, 0, 0'): Object {
    return {
        'box-shadow': `${getUmbra(color, zValue)}, ${getPenumbra(color, zValue)}, ${getAmbient(color, zValue)}`
    };
}

/**
 * Executes `getUmbra` to handle get umbra.
 * @zh 执行 `getUmbra`，用于获取Umbra。
 * @param color - color parameter (`string`) / 颜色参数（`string`）
 * @param zValue - z value parameter (`number`) / Z坐标值参数（`number`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function getUmbra(color: string, zValue: number): string {
    return `${umbraMap.get(zValue)} rgba(${color}, 0.2)`;
}

/**
 * Executes `getPenumbra` to handle get penumbra.
 * @zh 执行 `getPenumbra`，用于获取Penumbra。
 * @param color - color parameter (`string`) / 颜色参数（`string`）
 * @param zValue - z value parameter (`number`) / Z坐标值参数（`number`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function getPenumbra(color: string, zValue: number): string {
    return `${penumbraMap.get(zValue)} rgba(${color}, 0.14)`;
}

/**
 * Executes `getAmbient` to handle get ambient.
 * @zh 执行 `getAmbient`，用于获取Ambient。
 * @param color - color parameter (`string`) / 颜色参数（`string`）
 * @param zValue - z value parameter (`number`) / Z坐标值参数（`number`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function getAmbient(color: string, zValue: number): string {
    return `${ambientMap.get(zValue)} rgba(${color}, 0.12)`;
}
