/**
 * @fileoverview Module `src/form/date/picker/datetimepicker-animations.ts` providing datetimepicker animations definitions and implementation.
 * @zh 模块文件 `src/form/date/picker/datetimepicker-animations.ts`，提供日期时间选择器动画相关的定义与实现。
 */

import {animate, AnimationTriggerMetadata, keyframes, state, style, transition, trigger} from "@angular/animations";


/**
 * Angular animation trigger `fadeInContent` defining state transitions for fade in content.
 * @zh Angular 动画触发器 `fadeInContent`，定义fade在内容的状态过渡动画。
 */
export const fadeInContent: AnimationTriggerMetadata = trigger("fadeInContent", [
  state("showing", style({opacity: 1})),
  transition("void => showing", [
    style({opacity: 0}),
    animate(`150ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)`)
  ])
]);

/**
 * Angular animation trigger `slideCalendar` defining state transitions for slide calendar.
 * @zh Angular 动画触发器 `slideCalendar`，定义slide日历的状态过渡动画。
 */
export const slideCalendar: AnimationTriggerMetadata = trigger("slideCalendar", [
  transition("* => left", [
    animate(180, keyframes([
      style({transform: "translateX(100%)", offset: 0.5}),
      style({transform: "translateX(-100%)", offset: 0.51}),
      style({transform: "translateX(0)", offset: 1})
    ]))
  ]),
  transition("* => right", [
    animate(180, keyframes([
      style({transform: "translateX(-100%)", offset: 0.5}),
      style({transform: "translateX(100%)", offset: 0.51}),
      style({transform: "translateX(0)", offset: 1})
    ]))
  ])
]);
