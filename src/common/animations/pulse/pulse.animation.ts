/**
 * @fileoverview Module `src/common/animations/pulse/pulse.animation.ts` providing pulse animation definitions and implementation.
 * @zh 模块文件 `src/common/animations/pulse/pulse.animation.ts`，提供pulse动画相关的定义与实现。
 */

import {
  trigger,
  state,
  style,
  keyframes,
  transition,
  animate,
  AnimationTriggerMetadata,
  query,
  animateChild,
  group,
} from '@angular/animations';

/**
 * Angular animation trigger `PulseAnimation` defining state transitions for pulse animation.
 * @zh Angular 动画触发器 `PulseAnimation`，定义Pulse动画的状态过渡动画。
 */
export const PulseAnimation: AnimationTriggerMetadata = trigger('duiPulse', [
  state(
    '0',
    style({
      transform: 'scale3d(1, 1, 1)',
    }),
  ),
  state(
    '1',
    style({
      transform: 'scale3d(1, 1, 1)',
    }),
  ),
  transition(
    '0 <=> 1',
    [
      group([
        query('@*', animateChild(), { optional: true }),
        animate(
          '{{ duration }}ms {{ delay }}ms {{ ease }}',
          keyframes([
            style({ transform: 'scale3d(1, 1, 1)', offset: 0 }),
            style({ transform: 'scale3d(1.05, 1.05, 1.05)', offset: 0.5 }),
            style({ transform: 'scale3d(1, 1, 1)', offset: 1.0 }),
          ]),
        ),
      ]),
    ],
    { params: { duration: 500, delay: '0', ease: 'ease-out' } },
  ),
]);
