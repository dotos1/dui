/**
 * Constant/variable `IS_TOUCH_DEVICE` defining is touch device in `src/common/resize-element/util`.
 * @hidden

 * @zh 常量/变量 `IS_TOUCH_DEVICE`，定义 `src/common/resize-element/util` 中的是否为触摸DEVICE。
 */
export const IS_TOUCH_DEVICE: boolean = (() => {
  // In case we're in Node.js environment.
  if (typeof window === 'undefined') {
    return false;
  } else {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as unknown as { msMaxTouchPoints: number }).msMaxTouchPoints >
        0
    );
  }
})();
