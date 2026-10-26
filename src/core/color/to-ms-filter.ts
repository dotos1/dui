/**
 * @fileoverview Module `src/core/color/to-ms-filter.ts` providing to ms filter definitions and implementation.
 * @zh 模块文件 `src/core/color/to-ms-filter.ts`，提供转换为毫秒过滤相关的定义与实现。
 */

import { rgbaToArgbHex } from './conversion';
import { ColorInput, TinyColor } from './tinycolor';

/**
 * Executes `toMsFilter` to handle to ms filter.
 * @zh 执行 `toMsFilter`，用于转换为毫秒过滤。
 * @param firstColor - first color parameter (`ColorInput`) / 首个颜色参数（`ColorInput`）
 * @param secondColor - second color parameter (`ColorInput`) / 秒颜色参数（`ColorInput`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function toMsFilter(firstColor: ColorInput, secondColor?: ColorInput): string {
  const color = new TinyColor(firstColor);
  const hex8String = '#' + rgbaToArgbHex(color.r, color.g, color.b, color.a);
  let secondHex8String = hex8String;
  const gradientType: string = color.gradientType ? 'GradientType = 1, ' : '';

  if (secondColor) {
    const s = new TinyColor(secondColor);
    secondHex8String = '#' + rgbaToArgbHex(s.r, s.g, s.b, s.a);
  }

  return `progid:DXImageTransform.Microsoft.gradient(${gradientType}startColorstr=${hex8String},endColorstr=${secondHex8String})`;
}
