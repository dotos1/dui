/**
 * @fileoverview Module `src/common/animations/rotate/rotate.animation.ts` providing rotate animation metadata.
 * @zh 模块文件 `src/common/animations/rotate/rotate.animation.ts`，提供旋转纯 CSS 动画描述元数据。
 */

import { DuiAnimationMetadata, IAnimationOptions } from '../common/interfaces';

/**
 * Interface `IRotateAnimation` defining the contract and properties for rotate animation options.
 * @zh 接口 `IRotateAnimation`，定义旋转动画配置选项的数据结构契约与属性规范。
 */
export interface IRotateAnimation extends IAnimationOptions {
  /**
   * Property `degrees` (`number`) storing degrees.
   * @zh 属性 `degrees`（类型：`number`），用于存储或配置旋转角度。
   */
  degrees?: number;
  /**
   * Property `ease` (`string`) storing ease.
   * @zh 属性 `ease`（类型：`string`），用于存储或配置缓动函数。
   */
  ease?: string;
}

/**
 * Pure CSS animation metadata `RotateAnimation` for rotate transitions.
 * @zh 纯 CSS 动画描述元数据 `RotateAnimation`，用于旋转过渡动画。
 */
export const RotateAnimation: DuiAnimationMetadata = {
  name: 'duiRotate',
  duration: 250,
  delay: 0,
  easing: 'ease-in',
  cssClass: 'dui-anim-rotate',
};
