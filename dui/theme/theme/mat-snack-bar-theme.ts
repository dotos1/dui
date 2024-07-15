import { Theme } from '../interfaces/theme';
import { create_token_values } from '../mdc/token-utils';
import * as keys from '../mdc/keys';
import * as  mdc_snack from '../tokens/mdc/_snack-bar';
import * as  mat_snack from '../tokens/mat/_snack-bar';
import { TypographyConfig } from '../interfaces';
function base(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_snack.get_unthemable_tokens(),mdc_snack.$custom_property_prefix),
  }
}

function color(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_snack.get_color_tokens(theme),mdc_snack.$custom_property_prefix),
        ...create_token_values(mat_snack.$prefix,mat_snack.get_color_tokens(theme)),
    }
}
function density(theme: Theme): Object {
  return{
  }
}
function typography(theme: TypographyConfig) {
  return{
      ...keys.declare_custom_properties(mdc_snack.get_typography_tokens(theme),mdc_snack.$custom_property_prefix),
  }
}
export function matSnackBarTheme(theme: Theme): Object {
    return {
        '.mat-mdc-snack-bar': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
