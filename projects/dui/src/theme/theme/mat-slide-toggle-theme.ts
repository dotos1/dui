import { Theme } from '../interfaces/index';
import { TypographyConfig } from '../interfaces';
import * as inspection from '../mdc/inspection';
import { create_token_values } from '../mdc/token-utils';
import * as keys from '../mdc/keys';
import * as  mdc_form from '../tokens/mdc/_form-field';
import * as  mdc_switch from '../tokens/mdc/_switch';
import * as  mat_switch from '../tokens/mat/_switch';

function base(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_switch.get_unthemable_tokens(),mdc_switch.$custom_property_prefix),
        ...create_token_values(mat_switch.$prefix,mat_switch.get_unthemable_tokens()),
  }
}

function color(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_switch.get_color_tokens(theme),mdc_switch.$custom_property_prefix),
        ...keys.declare_custom_properties(mdc_form.get_color_tokens(theme),mdc_form.$custom_property_prefix),
        ...create_token_values(mat_switch.$prefix,mat_switch.get_color_tokens(theme)),
        "--mdc-switch-disabled-label-text-color": inspection.get_theme_color(theme,'foreground','disabled-text'),
        
        "&.mat-accent": {
            ...keys.declare_custom_properties(mdc_switch.private_get_color_palette_color_tokens(theme,'accent'),mdc_switch.$custom_property_prefix),
        },

        "&.mat-warn": {
            ...keys.declare_custom_properties(mdc_switch.private_get_color_palette_color_tokens(theme,'warn'),mdc_switch.$custom_property_prefix),
        }
    }
}

function density(theme: Theme): Object {
  return{
    ...keys.declare_custom_properties(mdc_switch.get_density_tokens(theme),mdc_switch.$custom_property_prefix),
  }
}
function typography(theme: TypographyConfig) {
  return{
      ...keys.declare_custom_properties(mdc_switch.get_typography_tokens(theme),mdc_switch.$custom_property_prefix),
      ...keys.declare_custom_properties(mdc_form.get_typography_tokens(theme),mdc_form.$custom_property_prefix),
      ...create_token_values(mat_switch.$prefix, mat_switch.get_typography_tokens(theme))
  }
}
export function matSlideToggleTheme(theme: Theme): Object {
    return {
        ".mat-mdc-slide-toggle": {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
