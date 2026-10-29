/**
 * @fileoverview Module `src/core/color/tinycolor.ts` providing tinycolor definitions and implementation.
 * @zh 模块文件 `src/core/color/tinycolor.ts`，提供tinycolor相关的定义与实现。
 */

import { rgbaToHex, rgbToHex, rgbToHsl, rgbToHsv } from './conversion';
import { names } from './css-color-names';
import { inputToRGB } from './format-input';
import { HSL, HSLA, HSV, HSVA, RGB, RGBA, Numberify } from './interfaces';
import { bound01, boundAlpha, clamp01 } from './util';

/**
 * Interface `TinyColorOptions` defining the contract and properties for tiny color options.
 * @zh 接口 `TinyColorOptions`，定义Tiny颜色配置选项的数据结构契约与属性规范。
 */
export interface TinyColorOptions {
  /**
   * Property `format` (`string`) storing format.
   * @zh 属性 `format`（类型：`string`），用于存储或配置格式化。
   */
  format: string;
  /**
   * Property `gradientType` (`string`) storing gradient type.
   * @zh 属性 `gradientType`（类型：`string`），用于存储或配置渐变类型。
   */
  gradientType: string;
}

/**
 * Type alias `ColorInput` representing color input (`string | RGB | RGBA | HSL | HSLA | HSV | HSVA | TinyColor`).
 * @zh 类型别名 `ColorInput`，表示颜色输入属性（`string | RGB | RGBA | HSL | HSLA | HSV | HSVA | TinyColor`）。
 */
export type ColorInput = string | RGB | RGBA | HSL | HSLA | HSV | HSVA | TinyColor;

/**
 * Type alias `ColorFormats` representing color formats (`| 'rgb' | 'prgb' | 'hex' | 'hex3' | 'hex4' | 'hex6' | 'hex8' | 'name'...`).
 * @zh 类型别名 `ColorFormats`，表示颜色格式列表（`| 'rgb' | 'prgb' | 'hex' | 'hex3' | 'hex4' | 'hex6' | 'hex8' | 'name'...`）。
 */
export type ColorFormats =
  | 'rgb'
  | 'prgb'
  | 'hex'
  | 'hex3'
  | 'hex4'
  | 'hex6'
  | 'hex8'
  | 'name'
  | 'hsl'
  | 'hsv';

/**
 * Class `TinyColor` encapsulating tiny color data structures and logic in `src/core/color`.
 * @zh 类 `TinyColor`，封装 `src/core/color` 中的Tiny颜色数据结构与处理逻辑。
 */
export class TinyColor {
  /**
   * red
   * @zh 属性 `r`（类型：`number`），用于存储或配置r。
   */
  r!: number;

  /**
   * green
   * @zh 属性 `g`（类型：`number`），用于存储或配置g。
   */
  g!: number;

  /**
   * blue
   * @zh 属性 `b`（类型：`number`），用于存储或配置b。
   */
  b!: number;

  /**
   * alpha
   * @zh 属性 `a`（类型：`number`），用于存储或配置a。
   */
  a!: number;

  /**
   * the format used to create the tinycolor instance
   * @zh 属性 `format`（类型：`ColorFormats`），用于存储或配置格式化。
   */
  format!: ColorFormats;

  /**
   * input passed into the constructer used to create the tinycolor instance
   * @zh 属性 `originalInput`（类型：`ColorInput`），用于存储或配置原始输入属性。
   */
  originalInput!: ColorInput;

  /**
   * the color was successfully parsed
   * @zh 属性 `isValid`（类型：`boolean`），用于存储或配置是否为有效。
   */
  isValid!: boolean;

  /**
   * Property `gradientType` (`string`) storing gradient type.
   * @zh 属性 `gradientType`（类型：`string`），用于存储或配置渐变类型。
   */
  gradientType?: string;

  /**
   * rounded alpha
   * @zh 属性 `roundA`（类型：`number`），用于存储或配置四舍五入A。
   */
  roundA!: number;

