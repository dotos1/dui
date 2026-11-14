/**
 * @fileoverview Module `src/form/date/picker/datetimepicker-animations.ts` providing datetimepicker CSS animation metadata.
 * @zh 模块文件 `src/form/date/picker/datetimepicker-animations.ts`，提供日期时间选择器纯 CSS 动画描述元数据。
 */

/**
 * Pure CSS animation metadata `fadeInContent` replacing legacy `@angular/animations` trigger.
 * @zh 纯 CSS 淡入动画元数据 `fadeInContent`。
 */
export const fadeInContent: Readonly<{
  name: string;
  duration: number;
  delay: number;
  easing: string;
}> = {
  name: 'fadeInContent',
  duration: 150,
  delay: 100,
  easing: 'cubic-bezier(0.55, 0, 0.55, 0.2)',
};

/**
 * Pure CSS animation metadata `slideCalendar` replacing legacy `@angular/animations` trigger.
 * @zh 纯 CSS 日历滑动动画元数据 `slideCalendar`。
 */
export const slideCalendar: Readonly<{
  name: string;
  duration: number;
}> = {
  name: 'slideCalendar',
  duration: 180,
};
