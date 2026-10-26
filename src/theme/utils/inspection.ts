/**
 * @fileoverview Module `src/theme/utils/inspection.ts` providing inspection definitions and implementation.
 * @zh 模块文件 `src/theme/utils/inspection.ts`，提供inspection相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
/**
 * Executes `themeHas` to handle theme has.
 * @zh 执行 `themeHas`，用于主题是否包含。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @param system - system parameter (`string`) / system参数（`string`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function themeHas(theme: Theme, system: string) : boolean {
    let version = themeVersion(theme);
    if(version==0){
        return true;
    }else if(version==1){
        if(system=='base')
            return theme["ase-tokens"] != null;
        if(system=='color')
            return theme["color-tokens"] != null;
        if(system=='typography')
            return theme["typography-tokens"] != null;
        if(system=='density')
            return theme["density-scale"] != null;
        throw new Error('Valid systems are: base, color, typography, density. Got:' + system);
    }else{
        throw new Error('Unrecognized theme version:' + version);
    }
}
/**
 * Executes `themeVersion` to handle theme version.
 * @zh 执行 `themeVersion`，用于主题Version。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
export function themeVersion(theme: Theme) : number {
    return theme["theme-version"] || 0;
}