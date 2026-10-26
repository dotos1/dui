/**
 * The offset of the dynamic window from sides of the screen in CSS format
 * @zh 接口 `DynamicWindowFullscreenOffset`，定义动态窗口全屏偏移量的数据结构契约与属性规范。
 */
export interface DynamicWindowFullscreenOffset {
    /**
     * The offset from the top
     * @zh 属性 `top`（类型：`string`），用于存储或配置顶部位置。
     */
    top?: string;
    /**
     * The offset from the left
     * @zh 属性 `left`（类型：`string`），用于存储或配置左侧位置。
     */
    left?: string;
    /**
     * The offset from the bottom
     * @zh 属性 `bottom`（类型：`string`），用于存储或配置底部位置。
     */
    bottom?: string;
    /**
     * The offset from the right
     * @zh 属性 `right`（类型：`string`），用于存储或配置右侧位置。
     */
    right?: string;
}
