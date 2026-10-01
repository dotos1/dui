import { TypographyConfig } from '../interfaces';
import { Theme } from '../interfaces/theme';
import { create_token_values } from '../mdc/token-utils';
import * as  badge from '../tokens/mat/_badge';


function base(theme: Theme): Object {
  return{
      ...create_token_values(badge.$prefix,badge.get_unthemable_tokens())
  }
}

function color(theme: Theme): Object {
  return{
      ...create_token_values(badge.$prefix,badge.get_color_tokens(theme)),
      ".mat-badge-accent": {
       ...create_token_values(badge.$prefix,  badge.private_get_color_palette_color_tokens(theme, "accent"))
      },
     ".mat-badge-warn": {
       ... create_token_values(badge.$prefix, badge.private_get_color_palette_color_tokens(theme, "warn"))
      }
  }
}

function density(theme: Theme): Object {
  return{
      ...create_token_values(badge.$prefix, badge.get_density_tokens(theme))
  }
}
function typography(theme: TypographyConfig): Object {
  return{
    ...create_token_values(badge.$prefix,badge.get_typography_tokens(theme)),
  }
}
export function matBadgeTheme(theme: Theme): Object {

    return {
      ".mat-badge": {
        ...base(theme),
        ...color(theme),
        ...density(theme),
        ...typography(theme.typography)
      },
    };
}

