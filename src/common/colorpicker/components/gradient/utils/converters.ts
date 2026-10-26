/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/utils/converters.ts` providing converters definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/utils/converters.ts`，提供converters相关的定义与实现。
 */

/**
 * Executes `rgb2cmyk` to handle rgb2cmyk.
 * @zh 执行 `rgb2cmyk`，用于rgb2cmyk。
 * @param r - r parameter (`number`) / r参数（`number`）
 * @param g - g parameter (`number`) / g参数（`number`）
 * @param b - b parameter (`number`) / b参数（`number`）
 */
export function rgb2cmyk(r: number, g: number, b: number) {
  let computedC = 0
  let computedM = 0
  let computedY = 0
  let computedK = 0

  if (
    r === null ||
    g === null ||
    b === null ||
    isNaN(r) ||
    isNaN(g) ||
    isNaN(b)
  ) {
    console.log('Please enter numeric RGB values!')
    return { c: 0, m: 0, k: 0, y: 1 }
  }
  if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
    console.log('RGB values must be in the range 0 to 255.')
    return { c: 0, m: 0, k: 0, y: 1 }
  }

  if (r === 0 && g === 0 && b === 0) {
    computedK = 1
    return { c: 0, m: 0, k: 0, y: 1 }
  }

  computedC = 1 - r / 255
  computedM = 1 - g / 255
  computedY = 1 - b / 255

  const minCMY = Math.min(computedC, Math.min(computedM, computedY))
  computedC = (computedC - minCMY) / (1 - minCMY)
  computedM = (computedM - minCMY) / (1 - minCMY)
  computedY = (computedY - minCMY) / (1 - minCMY)
  computedK = minCMY

  return { c: computedC, m: computedM, y: computedY, k: computedK }
}

/**
 * Constant/variable `cmykToRgb` defining cmyk to rgb in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `cmykToRgb`，定义 `src/common/colorpicker/components/gradient/utils` 中的cmyk转换为RGB颜色。
 */
export const cmykToRgb = ({
  c,
  m,
  y,
  k,
}: {
  c: number
  m: number
  y: number
  k: number
}) => {
  const r = 255 * (1 - c) * (1 - k)
  const g = 255 * (1 - m) * (1 - k)
  const b = 255 * (1 - y) * (1 - k)

  return { r: r, g: g, b: b }
}
