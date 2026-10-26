/**
 * @fileoverview Module `src/theme/interfaces/typography-level.ts` providing typography level definitions and implementation.
 * @zh 模块文件 `src/theme/interfaces/typography-level.ts`，提供排版层级相关的定义与实现。
 */

/**
 * Interface `TypographyLevel` defining the contract and properties for typography level.
 * @zh 接口 `TypographyLevel`，定义排版层级的数据结构契约与属性规范。
 */
export interface TypographyLevel {
    /**
     * Property `font-size` (`number | string`) storing font size.
     * @zh 属性 `font-size`（类型：`number | string`），用于存储或配置字体尺寸。
     */
    readonly 'font-size': number | string;
    /**
     * Property `line-height` (`number | string`) storing line height.
     * @zh 属性 `line-height`（类型：`number | string`），用于存储或配置线段高度。
     */
    readonly 'line-height': number | string;
    /**
     * Property `font-weight` (`number | string`) storing font weight.
     * @zh 属性 `font-weight`（类型：`number | string`），用于存储或配置字体权重/字重。
     */
    readonly 'font-weight': number | string;
    /**
     * Property `font-family` (`string`) storing font family.
     * @zh 属性 `font-family`（类型：`string`），用于存储或配置字体family。
     */
    readonly 'font-family'?: string;
    /**
     * Property `letter-spacing` (`string`) storing letter spacing.
     * @zh 属性 `letter-spacing`（类型：`string`），用于存储或配置letter间距。
     */
    readonly 'letter-spacing'?: string;
}
