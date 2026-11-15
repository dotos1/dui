/**
 * @fileoverview Module `src/theme/theme/dui-datefield-theme.ts` providing dui datefield theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-datefield-theme.ts`，提供DUIdatefield主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor, rgba } from '../mat-color';
import { matThemeElevation } from '../utils/elevation';
import { matFontSize, matFontWeight,  matLineHeight } from '../utils/index';

/**
 * Executes `duiDateFieldTheme` to handle dui date field theme.
 * @zh 执行 `duiDateFieldTheme`，用于DUI日期字段主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiDateFieldTheme(theme: Theme): Object {
  let config= theme.typography;
  const type: string =config['type'];
  let px4: string = type === 'loose' ? '4px !default' : type === 'normal' ? '4px !default' : '3px !default';
  let px5: string = type === 'loose' ? '5px !default' : type === 'normal' ? '4px !default' : '4px !default';
  let px8: string = type === 'loose' ? '8px !default' : type === 'normal' ? '7px !default' : '6px !default';
  let px6: string = type === 'loose' ? '6px' : type === 'normal' ? '5px' : '5px';
  let px10: string = type === 'loose' ? '10px' : type === 'normal' ? '9px' : '8px';
  let px12: string = type === 'loose' ? '12px' : type === 'normal' ? '11px' : '9px';
  let px20: string = type === 'loose' ? '20px' : type === 'normal' ? '18px' : '15px';
  let px22: string = type === 'loose' ? '22px' : type === 'normal' ? '19px' : '17px';
  let px26: string = type === 'loose' ? '26px' : type === 'normal' ? '23px' : '21px';
  let px18: string = type === 'loose' ? '18px' : type === 'normal' ? '16px' : '14px';
  let px24: string = type === 'loose' ? '24px !default' : type === 'normal' ? '21px !default' : '18px !default';
  let px30: string = type === 'loose' ? '30px !default' : type === 'normal' ? '27px !default' : '24px  !default';
  let px40: string = type === 'loose' ? '40px' : type === 'normal' ? '35px' : '30px';
  let px48: string = type === 'loose' ? '48px' : type === 'normal' ? '42px' : '36px';
  let px64: string = type === 'loose' ? '64px' : type === 'normal' ? '56px' : '48px';
  let px240: string = type === 'loose' ? '240px !default' : type === 'normal' ? '210px !default' : '180px !default';
  let px168: string = type === 'loose' ? '168px !default' : type === 'normal' ? '147px !default' : '126px !default';
  let px224: string = type === 'loose' ? '224px !default' : type === 'normal' ? '198px  !default' : '170px  !default';
  let px280: string = type === 'loose' ? '280px' : type === 'normal' ? '235px' : '190px';
  let px446: string = type === 'loose' ? '446px' : type === 'normal' ? '400px' : '355px';
  let px328: string = type === 'loose' ? '328px' : type === 'normal' ? '286px' : '244px';
  let px405: string = type === 'loose' ? '405px' : type === 'normal' ? '351px' : '301px';
  let px150: string = type === 'loose' ? '150px' : type === 'normal' ? '131px' : '112px';
  let px175: string = type === 'loose' ? '175px' : type === 'normal' ? '153px' : '131px';

  const primaryColor: string = matColor(theme.primary);
  const warnColor: string = matColor(theme.warn);

  return {
    "dui-datepicker": {
      "min-width": px175,
    },
    ".dui-datepicker-trigger": {
      "padding": px18 + " 0 " + px4 + " " + px48
    },
    ".dui-datepicker-input": {
      "height": px30,
      "min-width": px168,
      "line-height": px22,
      "padding-right": px20,
    },
    ".dui-datepicker-placeholder": {
      "right": px18,
      "transform": "translate3d(0, " + px26 + ", 0) scale(1)",
      "&.dui-floating-placeholder": {
        "transform": "translate3d(0, " + px6 + ", 0) scale(0.75)"
      },
      "[dir='rtl'] &": {
        'left': px18
      }
    },
    ".dui-datepicker-arrow": {
      "border-left": px5 + "solid transparent",
      "border-right": px5 + " solid transparent",
      "border-top": px5 + " solid",
      "margin": " 0 " + px4
    },
    ".dui-calendar-years": {
      "bottom": px10,
      "line-height": px40,
    },
    ".dui-calendar-year": {
      "font-size": matFontSize(config, 'subheading-2'),
      "font-weight": matFontWeight(config, 'subheading-2'),
      "&.selected": {
        "font-size": matFontSize(config, 'headline'),
        "font-weight": matFontWeight(config, 'headline'),
      }
    },
    ".dui-datepicker-actions .dui-button": {
      "min-width": px64,
      "margin": px4 + " " + px8 + " " + px8 + " 0",
      "padding": "0 " + px12,
      "font-size": matFontSize(config, 'body-1'),
      "line-height": matLineHeight(config, 'body-1')
    },
    ".dui-datepicker-toggle": {
      "height": px24,
      "width": px24
    },
    ".dui-calendar": {
      "width": px40 + "* 7+" + px8 + " * 2",
      "height": px405,
      "&[mode='landscape']": {
        "width": px446,
        "height": px328,
      }
    },
    "@media (min-width: 480px)": {
      ".dui-calendar[mode='auto']": {
        "width": px446,
        "height": px328,
      },
      ".dui-calendar[mode='auto'] .dui-calendar-header": {
        "width": px150,
        "min-width": px150,
      },
      ".dui-calendar[mode='auto'] .dui-calendar-content": {
        "padding-top": px8
      }
    },
    "dui-clock": {
      "min-width": px224,
      "margin": px8,
      "font-size": matFontSize(config, 'body-1'),
    },
    ".dui-clock-hand": {
      "&::before": {
        "top": "-" + px4,
        "left": "-" + px4,
        "width": px8,
        "height": px8
      }
    },
    ".dui-calendar-header": {
      "padding": px8 + "* 2",
      "font-size": matFontSize(config, 'body-1'),
      "[mode='landscape'] &": {
        "width": px150,
        "min-width": px150,
      }
    },
    ".dui-calendar-header-date-time": {
      "font-size": matFontSize(config, 'headline'),
      "line-height": matLineHeight(config, 'headline')
    },
    ".dui-calendar-header-time": {
      "padding-left": px8
    },
    ".dui-calendar-content": {
      "padding": " 0 " + px8 + " " + px8 + " " + px8,
      "[mode='landscape'] &": {
        "padding-top": px8
      }
    },
    ".dui-calendar-period-button": {
      "height": px48,
      "padding": px12,
    },
    ".dui-calendar-previous-button,.dui-calendar-ndui-button": {
      "width": px48,
      "height": px48,
      "padding": px12,
    },
    ".dui-calendar-table-header th": {
      "font-size": matFontSize(config, 'caption'),
      "padding": " 0 0 " + px8 + "  0"
    },
    ".mat-datetimepicker-calendar-body-label": {
      "color": matColor(theme.foreground, 'icon')
    },
    ".mat-datetimepicker-calendar-body-cell-content": {
      color: matColor(theme.foreground, 'text'),
    },
    ".mat-datetimepicker-calendar-body-disabled > .mat-datetimepicker-calendar-body-cell-content:not(.mat-datetimepicker-calendar-body-selected)": {
      color: matColor(theme.foreground, 'slider-off-active'),
    },
    // ":not(.mat-datetimepicker-calendar-body-disabled):hover,.mat-datetimepicker-calendar-body-active > .mat-datetimepicker-calendar-body-cell-content:not(.mat-datetimepicker-calendar-body-selected)": {
    //   "background-color": matColor(theme.foreground, 'divider')
    // },
    ".mat-datetimepicker-calendar-body-disabled > .mat-datetimepicker-calendar-body-today:not(.mat-datetimepicker-calendar-body-selected)": {
      "border-color": matColor(theme.foreground, 'disabled-button')
    },
    ".mat-datetimepicker-calendar-header": {
      'background-color': primaryColor,
      "color": matColor(theme.primary, 'darker-contrast')
    },
    ".mat-datetimepicker-calendar-table-header": {
      "color": matColor(theme.foreground, 'slider-off-active')
    },
    ".mat-datetimepicker-clock": {
      "background-color": "darken(" + matColor(theme.background, 'card') + ", 12)"
    },
    ".mat-datetimepicker-clock-cell": {
      "color": matColor(theme.foreground, 'text'),
    },
    '.mat-datetimepicker-clock-cell .mat-datetimepicker-clock-cell-selected': {
      'color': matColor(theme.primary, 'darker-contrast'),
      'background-color': primaryColor
    },
    ".mat-datetimepicker-clock-cell:not(.mat-datetimepicker-clock-cell-selected):not(.mat-datetimepicker-clock-cell-disabled):hover": {
      "background-color": matColor(theme.foreground, 'divider')
    },
    ".mat-datetimepicker-clock-cell .mat-datetimepicker-clock-cell-disabled": {
      color: matColor(theme.foreground, 'slider-off-active')
    },
    ".mat-datetimepicker-content": {
      ...matThemeElevation(8, theme, 1),
      "background-color": matColor(theme.background, 'card')
    },
    ".mat-datetimepicker-content-touch": {
      ...matThemeElevation(0, theme, 1),
    },
    // ".cdk-overlay-dark-backdrop": {
    //   "background": matColor(theme.foreground, 'icon')
    // },
    '.mat-datetimepicker-calendar-body-selected': {
      'background-color': primaryColor,
      'color':  matColor(theme.primary, 'darker-contrast')
    },
    '.mat-datetimepicker-calendar-body-disabled > .mat-datetimepicker-calendar-body-selected': {
      'background-color': rgba(primaryColor, 0.4),
    },
    '.mat-datetimepicker-calendar-body-today': {
      '&:not(.mat-datetimepicker-calendar-body-selected)': {
        'border-color': primaryColor
      },
      ' &.mat-datetimepicker-calendar-body-selected': {
        // 'box-shadow': mat-datetimepicker-color(primaryColor, default-contrast)
      }
    },
    '.mat-datetimepicker-clock-hand': {
      'background-color': primaryColor,
      '&::before': {
        'background-color': primaryColor
      }
    },
    '.mat-datetimepicker-clock-center': {
      'background-color': primaryColor
    },

    '.mat-datetimepicker-datepicker-arrow': {
      '.mat-datetimepicker-datepicker-input-focused &': {
        'color': primaryColor
      },
      ' mat-datetimepicker-datepicker.ng-invalid.ng-touched:not(.mat-datetimepicker-datepicker-disabled) &': {
        'color': warnColor
      }
    },
    '.mat-datetimepicker-calendar-year': {
      '&.selected': {
        'color': primaryColor
      }
    },
    '.mat-datetimepicker-datepicker-actions': {
      '.dui-button': {
        'color': primaryColor
      }
    },
    ".mat-datetimepicker-calendar-controls":{
      color:matColor(theme.foreground, 'text')
    },
    '.mat-datetimepicker-datepicker-input': {
      '&.mat-datetimepicker-datepicker-input-focused': {
        'color': primaryColor,
        'border-color': primaryColor
      },
      ' mat-datetimepicker-datepicker.ng-invalid.ng-touched:not(.mat-datetimepicker-datepicker-disabled) ': {
        'color': warnColor,
        'border-color': warnColor
      }
    }
  }
}
