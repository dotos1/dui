/**
 * @fileoverview Module `src/common/animations/fade/fadeInOut.animation.ts` providing fade in out animation definitions and implementation.
 * @zh 模块文件 `src/common/animations/fade/fadeInOut.animation.ts`，提供fade在输出动画相关的定义与实现。
 */

import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationTriggerMetadata,
  AUTO_STYLE,
  query,
  animateChild,
  group,
} from '@angular/animations';
import { IAnimationOptions } from '../common/interfaces';

/**
 * Interface `IFadeInOutAnimation` defining the contract and properties for i fade in out animation.
 * @zh 接口 `IFadeInOutAnimation`，定义IFade在输出动画的数据结构契约与属性规范。
 */
export interface IFadeInOutAnimation extends IAnimationOptions {
  /**
   * Property `easeOnIn` (`string`) storing ease on in.
   * @zh 属性 `easeOnIn`（类型：`string`），用于存储或配置ease当在。
   */
  easeOnIn?: string;
  /**
   * Property `easeOnOut` (`string`) storing ease on out.
   * @zh 属性 `easeOnOut`（类型：`string`），用于存储或配置ease当输出。
   */
  easeOnOut?: string;
}

/**
 * Angular animation trigger `FadeInOutAnimation` defining state transitions for fade in out animation.
 * @zh Angular 动画触发器 `FadeInOutAnimation`，定义Fade在输出动画的状态过渡动画。
 */
export const FadeInOutAnimation: AnimationTriggerMetadata = trigger('duiFadeInOut', [
  state(
    '0',
    style({
      opacity: '0',
      visibility: 'hidden',
    }),
  ),
  state(
    '1',
    style({
      opacity: AUTO_STYLE,
      visibility: AUTO_STYLE,
    }),
  ),
  transition(
    '0 => 1',
    [
      group([
        query('@*', animateChild(), { optional: true }),
        animate('{{ duration }}ms {{ delay }}ms {{ easeOnIn }}'),
      ]),
    ],
    { params: { duration: 150, delay: '0', easeOnIn: 'ease-in' } },
  ),
  transition(
    '1 => 0',
    [
      group([
        query('@*', animateChild(), { optional: true }),
        animate('{{ duration }}ms {{ delay }}ms {{ easeOnOut }}'),
      ]),
    ],
    { params: { duration: 150, delay: '0', easeOnOut: 'ease-out' } },
  ),
]);
