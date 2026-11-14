/**
 * @fileoverview Module `src/common/animations/animations.ts` providing pure CSS animation metadata definitions.
 * @zh 模块文件 `src/common/animations/animations.ts`，提供零 `@angular/animations` 依赖的兼容导出定义。
 */

import { DuiAnimationMetadata } from './common/interfaces';

/**
 * Constant `customAnimation` providing CSS animation descriptor metadata for transition compatibility.
 * @zh 常量 `customAnimation`，提供过渡期兼容的纯 CSS 动画描述元数据。
 */
export const customAnimation: DuiAnimationMetadata = {
  name: 'animate',
  duration: 200,
  delay: 0,
  easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  cssClass: 'dui-anim-enter',
};

/**
 * Legacy-compatible empty animation list (`[]`) after `@angular/animations` removal in M3.
 * @zh M3 清退 `@angular/animations` 后的向后兼容空数组导出（`[]`），供下游过渡引用。
 */
export const duiAnimations: readonly DuiAnimationMetadata[] = [];
