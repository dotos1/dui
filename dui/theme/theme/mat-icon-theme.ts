import { Theme } from '../interfaces/theme';
import * as inspection from '../mdc/inspection';

import { create_token_values } from '../mdc/token-utils';
import * as  mat_icon from '../tokens/mat/_icon';
function _palette_colors($theme, $palette_name) {
    let $color= inspection.get_theme_color($theme, $palette_name, 'text');
    let $tokens= mat_icon.private_get_icon_color_tokens($color);
    return create_token_values(mat_icon.$prefix,$tokens);
  }
function base(theme: Theme): Object {
    return{
    }
  }
  
function color(theme: Theme): Object {
    return{
          ...create_token_values(mat_icon.$prefix,mat_icon.get_color_tokens(theme)),
        "&.mat-primary": {
          ..._palette_colors(theme,'primary')
        },
        "&.mat-accent": {
            ..._palette_colors(theme,'accent')
        },
        "&.mat-warn": {
          ..._palette_colors(theme,'warn')
        }
    }
  }
function density(theme: Theme): Object {
    return{
    }
  }
export function matIconTheme(theme: Theme): Object {
    return {
      ".mat-icon": {
          ...base(theme),
          ...color(theme),
          ...density(theme),
          "color":"var(--mat-icon-color)"
        }
      };
}