  /**
   * Creates an instance of `TinyColor` and initializes its dependencies and internal state.
   * @zh 创建 `TinyColor` 实例，并初始化其依赖项与内部状态。
   * @param color - Injected or initial color (`ColorInput`) / 注入或传入的颜色（`ColorInput`）
   * @param opts - Injected or initial opts (`Partial<TinyColorOptions>`) / 注入或传入的选项列表（`Partial<TinyColorOptions>`）
   */
  constructor(color: ColorInput = '', opts: Partial<TinyColorOptions> = {}) {
    // If input is already a tinycolor, return itself
    if (color instanceof TinyColor) {
      return color;
    }

    this.originalInput = color;
    const rgb = inputToRGB(color);
    this.originalInput = color;
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;
    this.a = rgb.a;
    this.roundA = Math.round(100 * this.a) / 100;
    this.format = opts.format ? rgb.format:null;
    this.gradientType = opts.gradientType;

    if (this.r < 1) {
      this.r = Math.round(this.r);
    }

    if (this.g < 1) {
      this.g = Math.round(this.g);
    }

    if (this.b < 1) {
      this.b = Math.round(this.b);
    }

    this.isValid = rgb.ok;
  }

  /**
   * Executes `isDark` to handle is dark.
   * @zh 执行 `isDark`，用于是否为深色。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isDark(): boolean {
    return this.getBrightness() < 128;
  }

  /**
   * Executes `isLight` to handle is light.
   * @zh 执行 `isLight`，用于是否为浅色。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isLight(): boolean {
    return !this.isDark();
  }

  /**
   * Returns the perceived brightness of the color, from 0-255.

   * @zh 执行 `getBrightness`，用于获取明度。
   */
  getBrightness(): number {
    // http://www.w3.org/TR/AERT#color-contrast
    const rgb = this.toRgb();
    return ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
  }

  /**
   * Returns the perceived luminance of a color, from 0-1.

   * @zh 执行 `getLuminance`，用于获取Luminance。
   */
  getLuminance(): number {
    // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    const rgb = this.toRgb();
    let R;
    let G;
    let B;
    const RsRGB = rgb.r / 255;
    const GsRGB = rgb.g / 255;
    const BsRGB = rgb.b / 255;

    if (RsRGB <= 0.03928) {
      R = RsRGB / 12.92;
    } else {
      R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    }

    if (GsRGB <= 0.03928) {
      G = GsRGB / 12.92;
    } else {
      G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    }

    if (BsRGB <= 0.03928) {
      B = BsRGB / 12.92;
    } else {
      B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
    }

    return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
  }

  /**
   * Returns the alpha value of a color, from 0-1.

   * @zh 执行 `getAlpha`，用于获取透明度。
   */
  getAlpha(): number {
    return this.a;
  }

  /**
   * Sets the alpha value on the current color.
   *
   * @param alpha - The new alpha value. The accepted range is 0-1.

   * @zh 执行 `setAlpha`，用于集合透明度。
   */
  setAlpha(alpha?: string | number): TinyColor {
    this.a = boundAlpha(alpha);
    this.roundA = Math.round(100 * this.a) / 100;
    return this;
  }

  /**
   * Returns the object as a HSVA object.

   * @zh 执行 `toHsv`，用于转换为HSV颜色。
   */
  toHsv(): Numberify<HSVA> {
    const hsv = rgbToHsv(this.r, this.g, this.b);
    return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
  }

  /**
   * Returns the hsva values interpolated into a string with the following format:
   * "hsva(xxx, xxx, xxx, xx)".

   * @zh 执行 `toHsvString`，用于转换为HSV颜色字符串。
   */
  toHsvString(): string {
    const hsv = rgbToHsv(this.r, this.g, this.b);
    const h = Math.round(hsv.h * 360);
    const s = Math.round(hsv.s * 100);
    const v = Math.round(hsv.v * 100);
    return this.a === 1 ? `hsv(${h}, ${s}%, ${v}%)` : `hsva(${h}, ${s}%, ${v}%, ${this.roundA})`;
  }

  /**
   * Returns the object as a HSLA object.

   * @zh 执行 `toHsl`，用于转换为HSL颜色。
   */
  toHsl(): Numberify<HSLA> {
    const hsl = rgbToHsl(this.r, this.g, this.b);
    return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
  }

  /**
   * Returns the hsla values interpolated into a string with the following format:
   * "hsla(xxx, xxx, xxx, xx)".

   * @zh 执行 `toHslString`，用于转换为HSL颜色字符串。
   */
  toHslString(): string {
    const hsl = rgbToHsl(this.r, this.g, this.b);
    const h = Math.round(hsl.h * 360);
    const s = Math.round(hsl.s * 100);
    const l = Math.round(hsl.l * 100);
    return this.a === 1 ? `hsl(${h}, ${s}%, ${l}%)` : `hsla(${h}, ${s}%, ${l}%, ${this.roundA})`;
  }

