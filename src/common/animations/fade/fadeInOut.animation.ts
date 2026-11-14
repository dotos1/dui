/**
 * @fileoverview Module `src/common/animations/fade/fadeInOut.animation.ts` providing fade in/out animation metadata.
 * @zh 模块文件 `src/common/animations/fade/fadeInOut.animation.ts`，提供淡入淡出纯 CSS 动画描述元数据。
 */

import { DuiAnimationMetadata, IAnimationOptions } from '../common/interfaces';

/**
 * Interface `IFadeInOutAnimation` defining the contract and properties for fade in/out animation options.
 * @zh 接口 `IFadeInOutAnimation`，定义淡入淡出动画配置选项的数据结构契约与属性规范。
 */
export interface IFadeInOutAnimation extends IAnimationOptions {
  /**
   * Property `easeOnIn` (`string`) storing ease on in.
   * @zh 属性 `easeOnIn`（类型：`string`），用于存储或配置淡入缓动函数。
   */
  easeOnIn?: string;
  /**
   * Property `easeOnOut` (`string`) storing ease on out.
   * @zh 属性 `easeOnOut`（类型：`string`），用于存储或配置淡出缓动函数。
   */
  easeOnOut?: string;
}

/**
 * Pure CSS animation metadata `FadeInOutAnimation` for fade in/out transitions.
 * @zh 纯 CSS 动画描述元数据 `FadeInOutAnimation`，用于淡入淡出过渡动画。
 */
export const FadeInOutAnimation: DuiAnimationMetadata = {
  name: 'duiFadeInOut',
  duration: 150,
  delay: 0,
  easing: 'ease-in-out',
  cssClass: 'dui-anim-fade-in-out',
};
