/**
 * @fileoverview Module `src/core/color/conversion.ts` providing conversion definitions and implementation.
 * @zh 模块文件 `src/core/color/conversion.ts`，提供conversion相关的定义与实现。
 */

import { bound01, pad2 } from './util';
import { RGB, HSL, HSV, Numberify } from './interfaces';



 /**
  * Executes `rgbToRgb1` to handle rgb to rgb1.
  * @zh 执行 `rgbToRgb1`，用于RGB颜色转换为Rgb1。
  * @param r - r parameter (`number`) / r参数（`number`）
  * @param g - g parameter (`number`) / g参数（`number`）
  * @param b - b parameter (`number`) / b参数（`number`）
  * @returns Result of type `Numberify<RGB>` / 类型为 `Numberify<RGB>` 的返回值
  */
 export function rgbToRgb1(r: number, g: number, b: number): Numberify<RGB> {
  return {
    r: Math.round( 255*r),
    g: Math.round(g*255),
    b: Math.round(b*255),
  };
}

/**
 * Executes `rgbToRgb` to handle rgb to rgb.
 * @zh 执行 `rgbToRgb`，用于RGB颜色转换为RGB颜色。
 * @param r - r parameter (`number`) / r参数（`number`）
 * @param g - g parameter (`number`) / g参数（`number`）
 * @param b - b parameter (`number`) / b参数（`number`）
 * @returns Result of type `Numberify<RGB>` / 类型为 `Numberify<RGB>` 的返回值
 */
export function rgbToRgb(r: number, g: number, b: number): Numberify<RGB> {
  return {
    r: bound01(r, 255) * 255,
    g: bound01(g, 255) * 255,
    b: bound01(b, 255) * 255,
  };
}

/**
 * Converts an RGB color value to HSL.
 * *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
 * *Returns:* { h, s, l } in [0,1]

 * @zh 执行 `rgbToHsl`，用于RGB颜色转换为HSL颜色。
 */
export function rgbToHsl(r: number, g: number, b: number): Numberify<HSL> {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    s = 0;
    h = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d) + (g < b ? 6 : 0);
        break;
      case g:
        h = ((b - r) / d) + 2;
        break;
      case b:
        h = ((r - g) / d) + 4;
        break;
      default:
        break;
    }

    h /= 6;
  }

  return { h, s, l };
}

/**
 * Executes `hue2rgb` to handle hue2rgb.
 * @zh 执行 `hue2rgb`，用于hue2rgb。
 * @param p - p parameter (`number`) / p参数（`number`）
 * @param q - q parameter (`number`) / q参数（`number`）
 * @param t - t parameter (`number`) / t参数（`number`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) {
    t += 1;
  }

  if (t > 1) {
    t -= 1;
  }

  if (t < 1 / 6) {
    return p + ((q - p) * (6 * t));
  }

  if (t < 1 / 2) {
    return q;
  }

  if (t < 2 / 3) {
    return p + ((q - p) * ((2 / 3) - t) * 6);
  }

  return p;
}

/**
 * Converts an HSL color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]

 * @zh 执行 `hslToRgb`，用于HSL颜色转换为RGB颜色。
 */
export function hslToRgb(h: number, s: number, l: number): Numberify<RGB> {
  let r;
  let g;
  let b;

  h = bound01(h, 360);
  s = bound01(s, 100);
  l = bound01(l, 100);

  if (s === 0) {
    // achromatic
    g = l;
    b = l;
    r = l;
  } else {
    const q = l < 0.5 ? (l * (1 + s)) : (l + s - (l * s));
    const p = (2 * l) - q;
    r = hue2rgb(p, q, h + (1 / 3));
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - (1 / 3));
  }

  return { r: r * 255, g: g * 255, b: b * 255 };
}

/**
 * Converts an RGB color value to HSV
 *
 * *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
 * *Returns:* { h, s, v } in [0,1]

 * @zh 执行 `rgbToHsv`，用于RGB颜色转换为HSV颜色。
 */
