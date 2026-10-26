/**
 * @fileoverview Module `src/core/color/util.ts` providing util definitions and implementation.
 * @zh 模块文件 `src/core/color/util.ts`，提供工具相关的定义与实现。
 */


/**
 * Executes `bound01` to handle bound01.
 * @zh 执行 `bound01`，用于bound01。
 * @param n - n parameter (`any`) / n参数（`any`）
 * @param max - max parameter (`number`) / 最大值参数（`number`）
 * @returns Result of type `any` / 类型为 `any` 的返回值
 */
export function bound01(n, max: number) {
  if (isOnePointZero(n)) {
    n = '100%';
  }

  const processPercent = isPercentage(n);
  n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));

  // Automatically convert percentage into number
  if (processPercent) {
    n = parseInt(String(n * max), 10) / 100;
  }

  // Handle floating point rounding errors
  if (Math.abs(n - max) < 0.000001) {
    return 1;
  }

  // Convert into [0, 1] range if it isn't already
  if (max === 360) {
    // If n is a hue given in degrees,
    // wrap around out-of-range values into [0, 360] range
    // then convert into [0, 1].
    n = (n < 0 ? (n % max) + max : n % max) / parseFloat(String(max));
  } else {
    // If n not a hue given in degrees
    // Convert into [0, 1] range if it isn't already.
    n = (n % max) / parseFloat(String(max));
  }

  return n;
}

/**
 * Force a number between 0 and 1
 * @hidden

 * @zh 执行 `clamp01`，用于clamp01。
 */
export function clamp01(val: number): number {
  return Math.min(1, Math.max(0, val));
}

/**
 * Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
 * <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
 * @hidden

 * @zh 执行 `isOnePointZero`，用于是否为One坐标点Zero。
 */
export function isOnePointZero(n: string | number): boolean {
  return typeof n === 'string' && n.includes('.') && parseFloat(n) === 1;
}

/**
 * Check to see if string passed in is a percentage
 * @hidden

 * @zh 执行 `isPercentage`，用于是否为Percentage。
 */
export function isPercentage(n: string | number): boolean {
  return typeof n === 'string' && n.includes('%');
}

/**
 * Return a valid alpha value [0,1] with all invalid values being set to 1
 * @hidden

 * @zh 执行 `boundAlpha`，用于已绑定透明度。
 */
export function boundAlpha(a?: number | string): number {
  a = parseFloat(a as string);

  if (isNaN(a) || a < 0 || a > 1) {
    a = 1;
  }

  return a;
}

/**
 * Replace a decimal with it's percentage value
 * @hidden

 * @zh 执行 `convertToPercentage`，用于转换转换为Percentage。
 */
export function convertToPercentage(n: number | string): number | string {
  if(typeof n === 'number'){
    if (n <= 1) {
      return `${Number(n) * 100}%`;
    }
  }
  return n;
}


/**
 * Executes `pad2` to handle pad2.
 * @zh 执行 `pad2`，用于pad2。
 * @param c - c parameter (`string`) / c参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function pad2(c: string): string {
  return c.length === 1 ? '0' + c : String(c);
}
