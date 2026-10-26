/**
 * @fileoverview Module `src/theme/interfaces/palette.ts` providing palette definitions and implementation.
 * @zh 模块文件 `src/theme/interfaces/palette.ts`，提供调色板相关的定义与实现。
 */

/**
 * Interface `BasePalette` defining the contract and properties for base palette.
 * @zh 接口 `BasePalette`，定义基础调色板的数据结构契约与属性规范。
 */
export interface BasePalette {
    /**
     * Property `50` (`string`) storing 50.
     * @zh 属性 `50`（类型：`string`），用于存储或配置50。
     */
    readonly 50: string;
    /**
     * Property `100` (`string`) storing 100.
     * @zh 属性 `100`（类型：`string`），用于存储或配置100。
     */
    readonly 100: string;
    /**
     * Property `200` (`string`) storing 200.
     * @zh 属性 `200`（类型：`string`），用于存储或配置200。
     */
    readonly 200: string;
    /**
     * Property `300` (`string`) storing 300.
     * @zh 属性 `300`（类型：`string`），用于存储或配置300。
     */
    readonly 300: string;
    /**
     * Property `400` (`string`) storing 400.
     * @zh 属性 `400`（类型：`string`），用于存储或配置400。
     */
    readonly 400: string;
    /**
     * Property `500` (`string`) storing 500.
     * @zh 属性 `500`（类型：`string`），用于存储或配置500。
     */
    readonly 500: string;
    /**
     * Property `600` (`string`) storing 600.
     * @zh 属性 `600`（类型：`string`），用于存储或配置600。
     */
    readonly 600: string;
    /**
     * Property `700` (`string`) storing 700.
     * @zh 属性 `700`（类型：`string`），用于存储或配置700。
     */
    readonly 700: string;
    /**
     * Property `800` (`string`) storing 800.
     * @zh 属性 `800`（类型：`string`），用于存储或配置800。
     */
    readonly 800: string;
    /**
     * Property `900` (`string`) storing 900.
     * @zh 属性 `900`（类型：`string`），用于存储或配置900。
     */
    readonly 900: string;
    /**
     * Property `A100` (`string`) storing a100.
     * @zh 属性 `A100`（类型：`string`），用于存储或配置A100。
     */
    readonly A100?: string;
    /**
     * Property `A200` (`string`) storing a200.
     * @zh 属性 `A200`（类型：`string`），用于存储或配置A200。
     */
    readonly A200?: string;
    /**
     * Property `A400` (`string`) storing a400.
     * @zh 属性 `A400`（类型：`string`），用于存储或配置A400。
     */
    readonly A400?: string;
    /**
     * Property `A700` (`string`) storing a700.
     * @zh 属性 `A700`（类型：`string`），用于存储或配置A700。
     */
    readonly A700?: string;
}

/**
 * Interface `Palette` defining the contract and properties for palette.
 * @zh 接口 `Palette`，定义调色板的数据结构契约与属性规范。
 */
export interface Palette extends BasePalette {
    /**
     * Property `contrast` (`BasePalette`) storing contrast.
     * @zh 属性 `contrast`（类型：`BasePalette`），用于存储或配置对比度。
     */
    readonly contrast?: BasePalette;
}
