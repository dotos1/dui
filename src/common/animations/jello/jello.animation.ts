/**
 * @fileoverview Module `src/common/animations/jello/jello.animation.ts` providing jello animation metadata.
 * @zh 模块文件 `src/common/animations/jello/jello.animation.ts`，提供果冻弹性纯 CSS 动画描述元数据。
 */

import { DuiAnimationMetadata } from '../common/interfaces';

/**
 * Pure CSS animation metadata `JelloAnimation` for jello transitions.
 * @zh 纯 CSS 动画描述元数据 `JelloAnimation`，用于果冻弹性过渡动画。
 */
export const JelloAnimation: DuiAnimationMetadata = {
  name: 'duiJello',
  duration: 500,
  delay: 0,
  easing: 'ease-out',
  cssClass: 'dui-anim-jello',
};
