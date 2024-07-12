import {
    Theme
} from '../interfaces/index';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as keys from '../mdc/keys';
import * as  mdc_form from '../tokens/mdc/_form-field';
import * as  mdc_radio from '../tokens/mdc/_radio';
import * as  mat_radio from '../tokens/mat/_radio';
function base(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_radio.get_unthemable_tokens(),mdc_radio.$custom_property_prefix),
        ...create_token_values(mat_radio.$prefix,mat_radio.get_unthemable_tokens()),
  }
}

function color(theme: Theme): Object {

  return{
        ...keys.declare_custom_properties(mdc_form.get_color_tokens(theme),mdc_form.$custom_property_prefix),
        ...create_token_values(mat_radio.$prefix,mat_radio.get_color_tokens(theme)),
      "&.mat-primary": {
        ...keys.declare_custom_properties(mdc_radio.get_color_tokens(theme,'primary'),mdc_radio.$custom_property_prefix),
        ...create_token_values(mat_radio.$prefix,mat_radio.get_color_tokens(theme,'primary')),
      },
      "&.mat-accent": {
        ...keys.declare_custom_properties(mdc_radio.get_color_tokens(theme),mdc_radio.$custom_property_prefix),
        ...create_token_values(mat_radio.$prefix,mat_radio.get_color_tokens(theme)),
      },
      "&.mat-warn": {
        ...keys.declare_custom_properties(mdc_radio.get_color_tokens(theme,'warn'),mdc_radio.$custom_property_prefix),
        ...create_token_values(mat_radio.$prefix,mat_radio.get_color_tokens(theme,'warn')),
      }
  }
}

function density(theme: Theme): Object {
  return{
    ...keys.declare_custom_properties(mdc_radio.get_density_tokens(theme),mdc_radio.$custom_property_prefix),
    ...create_token_values(mat_radio.$prefix,mat_radio.get_density_tokens(theme)),
  }
}
function typography(theme: TypographyConfig): Object {
   
  return{
      ...keys.declare_custom_properties(mdc_radio.get_typography_tokens(theme),mdc_radio.$custom_property_prefix),
      ...keys.declare_custom_properties(mdc_form.get_typography_tokens(theme),mdc_form.$custom_property_prefix),
      ...create_token_values(mat_radio.$prefix, mat_radio.get_typography_tokens(theme))
  }
}
export function matRadioTheme(theme: Theme): Object {

    return {
      ".mat-mdc-radio-button": {
          ...base(theme),
          ...color(theme),
          ...density(theme),
          ...typography(theme.typography)
      }
    };
}