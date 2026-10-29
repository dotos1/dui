/**
 * @fileoverview Module `src/core/color/umd_api.ts` providing umd api definitions and implementation.
 * @zh 模块文件 `src/core/color/umd_api.ts`，提供umdAPI接口相关的定义与实现。
 */


import { names } from './css-color-names';
import { inputToRGB, isValidCSSUnit, stringInputToObject } from './format-input';
import { fromRatio, legacyRandom } from './from-ratio';
import { tinycolor, TinyColor } from './tinycolor';
import { random } from './random';
import { mostReadable, readability } from './readability';
import { toMsFilter } from './to-ms-filter';

/**
 * Interface `TinyColorUMD` defining the contract and properties for tiny color umd.
 * @zh 接口 `TinyColorUMD`，定义Tiny颜色UMD的数据结构契约与属性规范。
 */
export interface TinyColorUMD {
  (): TinyColor;
  /**
   * Property `TinyColor` (`typeof TinyColor`) storing tiny color.
   * @zh 属性 `TinyColor`（类型：`typeof TinyColor`），用于存储或配置Tiny颜色。
   */
  TinyColor: typeof TinyColor;
  /**
   * Property `readability` (`(color1: ColorInput, color2: ColorInput) => number`) storing readability.
   * @zh 属性 `readability`（类型：`(color1: ColorInput, color2: ColorInput) => number`），用于存储或配置readability。
   */
  readability: typeof readability;
  /**
   * Property `random` (`{…}`) storing random.
   * @zh 属性 `random`（类型：`{…}`），用于存储或配置随机。
   */
  random: typeof random;
  /**
   * Property `names` (`{ [key: string]: string; }`) storing names.
   * @zh 属性 `names`（类型：`{ [key: string]: string; }`），用于存储或配置名称列表。
   */
  names: typeof names;
  /**
   * Property `fromRatio` (`(ratio: RatioInput, opts?: any) => TinyColor`) storing from ratio.
   * @zh 属性 `fromRatio`（类型：`(ratio: RatioInput, opts?: any) => TinyColor`），用于存储或配置从比例。
   */
  fromRatio: typeof fromRatio;
  /**
   * Property `legacyRandom` (`() => TinyColor`) storing legacy random.
   * @zh 属性 `legacyRandom`（类型：`() => TinyColor`），用于存储或配置legacy随机。
   */
  legacyRandom: typeof legacyRandom;
  /**
   * Property `toMsFilter` (`(firstColor: ColorInput, secondColor?: ColorInput) => string`) storing to ms filter.
   * @zh 属性 `toMsFilter`（类型：`(firstColor: ColorInput, secondColor?: ColorInput) => string`），用于存储或配置转换为毫秒过滤。
   */
  toMsFilter: typeof toMsFilter;
  /**
   * Property `inputToRGB` (`(color: any) => {…}`) storing input to rgb.
   * @zh 属性 `inputToRGB`（类型：`(color: any) => {…}`），用于存储或配置输入属性转换为RGB颜色。
   */
  inputToRGB: typeof inputToRGB;
  /**
   * Property `stringInputToObject` (`(color: string) => false | {…}`) storing string input to object.
   * @zh 属性 `stringInputToObject`（类型：`(color: string) => false | {…}`），用于存储或配置字符串输入属性转换为对象。
   */
  stringInputToObject: typeof stringInputToObject;
  /**
   * Property `isValidCSSUnit` (`(color: string | number) => RegExpExecArray`) storing is valid css unit.
   * @zh 属性 `isValidCSSUnit`（类型：`(color: string | number) => RegExpExecArray`），用于存储或配置是否为有效CSS样式Unit。
   */
  isValidCSSUnit: typeof isValidCSSUnit;
  /**
   * Property `mostReadable` (`(baseColor: ColorInput, colorList: ColorInput[], args?: WCAG2FallbackParms) => TinyColor | null`) storing most readable.
   * @zh 属性 `mostReadable`（类型：`(baseColor: ColorInput, colorList: ColorInput[], args?: WCAG2FallbackParms) => TinyColor | null`），用于存储或配置mostReadable。
   */
  mostReadable: typeof mostReadable;
}
/**
 * Constant/variable `tinycolorumd` defining tinycolorumd in `src/core/color`.
 * @zh 常量/变量 `tinycolorumd`，定义 `src/core/color` 中的tinycolorumd。
 */
const tinycolorumd = tinycolor as TinyColorUMD;
tinycolorumd.TinyColor = TinyColor;
tinycolorumd.readability = readability;
tinycolorumd.mostReadable = mostReadable;
tinycolorumd.random = random;
tinycolorumd.names = names;
tinycolorumd.fromRatio = fromRatio;
tinycolorumd.legacyRandom = legacyRandom;
tinycolorumd.toMsFilter = toMsFilter;
tinycolorumd.inputToRGB = inputToRGB;
tinycolorumd.stringInputToObject = stringInputToObject;
tinycolorumd.isValidCSSUnit = isValidCSSUnit;
export default tinycolorumd;
