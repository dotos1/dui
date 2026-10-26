/**
 * @fileoverview Module `src/common/colorpicker/common/helpers/checkboard.ts` providing checkboard definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/common/helpers/checkboard.ts`，提供checkboard相关的定义与实现。
 */

/**
 * Constant/variable `checkboardCache` defining checkboard cache in `src/common/colorpicker/common/helpers`.
 * @zh 常量/变量 `checkboardCache`，定义 `src/common/colorpicker/common/helpers` 中的checkboard缓存。
 */
const checkboardCache: {[key: string]: string} = {};

/**
 * Executes `render` to handle render.
 * @zh 执行 `render`，用于渲染。
 * @param c1 - c1 parameter (`string`) / c1参数（`string`）
 * @param c2 - c2 parameter (`string`) / c2参数（`string`）
 * @param size - size parameter (`number`) / 尺寸参数（`number`）
 */
export function render(c1: string, c2: string, size: number) {
  if (typeof document === 'undefined') {
    return null;
  }
  const canvas = document.createElement('canvas');
  canvas.width = size * 2;
  canvas.height = size * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  } // If no context can be found, return early.
  ctx.fillStyle = c1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = c2;
  ctx.fillRect(0, 0, size, size);
  ctx.translate(size, size);
  ctx.fillRect(0, 0, size, size);
  return canvas.toDataURL();
}

/**
 * Executes `getCheckerboard` to handle get checkerboard.
 * @zh 执行 `getCheckerboard`，用于获取Checkerboard。
 * @param c1 - c1 parameter (`string`) / c1参数（`string`）
 * @param c2 - c2 parameter (`string`) / c2参数（`string`）
 * @param size - size parameter (`number`) / 尺寸参数（`number`）
 */
export function getCheckerboard(c1: string, c2: string, size: number) {
  const key = `${c1}-${c2}-${size}`;
  if (checkboardCache[key]) {
    return checkboardCache[key];
  }
  const checkboard = render(c1, c2, size);
  if (!checkboard) {
    return null;
  }
  checkboardCache[key] = checkboard;
  return checkboard;
}
