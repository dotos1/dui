/**
 * @fileoverview Module `src/theme/core/cdk-textfield.ts` providing cdk textfield definitions and implementation.
 * @zh 模块文件 `src/theme/core/cdk-textfield.ts`，提供CDK工具textfield相关的定义与实现。
 */

/**
 * Executes `cdkTextfieldAutosize` to handle cdk textfield autosize.
 * @zh 执行 `cdkTextfieldAutosize`，用于CDK工具TextfieldAutosize。
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function cdkTextfieldAutosize(): Object {
    return {
        'textarea.cdk-textarea-autosize': {
            resize: 'none'
        },
        'textarea.cdk-textarea-autosize-measuring': {
            'padding': '2px 0 !important',
            'box-sizing': 'content-box !important',
            'height': 'auto !important',
            'overflow': 'hidden !important'
        },
        'textarea.cdk-textarea-autosize-measuring-firefox': {
            'padding': '2px 0 !important',
            'box-sizing': 'content-box !important',
            'height': '0 !important',
        }
    }
}
/**
 * Executes `cdkTextfieldAutoFill` to handle cdk textfield auto fill.
 * @zh 执行 `cdkTextfieldAutoFill`，用于CDK工具Textfield自动填充。
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function cdkTextfieldAutoFill(): Object {
    return {
        '.cdk-text-field-autofill-monitored:-webkit-autofill': {
        },
        '.cdk-text-field-autofill-monitored:not(:-webkit-autofill)': {
        },
    }
}