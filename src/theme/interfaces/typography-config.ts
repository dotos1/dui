/**
 * @fileoverview Module `src/theme/interfaces/typography-config.ts` providing typography config definitions and implementation.
 * @zh 模块文件 `src/theme/interfaces/typography-config.ts`，提供排版配置相关的定义与实现。
 */

import { TypographyLevel } from './typography-level';



/**
 * Interface `TypographyConfig` defining the contract and properties for typography config.
 * @zh 接口 `TypographyConfig`，定义排版配置的数据结构契约与属性规范。
 */
export interface TypographyConfig {
    /**
     * Property `type` (`string`) storing type.
     * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
     */
    readonly 'type': string;
    /**
     * Property `display-4` (`TypographyLevel`) storing display 4.
     * @zh 属性 `display-4`（类型：`TypographyLevel`），用于存储或配置display4。
     */
    readonly 'display-4': TypographyLevel;
    /**
     * Property `display-3` (`TypographyLevel`) storing display 3.
     * @zh 属性 `display-3`（类型：`TypographyLevel`），用于存储或配置display3。
     */
    readonly 'display-3': TypographyLevel;
    /**
     * Property `display-2` (`TypographyLevel`) storing display 2.
     * @zh 属性 `display-2`（类型：`TypographyLevel`），用于存储或配置display2。
     */
    readonly 'display-2': TypographyLevel;
    /**
     * Property `display-1` (`TypographyLevel`) storing display 1.
     * @zh 属性 `display-1`（类型：`TypographyLevel`），用于存储或配置display1。
     */
    readonly 'display-1': TypographyLevel;
    /**
     * Property `headline` (`TypographyLevel`) storing headline.
     * @zh 属性 `headline`（类型：`TypographyLevel`），用于存储或配置headline。
     */
    readonly "headline": TypographyLevel;
    /**
     * Property `title` (`TypographyLevel`) storing title.
     * @zh 属性 `title`（类型：`TypographyLevel`），用于存储或配置标题。
     */
    readonly "title": TypographyLevel;
    /**
     * Property `subheading-2` (`TypographyLevel`) storing subheading 2.
     * @zh 属性 `subheading-2`（类型：`TypographyLevel`），用于存储或配置subheading2。
     */
    readonly 'subheading-2': TypographyLevel;
    /**
     * Property `subheading-1` (`TypographyLevel`) storing subheading 1.
     * @zh 属性 `subheading-1`（类型：`TypographyLevel`），用于存储或配置subheading1。
     */
    readonly 'subheading-1': TypographyLevel;
    /**
     * Property `body-2` (`TypographyLevel`) storing body 2.
     * @zh 属性 `body-2`（类型：`TypographyLevel`），用于存储或配置主体2。
     */
    readonly 'body-2': TypographyLevel;
    /**
     * Property `body-1` (`TypographyLevel`) storing body 1.
     * @zh 属性 `body-1`（类型：`TypographyLevel`），用于存储或配置主体1。
     */
    readonly 'body-1': TypographyLevel;
    /**
     * Property `caption` (`TypographyLevel`) storing caption.
     * @zh 属性 `caption`（类型：`TypographyLevel`），用于存储或配置说明文字。
     */
    readonly "caption": TypographyLevel;
    /**
     * Property `button` (`TypographyLevel`) storing button.
     * @zh 属性 `button`（类型：`TypographyLevel`），用于存储或配置按钮。
     */
    readonly "button": TypographyLevel;
    /**
     * Property `input` (`TypographyLevel`) storing input.
     * @zh 属性 `input`（类型：`TypographyLevel`），用于存储或配置输入属性。
     */
    readonly "input": TypographyLevel;
    /**
     * Property `font-family` (`string`) storing font family.
     * @zh 属性 `font-family`（类型：`string`），用于存储或配置字体family。
     */
    readonly 'font-family'?: string;
}
