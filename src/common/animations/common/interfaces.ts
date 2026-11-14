/**
 * @fileoverview Module `src/common/animations/common/interfaces.ts` providing interfaces definitions and implementation.
 * @zh 模块文件 `src/common/animations/common/interfaces.ts`，提供动画配置接口相关的定义与实现。
 */

/**
 * Interface `IAnimationOptions` defining the contract and properties for animation options.
 * @zh 接口 `IAnimationOptions`，定义动画配置选项的数据结构契约与属性规范。
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

/**
 * Pure CSS / Web Animations API metadata descriptor replacing legacy `@angular/animations` triggers.
 * @zh 纯 CSS / Web Animations API 动画描述元数据接口，用于替代旧版 `@angular/animations` 触发器。
 */
export interface DuiAnimationMetadata {
  /**
   * Animation trigger / preset name.
   * @zh 动画预设名称。
   */
  readonly name: string;
  /**
   * Default animation duration in milliseconds.
   * @zh 默认动画持续时间（毫秒）。
   */
  readonly duration?: number;
  /**
   * Default animation delay in milliseconds.
   * @zh 默认动画延迟时间（毫秒）。
   */
  readonly delay?: number;
  /**
   * CSS timing / easing function.
   * @zh CSS 缓动函数。
   */
  readonly easing?: string;
  /**
   * Optional CSS utility class associated with this animation.
   * @zh 与该动画关联的可选 CSS 类名。
   */
  readonly cssClass?: string;
}
