/**
 * @fileoverview Module `src/common/popover/popover-animations.ts` providing popover animations definitions and implementation.
 * @zh 模块文件 `src/common/popover/popover-animations.ts`，提供气泡卡片动画相关的定义与实现。
 */

import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationTriggerMetadata,
} from '@angular/animations';

/**
 * Angular animation trigger `transformPopover` defining state transitions for transform popover.
 * @zh Angular 动画触发器 `transformPopover`，定义转换气泡卡片的状态过渡动画。
 */
export const transformPopover: AnimationTriggerMetadata = trigger('transformPopover', [
  state('enter', style({
    opacity: 1,
    transform: `scale(1)`
  })),
  transition('void => *', [
    style({
      opacity: 0,
      transform: `scale(0)`
    }),
    animate(`200ms cubic-bezier(0.25, 0.8, 0.25, 1)`)
  ]),
  transition('* => void', [
    animate('50ms 100ms linear', style({opacity: 0}))
  ])
]);
