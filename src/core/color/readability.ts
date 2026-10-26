/**
 * @fileoverview Module `src/core/color/readability.ts` providing readability definitions and implementation.
 * @zh 模块文件 `src/core/color/readability.ts`，提供readability相关的定义与实现。
 */

import { ColorInput, TinyColor } from './tinycolor';


/**
 * Executes `readability` to handle readability.
 * @zh 执行 `readability`，用于readability。
 * @param color1 - color1 parameter (`ColorInput`) / color1参数（`ColorInput`）
 * @param color2 - color2 parameter (`ColorInput`) / color2参数（`ColorInput`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
export function readability(color1: ColorInput, color2: ColorInput): number {
  const c1 = new TinyColor(color1);
  const c2 = new TinyColor(color2);
  return (
    (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) /
    (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05)
  );
}

/**
 * Interface `WCAG2Parms` defining the contract and properties for wcag2 parms.
 * @zh 接口 `WCAG2Parms`，定义WCAG2Parms的数据结构契约与属性规范。
 */
export interface WCAG2Parms {
  /**
   * Property `level` (`'AA' | 'AAA'`) storing level.
   * @zh 属性 `level`（类型：`'AA' | 'AAA'`），用于存储或配置层级。
   */
  level?: 'AA' | 'AAA';
  /**
   * Property `size` (`'large' | 'small'`) storing size.
   * @zh 属性 `size`（类型：`'large' | 'small'`），用于存储或配置尺寸。
   */
  size?: 'large' | 'small';
}


/**
 * Executes `isReadable` to handle is readable.
 * @zh 执行 `isReadable`，用于是否为Readable。
 * @param color1 - color1 parameter (`ColorInput`) / color1参数（`ColorInput`）
 * @param color2 - color2 parameter (`ColorInput`) / color2参数（`ColorInput`）
 * @param wcag2 - wcag2 parameter (`WCAG2Parms`) / wcag2参数（`WCAG2Parms`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isReadable(
  color1: ColorInput,
  color2: ColorInput,
  wcag2: WCAG2Parms = { level: 'AA', size: 'small' },
): boolean {
  const readabilityLevel = readability(color1, color2);
  switch ((wcag2.level ? 'AA' : '') + (wcag2.size ? 'small' : '')) {
    case 'AAsmall':
    case 'AAAlarge':
      return readabilityLevel >= 4.5;
    case 'AAlarge':
      return readabilityLevel >= 3;
    case 'AAAsmall':
      return readabilityLevel >= 7;
    default:
      return false;
  }
}

/**
 * Interface `WCAG2FallbackParms` defining the contract and properties for wcag2 fallback parms.
 * @zh 接口 `WCAG2FallbackParms`，定义WCAG2FallbackParms的数据结构契约与属性规范。
 */
export interface WCAG2FallbackParms extends WCAG2Parms {
  /**
   * Property `includeFallbackColors` (`boolean`) storing include fallback colors.
   * @zh 属性 `includeFallbackColors`（类型：`boolean`），用于存储或配置includeFallback颜色列表。
   */
  includeFallbackColors?: boolean;
}

/**
 * Given a base color and a list of possible foreground or background
 * colors for that base, returns the most readable color.
 * Optionally returns Black or White if the most readable color is unreadable.
 *
 * @param baseColor - the base color.
 * @param colorList - array of colors to pick the most readable one from.
 * @param args - and object with extra arguments
 *
 * Example
 * ```ts
 * new TinyColor().mostReadable('#123', ['#124", "#125'], { includeFallbackColors: false }).toHexString(); // "#112255"
 * new TinyColor().mostReadable('#123', ['#124", "#125'],{ includeFallbackColors: true }).toHexString();  // "#ffffff"
 * new TinyColor().mostReadable('#a8015a', ["#faf3f3"], { includeFallbackColors:true, level: 'AAA', size: 'large' }).toHexString(); // "#faf3f3"
 * new TinyColor().mostReadable('#a8015a', ["#faf3f3"], { includeFallbackColors:true, level: 'AAA', size: 'small' }).toHexString(); // "#ffffff"
 * ```

 * @zh 执行 `mostReadable`，用于mostReadable。
 */
export function mostReadable(
  baseColor: ColorInput,
  colorList: ColorInput[],
  args: WCAG2FallbackParms = { includeFallbackColors: false, level: 'AA', size: 'small' },
): TinyColor | null {
  let bestColor: TinyColor | null = null;
  let bestScore = 0;
  const { includeFallbackColors, level, size } = args;

  for (const color of colorList) {
    const score = readability(baseColor, color);
    if (score > bestScore) {
      bestScore = score;
      bestColor = new TinyColor(color);
    }
  }

  if (isReadable(baseColor, bestColor as TinyColor, { level, size }) || !includeFallbackColors) {
    return bestColor;
  }

  args.includeFallbackColors = false;
  return mostReadable(baseColor, ['#fff', '#000'], args);
}
