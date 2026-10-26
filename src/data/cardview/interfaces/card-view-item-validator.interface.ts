/**
 * @fileoverview Module `src/data/cardview/interfaces/card-view-item-validator.interface.ts` providing card view item validator interface definitions and implementation.
 * @zh 模块文件 `src/data/cardview/interfaces/card-view-item-validator.interface.ts`，提供卡片视图条目校验器interface相关的定义与实现。
 */


/**
 * Interface `CardViewItemValidator` defining the contract and properties for card view item validator.
 * @zh 接口 `CardViewItemValidator`，定义卡片视图条目校验器的数据结构契约与属性规范。
 */
export interface CardViewItemValidator {
  /**
   * Property `message` (`string`) storing message.
   * @zh 属性 `message`（类型：`string`），用于存储或配置消息。
   */
  message: string;
  /**
   * Executes `isValid` to handle is valid.
   * @zh 执行 `isValid`，用于是否为有效。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isValid(value): boolean;
}
