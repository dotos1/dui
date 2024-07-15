import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import * as inspection from '../mdc/inspection';
import { create_token_values } from '../mdc/token-utils';
import * as  mat_datepicker from '../tokens/mat/_datepicker';
import * as  iconbutton from './mat-icon-button-theme';


function base(theme: Theme): Object {
  return{
        ...create_token_values(mat_datepicker.$prefix,mat_datepicker.get_unthemable_tokens()),
  }
}
function _calendar_color($theme, $palette_name) {
  let $palette_color= inspection.get_theme_color($theme, $palette_name);
  let $range_color= mat_datepicker.private_get_range_background_color($palette_color);
  let $range_tokens= mat_datepicker.get_range_color_tokens($range_color);
  let $calendar_tokens= mat_datepicker.private_get_calendar_color_palette_color_tokens($theme, $palette_name);

  return  create_token_values(mat_datepicker.$prefix,{...$calendar_tokens, ...$range_tokens});
}
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

function density(theme: Theme): Object {
  return{
    ".mat-calendar-controls":{
    //   ...iconbutton.density(-2)
    }
  }
}
function typography(theme: TypographyConfig): Object {
  return{
          ...create_token_values(mat_datepicker.$prefix, mat_datepicker.get_typography_tokens(theme))
  }
}

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
