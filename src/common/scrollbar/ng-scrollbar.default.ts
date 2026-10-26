/**
 * @fileoverview Module `src/common/scrollbar/ng-scrollbar.default.ts` providing ng scrollbar default definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/ng-scrollbar.default.ts`，提供Angular滚动条默认相关的定义与实现。
 */

import { NgScrollbarOptions } from './ng-scrollbar.model';

/**
 * Constant/variable `defaultOptions` defining default options in `src/common/scrollbar`.
 * @zh 常量/变量 `defaultOptions`，定义 `src/common/scrollbar` 中的默认配置选项。
 */
export const defaultOptions: NgScrollbarOptions = {
  trackClass: '',
  thumbClass: '',
  buttonClass: '',
  orientation: 'auto',
  appearance: 'native',
  visibility: 'native',
  position: 'native',
  trackScrollDuration: 50,
  sensorThrottleTime: 0,
  disableSensor: false,
  disableInteraction: false,
  buttons: false,
  hoverOffset: false
};


/**
 * Constant/variable `defaultScrollTimelinePolyfill` defining default scroll timeline polyfill in `src/common/scrollbar`.
 * @zh 常量/变量 `defaultScrollTimelinePolyfill`，定义 `src/common/scrollbar` 中的默认滚动时间轴Polyfill。
 */
export const defaultScrollTimelinePolyfill: string = '/assets/polyfill/scroll-timeline-lite.js';
