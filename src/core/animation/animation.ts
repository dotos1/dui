/**
 * @fileoverview Module `src/core/animation/animation.ts` providing animation definitions and implementation.
 * @zh 模块文件 `src/core/animation/animation.ts`，提供动画相关的定义与实现。
 */


/**
 * Class `AnimationCurves` encapsulating animation curves data structures and logic in `src/core/animation`.
 * @zh 类 `AnimationCurves`，封装 `src/core/animation` 中的动画曲线数据结构与处理逻辑。
 */
export class AnimationCurves {
  /**
   * Property `STANDARD_CURVE` (`string`) storing standard curve (default: `'cubic-bezier(0.4,0.0,0.2,1)'`).
   * @zh 属性 `STANDARD_CURVE`（类型：`string`），用于存储或配置STANDARD曲线（默认值：`'cubic-bezier(0.4,0.0,0.2,1)'`）。
   */
  static STANDARD_CURVE = 'cubic-bezier(0.4,0.0,0.2,1)';
  /**
   * Property `DECELERATION_CURVE` (`string`) storing deceleration curve (default: `'cubic-bezier(0.0,0.0,0.2,1)'`).
   * @zh 属性 `DECELERATION_CURVE`（类型：`string`），用于存储或配置DECELERATION曲线（默认值：`'cubic-bezier(0.0,0.0,0.2,1)'`）。
   */
  static DECELERATION_CURVE = 'cubic-bezier(0.0,0.0,0.2,1)';
  /**
   * Property `ACCELERATION_CURVE` (`string`) storing acceleration curve (default: `'cubic-bezier(0.4,0.0,1,1)'`).
   * @zh 属性 `ACCELERATION_CURVE`（类型：`string`），用于存储或配置ACCELERATION曲线（默认值：`'cubic-bezier(0.4,0.0,1,1)'`）。
   */
  static ACCELERATION_CURVE = 'cubic-bezier(0.4,0.0,1,1)';
  /**
   * Property `SHARP_CURVE` (`string`) storing sharp curve (default: `'cubic-bezier(0.4,0.0,0.6,1)'`).
   * @zh 属性 `SHARP_CURVE`（类型：`string`），用于存储或配置SHARP曲线（默认值：`'cubic-bezier(0.4,0.0,0.6,1)'`）。
   */
  static SHARP_CURVE = 'cubic-bezier(0.4,0.0,0.6,1)';
}

/**
 * @docs-private
 * @zh 类 `AnimationDurations`，封装 `src/core/animation` 中的动画持续时间数据结构与处理逻辑。
 */
export class AnimationDurations {
  /**
   * Property `COMPLEX` (`string`) storing complex (default: `'375ms'`).
   * @zh 属性 `COMPLEX`（类型：`string`），用于存储或配置COMPLEX（默认值：`'375ms'`）。
   */
  static COMPLEX = '375ms';
  /**
   * Property `ENTERING` (`string`) storing entering (default: `'225ms'`).
   * @zh 属性 `ENTERING`（类型：`string`），用于存储或配置进入（默认值：`'225ms'`）。
   */
  static ENTERING = '225ms';
  /**
   * Property `EXITING` (`string`) storing exiting (default: `'195ms'`).
   * @zh 属性 `EXITING`（类型：`string`），用于存储或配置EXITING（默认值：`'195ms'`）。
   */
  static EXITING = '195ms';
}
