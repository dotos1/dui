/**
 * @fileoverview Module `src/util/models/decimal-number.model.ts` providing decimal number model definitions and implementation.
 * @zh 模块文件 `src/util/models/decimal-number.model.ts`，提供decimal数字模型相关的定义与实现。
 */


/**
 * Class `DecimalNumberModel` encapsulating decimal number model data structures and logic in `src/util/models`.
 * @zh 类 `DecimalNumberModel`，封装 `src/util/models` 中的Decimal数字模型数据结构与处理逻辑。
 */
export class DecimalNumberModel {
    /**
     * Property `minIntegerDigits` (`number`) storing min integer digits.
     * @zh 属性 `minIntegerDigits`（类型：`number`），用于存储或配置最小值Integer数字位。
     */
    minIntegerDigits: number;
    /**
     * Property `minFractionDigits` (`number`) storing min fraction digits.
     * @zh 属性 `minFractionDigits`（类型：`number`），用于存储或配置最小值Fraction数字位。
     */
    minFractionDigits: number;
    /**
     * Property `maxFractionDigits` (`number`) storing max fraction digits.
     * @zh 属性 `maxFractionDigits`（类型：`number`），用于存储或配置最大值Fraction数字位。
     */
    maxFractionDigits: number;

    /**
     * Creates an instance of `DecimalNumberModel` and initializes its dependencies and internal state.
     * @zh 创建 `DecimalNumberModel` 实例，并初始化其依赖项与内部状态。
     * @param obj - Injected or initial obj (`any`) / 注入或传入的对象（`any`）
     */
    constructor(obj?: Partial<DecimalNumberModel>) {
        if (obj) {
            this.minIntegerDigits = obj.minIntegerDigits;
            this.minFractionDigits = obj.minFractionDigits;
            this.maxFractionDigits = obj.maxFractionDigits;
        }
    }
}
