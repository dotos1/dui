/**
 * @fileoverview Module `src/theme/mat-palette.ts` providing mat palette definitions and implementation.
 * @zh 模块文件 `src/theme/mat-palette.ts`，提供Material调色板相关的定义与实现。
 */

import { Palette } from './interfaces';

/**
 * Executes `matPalette` to handle mat palette.
 * @zh 执行 `matPalette`，用于Material调色板。
 * @param basePalette - base palette parameter (`Palette`) / 基础调色板参数（`Palette`）
 * @param defaultColor - default color parameter (`number | string`) / 默认颜色参数（`number | string`）
 * @param lighter - lighter parameter (`number | string`) / 浅色器参数（`number | string`）
 * @param darker - darker parameter (`number | string`) / 深色器参数（`number | string`）
 * @param text - text parameter (`any`) / 文本参数（`any`）
 * @returns Result of type `Palette` / 类型为 `Palette` 的返回值
 */
export function matPalette(basePalette: Palette, defaultColor: number | string = 500, lighter: number | string = 100, darker: number | string = 700,text= defaultColor): Palette {
    const result: Palette = { ...basePalette };

    result['default'] = basePalette[defaultColor];
    result['lighter'] = basePalette[lighter];
    result['darker'] = basePalette[darker];
    result['text'] = basePalette[text];
    result['default-contrast'] = matContrast(basePalette, defaultColor);
    result['lighter-contrast'] = matContrast(basePalette, lighter);
    result['darker-contrast'] = matContrast(basePalette, darker);

    // For each hue in the palette, add a "-contrast" color to the map.
    Object.keys(basePalette).map((key: string) => {
        if (key !== 'contrast') {
            result[`${key}-contrast`] = matContrast(basePalette, key);
        }
    });
    return result;
}

/**
 * Executes `matContrast` to handle mat contrast.
 * @zh 执行 `matContrast`，用于Material对比度。
 * @param palette - palette parameter (`Palette`) / 调色板参数（`Palette`）
 * @param hue - hue parameter (`number | string`) / 色相参数（`number | string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function matContrast(palette: Palette, hue: number | string): string {
    return palette.contrast[hue];
}
