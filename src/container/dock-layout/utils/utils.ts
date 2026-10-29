/**
 * @fileoverview Module `src/container/dock-layout/utils/utils.ts` providing utils definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/utils/utils.ts`，提供工具集相关的定义与实现。
 */

import { WidthAndHeight } from './types';

/**
 * Executes `numberToPixels` to handle number to pixels.
 * @internal
 * @zh 执行 `numberToPixels`，用于数字转换为像素。
 */
export function numberToPixels(value: number): string {
    return value.toString(10) + 'px';
}

/**
 * Executes `pixelsToNumber` to handle pixels to number.
 * @internal
 * @zh 执行 `pixelsToNumber`，用于像素转换为数字。
 */
export function pixelsToNumber(value: string): number {
    const numberStr = value.replace("px", "");
    return parseFloat(numberStr);
}

/**
 * Interface `SplitStringAtFirstNonNumericCharResult` defining the contract and properties for split string at first non numeric char result.
 * @internal
 * @zh 接口 `SplitStringAtFirstNonNumericCharResult`，定义分割面板字符串位于首个NonNumeric字符结果的数据结构契约与属性规范。
 */
export interface SplitStringAtFirstNonNumericCharResult {
    /**
     * Property `numericPart` (`string`) storing numeric part.
     * @zh 属性 `numericPart`（类型：`string`），用于存储或配置numericPart。
     */
    numericPart: string;
    /**
     * Property `firstNonNumericCharPart` (`string`) storing first non numeric char part.
     * @zh 属性 `firstNonNumericCharPart`（类型：`string`），用于存储或配置首个NonNumeric字符Part。
     */
    firstNonNumericCharPart: string;
}

/**
 * Executes `splitStringAtFirstNonNumericChar` to handle split string at first non numeric char.
 * @internal
 * @zh 执行 `splitStringAtFirstNonNumericChar`，用于分割面板字符串位于首个NonNumeric字符。
 */
export function splitStringAtFirstNonNumericChar(value: string): SplitStringAtFirstNonNumericCharResult {
    value = value.trimStart();

    const length = value.length;
    if (length === 0) {
        return { numericPart: '', firstNonNumericCharPart: '' }
    } else {
        let firstNonDigitPartIndex = length;
        let gotDecimalPoint = false;
        for (let i = 0; i < length; i++) {
            const char = value[i];
            if (!isDigit(char)) {
                if (char !== '.') {
                    firstNonDigitPartIndex = i;
                    break;
                } else {
                    if (gotDecimalPoint) {
                        firstNonDigitPartIndex = i;
                        break;
                    } else {
                        gotDecimalPoint = true;
                    }
                }
            }
        }
        const digitsPart = value.substring(0, firstNonDigitPartIndex);
        const firstNonDigitPart = value.substring(firstNonDigitPartIndex).trim();

        return { numericPart: digitsPart, firstNonNumericCharPart: firstNonDigitPart };
    }
}

/**
 * Executes `isDigit` to handle is digit.
 * @internal
 * @zh 执行 `isDigit`，用于是否为Digit。
 */
export function isDigit(char: string) {
    return char >= '0' && char <= '9';
}

/**
 * Executes `getElementWidth` to handle get element width.
 * @internal
 * @zh 执行 `getElementWidth`，用于获取元素宽度。
 */
export function getElementWidth(element: HTMLElement): number {
    return element.offsetWidth;
}

/**
 * Executes `setElementWidth` to handle set element width.
 * @internal
 * @zh 执行 `setElementWidth`，用于集合元素宽度。
 */
export function setElementWidth(element: HTMLElement, width: number): void {
    const widthAsPixels = numberToPixels(width);
    element.style.width = widthAsPixels;
}

/**
 * Executes `getElementHeight` to handle get element height.
 * @internal
 * @zh 执行 `getElementHeight`，用于获取元素高度。
 */
export function getElementHeight(element: HTMLElement): number {
    return element.offsetHeight;
}

/**
 * Executes `setElementHeight` to handle set element height.
 * @internal
 * @zh 执行 `setElementHeight`，用于集合元素高度。
 */
export function setElementHeight(element: HTMLElement, height: number): void {
    const heightAsPixels = numberToPixels(height);
    element.style.height = heightAsPixels;
}

