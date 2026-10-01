import { Theme } from '../interfaces/theme';
import { create_token_values } from '../mdc/token-utils';
import * as  autocomplete from '../tokens/mat/_autocomplete';
import { TypographyConfig } from '../interfaces/typography-config';
function typography(theme: TypographyConfig): Object {
  return{
    ...create_token_values(autocomplete.$prefix,autocomplete.get_typography_tokens(theme)),
  }
}
function base(theme: Theme): Object {
  return{
      ...create_token_values(autocomplete.$prefix,autocomplete.get_unthemable_tokens())
  }
}

function color(theme: Theme): Object {
  return{
      ...create_token_values(autocomplete.$prefix,autocomplete.get_color_tokens(theme))
  }
}

function density(theme: Theme): Object {
  return{
      ...create_token_values(autocomplete.$prefix, autocomplete.get_density_tokens(theme))
  }
}
export function matAutocompleteTheme(theme: Theme): Object {
  return {
    '.mat-mdc-autocomplete-panel': {
      ...base(theme),
      ...color(theme),
      ...density(theme),
      ...typography(theme.typography)
    }
  };
}
