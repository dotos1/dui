/**
 * @fileoverview Module `src/common/animations/collapse/collapse.animation.ts` providing collapse animation definitions and implementation.
 * @zh 模块文件 `src/common/animations/collapse/collapse.animation.ts`，提供折叠动画相关的定义与实现。
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
 * Interface `ICollapseAnimation` defining the contract and properties for i collapse animation.
 * @zh 接口 `ICollapseAnimation`，定义I折叠动画的数据结构契约与属性规范。
 */
export interface ICollapseAnimation extends IAnimationOptions {
  /**
   * Property `easeOnClose` (`string`) storing ease on close.
   * @zh 属性 `easeOnClose`（类型：`string`），用于存储或配置ease当关闭。
   */
  easeOnClose?: string;
  /**
   * Property `easeOnOpen` (`string`) storing ease on open.
   * @zh 属性 `easeOnOpen`（类型：`string`），用于存储或配置ease当打开。
   */
  easeOnOpen?: string;
}


/**
 * Angular animation trigger `CollapseAnimation` defining state transitions for collapse animation.
 * @zh Angular 动画触发器 `CollapseAnimation`，定义折叠动画的状态过渡动画。
 */
export const CollapseAnimation: AnimationTriggerMetadata = trigger('duiCollapse', [
  state(
    '1',
    style({
      height: '0',
      overflow: 'hidden',
    }),
  ),
  state(
    '0',
    style({
      height: AUTO_STYLE,
      overflow: AUTO_STYLE,
    }),
  ),
  transition(
    '0 => 1',
    [
      style({
        overflow: 'hidden',
        height: AUTO_STYLE,
      }),
      group([
        query('@*', animateChild(), { optional: true }),
        animate(
          '{{ duration }}ms {{ delay }}ms {{ ease }}',
          style({
            height: '0',
            overflow: 'hidden',
          }),
        ),
      ]),
    ],
    { params: { duration: 150, delay: '0', ease: 'ease-in' } },
  ),
  transition(
    '1 => 0',
    [
      style({
        height: '0',
        overflow: 'hidden',
      }),
      group([
        query('@*', animateChild(), { optional: true }),
        animate(
          '{{ duration }}ms {{ delay }}ms {{ ease }}',
          style({
            overflow: 'hidden',
            height: AUTO_STYLE,
          }),
        ),
      ]),
    ],
    { params: { duration: 150, delay: '0', ease: 'ease-out' } },
  ),
]);
