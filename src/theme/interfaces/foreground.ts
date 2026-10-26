/**
 * @fileoverview Module `src/theme/interfaces/foreground.ts` providing foreground definitions and implementation.
 * @zh 模块文件 `src/theme/interfaces/foreground.ts`，提供前景相关的定义与实现。
 */

/**
 * Interface `Foreground` defining the contract and properties for foreground.
 * @zh 接口 `Foreground`，定义前景的数据结构契约与属性规范。
 */
export interface Foreground {
    /**
     * Property `base` (`string`) storing base.
     * @zh 属性 `base`（类型：`string`），用于存储或配置基础。
     */
    readonly base: string;
    /**
     * Property `divider` (`string`) storing divider.
     * @zh 属性 `divider`（类型：`string`），用于存储或配置divider。
     */
    readonly divider: string;
    /**
     * Property `dividers` (`string`) storing dividers.
     * @zh 属性 `dividers`（类型：`string`），用于存储或配置dividers。
     */
    readonly dividers: string;
    /**
     * Property `disabled` (`string`) storing disabled.
     * @zh 属性 `disabled`（类型：`string`），用于存储或配置已禁用。
     */
    readonly disabled: string;
    /**
     * Property `disabled-button` (`string`) storing disabled button.
     * @zh 属性 `disabled-button`（类型：`string`），用于存储或配置已禁用按钮。
     */
    readonly 'disabled-button': string;
    /**
     * Property `disabled-text` (`string`) storing disabled text.
     * @zh 属性 `disabled-text`（类型：`string`），用于存储或配置已禁用文本。
     */
    readonly 'disabled-text': string;
    /**
     * Property `hint-text` (`string`) storing hint text.
     * @zh 属性 `hint-text`（类型：`string`），用于存储或配置提示信息文本。
     */
    readonly 'hint-text': string;
    /**
     * Property `secondary-text` (`string`) storing secondary text.
     * @zh 属性 `secondary-text`（类型：`string`），用于存储或配置secondary文本。
     */
    readonly 'secondary-text': string;
    /**
     * Property `icon` (`string`) storing icon.
     * @zh 属性 `icon`（类型：`string`），用于存储或配置图标。
     */
    readonly icon: string;
    /**
     * Property `icons` (`string`) storing icons.
     * @zh 属性 `icons`（类型：`string`），用于存储或配置图标集合。
     */
    readonly icons: string;
    /**
     * Property `text` (`string`) storing text.
     * @zh 属性 `text`（类型：`string`），用于存储或配置文本。
     */
    readonly text: string;
    /**
     * Property `elevation` (`string`) storing elevation.
     * @zh 属性 `elevation`（类型：`string`），用于存储或配置层级阴影。
     */
    readonly elevation: string;
    /**
     * Property `slider-min` (`string`) storing slider min.
     * @zh 属性 `slider-min`（类型：`string`），用于存储或配置滑块最小值。
     */
    readonly 'slider-min': string;
    /**
     * Property `slider-off` (`string`) storing slider off.
     * @zh 属性 `slider-off`（类型：`string`），用于存储或配置滑块off。
     */
    readonly 'slider-off': string;
    /**
     * Property `slider-off-active` (`string`) storing slider off active.
     * @zh 属性 `slider-off-active`（类型：`string`），用于存储或配置滑块off激活。
     */
    readonly 'slider-off-active': string;
}
