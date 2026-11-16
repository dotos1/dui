/**
 * @fileoverview Module `src/theme/core/focus.ts` providing focus definitions and implementation.
 * @zh 模块文件 `src/theme/core/focus.ts`，提供聚焦相关的定义与实现。
 */

/**
 * Executes `structuralStyling` to handle structural styling.
 * @zh 执行 `structuralStyling`，用于structural样式。
 * @param prefix - prefix parameter (`string`) / 前缀参数（`string`）
 * @returns Result of type `Record<string, unknown>` / 类型为 `Record<string, unknown>` 的返回值
 */
export function structuralStyling(prefix: string): Record<string, unknown> {
    const val: Record<string, unknown> = {};
    val['.' + prefix + '-focus-indicator'] = {
        position: 'relative',
        '&::before': {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
            'box-sizing': 'border-box',
            'pointer-events': 'none',
            display: 'var(--mat-focus-indicator-display, none)',
            'border-width': 'var(--mat-focus-indicator-border-width, 3px)',
            'border-style': 'var(--mat-focus-indicator-border-style, solid)',
            'border-color': 'var(--mat-focus-indicator-border-color, transparent)',
            'border-radius': 'var(--mat-focus-indicator-border-radius, 4px)'
        },
        '&:focus-visible::before': {
            content: '""'
        }
    };
    return val;
}
/**
 * Executes `matFocus` to handle mat focus.
 * @zh 执行 `matFocus`，用于Material聚焦。
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matFocus(): Object {
    return structuralStyling('mat');
}
/**
 * Executes `mdcFocus` to handle mdc focus.
 * @zh 执行 `mdcFocus`，用于MDC组件聚焦。
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function mdcFocus(): Object {
    return structuralStyling('mat-mdc');
}