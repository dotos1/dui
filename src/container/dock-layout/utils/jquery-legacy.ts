/**
 * @fileoverview Module `src/container/dock-layout/utils/jquery-legacy.ts` providing jquery legacy definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/utils/jquery-legacy.ts`，提供jquerylegacy相关的定义与实现。
 */

import { LeftAndTop } from './types';
import { pixelsToNumber } from './utils';

/**
 * Executes `getJQueryLeftAndTop` to handle get j query left and top.
 * @internal
 * @zh 执行 `getJQueryLeftAndTop`，用于获取J查询左侧位置And顶部位置。
 */
export function getJQueryLeftAndTop(element: HTMLElement): LeftAndTop {
    const style = getComputedStyle(element, null);
    const leftAndTop: LeftAndTop = {
        left: pixelsToNumber(style.left),
        top: pixelsToNumber(style.top),
    }
    return leftAndTop;
}
