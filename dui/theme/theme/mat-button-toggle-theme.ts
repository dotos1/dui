import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as  standard from '../tokens/mat/_standard-button-toggle';
import * as  legacy from '../tokens/mat/_legacy-button-toggle';

function base(theme: Theme): Object {
  return{
      ...create_token_values(legacy.$prefix,legacy.get_unthemable_tokens()),
      ...create_token_values(standard.$prefix,standard.get_unthemable_tokens()),
  }
}

function color(theme: Theme): Object {
  return{
      ...create_token_values(legacy.$prefix,legacy.get_color_tokens(theme)),
      ...create_token_values(standard.$prefix,standard.get_color_tokens(theme)),
  }
}

function density(theme: Theme): Object {
  return{
      ...create_token_values(legacy.$prefix, legacy.get_density_tokens(theme)),
      ...create_token_values(standard.$prefix, standard.get_density_tokens(theme)),
  }
}
function typography(theme: TypographyConfig): Object {
   
  return{
          ...create_token_values(legacy.$prefix, legacy.get_typography_tokens(theme)),
          ...create_token_values(standard.$prefix, standard.get_typography_tokens(theme)),
  }
}
export function matButtonToggleTheme(theme: Theme): Object {
  return {
    ".mat-button-toggle": {
      ...base(theme),
      ...color(theme),
      ...density(theme),
      ...typography(theme.typography)
    }
  };
}
