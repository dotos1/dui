/**
 * @fileoverview Module `src/theme/theme/dui-speeddial-theme.ts` providing dui speeddial theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-speeddial-theme.ts`，提供DUIspeeddial主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matFontSize, matFontWeight } from '../utils/index';

/**
 * Executes `matSpeedDialTheme` to handle mat speed dial theme.
 * @zh 执行 `matSpeedDialTheme`，用于Material速度Dial主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matSpeedDialTheme(theme: Theme): Object {
    const primaryDefault: string = matColor(theme.primary, 'default');
    const foregroundText: string = matColor(theme.primary, 'darker-contrast');


    let config= theme.typography;
    const type: string = config['type'];
    let px48: string = type === 'loose' ? '48px' : '42px';
    let px56: string = type === 'loose' ? '56px' : '49px';

    return {
        '.fab-toggle': {
            'color': foregroundText+" !important",
            'background': primaryDefault+" !important",

            "width": px48 + " !important",
            "height": px48 + " !important",
            "font-weight": matFontWeight(config, "headline"),
            "font-size": matFontSize(config, "headline"),
            "line-height": px48 + " !important",
        },
        '.fab-icon': {
            'color': foregroundText+" !important",
        },
        '.fab-item': {
            'color': foregroundText+" !important",
            'background': primaryDefault+" !important",
            "width": px48 + " !important",
            "height": px48 + " !important",
            "line-height": px48 + " !important",
        },
        '.fab-item-icon': {
            'color': foregroundText+" !important",
        },
        '.item.disabled .fab-item': {
            'color': matColor(theme.foreground, 'disabled-button')
        },

        ".fab-menu": {
            "width": px56 + " !important",
            "height": px56 + " !important"
          },
          ".item": {
            "width": px48 + " !important",
            "height": px48 + " !important",
          }
    };
}
