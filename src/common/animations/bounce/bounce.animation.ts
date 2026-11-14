/**
 * @fileoverview Module `src/common/animations/bounce/bounce.animation.ts` providing bounce animation metadata.
 * @zh 模块文件 `src/common/animations/bounce/bounce.animation.ts`，提供 bounce 纯 CSS 动画描述元数据。
 */

import { DuiAnimationMetadata } from '../common/interfaces';

/**
 * Pure CSS animation metadata `BounceAnimation` for bounce transitions.
 * @zh 纯 CSS 动画描述元数据 `BounceAnimation`，用于弹跳过渡动画。
 */
export const BounceAnimation: DuiAnimationMetadata = {
  name: 'duiBounce',
  duration: 500,
  delay: 0,
  easing: 'ease-out',
  cssClass: 'dui-anim-bounce',
};
