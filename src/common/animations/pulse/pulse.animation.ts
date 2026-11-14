/**
 * @fileoverview Module `src/common/animations/pulse/pulse.animation.ts` providing pulse animation metadata.
 * @zh 模块文件 `src/common/animations/pulse/pulse.animation.ts`，提供脉冲纯 CSS 动画描述元数据。
 */

import { DuiAnimationMetadata } from '../common/interfaces';

/**
 * Pure CSS animation metadata `PulseAnimation` for pulse transitions.
 * @zh 纯 CSS 动画描述元数据 `PulseAnimation`，用于脉冲过渡动画。
 */
export const PulseAnimation: DuiAnimationMetadata = {
  name: 'duiPulse',
  duration: 500,
  delay: 0,
  easing: 'ease-out',
  cssClass: 'dui-anim-pulse',
};
