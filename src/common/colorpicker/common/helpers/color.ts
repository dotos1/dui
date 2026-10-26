/**
 * @fileoverview Module `src/common/colorpicker/common/helpers/color.ts` providing color definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/common/helpers/color.ts`，提供颜色相关的定义与实现。
 */

import { TinyColor } from '@dotos/dui/core/color';
import { Color } from './color.interfaces';

/**
 * Executes `simpleCheckForValidColor` to handle simple check for valid color.
 * @zh 执行 `simpleCheckForValidColor`，用于simple检查用于有效颜色。
 * @param data - data parameter (`any`) / 数据参数（`any`）
 */
export function simpleCheckForValidColor(data) {
  const keysToCheck = ['r', 'g', 'b', 'a', 'h', 's', 'l', 'v'];
  let checked = 0;
  let passed = 0;
  keysToCheck.forEach(letter => {
    if (!data[letter]) {
      return;
    }
    checked += 1;
    if (!isNaN(data[letter])) {
      passed += 1;
    }
    if (letter === 's' || letter === 'l') {
      const percentPatt = /^\d+%$/;
      if (percentPatt.test(data[letter])) {
        passed += 1;
      }
    }
  });
  return checked === passed ? data : false;
}

/**
 * Executes `toState` to handle to state.
 * @zh 执行 `toState`，用于转换为状态。
 * @param data - data parameter (`any`) / 数据参数（`any`）
 * @param oldHue - old hue parameter (`number`) / 旧色相参数（`number`）
 * @returns Result of type `Color` / 类型为 `Color` 的返回值
 */
export function toState(data, oldHue?: number): Color {
  const color = data.hex ? new TinyColor(data.hex) : new TinyColor(data);
  const hsl = color.toHsl();
  const hsv = color.toHsv();
  const rgb = color.toRgb();
  const hex = color.toHex();
  if (hsl.s === 0) {
    hsl.h = oldHue || 0;
    hsv.h = oldHue || 0;
  }
  const transparent = hex === '000000' && rgb.a === 0;

  return {
    hsl,
    hex: transparent ? 'transparent' : `#${hex}`,
    rgb,
    hsv,
    oldHue: data.h || oldHue || hsl.h,
    source: data.source,
  };
}

/**
 * Executes `isValidHex` to handle is valid hex.
 * @zh 执行 `isValidHex`，用于是否为有效十六进制颜色。
 * @param hex - hex parameter (`string`) / 十六进制颜色参数（`string`）
 */
export function isValidHex(hex: string) {
  return new TinyColor(hex).isValid;
}

/**
 * Executes `getContrastingColor` to handle get contrasting color.
 * @zh 执行 `getContrastingColor`，用于获取对比度颜色。
 * @param data - data parameter (`any`) / 数据参数（`any`）
 */
export function getContrastingColor(data) {
  if (!data) {
    return '#fff';
  }
  const col = toState(data);
  if (col.hex === 'transparent') {
    return 'rgba(0,0,0,0.4)';
  }
  const yiq = (col.rgb.r * 299 + col.rgb.g * 587 + col.rgb.b * 114) / 1000;
  return yiq >= 128 ? '#000' : '#fff';
}
