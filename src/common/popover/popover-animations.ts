/**
 * @fileoverview Module `src/common/popover/popover-animations.ts` providing popover CSS animation metadata.
 * @zh 模块文件 `src/common/popover/popover-animations.ts`，提供气泡卡片纯 CSS 动画描述元数据。
 */

/**
 * Pure CSS animation metadata `transformPopover` replacing legacy `@angular/animations` trigger.
 * @zh 纯 CSS 动画描述元数据 `transformPopover`，替代旧版 `@angular/animations` 触发器。
 */
export const transformPopover: Readonly<{
  name: string;
  enterDuration: number;
  leaveDuration: number;
  easing: string;
}> = {
  name: 'transformPopover',
  enterDuration: 200,
  leaveDuration: 50,
  easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
};
