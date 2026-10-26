/**
 * @fileoverview Module `src/theme/theme/mat-input-theme.ts` providing mat input theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-input-theme.ts`，提供Material输入属性主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matControlPlaceholderColor } from './mat-control-placeholder-color';
import {
    matLineHeight,
    roundRule
} from '../utils/index';

/**
 * Executes `matInputTheme` to handle mat input theme.
 * @zh 执行 `matInputTheme`，用于Material输入属性主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matInputTheme(theme: Theme): Object {
    const lineHeight: number = matLineHeight(theme.typography, 'input') as number;
    const lineSpacing: number = -(lineHeight - 1) / 2;

    return {
        '.mat-mdc-input-element:disabled': {
            "color": matColor(theme.foreground, 'disabled-text')
        },
        'input.mat-mdc-input-element':{
          "color": matColor(theme.foreground, 'text'),
          'margin-top': `${roundRule(lineSpacing)}em ` + ' !important',
        },
        '.mat-mdc-input-element': {
            'caret-color': matColor(theme.primary),
            ...inputPlaceholder(theme)
        },
        '.mat-accent .mat-mdc-input-element': {
            'caret-color': matColor(theme.accent)
        },
        '.mat-warn .mat-mdc-input-element, .mat-mdc-form-field-invalid .mat-mdc-input-element': {
            'caret-color': matColor(theme.warn)
        }
    };
}

/**
 * Executes `inputPlaceholder` to handle input placeholder.
 * @zh 执行 `inputPlaceholder`，用于输入属性占位提示。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function inputPlaceholder(theme: Theme): Object {
    const content: Object = {
        color: matControlPlaceholderColor(theme)
    };

    return {
        '&::placeholder': content,
        '&::-webkit-input-placeholder': content
    };
}
