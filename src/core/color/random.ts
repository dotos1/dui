/**
 * @fileoverview Module `src/core/color/random.ts` providing random definitions and implementation.
 * @zh 模块文件 `src/core/color/random.ts`，提供随机相关的定义与实现。
 */


import { TinyColor } from './tinycolor';
import { HSVA } from './interfaces';

/**
 * Interface `RandomOptions` defining the contract and properties for random options.
 * @zh 接口 `RandomOptions`，定义随机配置选项的数据结构契约与属性规范。
 */
export interface RandomOptions {
  /**
   * Property `seed` (`number`) storing seed.
   * @zh 属性 `seed`（类型：`number`），用于存储或配置seed。
   */
  seed?: number;
  /**
   * Property `hue` (`string | number`) storing hue.
   * @zh 属性 `hue`（类型：`string | number`），用于存储或配置色相。
   */
  hue?:
  | number
  | string
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'monochrome';
  /**
   * Property `luminosity` (`"random" | "bright" | "dark" | "light"`) storing luminosity.
   * @zh 属性 `luminosity`（类型：`"random" | "bright" | "dark" | "light"`），用于存储或配置luminosity。
   */
  luminosity?: 'random' | 'bright' | 'dark' | 'light';
  /**
   * Property `alpha` (`number`) storing alpha.
   * @zh 属性 `alpha`（类型：`number`），用于存储或配置透明度。
   */
  alpha?: number;
}

/**
 * Interface `RandomCountOptions` defining the contract and properties for random count options.
 * @zh 接口 `RandomCountOptions`，定义随机计数配置选项的数据结构契约与属性规范。
 */
export interface RandomCountOptions extends RandomOptions {
  /**
   * Property `count` (`number`) storing count.
   * @zh 属性 `count`（类型：`number`），用于存储或配置计数。
   */
  count?: number | null;
}

/**
 * Executes `random` to handle random.
 * @zh 执行 `random`，用于随机。
 * @param options - options parameter (`RandomOptions`) / 配置选项参数（`RandomOptions`）
 * @returns Result of type `TinyColor` / 类型为 `TinyColor` 的返回值
 */
export function random(options?: RandomOptions): TinyColor;
// eslint-disable-next-line no-redeclare
/**
 * Executes `random` to handle random.
 * @zh 执行 `random`，用于随机。
 * @param options - options parameter (`RandomCountOptions`) / 配置选项参数（`RandomCountOptions`）
 * @returns Result of type `TinyColor[]` / 类型为 `TinyColor[]` 的返回值
 */
export function random(options?: RandomCountOptions): TinyColor[];
// eslint-disable-next-line no-redeclare
/**
 * Executes `random` to handle random.
 * @zh 执行 `random`，用于随机。
 * @param options - options parameter (`RandomOptions | RandomCountOptions`) / 配置选项参数（`RandomOptions | RandomCountOptions`）
 * @returns Result of type `TinyColor | TinyColor[]` / 类型为 `TinyColor | TinyColor[]` 的返回值
 */
export function random(options: RandomOptions | RandomCountOptions = {}): TinyColor | TinyColor[] {
  // Check if we need to generate multiple colors
  if ((options as RandomCountOptions).count !== undefined && (options as RandomCountOptions).count !== null) {
    const totalColors: number = (options as RandomCountOptions).count as number;
    const colors: TinyColor[] = [];

    (options as RandomCountOptions).count = undefined;

    while (totalColors > colors.length) {

      (options as RandomCountOptions).count = null;
      if (options.seed) {
        options.seed += 1;
      }

      colors.push(random(options as RandomOptions));
    }

    (options as RandomCountOptions).count = totalColors;
    return colors;
  }

  // First we pick a hue (H)
  const h = pickHue(options.hue, options.seed);

  // Then use H to determine saturation (S)
  const s = pickSaturation(h, options);

  // Then use S and H to determine brightness (B).
  const v = pickBrightness(h, s, options);
  const res: Partial<HSVA> = { h, s, v };
  if (options.alpha !== undefined) {
    res.a = options.alpha;
  }

  // Then we return the HSB color in the desired format
  return new TinyColor(res as HSVA);
}

