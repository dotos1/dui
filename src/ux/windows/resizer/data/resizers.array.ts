/**
 * @fileoverview Module `src/ux/windows/resizer/data/resizers.array.ts` providing resizers array definitions and implementation.
 * @zh 模块文件 `src/ux/windows/resizer/data/resizers.array.ts`，提供尺寸调整器数组相关的定义与实现。
 */

import { ResizerEnum } from '../enums';

/**
 * Constant/variable `ɵRESIZERS_ARRAY` defining ɵresizers array in `src/ux/windows/resizer/data`.
 * @internal
 * @zh 常量/变量 `ɵRESIZERS_ARRAY`，定义 `src/ux/windows/resizer/data` 中的ɵRESIZERS数组。
 */
export const ɵRESIZERS_ARRAY: ResizerEnum[] = [
    ResizerEnum.TopLeft,
    ResizerEnum.Top,
    ResizerEnum.TopRight,
    ResizerEnum.Right,
    ResizerEnum.BottomRight,
    ResizerEnum.Bottom,
    ResizerEnum.BottomLeft,
    ResizerEnum.Left
];
