/**
 * @fileoverview Module `src/theme/utils/mat-line-base.ts` providing mat line base definitions and implementation.
 * @zh 模块文件 `src/theme/utils/mat-line-base.ts`，提供Material线段基础相关的定义与实现。
 */

/**
 * Executes `matLineBase` to handle mat line base.
 * @zh 执行 `matLineBase`，用于Material线段基础。
 * @param secondaryFontSize - secondary font size parameter (`number | string`) / secondary字体尺寸参数（`number | string`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matLineBase(secondaryFontSize: number | string): Object {
    return {
        '& .mat-line': {
            'white-space': 'nowrap',
            overflow: 'hidden',
            'text-overflow': 'ellipsis',
            display: 'block',
            'box-sizing': 'border-box',
            '&:nth-child(n+2)': {
                'font-size': secondaryFontSize
            }
        }
    };
}