/**
 * Executes `pickHue` to handle pick hue.
 * @zh 执行 `pickHue`，用于pick色相。
 * @param hue - hue parameter (`string | number`) / 色相参数（`string | number`）
 * @param seed - seed parameter (`number`) / seed参数（`number`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function pickHue(hue: number | string | undefined, seed?: number): number {
  const hueRange = getHueRange(hue);
  let res = randomWithin(hueRange, seed);

  // Instead of storing red as two seperate ranges,
  // we group them, using negative numbers
  if (res < 0) {
    res = 360 + res;
  }

  return res;
}

/**
 * Executes `pickSaturation` to handle pick saturation.
 * @zh 执行 `pickSaturation`，用于pick饱和度。
 * @param hue - hue parameter (`number`) / 色相参数（`number`）
 * @param options - options parameter (`RandomOptions`) / 配置选项参数（`RandomOptions`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function pickSaturation(hue: number, options: RandomOptions): number {
  if (options.hue === 'monochrome') {
    return 0;
  }

  if (options.luminosity === 'random') {
    return randomWithin([0, 100], options.seed);
  }

  const { saturationRange } = getColorInfo(hue);

  let sMin = saturationRange[0];
  let sMax = saturationRange[1];

  switch (options.luminosity) {
    case 'bright':
      sMin = 55;
      break;
    case 'dark':
      sMin = sMax - 10;
      break;
    case 'light':
      sMax = 55;
      break;
    default:
      break;
  }

  return randomWithin([sMin, sMax], options.seed);
}

/**
 * Executes `pickBrightness` to handle pick brightness.
 * @zh 执行 `pickBrightness`，用于pick明度。
 * @param H - h parameter (`number`) / H参数（`number`）
 * @param S - s parameter (`number`) / S参数（`number`）
 * @param options - options parameter (`RandomOptions`) / 配置选项参数（`RandomOptions`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function pickBrightness(H: number, S: number, options: RandomOptions): number {
  let bMin = getMinimumBrightness(H, S);
  let bMax = 100;

  switch (options.luminosity) {
    case 'dark':
      bMax = bMin + 20;
      break;
    case 'light':
      bMin = (bMax + bMin) / 2;
      break;
    case 'random':
      bMin = 0;
      bMax = 100;
      break;
    default:
      break;
  }

  return randomWithin([bMin, bMax], options.seed);
}

/**
 * Executes `getMinimumBrightness` to handle get minimum brightness.
 * @zh 执行 `getMinimumBrightness`，用于获取Minimum明度。
 * @param H - h parameter (`number`) / H参数（`number`）
 * @param S - s parameter (`number`) / S参数（`number`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function getMinimumBrightness(H: number, S: number): number {
  const { lowerBounds } = getColorInfo(H);

  for (let i = 0; i < lowerBounds.length - 1; i++) {
    const s1 = lowerBounds[i][0];
    const v1 = lowerBounds[i][1];

    const s2 = lowerBounds[i + 1][0];
    const v2 = lowerBounds[i + 1][1];

    if (S >= s1 && S <= s2) {
      const m = (v2 - v1) / (s2 - s1);
      const b = v1 - (m * s1);

      return (m * S) + b;
    }
  }

  return 0;
}

/**
 * Executes `getHueRange` to handle get hue range.
 * @zh 执行 `getHueRange`，用于获取色相范围。
 * @param colorInput - color input parameter (`string | number`) / 颜色输入属性参数（`string | number`）
 * @returns Result of type `[number, number]` / 类型为 `[number, number]` 的返回值
 */
function getHueRange(colorInput?: number | string): [number, number] {
  const num = parseInt(colorInput as string, 10);
  if (!Number.isNaN(num) && num < 360 && num > 0) {
    return [num, num];
  }

  if (typeof colorInput === 'string') {
    const namedColor = bounds.find(n => n.name === colorInput);
    if (namedColor) {
      const color = defineColor(namedColor);
      if (color.hueRange) {
        return color.hueRange;
      }
    }

    const parsed = new TinyColor(colorInput);
    if (parsed.isValid) {
      const hue = parsed.toHsv().h;
      return [hue, hue];
    }
  }

  return [0, 360];
}

/**
 * Executes `getColorInfo` to handle get color info.
 * @zh 执行 `getColorInfo`，用于获取颜色信息。
 * @param hue - hue parameter (`number`) / 色相参数（`number`）
 * @returns Result of type `{…}` / 类型为 `{…}` 的返回值
 */
function getColorInfo(hue: number): {
  name: string;
  hueRange: [number, number] | null;
  lowerBounds: Array<[number, number]>;
  saturationRange: number[];
  brightnessRange: number[];
} {
  // Maps red colors to make picking hue easier
  if (hue >= 334 && hue <= 360) {
    hue -= 360;
  }

  for (const bound of bounds) {
    const color = defineColor(bound);
    if (color.hueRange && hue >= color.hueRange[0] && hue <= color.hueRange[1]) {
      return color;
    }
  }

  throw Error('Color not found');
}

