/**
 * @fileoverview Module `src/theme/core/cdk-a11y.ts` providing cdk a11y definitions and implementation.
 * @zh 模块文件 `src/theme/core/cdk-a11y.ts`，提供CDK工具a11y相关的定义与实现。
 */

/**
 * Executes `cdkA11y` to handle cdk a11y.
 * @zh 执行 `cdkA11y`，用于CDK工具A11y。
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function cdkA11y(): Object {
    return {
        '.cdk-visually-hidden': {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: '1px',
            margin: '-1px',
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            width: '1px',
            'white-space': 'nowrap',
            outline: 0,
            '-webkit-appearance': 'none',
            '-moz-appearance': 'none',
            left: 0,
            "[dir='rtl'] &": {
                left: 'auto',
                right: 0
              }
        }
    };
}
