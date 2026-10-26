/**
 * @fileoverview Module `src/common/animations/bounce/bounce.animation.ts` providing bounce animation definitions and implementation.
 * @zh 模块文件 `src/common/animations/bounce/bounce.animation.ts`，提供bounce动画相关的定义与实现。
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
 * Angular animation trigger `BounceAnimation` defining state transitions for bounce animation.
 * @zh Angular 动画触发器 `BounceAnimation`，定义Bounce动画的状态过渡动画。
 */
export const BounceAnimation: AnimationTriggerMetadata = trigger('duiBounce', [
  state(
    '0',
    style({
      transform: 'translate3d(0, 0, 0)',
    }),
  ),
  state(
    '1',
    style({
      transform: 'translate3d(0, 0, 0)',
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
            style({
              animationTimingFunction: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
              transform: 'translate3d(0, 0, 0)',
              offset: 0,
            }),
            style({
              animationTimingFunction: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
              transform: 'translate3d(0, 0, 0)',
              offset: 0.2,
            }),
            style({
              animationTimingFunction: 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
              transform: 'translate3d(0, -30px, 0)',
              offset: 0.4,
            }),
            style({
              animationTimingFunction: 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
              transform: 'translate3d(0, -30px, 0)',
              offset: 0.43,
            }),
            style({
              animationTimingFunction: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
              transform: 'translate3d(0, 0, 0)',
              offset: 0.53,
            }),
            style({
              animationTimingFunction: 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
              transform: 'translate3d(0, -15px, 0)',
              offset: 0.7,
            }),
            style({
              animationTimingFunction: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
              transform: 'translate3d(0, 0, 0)',
              offset: 0.8,
            }),
            style({ transform: 'translate3d(0, -4px, 0)', offset: 0.9 }),
            style({
              animationTimingFunction: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
              transform: 'translate3d(0, 0, 0)',
              offset: 1.0,
            }),
          ]),
        ),
      ]),
    ],
    { params: { duration: 500, delay: '0', ease: 'ease-out' } },
  ),
]);
