/**
 * @fileoverview Module `src/common/animations/rotate/rotate.animation.ts` providing rotate animation definitions and implementation.
 * @zh 模块文件 `src/common/animations/rotate/rotate.animation.ts`，提供旋转动画相关的定义与实现。
 */

import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationTriggerMetadata,
  query,
  animateChild,
  group,
} from '@angular/animations';

import { IAnimationOptions } from '../common/interfaces';

/**
 * Interface `IRotateAnimation` defining the contract and properties for i rotate animation.
 * @zh 接口 `IRotateAnimation`，定义I旋转动画的数据结构契约与属性规范。
 */
export interface IRotateAnimation extends IAnimationOptions {
  /**
   * Property `degrees` (`number`) storing degrees.
   * @zh 属性 `degrees`（类型：`number`），用于存储或配置度数。
   */
  degrees?: number;
  /**
   * Property `ease` (`string`) storing ease.
   * @zh 属性 `ease`（类型：`string`），用于存储或配置ease。
   */
  ease?: string;
}


/**
 * Angular animation trigger `RotateAnimation` defining state transitions for rotate animation.
 * @zh Angular 动画触发器 `RotateAnimation`，定义旋转动画的状态过渡动画。
 */
export const RotateAnimation: AnimationTriggerMetadata = trigger('duiRotate', [
  state(
    '0',
    style({
      transform: 'rotate({{ degressStart }}deg)',
    }),
    { params: { degressStart: 0 } },
  ),
  state(
    '1',
    style({
      transform: 'rotate({{ degreesEnd }}deg)',
    }),
    { params: { degreesEnd: 180 } },
  ),
  transition(
    '0 <=> 1',
    [group([query('@*', animateChild(), { optional: true }), animate('{{ duration }}ms {{ delay }}ms {{ ease }}')])],
    { params: { duration: 250, delay: '0', ease: 'ease-in' } },
  ),
]);
