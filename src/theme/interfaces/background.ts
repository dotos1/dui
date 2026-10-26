/**
 * @fileoverview Module `src/theme/interfaces/background.ts` providing background definitions and implementation.
 * @zh 模块文件 `src/theme/interfaces/background.ts`，提供背景相关的定义与实现。
 */

/**
 * Interface `Background` defining the contract and properties for background.
 * @zh 接口 `Background`，定义背景的数据结构契约与属性规范。
 */
export interface Background {
    /**
     * Property `status-bar` (`string`) storing status bar.
     * @zh 属性 `status-bar`（类型：`string`），用于存储或配置状态条。
     */
    readonly 'status-bar': string;
    /**
     * Property `app-bar` (`string`) storing app bar.
     * @zh 属性 `app-bar`（类型：`string`），用于存储或配置app条。
     */
    readonly 'app-bar': string;
    /**
     * Property `background` (`string`) storing background.
     * @zh 属性 `background`（类型：`string`），用于存储或配置背景。
     */
    readonly background: string;
    /**
     * Property `hover` (`string`) storing hover.
     * @zh 属性 `hover`（类型：`string`），用于存储或配置hover。
     */
    readonly hover: string;
    /**
     * Property `card` (`string`) storing card.
     * @zh 属性 `card`（类型：`string`），用于存储或配置卡片。
     */
    readonly card: string;
    /**
     * Property `dialog` (`string`) storing dialog.
     * @zh 属性 `dialog`（类型：`string`），用于存储或配置对话框。
     */
    readonly dialog: string;
    /**
     * Property `disabled-button` (`string`) storing disabled button.
     * @zh 属性 `disabled-button`（类型：`string`），用于存储或配置已禁用按钮。
     */
    readonly 'disabled-button': string;
    /**
     * Property `raised-button` (`string`) storing raised button.
     * @zh 属性 `raised-button`（类型：`string`），用于存储或配置raised按钮。
     */
    readonly 'raised-button': string;
    /**
     * Property `focused-button` (`string`) storing focused button.
     * @zh 属性 `focused-button`（类型：`string`），用于存储或配置已聚焦按钮。
     */
    readonly 'focused-button': string;
    /**
     * Property `selected-button` (`string`) storing selected button.
     * @zh 属性 `selected-button`（类型：`string`），用于存储或配置已选中按钮。
     */
    readonly 'selected-button': string;
    /**
     * Property `selected-disabled-button` (`string`) storing selected disabled button.
     * @zh 属性 `selected-disabled-button`（类型：`string`），用于存储或配置已选中已禁用按钮。
     */
    readonly 'selected-disabled-button': string;
    /**
     * Property `disabled-button-toggle` (`string`) storing disabled button toggle.
     * @zh 属性 `disabled-button-toggle`（类型：`string`），用于存储或配置已禁用按钮开关。
     */
    readonly 'disabled-button-toggle': string;
    /**
     * Property `unselected-chip` (`string`) storing unselected chip.
     * @zh 属性 `unselected-chip`（类型：`string`），用于存储或配置已取消选中纸片标签。
     */
    readonly 'unselected-chip': string;
    /**
     * Property `disabled-list-option` (`string`) storing disabled list option.
     * @zh 属性 `disabled-list-option`（类型：`string`），用于存储或配置已禁用列表选项。
     */
    readonly 'disabled-list-option': string;
    /**
     * Property `tooltip` (`string`) storing tooltip.
     * @zh 属性 `tooltip`（类型：`string`），用于存储或配置悬浮提示。
     */
    readonly 'tooltip': string;
}
