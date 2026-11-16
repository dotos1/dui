/**
 * @fileoverview Module `src/common/animations/common/interfaces.ts` providing interfaces definitions and implementation.
 * @zh 模块文件 `src/common/animations/common/interfaces.ts`，提供interfaces相关的定义与实现。
 */

/**
 * Interface `IAnimationOptions` defining the contract and properties for i animation options.
 * @zh 接口 `IAnimationOptions`，定义I动画配置选项的数据结构契约与属性规范。
 */
export interface IAnimationOptions {
  /**
   * Property `anchor` (`string`) storing anchor.
   * @zh 属性 `anchor`（类型：`string`），用于存储或配置锚点。
   */
  anchor?: string;
  /**
   * Property `duration` (`number`) storing duration.
   * @zh 属性 `duration`（类型：`number`），用于存储或配置持续时间。
   */
  duration?: number;
  /**
   * Property `delay` (`number`) storing delay.
   * @zh 属性 `delay`（类型：`number`），用于存储或配置延迟。
   */
  delay?: number;
 }