/**
 * Executes `getElementWidthAndHeight` to handle get element width and height.
 * @internal
 * @zh 执行 `getElementWidthAndHeight`，用于获取元素宽度And高度。
 */
export function getElementWidthAndHeight(element: HTMLElement): WidthAndHeight {
    return {
        width: element.offsetWidth,
        height: element.offsetHeight,
    };
}

/**
 * Executes `setElementDisplayVisibility` to handle set element display visibility.
 * @internal
 * @zh 执行 `setElementDisplayVisibility`，用于集合元素DisplayVisibility。
 */
export function setElementDisplayVisibility(element: HTMLElement, visible: boolean): void {
    if (visible) {
        element.style.display = '';
    } else {
        element.style.display = 'none';
    }
}

/**
 * Executes `ensureElementPositionAbsolute` to handle ensure element position absolute.
 * @internal
 * @zh 执行 `ensureElementPositionAbsolute`，用于确保元素位置Absolute。
 */
export function ensureElementPositionAbsolute(element: HTMLElement): void {
    const absolutePosition = 'absolute';
    if (element.style.position !== absolutePosition) {
        element.style.position = absolutePosition;
    }
}

/**
 * Replacement for JQuery $.extend(target, obj)
 * @internal

 * @zh 执行 `extend`，用于extend。
 */
export function extend(target: Record<string, unknown>, obj: Record<string, unknown>): Record<string, unknown> {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            target[key] = obj[key];
        }
    }
    return target;
}

/**
 * Replacement for JQuery $.extend(true, target, obj)
 * @internal

 * @zh 执行 `deepExtend`，用于deepExtend。
 */
export function deepExtend(target: Record<string, unknown>, obj: Record<string, unknown> | undefined): Record<string, unknown> {
    if (obj !== undefined) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                const existingTarget = target[key];
                target[key] = deepExtendValue(existingTarget, value);
            }
        }
    }

    return target;
}

/**
 * Executes `deepExtendValue` to handle deep extend value.
 * @internal
 * @zh 执行 `deepExtendValue`，用于deepExtend值。
 */
export function deepExtendValue(existingTarget: unknown, value: unknown): unknown {
    if (typeof value !== 'object') {
        return value;
    } else {
        if (Array.isArray(value)) {
            const length = value.length;
            const targetArray = new Array<unknown>(length);
            for (let i = 0; i < length; i++) {
                const element = value[i];
                targetArray[i] = deepExtendValue({}, element);
            }
            return targetArray;
        } else {
            if (value === null) {
                return null;
            } else {
                const valueObj = value as Record<string, unknown>;
                if (existingTarget === undefined) {
                    return deepExtend({}, valueObj); // overwrite
                } else {
                    if (typeof existingTarget !== "object") {
                        return deepExtend({}, valueObj); // overwrite
                    } else {
                        if (Array.isArray(existingTarget)) {
                            return deepExtend({}, valueObj); // overwrite
                        } else {
                            if (existingTarget === null) {
                                return deepExtend({}, valueObj); // overwrite
                            } else {
                                const existingTargetObj = existingTarget as Record<string, unknown>;
                                return deepExtend(existingTargetObj, valueObj); // merge
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * Executes `removeFromArray` to handle remove from array.
 * @internal
 * @zh 执行 `removeFromArray`，用于移除从数组。
 */
export function removeFromArray<T>(item: T, array: T[]): void {
    const index = array.indexOf(item);

    if (index === -1) {
        throw new Error('Can\'t remove item from array. Item is not in the array');
    }

    array.splice(index, 1);
}

/**
 * Executes `getUniqueId` to handle get unique id.
 * @internal
 * @zh 执行 `getUniqueId`，用于获取唯一唯一标识。
 */
export function getUniqueId(): string {
    return (Math.random() * 1000000000000000)
        .toString(36)
        .replace('.', '');
}

/**
 * Executes `getErrorMessage` to handle get error message.
 * @internal
 * @zh 执行 `getErrorMessage`，用于获取错误消息。
 */
export function getErrorMessage(e: unknown): string {
    if (e instanceof Error) {
        return e.message;
    } else {
        if (typeof e === 'string') {
            return e;
        } else {
            return 'Unknown Error';
        }
    }
}
