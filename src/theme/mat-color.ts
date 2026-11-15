/**
 * @fileoverview Module `src/theme/mat-color.ts` providing mat color definitions and implementation.
 * @zh 模块文件 `src/theme/mat-color.ts`，提供Material颜色相关的定义与实现。
 */

import cssColorToHex from 'colornames';
import { Color, Solver, TinyColor } from '@dotos1/dui/core/color';


// const cssColorToHex = _cssColorToHex;
// Gets a color from a theme palette (the output of mat-palette).
// The hue can be one of the standard values (500, A400, etc.), one of the three preconfigured
// hues (default, lighter, darker), or any of the aforementioned prefixed with "-contrast".
//
// param $color-map The theme palette (output of mat-palette).
// param $hue The hue from the palette to use. If this is a value between 0 and 1, it will
//     be treated as opacity.
// param $opacity The alpha channel value for the color.
/**
 * Executes `matColor` to handle mat color.
 * @zh 执行 `matColor`，用于Material颜色。
 * @param palette - palette parameter (`Object`) / 调色板参数（`Object`）
 * @param hue - hue parameter (`string | number`) / 色相参数（`string | number`）
 * @param opacityParam - opacity param parameter (`number`) / 不透明度参数参数（`number`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function matColor(
  palette: Object,
  hue: string | number = 'default',
  opacityParam: number = null
): string {
  // If hueKey is a number between zero and one, then it actually contains an
  // opacity value, so recall this function with the default hue and that given opacity.
  if (typeof hue === 'number' && hue >= 0 && hue <= 1) {
    return matColor(palette, 'default', hue);
  }
  const color: string = palette[hue];

  const opacity: number = opacityParam === null ? colorToOpacity(color) : opacityParam;
  return rgba(color, opacity);
}
/**
 * Executes `rgbToHex` to handle rgb to hex.
 * @zh 执行 `rgbToHex`，用于RGB颜色转换为十六进制颜色。
 * @param r - r parameter (`number`) / r参数（`number`）
 * @param g - g parameter (`number`) / g参数（`number`）
 * @param b - b parameter (`number`) / b参数（`number`）
 */