/**
 * Executes `randomWithin` to handle random within.
 * @zh 执行 `randomWithin`，用于随机Within。
 * @param range - range parameter (`[number, number]`) / 范围参数（`[number, number]`）
 * @param seed - seed parameter (`number`) / seed参数（`number`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function randomWithin(range: [number, number], seed?: number): number {
  if (seed === undefined) {
    return Math.floor(range[0] + (Math.random() * (range[1] + 1 - range[0])));
  }

 
  const max = range[1] || 1;
  const min = range[0] || 0;
  seed = ((seed * 9301) + 49297) % 233280;
  const rnd = seed / 233280.0;
  return Math.floor(min + (rnd * (max - min)));
}

/**
 * Executes `defineColor` to handle define color.
 * @zh 执行 `defineColor`，用于定义颜色。
 * @param bound - bound parameter (`ColorBound`) / 已绑定参数（`ColorBound`）
 * @returns Result of type `{…}` / 类型为 `{…}` 的返回值
 */
function defineColor(bound: ColorBound): {
  name: string;
  hueRange: [number, number] | null;
  lowerBounds: Array<[number, number]>;
  saturationRange: number[];
  brightnessRange: number[];
} {
  const sMin = bound.lowerBounds[0][0];
  const sMax = bound.lowerBounds[bound.lowerBounds.length - 1][0];
  const bMin = bound.lowerBounds[bound.lowerBounds.length - 1][1];
  const bMax = bound.lowerBounds[0][1];

  return {
    name: bound.name,
    hueRange: bound.hueRange,
    lowerBounds: bound.lowerBounds,
    saturationRange: [sMin, sMax],
    brightnessRange: [bMin, bMax],
  };
}

/**
 * Interface `ColorBound` defining the contract and properties for color bound.
 * @hidden

 * @zh 接口 `ColorBound`，定义颜色已绑定的数据结构契约与属性规范。
 */
export interface ColorBound {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `hueRange` (`[number, number]`) storing hue range.
   * @zh 属性 `hueRange`（类型：`[number, number]`），用于存储或配置色相范围。
   */
  hueRange: [number, number] | null;
  /**
   * Property `lowerBounds` (`[number, number][]`) storing lower bounds.
   * @zh 属性 `lowerBounds`（类型：`[number, number][]`），用于存储或配置下限边界框。
   */
  lowerBounds: Array<[number, number]>;
}

/**
 * Constant/variable `bounds` defining bounds in `src/core/color`.
 * @hidden

 * @zh 常量/变量 `bounds`，定义 `src/core/color` 中的边界框。
 */
export const bounds: ColorBound[] = [
  {
    name: 'monochrome',
    hueRange: null,
    lowerBounds: [[0, 0], [100, 0]],
  },
  {
    name: 'red',
    hueRange: [-26, 18],
    lowerBounds: [
      [20, 100],
      [30, 92],
      [40, 89],
      [50, 85],
      [60, 78],
      [70, 70],
      [80, 60],
      [90, 55],
      [100, 50],
    ],
  },
  {
    name: 'orange',
    hueRange: [19, 46],
    lowerBounds: [[20, 100], [30, 93], [40, 88], [50, 86], [60, 85], [70, 70], [100, 70]],
  },
  {
    name: 'yellow',
    hueRange: [47, 62],
    lowerBounds: [[25, 100], [40, 94], [50, 89], [60, 86], [70, 84], [80, 82], [90, 80], [100, 75]],
  },
  {
    name: 'green',
    hueRange: [63, 178],
    lowerBounds: [[30, 100], [40, 90], [50, 85], [60, 81], [70, 74], [80, 64], [90, 50], [100, 40]],
  },
  {
    name: 'blue',
    hueRange: [179, 257],
    lowerBounds: [
      [20, 100],
      [30, 86],
      [40, 80],
      [50, 74],
      [60, 60],
      [70, 52],
      [80, 44],
      [90, 39],
      [100, 35],
    ],
  },
  {
    name: 'purple',
    hueRange: [258, 282],
    lowerBounds: [
      [20, 100],
      [30, 87],
      [40, 79],
      [50, 70],
      [60, 65],
      [70, 59],
      [80, 52],
      [90, 45],
      [100, 42],
    ],
  },
  {
    name: 'pink',
    hueRange: [283, 334],
    lowerBounds: [[20, 100], [30, 90], [40, 86], [60, 84], [80, 80], [90, 75], [100, 73]],
  },
];
