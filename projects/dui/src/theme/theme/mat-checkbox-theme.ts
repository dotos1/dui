import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as keys from '../mdc/keys';
import * as  mdc_checkbox from '../tokens/mdc/_checkbox';
import * as  mdc_form from '../tokens/mdc/_form-field';
import * as  mat_checkbox from '../tokens/mat/_checkbox';
function base(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_checkbox.get_unthemable_tokens(),mdc_checkbox.$custom_property_prefix),
        ...create_token_values(mat_checkbox.$prefix,mat_checkbox.get_unthemable_tokens()),
  }
}

function color(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_checkbox.get_color_tokens(theme),mdc_checkbox.$custom_property_prefix),
        ...keys.declare_custom_properties(mdc_form.get_color_tokens(theme),mdc_form.$custom_property_prefix),
        ...create_token_values(mat_checkbox.$prefix,mat_checkbox.get_color_tokens(theme)),

      "&.mat-primary": {
        ...keys.declare_custom_properties(mdc_checkbox.get_color_tokens(theme,'primary'),mdc_checkbox.$custom_property_prefix),
      },

      "&.mat-warn": {
        ...keys.declare_custom_properties(mdc_checkbox.get_color_tokens(theme,'warn'),mdc_checkbox.$custom_property_prefix),
      }
  }
}

function density(theme: Theme): Object {
  return{
    ...keys.declare_custom_properties(mdc_checkbox.get_density_tokens(theme),mdc_checkbox.$custom_property_prefix),
    ...create_token_values(mat_checkbox.$prefix,mat_checkbox.get_density_tokens(theme)),
  }
}
function typography(theme: TypographyConfig): Object {
   
  return{
          ...keys.declare_custom_properties(mdc_checkbox.get_typography_tokens(theme),mdc_checkbox.$custom_property_prefix),
          ...keys.declare_custom_properties(mdc_form.get_typography_tokens(theme),mdc_form.$custom_property_prefix),
          ...create_token_values(mat_checkbox.$prefix, mat_checkbox.get_typography_tokens(theme))
  }
}
export function matCheckboxTheme(theme: Theme): Object {
    return {
        ".mat-mdc-checkbox": {
        ...base(theme),
        ...color(theme),
        ...density(theme),
        ...typography(theme.typography)
        }
      };
}
