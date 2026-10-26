/**
 * Settings for {@link FixedToParentDirective}
 * @zh 类 `FixedToParentConfig`，封装 `src/ux/windows/utils/classes` 中的固定转换为父级配置数据结构与处理逻辑。
 */
export class FixedToParentConfig {
    /**
     * Is should be fixed to parent or not
     * @zh 属性 `isEnabled`（类型：`boolean`），用于存储或配置是否为已启用（默认值：`true`）。
     */
    public isEnabled?: boolean = true;
    /**
     * Recalculation interval of the element position in milliseconds
     * @zh 属性 `recalculationIntervalInMs`（类型：`number`），用于存储或配置recalculation间隔定时器在毫秒（默认值：`5`）。
     */
    public recalculationIntervalInMs?: number = 5;
    /**
     * Amount of calculations after scroll.
     *
     * Some browsers have animated scroll and need to run several iterations
     * with some delay between them to calculate actual element position.
     *
     * Unfortunately, there is no better way to observe the end of the scroll animation.
     *
     * @zh 属性 `calculationIterationsCount`（类型：`number`），用于存储或配置calculationIterations计数（默认值：`40`）。
     */
    public calculationIterationsCount?: number = 40;
}
