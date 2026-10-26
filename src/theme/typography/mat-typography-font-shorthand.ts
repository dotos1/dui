/**
 * @fileoverview Module `src/theme/typography/mat-typography-font-shorthand.ts` providing mat typography font shorthand definitions and implementation.
 * @zh 模块文件 `src/theme/typography/mat-typography-font-shorthand.ts`，提供Material排版字体shorthand相关的定义与实现。
 */

/**
 * Executes `matTypographyFontShorthand` to handle mat typography font shorthand.
 * @zh 执行 `matTypographyFontShorthand`，用于Material排版字体Shorthand。
 * @param fontSize - font size parameter (`number | string`) / 字体尺寸参数（`number | string`）
 * @param fontWeight - font weight parameter (`number | string`) / 字体权重/字重参数（`number | string`）
 * @param lineHeight - line height parameter (`number | string`) / 线段高度参数（`number | string`）
 * @param fontFamily - font family parameter (`string`) / 字体Family参数（`string`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matTypographyFontShorthand(
  fontSize: number | string,
  fontWeight: number | string,
  lineHeight: number | string,
  fontFamily: string
): Object {
  if (
    fontSize === 'inherit' ||
    fontWeight === 'inherit' ||
    lineHeight === 'inherit' ||
    fontFamily === 'inherit' ||
    fontSize === null ||
    fontWeight === null ||
    lineHeight === null ||
    fontFamily === null
  ) {
    return {
      'font-size': fontSize,
      'font-weight': fontWeight,
      'line-height': lineHeight,
      'font-family': fontFamily
    };
  }
  if (fontFamily) {
    return {
      "font": `${fontWeight} ${fontSize}/${lineHeight} ${fontFamily}`
    };
  } else {
    return {
      "font": `${fontWeight} ${fontSize}/${lineHeight}`
    };
  }
}

