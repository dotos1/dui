/**
 * @fileoverview Module `src/theme/theme/dui-chips-theme.ts` providing dui chips theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-chips-theme.ts`，提供DUI纸片标签主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `duiChipsTheme` to handle dui chips theme.
 * @zh 执行 `duiChipsTheme`，用于DUI纸片标签主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiChipsTheme(theme: Theme): Object {
  const primaryColor: string = matColor(theme.primary);
  const warnColor: string = matColor(theme.warn);
  const accentColor: string = matColor(theme.accent, 'default');
  const primaryDefaultContrast: string = matColor(theme.primary, 'default-contrast');
  const warnDefaultContrast: string = matColor(theme.warn, 'default-contrast');
  const accentDefaultContrast: string = matColor(theme.accent, 'default-contrast');


  const type: string = theme.typography['type'];
  let px4: string = type === 'loose' ? '4px' : type === 'normal' ? '4px' : '3px';
  let px5: string = type === 'loose' ? '5px' : type === 'normal' ? '4px' : '3px';
  let px13: string = type === 'loose' ? '13px' : type === 'normal' ? '11px' : '10px';
  let px16: string = type === 'loose' ? '16px' : type === 'normal' ? '14px' : '12px';
  let px21: string = type === 'loose' ? '21px' : type === 'normal' ? '18px' : '16px';
  let px22: string = type === 'loose' ? '22px' : type === 'normal' ? '19px' : '17px';
  let px32: string = type === 'loose' ? '32px' : type === 'normal' ? '28px' : '24px';
  let px42: string = type === 'loose' ? '42px' : type === 'normal' ? '37px' : '32px';
  let px48: string = type === 'loose' ? '48px' : type === 'normal' ? '42px' : '36px';

  return {
    "dui-chips .mat-basic-chip": {
       "border-radius": px16 + " !important",
      "background": matColor(theme.background, 'status-bar'),
      "color": matColor(theme.foreground, 'text'),
      "&:focus:not(.dui-chip-disabled)": {
        "mat-icon:hover": {
          "color": matColor(theme.foreground, 'icon')
        },
        "&.mat-primary": {
          "background": primaryColor,
          "&, mat-icon": {
            "color": primaryDefaultContrast
          }
        },
        "&.mat-accent": {
          "background": accentColor,
          "&, mat-icon": {
            "color": accentDefaultContrast
          }
        },
        "&.mat-warn": {
          "background": warnColor,
          "&, mat-icon": {
            "color": warnDefaultContrast
          }
        }
      },
      "mat-icon.dui-chip-removal": {
        "color": matColor(theme.foreground, 'hint-text'),
        "&:hover": {
          "color": matColor(theme.foreground, 'icon')
        }
      }
    },
    "dui-chips": {
      "padding": " 0px " + px5 + " 0px " + px5 + " !important",
      "min-height": px48 + " !important",
      '&.mat-primary .mat-mdc-form-field-underline .mat-mdc-form-field-ripple': {
        'background-color': primaryColor,
      },
      '&.mat-accent .mat-mdc-form-field-underline .mat-mdc-form-field-ripple': {
        'background-color': accentColor
      },
      '&.mat-warn .mat-mdc-form-field-underline .mat-mdc-form-field-ripple': {
        'background-color': warnColor
      }
    },

    'dui-chips .dui-chips-wrapper': {
      'min-height': px42 + " !important"
    },
    'dui-chips  .mat-mdc-form-field-wrapper': {
      'padding-bottom': "2px" + " !important"
    },
    'dui-chips .mat-basic-chip .dui-chip': {
      "min-height": px32 + " !important",
      "line-height": px32 + " !important",
      "font-size": px13 + " !important",
      "[dui-chip-avatar]": {
        "height": px32 + " !important",
        "width": px32 + " !important",
      }
    },
    'dui-chips  .mat-basic-chip mat-icon.dui-chip-removal': {
      "margin": " 0 " + px4 + " !important",
      "font-size": px21 + " !important",
      "line-height": px22 + " !important",
    }
  }
}
