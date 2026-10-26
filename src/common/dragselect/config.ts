/**
 * @fileoverview Module `src/common/dragselect/config.ts` providing config definitions and implementation.
 * @zh 模块文件 `src/common/dragselect/config.ts`，提供配置相关的定义与实现。
 */

import { DragToSelectConfig } from './models';

/**
 * Constant/variable `DEFAULT_CONFIG` defining default config in `src/common/dragselect`.
 * @zh 常量/变量 `DEFAULT_CONFIG`，定义 `src/common/dragselect` 中的默认配置。
 */
export const DEFAULT_CONFIG: DragToSelectConfig = {
  selectedClass: 'selected',
  shortcuts: {
    moveRangeStart: 'shift+r',
    disableSelection: 'alt',
    toggleSingleItem: 'meta',
    addToSelection: 'shift',
    removeFromSelection: 'shift+meta'
  }
};