  /**
   * Returns the hex value of the color.
   * @param allow3Char will shorten hex value to 3 char if possible

   * @zh 执行 `toHex`，用于转换为十六进制颜色。
   */
  toHex(allow3Char = false): string {
      return rgbToHex(this.r, this.g, this.b, allow3Char);
  }

  /**
   * Returns the hex value of the color -with a # appened.
   * @param allow3Char will shorten hex value to 3 char if possible

   * @zh 执行 `toHexString`，用于转换为十六进制颜色字符串。
   */
  toHexString(allow3Char = false): string {
    return '#' + this.toHex(allow3Char);
  }

  /**
   * Executes `toHexStr` to handle to hex str.
   * @zh 执行 `toHexStr`，用于转换为十六进制颜色字符串。
   * @param backgroundColor - background color parameter (`any`) / 背景颜色参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  toHexStr(backgroundColor): string {
    return '#' + this.toAlphaHex(backgroundColor);
  }

  /**
   * Executes `toAlphaHex` to handle to alpha hex.
   * @zh 执行 `toAlphaHex`，用于转换为透明度十六进制颜色。
   * @param backgroundColor - background color parameter (`any`) / 背景颜色参数（`any`）
   * @param allow3Char - allow3 char parameter (`boolean`) / allow3字符参数（`boolean`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  toAlphaHex(backgroundColor,allow3Char = false): string {
      let r=((1 - this.a) * backgroundColor.r) + (this.a * this.r);
      let g=((1 - this.a) * backgroundColor.g) + (this.a * this.g);
      let b=((1 - this.a) * backgroundColor.b) + (this.a * this.b);
      return rgbToHex(r,g, b, allow3Char);
  }

  /**
   * Returns the hex 8 value of the color.
   * @param allow4Char will shorten hex value to 4 char if possible

   * @zh 执行 `toHex8`，用于转换为Hex8。
   */
  toHex8(allow4Char = false): string {
    return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
  }

  /**
   * Returns the hex 8 value of the color -with a # appened.
   * @param allow4Char will shorten hex value to 4 char if possible

   * @zh 执行 `toHex8String`，用于转换为Hex8字符串。
   */
  toHex8String(allow4Char = false): string {
    return '#' + this.toHex8(allow4Char);
  }

  /**
   * Returns the object as a RGBA object.

   * @zh 执行 `toRgb`，用于转换为RGB颜色。
   */
  toRgb(): Numberify<RGBA> {
    return {
      r: Math.round(this.r),
      g: Math.round(this.g),
      b: Math.round(this.b),
      a: this.a,
    };
  }

  /**
   * Executes `toRgbString` to handle to rgb string.
   * @zh 执行 `toRgbString`，用于转换为RGB颜色字符串。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  toRgbString(): string {
    const r = Math.round(this.r);
    const g = Math.round(this.g);
    const b = Math.round(this.b);
    return this.a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${this.roundA})`;
  }

  /**
   * Returns the object as a RGBA object.

   * @zh 执行 `toPercentageRgb`，用于转换为PercentageRGB颜色。
   */
  toPercentageRgb(): RGBA {
    const fmt = (x: number): string => `${Math.round(bound01(x, 255) * 100)}%`;
    return {
      r: fmt(this.r),
      g: fmt(this.g),
      b: fmt(this.b),
      a: this.a,
    };
  }

  /**
   * Returns the RGBA relative values interpolated into a string

   * @zh 执行 `toPercentageRgbString`，用于转换为PercentageRGB颜色字符串。
   */
  toPercentageRgbString(): string {
    const rnd = (x: number): number => Math.round(bound01(x, 255) * 100);
    return this.a === 1 ?
      `rgb(${rnd(this.r)}%, ${rnd(this.g)}%, ${rnd(this.b)}%)` :
      `rgba(${rnd(this.r)}%, ${rnd(this.g)}%, ${rnd(this.b)}%, ${this.roundA})`;
  }

  /**
   * The 'real' name of the color -if there is one.

   * @zh 执行 `toName`，用于转换为名称。
   */
  toName(): string | false {
    if (this.a === 0) {
      return 'transparent';
    }

    if (this.a < 1) {
      return false;
    }

    const hex = '#' + rgbToHex(this.r, this.g, this.b, false);
    for (const key of Object.keys(names)) {
      if (names[key] === hex) {
        return key;
      }
    }

    return false;
  }

