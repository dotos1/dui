/**
 * @fileoverview Module `src/theme/theme/mat-datepicker-theme.ts` providing mat datepicker theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-datepicker-theme.ts`，提供Material日期选择器主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import * as inspection from '../mdc/inspection';
import { create_token_values } from '../mdc/token-utils';
import * as  mat_datepicker from '../tokens/mat/_datepicker';

/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
  return{
        ...create_token_values(mat_datepicker.$prefix,mat_datepicker.get_unthemable_tokens()),
  }
}
/**
 * Executes `_calendar_color` to handle calendar color.
 * @zh 执行 `_calendar_color`，用于日历颜色。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
function _calendar_color($theme, $palette_name) {
  let $palette_color= inspection.get_theme_color($theme, $palette_name);
  let $range_color= mat_datepicker.private_get_range_background_color($palette_color);
  let $range_tokens= mat_datepicker.get_range_color_tokens($range_color);
  let $calendar_tokens= mat_datepicker.private_get_calendar_color_palette_color_tokens($theme, $palette_name);

  return  create_token_values(mat_datepicker.$prefix,{...$calendar_tokens, ...$range_tokens});
}
/**
 * Executes `color` to handle color.
 * @zh 执行 `color`，用于颜色。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function color(theme: Theme): Object {
  return{
    ...create_token_values(mat_datepicker.$prefix,mat_datepicker.get_color_tokens(theme)),
  }
}


// @mixin date-range-colors(
//   $range-color,
//   $comparison-color: tokens-mat-datepicker.$private-default-comparison-color,
//   $overlap-color: tokens-mat-datepicker.$private-default-overlap-color,
//   $overlap-selected-color:tokens-mat-datepicker.private-get-default-overlap-selected-color($overlap-color)) {
//   $tokens: tokens-mat-datepicker.get-range-color-tokens(
//                   $range-color: $range-color,
//                   $comparison-color: $comparison-color,
//                   $overlap-color: $overlap-color,
//                   $overlap-selected-color: $overlap-selected-color,
//   );
//     retutn  token-utils.create-token-values(tokens-mat-datepicker.$prefix, $tokens);
// }

/**
 * Executes `density` to handle density.
 * @zh 执行 `density`，用于密度。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function density(theme: Theme): Object {
  return{
    ".mat-calendar-controls":{
    //   ...iconbutton.density(-2)
    }
  }
}
/**
 * Executes `typography` to handle typography.
 * @zh 执行 `typography`，用于排版。
 * @param theme - theme parameter (`TypographyConfig`) / 主题参数（`TypographyConfig`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function typography(theme: TypographyConfig): Object {
  return{
          ...create_token_values(mat_datepicker.$prefix, mat_datepicker.get_typography_tokens(theme))
  }
}

/**
 * Executes `matDatepickerTheme` to handle mat datepicker theme.
 * @zh 执行 `matDatepickerTheme`，用于Material日期选择器主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matDatepickerTheme(theme: Theme): Object {
  return {
    ".mat-datepicker-content": {
      "&.mat-accent": {
        ..._calendar_color(theme,'accent')
      },
      "&.mat-warn": {
        ..._calendar_color(theme,'warn')
      }
    },
    ".mat-datepicker-toggle-active": {
      "&.mat-accent": {
        ...create_token_values(mat_datepicker.$prefix,mat_datepicker.private_get_toggle_color_palette_color_tokens(theme, "accent")),
      },
      "&.mat-warn": {
        ...create_token_values(mat_datepicker.$prefix,mat_datepicker.private_get_toggle_color_palette_color_tokens(theme, "warn")),
      }
    },
    '.mat-calendar': {
      ...typography(theme.typography)
    },
    '.mat-datepicker': {
        ...base(theme),
        ...color(theme),
        ...density(theme),
    }
  };
}
