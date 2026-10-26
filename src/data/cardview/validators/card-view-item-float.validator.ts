/**
 * @fileoverview Module `src/data/cardview/validators/card-view-item-float.validator.ts` providing card view item float validator definitions and implementation.
 * @zh 模块文件 `src/data/cardview/validators/card-view-item-float.validator.ts`，提供卡片视图条目float校验器相关的定义与实现。
 */


import { CardViewItemValidator } from '../interfaces';

/**
 * Class `CardViewItemFloatValidator` encapsulating card view item float validator data structures and logic in `src/data/cardview/validators`.
 * @zh 类 `CardViewItemFloatValidator`，封装 `src/data/cardview/validators` 中的卡片视图条目Float校验器数据结构与处理逻辑。
 */
export class CardViewItemFloatValidator implements CardViewItemValidator {

  /**
   * Property `message` (`string`) storing message.
   * @zh 属性 `message`（类型：`string`），用于存储或配置消息。
   */
  message = 'CORE.CARDVIEW.VALIDATORS.FLOAT_VALIDATION_ERROR';

  /**
   * Executes `isValid` to handle is valid.
   * @zh 执行 `isValid`，用于是否为有效。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isValid(value): boolean {
    return value === ''
      || !isNaN(parseFloat(value))
      && isFinite(value);
  }
}