  /**
   * String representation of the color.
   *
   * @param format - The format to be used when displaying the string representation.

   * @zh 执行 `toString`，用于转换为字符串。
   */
  toString(format?: ColorFormats): string | false {
    const formatSet = format;
    format = format ? this.format:null;

    let formattedString: string | false = false;
    const hasAlpha = this.a < 1 && this.a >= 0;
    const needsAlphaFormat =
      !formatSet && hasAlpha && (format.startsWith('hex') || format === 'name');

    if (needsAlphaFormat) {
      // Special case for "transparent", all other non-alpha formats
      // will return rgba when there is transparency.
      if (format === 'name' && this.a === 0) {
        return this.toName();
      }

      return this.toRgbString();
    }

    if (format === 'rgb') {
      formattedString = this.toRgbString();
    }

    if (format === 'prgb') {
      formattedString = this.toPercentageRgbString();
    }

    if (format === 'hex' || format === 'hex6') {
      formattedString = this.toHexString();
    }

    if (format === 'hex3') {
      formattedString = this.toHexString(true);
    }

    if (format === 'hex4') {
      formattedString = this.toHex8String(true);
    }

    if (format === 'hex8') {
      formattedString = this.toHex8String();
    }

    if (format === 'name') {
      formattedString = this.toName();
    }

    if (format === 'hsl') {
      formattedString = this.toHslString();
    }

    if (format === 'hsv') {
      formattedString = this.toHsvString();
    }

    return formattedString || this.toHexString();
  }

  /**
   * Executes `clone` to handle clone.
   * @zh 执行 `clone`，用于克隆。
   * @returns Result of type `TinyColor` / 类型为 `TinyColor` 的返回值
   */
  clone(): TinyColor {
    return new TinyColor(this.toString() as string);
  }

  /**
   * Lighten the color a given amount. Providing 100 will always return white.
   * @param amount - valid between 1-100

   * @zh 执行 `lighten`，用于lighten。
   */
  lighten(amount = 10): TinyColor {
    const hsl = this.toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return new TinyColor(hsl);
  }

  /**
   * Brighten the color a given amount, from 0 to 100.
   * @param amount - valid between 1-100

   * @zh 执行 `brighten`，用于brighten。
   */
  brighten(amount = 10): TinyColor {
    const rgb = this.toRgb();
    rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
    rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
    rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
    return new TinyColor(rgb);
  }

  /**
   * Darken the color a given amount, from 0 to 100.
   * Providing 100 will always return black.
   * @param amount - valid between 1-100

   * @zh 执行 `darken`，用于darken。
   */
  darken(amount = 10): TinyColor {
    const hsl = this.toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return new TinyColor(hsl);
  }

  /**
   * Mix the color with pure white, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return white.
   * @param amount - valid between 1-100

   * @zh 执行 `tint`，用于tint。
   */
  tint(amount = 10): TinyColor {
    return this.mix('white', amount);
  }

  /**
   * Mix the color with pure black, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return black.
   * @param amount - valid between 1-100

   * @zh 执行 `shade`，用于shade。
   */
  shade(amount = 10): TinyColor {
    return this.mix('black', amount);
  }

  /**
   * Desaturate the color a given amount, from 0 to 100.
   * Providing 100 will is the same as calling greyscale
   * @param amount - valid between 1-100

   * @zh 执行 `desaturate`，用于desaturate。
   */
  desaturate(amount = 10): TinyColor {
    const hsl = this.toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return new TinyColor(hsl);
  }

  /**
   * Saturate the color a given amount, from 0 to 100.
   * @param amount - valid between 1-100

   * @zh 执行 `saturate`，用于saturate。
   */
  saturate(amount = 10): TinyColor {
    const hsl = this.toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return new TinyColor(hsl);
  }

  /**
   * Completely desaturates a color into greyscale.
   * Same as calling `desaturate(100)`

   * @zh 执行 `greyscale`，用于greyscale。
   */
  greyscale(): TinyColor {
    return this.desaturate(100);
  }

  /**
   * Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
   * Values outside of this range will be wrapped into this range.

   * @zh 执行 `spin`，用于spin。
   */
  spin(amount: number): TinyColor {
    const hsl = this.toHsl();
    const hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return new TinyColor(hsl);
  }

  /**
   * Mix the current color a given amount with another color, from 0 to 100.
   * 0 means no mixing (return current color).

   * @zh 执行 `mix`，用于mix。
   */
  mix(color: ColorInput, amount = 50): TinyColor {
    const rgb1 = this.toRgb();
    const rgb2 = new TinyColor(color).toRgb();

    const p = amount / 100;
    const rgba = {
      r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
      g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
      b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
      a: ((rgb2.a - rgb1.a) * p) + rgb1.a,
    };

    return new TinyColor(rgba);
  }