function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
/**
 * Executes `mix` to handle mix.
 * @zh 执行 `mix`，用于mix。
 * @param color1 - color1 parameter (`string`) / color1参数（`string`）
 * @param color2 - color2 parameter (`string`) / color2参数（`string`）
 * @param weight - weight parameter (`number`) / 权重/字重参数（`number`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function mix(color1: string,color2: string, weight: number = 1): string {
    let rgba_color1= rgba(color1).slice(5).split(',');
    let rgba_color2= rgba(color2).slice(5).split(',');
    const r1 = parseInt(rgba_color1[0]);
    const g1 = parseInt(rgba_color1[1]);
    const b1 = parseInt(rgba_color1[2]);
 
    const r2 = parseInt(rgba_color2[0]);
    const g2 = parseInt(rgba_color2[1]);
    const b2 = parseInt(rgba_color2[2]);
 
    const r = Math.round(r1 * weight + r2 * (1 - weight));
    const g = Math.round(g1 * weight + g2 * (1 - weight));
    const b = Math.round(b1 * weight + b2 * (1 - weight));
    
    return rgbToHex(r,g,b);
}
/**
 * Executes `rgba` to handle rgba.
 * @zh 执行 `rgba`，用于RGBA颜色。
 * @param color - color parameter (`string`) / 颜色参数（`string`）
 * @param opacity - opacity parameter (`number`) / 不透明度参数（`number`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function rgba(color: string, opacity: number = 1): string {
  if (color.indexOf('#') === 0) {
    const colorValue: string = color.substr(1);

    if (colorValue.length === 3) {
      const red: number = parseInt(colorValue[0] + colorValue[0], 16);
      const green: number = parseInt(colorValue[1] + colorValue[1], 16);
      const blue: number = parseInt(colorValue[2] + colorValue[2], 16);

      return `rgba(${red},${green},${blue},${opacity})`;
    } else {
      const red: number = parseInt(colorValue.substr(0, 2), 16);
      const green: number = parseInt(colorValue.substr(2, 2), 16);
      const blue: number = parseInt(colorValue.substr(4, 2), 16);

      return `rgba(${red},${green},${blue},${opacity})`;
    }
  } else if (color.indexOf('rgba(') === 0) {
    const colorValue: string = color.substring(
      color.indexOf('(') + 1,
      color.lastIndexOf(',')
    );

    if (isNaN(parseInt(colorValue, 10))) {
      return rgba(cssColorToHex(colorValue), opacity);
    }

    return `rgba(${colorValue},${opacity})`;
  } else if (color.indexOf('rgb(') === 0) {
    const colorValue: string = color.substring(
      color.indexOf('(') + 1,
      color.lastIndexOf(')')
    );

    if (isNaN(parseInt(colorValue, 10))) {
      return rgba(cssColorToHex(colorValue), opacity);
    }

    return `rgba(${colorValue},${opacity})`;
  } else {
    const hex: string = cssColorToHex(color);
    if (hex) {
      return rgba(hex, opacity);
    }
  }

  return 'rgba(0,0,0,1)';
}

/**
 * Executes `invert` to handle invert.
 * @zh 执行 `invert`，用于invert。
 * @param color - color parameter (`string`) / 颜色参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function invert(color: string): string {
  if (color.indexOf('rgba(') === 0) {
    let colorValue: string = color.substring(
      color.indexOf('(') + 1,
      color.lastIndexOf(',')
    );

    if (isNaN(parseInt(colorValue, 10))) {
      return invert(cssColorToHex(colorValue));
    }

    const red: number =
      255 - parseInt(colorValue.substring(0, colorValue.indexOf(',')), 10);

    colorValue = colorValue.substring(colorValue.indexOf(',') + 1);
    const green: number = 255 - parseInt(colorValue, 10);

    colorValue = colorValue.substring(colorValue.indexOf(',') + 1);
    const blue: number = 255 - parseInt(colorValue, 10);

    const opacity: number = parseFloat(
      color.substring(color.lastIndexOf(',') + 1)
    );

    return `rgba(${red},${green},${blue},${opacity})`;
  }

  return color;
}

/**
 * Executes `colorToOpacity` to handle color to opacity.
 * @zh 执行 `colorToOpacity`，用于颜色转换为不透明度。
 * @param color - color parameter (`string`) / 颜色参数（`string`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function colorToOpacity(color: string): number {
  if (color.indexOf('rgba(') === 0) {
    return parseFloat(
      color.substr(color.lastIndexOf(',') + 1, color.indexOf(')') - 1)
    );
  }
  return 1;
}


/**
 * Executes `invertSvgColor` to handle invert svg color.
 * @zh 执行 `invertSvgColor`，用于invertSVG矢量图颜色。
 * @param theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function invertSvgColor(theme) {
    let iconColor =matColor(theme.background, 'card'); 
    let backgroundColor = matColor(theme.foreground, 'icon');
    let tinyColor = new TinyColor(iconColor);
    let backgroundTinyColor = new TinyColor(backgroundColor);
    let hex = tinyColor.toAlphaHex(backgroundTinyColor);
    let rgb = Solver.hexToRgb(hex);
    const color = new Color(rgb[0], rgb[1], rgb[2]);
    const solver = new Solver(color);
    const result = solver.solve();
    return result;
}

/**
 * Executes `svgColor` to handle svg color.
 * @zh 执行 `svgColor`，用于SVG矢量图颜色。
 * @param theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function svgColor(theme) {
  let iconColor = matColor(theme.foreground, 'icon');
  let backgroundColor = matColor(theme.background, 'card');
  let tinyColor = new TinyColor(iconColor);
  let backgroundTinyColor = new TinyColor(backgroundColor);
  let hex = tinyColor.toAlphaHex(backgroundTinyColor);
  let rgb = Solver.hexToRgb(hex);
  const color = new Color(rgb[0], rgb[1], rgb[2]);
  const solver = new Solver(color);
  const result = solver.solve();
  return result;
}
