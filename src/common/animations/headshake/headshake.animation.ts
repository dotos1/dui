/**
 * @fileoverview Module `src/common/animations/headshake/headshake.animation.ts` providing headshake animation metadata.
 * @zh 模块文件 `src/common/animations/headshake/headshake.animation.ts`，提供摇头纯 CSS 动画描述元数据。
 */

import { DuiAnimationMetadata } from '../common/interfaces';

/**
 * Pure CSS animation metadata `HeadshakeAnimation` for headshake transitions.
 * @zh 纯 CSS 动画描述元数据 `HeadshakeAnimation`，用于摇头过渡动画。
 */
export const HeadshakeAnimation: DuiAnimationMetadata = {
  name: 'duiHeadshake',
  duration: 500,
  delay: 0,
  easing: 'ease-out',
  cssClass: 'dui-anim-headshake',
};
