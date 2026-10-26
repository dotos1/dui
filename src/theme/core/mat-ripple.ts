/**
 * @fileoverview Module `src/theme/core/mat-ripple.ts` providing mat ripple definitions and implementation.
 * @zh 模块文件 `src/theme/core/mat-ripple.ts`，提供Materialripple相关的定义与实现。
 */

/**
 * Executes `matRipple` to handle mat ripple.
 * @zh 执行 `matRipple`，用于MaterialRipple。
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matRipple(): Object {
    return {
        '.mat-ripple': {
            overflow: 'hidden',
            position: 'relative',
            '&:not(:empty)': {
                transform: 'translateZ(0)'
            }
        },
        '.mat-ripple.mat-ripple-unbounded': {
            overflow: 'visible'
        },
        '.mat-ripple-element': {
            position: 'absolute',
            'border-radius': '50%',
            'pointer-events': 'none',
            transition: 'opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1)',
            transform: 'scale3d(0, 0, 0)'
        }
    };
}
