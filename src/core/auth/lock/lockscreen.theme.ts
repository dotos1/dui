/**
 * @fileoverview Module `src/core/auth/lock/lockscreen.theme.ts` providing lockscreen theme definitions and implementation.
 * @zh 模块文件 `src/core/auth/lock/lockscreen.theme.ts`，提供lockscreen主题相关的定义与实现。
 */


import { Theme } from '@dotos1/dui/theme';
import { matColor } from '@dotos1/dui/theme';

/**
 * Executes `LockTheme` to handle lock theme.
 * @zh 执行 `LockTheme`，用于锁定主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function LockTheme(theme: Theme): Object {
  const backgroundCardColor: string = matColor(theme.background, 'card');
  const textColor: string = matColor(theme.foreground, 'secondary-text');
  return {
    "lock-dialog  #lock-form-wrapper #lock-form": {
      "background": backgroundCardColor
    },
    "lock-dialog  #lock-form-wrapper #lock-form .lock-form-header .avatar-container  mat-icon": {
      "color": "red"
    },
    "lock-dialog  #lock-form-wrapper #lock-form .lock-form-header  .title": {
      "color": textColor
    },
    "lock-dialog  #lock-form-wrapper #lock-form .lock-form-header  .subtitle": {
      "color": textColor
    },
    "lock-dialog  #lock-form-wrapper #lock-form .message  .link": {
      "color":  matColor(theme.accent)
    }
  };
}

