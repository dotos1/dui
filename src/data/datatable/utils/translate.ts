/**
 * @fileoverview Module `src/data/datatable/utils/translate.ts` providing translate definitions and implementation.
 * @zh 模块文件 `src/data/datatable/utils/translate.ts`，提供翻译相关的定义与实现。
 */

import { getVendorPrefixedName } from './prefixes';
import { camelCase } from './camel-case';


/**
 * Constant/variable `transform` defining transform in `src/data/datatable/utils`.
 * @zh 常量/变量 `transform`，定义 `src/data/datatable/utils` 中的转换。
 */
const transform = typeof window !== 'undefined' ? getVendorPrefixedName('transform') : undefined;
/**
 * Constant/variable `backfaceVisibility` defining backface visibility in `src/data/datatable/utils`.
 * @zh 常量/变量 `backfaceVisibility`，定义 `src/data/datatable/utils` 中的backfaceVisibility。
 */
const backfaceVisibility = typeof window !== 'undefined' ? getVendorPrefixedName('backfaceVisibility') : undefined;
/**
 * Constant/variable `hasCSSTransforms` defining has css transforms in `src/data/datatable/utils`.
 * @zh 常量/变量 `hasCSSTransforms`，定义 `src/data/datatable/utils` 中的是否包含CSS样式转换。
 */
const hasCSSTransforms = typeof window !== 'undefined' ? !!getVendorPrefixedName('transform') : undefined;
/**
 * Constant/variable `hasCSS3DTransforms` defining has css3 d transforms in `src/data/datatable/utils`.
 * @zh 常量/变量 `hasCSS3DTransforms`，定义 `src/data/datatable/utils` 中的是否包含CSS3D转换。
 */
const hasCSS3DTransforms = typeof window !== 'undefined' ? !!getVendorPrefixedName('perspective') : undefined;
/**
 * Constant/variable `ua` defining ua in `src/data/datatable/utils`.
 * @zh 常量/变量 `ua`，定义 `src/data/datatable/utils` 中的ua。
 */
const ua = typeof window !== 'undefined' ? window.navigator.userAgent : 'Chrome';
/**
 * Constant/variable `isSafari` defining is safari in `src/data/datatable/utils`.
 * @zh 常量/变量 `isSafari`，定义 `src/data/datatable/utils` 中的是否为Safari。
 */
const isSafari = /Safari\//.test(ua) && !/Chrome\//.test(ua);

/**
 * Executes `translateXY` to handle translate xy.
 * @zh 执行 `translateXY`，用于翻译XY坐标。
 * @param styles - styles parameter (`any`) / 样式集合参数（`any`）
 * @param x - x parameter (`number`) / X坐标参数（`number`）
 * @param y - y parameter (`number`) / Y坐标参数（`number`）
 */
export function translateXY(styles, x: number, y: number) {
  if (typeof transform !== 'undefined' && hasCSSTransforms) {
    if (!isSafari && hasCSS3DTransforms) {
      styles[transform] = `translate3d(${x}px, ${y}px, 0)`;
      styles[backfaceVisibility] = 'hidden';
    } else {
      styles[camelCase(transform)] = `translate(${x}px, ${y}px)`;
    }
  } else {
    styles.top = `${y}px`;
    styles.left = `${x}px`;
  }
}