  /**
   * Executes `analogous` to handle analogous.
   * @zh 执行 `analogous`，用于analogous。
   * @param results - results parameter (`number`) / 结果参数（`number`）
   * @param slices - slices parameter (`number`) / 截取参数（`number`）
   * @returns Result of type `TinyColor[]` / 类型为 `TinyColor[]` 的返回值
   */
  analogous(results = 6, slices = 30): TinyColor[] {
    const hsl = this.toHsl();
    const part = 360 / slices;
    const ret: TinyColor[] = [this];

    for (hsl.h = (hsl.h - ((part * results) >> 1) + 720) % 360; --results;) {
      hsl.h = (hsl.h + part) % 360;
      ret.push(new TinyColor(hsl));
    }

    return ret;
  }


  /**
   * Executes `complement` to handle complement.
   * @zh 执行 `complement`，用于complement。
   * @returns Result of type `TinyColor` / 类型为 `TinyColor` 的返回值
   */
  complement(): TinyColor {
    const hsl = this.toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return new TinyColor(hsl);
  }

  /**
   * Executes `monochromatic` to handle monochromatic.
   * @zh 执行 `monochromatic`，用于monochromatic。
   * @param results - results parameter (`number`) / 结果参数（`number`）
   * @returns Result of type `TinyColor[]` / 类型为 `TinyColor[]` 的返回值
   */
  monochromatic(results = 6): TinyColor[] {
    const hsv = this.toHsv();
    const { h } = hsv;
    const { s } = hsv;
    let { v } = hsv;
    const res: TinyColor[] = [];
    const modification = 1 / results;

    while (results--) {
      res.push(new TinyColor({ h, s, v }));
      v = (v + modification) % 1;
    }

    return res;
  }

  /**
   * Executes `splitcomplement` to handle splitcomplement.
   * @zh 执行 `splitcomplement`，用于splitcomplement。
   * @returns Result of type `TinyColor[]` / 类型为 `TinyColor[]` 的返回值
   */
  splitcomplement(): TinyColor[] {
    const hsl = this.toHsl();
    const { h } = hsl;
    return [
      this,
      new TinyColor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
      new TinyColor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l }),
    ];
  }

  /**
   * Executes `triad` to handle triad.
   * @zh 执行 `triad`，用于triad。
   * @returns Result of type `TinyColor[]` / 类型为 `TinyColor[]` 的返回值
   */
  triad(): TinyColor[] {
    return this.polyad(3);
  }

  /**
   * Executes `tetrad` to handle tetrad.
   * @zh 执行 `tetrad`，用于tetrad。
   * @returns Result of type `TinyColor[]` / 类型为 `TinyColor[]` 的返回值
   */
  tetrad(): TinyColor[] {
    return this.polyad(4);
  }

  /**
   * Get polyad colors, like (for 1, 2, 3, 4, 5, 6, 7, 8, etc...)
   * monad, dyad, triad, tetrad, pentad, hexad, heptad, octad, etc...

   * @zh 执行 `polyad`，用于polyad。
   */
  polyad(n: number): TinyColor[] {
    const hsl = this.toHsl();
    const { h } = hsl;

    const result: TinyColor[] = [this];
    const increment = 360 / n;
    for (let i = 1; i < n; i++) {
      result.push(new TinyColor({ h: (h + (i * increment)) % 360, s: hsl.s, l: hsl.l }));
    }

    return result;
  }

  /**
   * compare color vs current color

   * @zh 执行 `equals`，用于相等比较。
   */
  equals(color?: ColorInput): boolean {
    return this.toRgbString() === new TinyColor(color).toRgbString();
  }
}

// kept for backwards compatability with v1
/**
 * Executes `tinycolor` to handle tinycolor.
 * @zh 执行 `tinycolor`，用于tinycolor。
 * @param color - color parameter (`ColorInput`) / 颜色参数（`ColorInput`）
 * @param opts - opts parameter (`Partial<TinyColorOptions>`) / 选项列表参数（`Partial<TinyColorOptions>`）
 * @returns Result of type `TinyColor` / 类型为 `TinyColor` 的返回值
 */
export function tinycolor(color: ColorInput = '', opts: Partial<TinyColorOptions> = {}): TinyColor {
  return new TinyColor(color, opts);
}
