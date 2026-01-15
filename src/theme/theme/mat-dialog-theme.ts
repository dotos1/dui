import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import { dialog_theme } from '../mdc/theme-utils';
import * as keys from '../mdc/keys';
import * as  mdc_dialog from '../tokens/mdc/_dialog';
import * as  mat_dialog from '../tokens/mat/_dialog';

function base(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(dialog_theme(mdc_dialog.get_unthemable_tokens()),mdc_dialog.$custom_property_prefix),
        ...create_token_values(mat_dialog.$prefix,mat_dialog.get_unthemable_tokens()),
  }
}

function color(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(dialog_theme(mdc_dialog.get_color_tokens(theme)),mdc_dialog.$custom_property_prefix),
        ...create_token_values(mat_dialog.$prefix,mat_dialog.get_color_tokens(theme)),
  }
}

function density(theme: Theme): Object {
  return{
  }
}
function typography(theme: TypographyConfig): Object {
  return{
      ...keys.declare_custom_properties(dialog_theme(mdc_dialog.get_typography_tokens(theme)),mdc_dialog.$custom_property_prefix),
      ...create_token_values(mat_dialog.$prefix, mat_dialog.get_typography_tokens(theme))
  }
}
export function matDialogTheme(theme: Theme): Object {
  return {
    '.mat-mdc-dialog-container': {
      "box-shadow": "var(--mdc-dialog-container-elevation-shadow)",
      ...typography(theme.typography)
    },
    '.mdc-dialog': {
        ...base(theme),
        ...color(theme),
        ...density(theme),
    }
  };
}
