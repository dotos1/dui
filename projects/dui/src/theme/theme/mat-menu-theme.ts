import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as  mat_menu from '../tokens/mat/_menu';
function base(theme: Theme): Object {
    return{
        ...create_token_values(mat_menu.$prefix,mat_menu.get_unthemable_tokens()),
    }
  }
  
function color(theme: Theme): Object {
    return{
        ...create_token_values(mat_menu.$prefix,mat_menu.get_color_tokens(theme)),
    }
  }
  
function density(theme: Theme): Object {
    return{
      ".mat-mdc-menu-item" : {
        ...create_token_values(mat_menu.$prefix,mat_menu.get_density_tokens(theme)),
        "min-height": "var(--mat-menu-menu-height) !important",
      }
    }
  }
  function typography(theme: TypographyConfig): Object {
    return{
            ...create_token_values(mat_menu.$prefix, mat_menu.get_typography_tokens(theme)),
    }
}
export function matMenuTheme(theme: Theme): Object {

    return {
        '.mat-mdc-menu-content': {
            ...typography(theme.typography),
        },
        '.mat-mdc-menu-panel': {
            ...base(theme),
            ...color(theme),
        },
        ...density(theme),
    };
}
