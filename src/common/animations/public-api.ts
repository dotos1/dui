/**
 * @fileoverview Module `src/common/animations/public-api.ts` providing public api definitions and implementation.
 * @zh 模块文件 `src/common/animations/public-api.ts`，提供动画模块公开 API 导出定义。
 */

export { customAnimation, duiAnimations } from './animations';
export * from './animations.module';
export { BounceAnimation } from './bounce/bounce.animation';
export { CollapseAnimation, ICollapseAnimation } from './collapse/collapse.animation';
export { DuiAnimationMetadata, IAnimationOptions } from './common/interfaces';
export { FadeInOutAnimation, IFadeInOutAnimation } from './fade/fadeInOut.animation';
export { FlashAnimation } from './flash/flash.animation';
export { HeadshakeAnimation } from './headshake/headshake.animation';
export { JelloAnimation } from './jello/jello.animation';
export { PulseAnimation } from './pulse/pulse.animation';
export { IRotateAnimation, RotateAnimation } from './rotate/rotate.animation';
export { ToggleDirective } from './toggle/toggle.directive';
