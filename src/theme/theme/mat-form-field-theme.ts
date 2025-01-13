import { Theme } from '../interfaces/theme';
import { create_token_values } from '../mdc/token-utils';
import * as keys from '../mdc/keys';
import { TypographyConfig } from '../interfaces';
import * as  mdc_filled from '../tokens/mdc/_filled-text-field';
import * as  mdc_outlined from '../tokens/mdc/_outlined-text-field';
import * as  mat_form from '../tokens/mat/_form-field';

function base(theme: Theme): Object {
  return{
        ...create_token_values(mdc_filled.$prefix,mdc_filled.get_unthemable_tokens()),
        ...create_token_values(mdc_outlined.$prefix,mdc_outlined.get_unthemable_tokens()),
        ...create_token_values(mat_form.$prefix,mat_form.get_unthemable_tokens()),
  }
}

function color(theme: Theme): Object {
  return{
      ...keys.declare_custom_properties(mdc_filled.get_color_tokens(theme),mdc_filled.$custom_property_prefix),
      ...keys.declare_custom_properties(mdc_outlined.get_color_tokens(theme),mdc_outlined.$custom_property_prefix),
      ...create_token_values(mat_form.$prefix,mat_form.get_color_tokens(theme)),
    "&.mat-accent": {
        ...keys.declare_custom_properties(mdc_filled.private_get_color_palette_color_tokens(theme, 'accent'),mdc_filled.$custom_property_prefix),
        ...keys.declare_custom_properties(mdc_outlined.private_get_color_palette_color_tokens(theme, 'accent'),mdc_filled.$custom_property_prefix),
        ...create_token_values(mat_form.$prefix,mat_form.private_get_color_palette_color_tokens(theme, 'accent')),
    },
    "&.mat-warn": {
        ...keys.declare_custom_properties(mdc_filled.private_get_color_palette_color_tokens(theme, 'warn'),mdc_filled.$custom_property_prefix),
        ...keys.declare_custom_properties(mdc_outlined.private_get_color_palette_color_tokens(theme, 'warn'),mdc_filled.$custom_property_prefix),
        ...create_token_values(mat_form.$prefix,mat_form.private_get_color_palette_color_tokens(theme, 'warn')),
    },
  }
}

function density(theme: Theme): Object {
  return{
    ...create_token_values(mat_form.$prefix,mat_form.get_density_tokens(theme)),
    ...create_token_values(mdc_outlined.$prefix,mdc_outlined.get_density_tokens(theme)),
  }
}
function typography(theme: TypographyConfig): Object {
  return{
          ...keys.declare_custom_properties(mdc_filled.get_typography_tokens(theme),mdc_filled.$custom_property_prefix),
          ...keys.declare_custom_properties(mdc_outlined.get_typography_tokens(theme),mdc_outlined.$custom_property_prefix),
          ...create_token_values(mat_form.$prefix, mat_form.get_typography_tokens(theme))
  }
}

export function matFormFieldTheme(theme: Theme): Object {
    return {
      ".mat-mdc-form-field":{
        ...base(theme),
        ...color(theme),
        ...density(theme),
        ...typography(theme.typography)
      },
      ".mat-mdc-text-field-wrapper": {
        "--mat-mdc-form-field-label-offset-x": "-8px" ,
        " .mdc-text-field__input":{
          "padding-left":"5px"
        }
       }
      };
}
