/**
 * @fileoverview Module `src/data/datatable/utils/visibility-observer.ts` providing visibility observer definitions and implementation.
 * @zh 模块文件 `src/data/datatable/utils/visibility-observer.ts`，提供visibility观察者相关的定义与实现。
 */

import { NgZone } from '@angular/core';

/**
 * Executes `checkVisibility` to handle check visibility.
 * @zh 执行 `checkVisibility`，用于检查Visibility。
 * @param element - element parameter (`any`) / 元素参数（`any`）
 * @param callback - callback parameter (`any`) / 回调函数参数（`any`）
 * @param zone - zone parameter (`NgZone`) / 区域(NgZone)参数（`NgZone`）
 */
export function checkVisibility(element, callback, zone: NgZone) {
  let timeout;

  function check() {
    // https://davidwalsh.name/offsetheight-visibility
    const { offsetHeight, offsetWidth } = element;

    if (offsetHeight && offsetWidth) {
      clearTimeout(timeout);
      if (callback) zone.run(() => callback());
    } else {
      clearTimeout(timeout);
      zone.runOutsideAngular(() => {
        timeout = setTimeout(() => check(), 50);
      });
    }
  }

  check();
}
