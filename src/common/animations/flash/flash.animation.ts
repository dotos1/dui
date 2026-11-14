/**
 * @fileoverview Module `src/common/animations/flash/flash.animation.ts` providing flash animation metadata.
 * @zh 模块文件 `src/common/animations/flash/flash.animation.ts`，提供闪烁纯 CSS 动画描述元数据。
 */

import { DuiAnimationMetadata } from '../common/interfaces';

/**
 * Pure CSS animation metadata `FlashAnimation` for flash transitions.
 * @zh 纯 CSS 动画描述元数据 `FlashAnimation`，用于闪烁过渡动画。
 */
export const FlashAnimation: DuiAnimationMetadata = {
  name: 'duiFlash',
  duration: 500,
  delay: 0,
  easing: 'ease-out',
  cssClass: 'dui-anim-flash',
};
