/**
 * @fileoverview Module `src/common/animations/headshake/headshake.animation.ts` providing headshake animation definitions and implementation.
 * @zh 模块文件 `src/common/animations/headshake/headshake.animation.ts`，提供headshake动画相关的定义与实现。
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
 * Angular animation trigger `HeadshakeAnimation` defining state transitions for headshake animation.
 * @zh Angular 动画触发器 `HeadshakeAnimation`，定义Headshake动画的状态过渡动画。
 */
export const HeadshakeAnimation: AnimationTriggerMetadata = trigger('duiHeadshake', [
  state(
    '0',
    style({
      transform: 'translateX(0)',
    }),
  ),
  state(
    '1',
    style({
      transform: 'translateX(0)',
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
            style({ transform: 'translateX(0)', offset: 0 }),
            style({ transform: 'translateX(-6px) rotateY(-9deg)', offset: 0.065 }),
            style({ transform: 'translateX(5px) rotateY(7deg)', offset: 0.185 }),
            style({ transform: 'translateX(-3px) rotateY(-5deg)', offset: 0.315 }),
            style({ transform: 'translateX(2px) rotateY(3deg)', offset: 0.435 }),
            style({ transform: 'translateX(0)', offset: 0.5 }),
          ]),
        ),
      ]),
    ],
    { params: { duration: 500, delay: '0', ease: 'ease-out' } },
  ),
]);
