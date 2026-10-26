/**
 * @fileoverview Module `src/data/datatable/utils/throttle.ts` providing throttle definitions and implementation.
 * @zh 模块文件 `src/data/datatable/utils/throttle.ts`，提供节流相关的定义与实现。
 */


/**
 * Executes `throttle` to handle throttle.
 * @zh 执行 `throttle`，用于节流。
 * @param func - func parameter (`any`) / func参数（`any`）
 * @param wait - wait parameter (`number`) / wait参数（`number`）
 * @param options - options parameter (`any`) / 配置选项参数（`any`）
 */
export function throttle(func, wait: number, options?) {
  options = options || {};
  let context;
  let args;
  let result;
  let timeout = null;
  let previous = 0;

  function later() {
    previous = options.leading === false ? 0 : +new Date();
    timeout = null;
    result = func.apply(context, args);
  }

  return function (this) {
    const now = +new Date();

    if (!previous && options.leading === false) {
      previous = now;
    }

    const remaining = wait - (now - previous);

    context = this;
    args = arguments;

    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };
}


/**
 * Executes `throttleable` to handle throttleable.
 * @zh 执行 `throttleable`，用于throttleable。
 * @param duration - duration parameter (`number`) / 持续时间参数（`number`）
 * @param options - options parameter (`any`) / 配置选项参数（`any`）
 */
export function throttleable(duration: number, options?) {
  return function innerDecorator(target, key: PropertyKey, descriptor: PropertyDescriptor) {
    return {
      configurable: true,
      enumerable: descriptor.enumerable,
      get: function getter() {
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable: descriptor.enumerable,
          value: throttle(descriptor.value, duration, options)
        });

        return this[key];
      }
    };
  };
}
