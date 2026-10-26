/**
 * @fileoverview Module `src/common/scrollbar/smooth-scroll/smooth-scroll.default.ts` providing smooth scroll default definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/smooth-scroll/smooth-scroll.default.ts`，提供smooth滚动默认相关的定义与实现。
 */

import { SmoothScrollToOptions } from './smooth-scroll.model';

/**
 * Constant/variable `defaultSmoothScrollOptions` defining default smooth scroll options in `src/common/scrollbar/smooth-scroll`.
 * @zh 常量/变量 `defaultSmoothScrollOptions`，定义 `src/common/scrollbar/smooth-scroll` 中的默认Smooth滚动配置选项。
 */
export const defaultSmoothScrollOptions: SmoothScrollToOptions = {
  duration: 468,
  easing: {
    x1: 0.42,
    y1: 0,
    x2: 0.58,
    y2: 1
  }
};