export function rgbToHsv(r: number, g: number, b: number): Numberify<HSV> {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = ((g - b) / d) + (g < b ? 6 : 0);
        break;
      case g:
        h = ((b - r) / d) + 2;
        break;
      case b:
        h = ((r - g) / d) + 4;
        break;
      default:
        break;
    }

    h /= 6;
  }

  return { h, s, v };
}

/**
 * Converts an HSV color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]

 * @zh 执行 `hsvToRgb`，用于HSV颜色转换为RGB颜色。
 */
export function hsvToRgb(h: number, s: number, v: number): Numberify<RGB> {
  h = bound01(h, 360) * 6;
  s = bound01(s, 100);
  v = bound01(v, 100);

  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - (f * s));
  const t = v * (1 - ((1 - f) * s));
  const mod = i % 6;
  const r = [v, q, p, p, t, v][mod];
  const g = [t, v, v, q, p, p][mod];
  const b = [p, p, t, v, v, q][mod];

  return { r: r * 255, g: g * 255, b: b * 255 };
}

/**
 * Converts an RGB color to hex
 *
 * Assumes r, g, and b are contained in the set [0, 255]
 * Returns a 3 or 6 character hex

 * @zh 执行 `rgbToHex`，用于RGB颜色转换为十六进制颜色。
 */
export function rgbToHex(r: number, g: number, b: number, allow3Char: boolean): string {
  const hex = [
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16)),
  ];

  // Return a 3 character hex if possible
  if (
    allow3Char &&
    hex[0].startsWith(hex[0].charAt(1)) &&
    hex[1].startsWith(hex[1].charAt(1)) &&
    hex[2].startsWith(hex[2].charAt(1))
  ) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
  }

  return hex.join('');
}


/**
 * Executes `rgbaToHex` to handle rgba to hex.
 * @zh 执行 `rgbaToHex`，用于RGBA颜色转换为十六进制颜色。
 * @param r - r parameter (`number`) / r参数（`number`）
 * @param g - g parameter (`number`) / g参数（`number`）
 * @param b - b parameter (`number`) / b参数（`number`）
 * @param a - a parameter (`number`) / a参数（`number`）
 * @param allow4Char - allow4 char parameter (`boolean`) / allow4字符参数（`boolean`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function rgbaToHex(r: number, g: number, b: number, a: number, allow4Char: boolean): string {
  const hex = [
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16)),
    pad2(convertDecimalToHex(a)),
  ];

  // Return a 4 character hex if possible
  if (
    allow4Char &&
    hex[0].startsWith(hex[0].charAt(1)) &&
    hex[1].startsWith(hex[1].charAt(1)) &&
    hex[2].startsWith(hex[2].charAt(1)) &&
    hex[3].startsWith(hex[3].charAt(1))
  ) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
  }

  return hex.join('');
}

/**
 * Converts an RGBA color to an ARGB Hex8 string
 * Rarely used, but required for "toFilter()"

 * @zh 执行 `rgbaToArgbHex`，用于RGBA颜色转换为Argb十六进制颜色。
 */
export function rgbaToArgbHex(r: number, g: number, b: number, a: number): string {
  const hex = [
    pad2(convertDecimalToHex(a)),
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16)),
  ];

  return hex.join('');
}

/**
 * Converts a decimal to a hex value
 * @zh 执行 `convertDecimalToHex`，用于转换Decimal转换为十六进制颜色。
 */
export function convertDecimalToHex(d: string | number): string {
  return Math.round(parseFloat(d as string) * 255).toString(16);
}

/**
 * Converts a hex value to a decimal
 * @zh 执行 `convertHexToDecimal`，用于转换十六进制颜色转换为Decimal。
 */
export function convertHexToDecimal(h: string): number {
  return parseIntFromHex(h) / 255;
}

/**
 * Parse a base-16 hex value into a base-10 integer
 * @zh 执行 `parseIntFromHex`，用于解析Int从十六进制颜色。
 */
export function parseIntFromHex(val: string): number {
  return parseInt(val, 16);
}
