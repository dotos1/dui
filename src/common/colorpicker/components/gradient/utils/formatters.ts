/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/utils/formatters.ts` providing formatters definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/utils/formatters.ts`，提供格式化器相关的定义与实现。
 */

import { config } from '../constants';
import { ColorsProps } from '../shared/types';
import { gradientParser } from './gradientParser';


/**
 * Constant/variable `{ defaultColor, defaultGradient }` defining { default color, default gradient } in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `{ defaultColor, defaultGradient }`，定义 `src/common/colorpicker/components/gradient/utils` 中的{默认Color,默认渐变}。
 */
const { defaultColor, defaultGradient } = config

/**
 * Constant/variable `low` defining low in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `low`，定义 `src/common/colorpicker/components/gradient/utils` 中的低。
 */
export const low = (color: ColorsProps) => {
  return color.value.toLowerCase()
}

/**
 * Constant/variable `high` defining high in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `high`，定义 `src/common/colorpicker/components/gradient/utils` 中的高。
 */
export const high = (color: ColorsProps) => {
  return color.value.toUpperCase()
}

/**
 * Constant/variable `getColors` defining get colors in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `getColors`，定义 `src/common/colorpicker/components/gradient/utils` 中的获取颜色列表。
 */
export const getColors = (value: string) => {
  const isGradient = value?.includes('gradient')
  if (isGradient) {
    const isConic = value?.includes('conic')
    const safeValue = !isConic ? value : defaultGradient
    if (isConic) {
      console.log('Sorry we cant handle conic gradients yet')
    }
    const obj = gradientParser(safeValue)
    return obj?.colorStops
  } else {
    const safeValue = value || defaultColor
    return [{ value: safeValue }]
  }
}

/**
 * Constant/variable `formatInputValues` defining format input values in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `formatInputValues`，定义 `src/common/colorpicker/components/gradient/utils` 中的格式化输入属性值列表。
 */
export const formatInputValues = (value: number, min: number, max: number) => {
  return isNaN(value) ? min : value < min ? min : value > max ? max : value
}

/**
 * Constant/variable `round` defining round in `src/common/colorpicker/components/gradient/utils`.
 * @zh 常量/变量 `round`，定义 `src/common/colorpicker/components/gradient/utils` 中的四舍五入。
 */
export const round = (val: number) => {
  return Math.round(val)
}
