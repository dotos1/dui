/**
 * @fileoverview Module `src/core/color/from-ratio.ts` providing from ratio definitions and implementation.
 * @zh 模块文件 `src/core/color/from-ratio.ts`，提供从比例相关的定义与实现。
 */

import { TinyColor } from './tinycolor';
import { RGBA } from './interfaces';
import { convertToPercentage } from './util';

/**
 * Interface `RatioInput` defining the contract and properties for ratio input.
 * @zh 接口 `RatioInput`，定义比例输入属性的数据结构契约与属性规范。
 */
export interface RatioInput {
  /**
   * Property `r` (`string | number`) storing r.
   * @zh 属性 `r`（类型：`string | number`），用于存储或配置r。
   */
  r: number | string;
  /**
   * Property `g` (`string | number`) storing g.
   * @zh 属性 `g`（类型：`string | number`），用于存储或配置g。
   */
  g: number | string;
  /**
   * Property `b` (`string | number`) storing b.
   * @zh 属性 `b`（类型：`string | number`），用于存储或配置b。
   */
  b: number | string;
  /**
   * Property `a` (`string | number`) storing a.
   * @zh 属性 `a`（类型：`string | number`），用于存储或配置a。
   */
  a?: number | string;
}

/**
 * If input is an object, force 1 into "1.0" to handle ratios properly
 * String input requires "1.0" as input, so 1 will be treated as 1

 * @zh 执行 `fromRatio`，用于从比例。
 */
export function fromRatio(ratio: RatioInput, opts?): TinyColor {
  const newColor: Partial<RGBA> = {
    r: convertToPercentage(ratio.r),
    g: convertToPercentage(ratio.g),
    b: convertToPercentage(ratio.b),
  };
  if (ratio.a !== undefined) {
    newColor.a = Number(ratio.a);
  }

  return new TinyColor(newColor as RGBA, opts);
}

/**
 * old random function
 * @zh 执行 `legacyRandom`，用于legacy随机。
 */
export function legacyRandom(): TinyColor {
  return new TinyColor({
    r: Math.random(),
    g: Math.random(),
    b: Math.random(),
  });
}
