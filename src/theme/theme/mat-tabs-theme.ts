import { TypographyConfig } from '../interfaces';
import {
  Theme
} from '../interfaces/index';
import * as keys from '../mdc/keys';
import { create_token_values } from '../mdc/token-utils';
import * as mat_tab_header from '../tokens/mat/_tab-header';
import * as mat_tab_header_bg from '../tokens/mat/_tab-header-with-background';
import * as mdc_tab from '../tokens/mdc/_tab';
import * as mdc_tab_indicator from '../tokens/mdc/_tab-indicator';


function base(theme: Theme): Object {
    return{
          ...keys.declare_custom_properties(mdc_tab_indicator.get_unthemable_tokens(),mdc_tab_indicator.$custom_property_prefix),
          ...keys.declare_custom_properties(mdc_tab.get_unthemable_tokens(),mdc_tab.$custom_property_prefix_secondary),
          ...create_token_values(mat_tab_header.$prefix,mat_tab_header.get_unthemable_tokens()),
          // ...create_token_values(mat_tab_header_bg.$prefix,mat_tab_header_bg.get_unthemable_tokens()),
    }
  }

  function _palette_styles($theme, $palette_name) {
    return{
          // ...keys.declare_custom_properties(mdc_tab.get_color_tokens($theme, $palette_name),mdc_tab.$custom_property_prefix_secondary),
          ...keys.declare_custom_properties(mdc_tab_indicator.get_color_tokens($theme, $palette_name),mdc_tab_indicator.$custom_property_prefix),
          ...create_token_values(mat_tab_header.$prefix,mat_tab_header.get_color_tokens($theme, $palette_name)),
    }
  }

  function _background_styles($theme, $palette_name) {
    return{
          ...create_token_values(mat_tab_header_bg.$prefix,mat_tab_header_bg.get_color_tokens($theme, $palette_name)),
    }
  }

  function color(theme: Theme): Object {
    return{
            ..._palette_styles(theme, "primary"),
            "&.mat-accent": {
                ..._palette_styles(theme, "accent"),
            },
            "&.mat-warn": {
                ..._palette_styles(theme, "warn"),
            },
            "&.mat-background-primary": {
                ..._background_styles(theme, "primary"),
            },
            "&.mat-background-accent": {
              ..._background_styles(theme, "accent"),
            },
            "&.mat-background-warn": {
              ..._background_styles(theme, "warn"),
            }
      }
  }
  
  function density(theme: Theme): Object {
    return{
        // ".mat-mdc-tab-header":{
            ...keys.declare_custom_properties(mdc_tab.get_density_tokens(theme),mdc_tab.$custom_property_prefix_secondary),
            // ...keys.declare_custom_properties(mdc_tab_indicator.get_density_tokens(theme),mdc_tab_indicator.$custom_property_prefix),
            // ...create_token_values(mat_tab_header.$prefix,mat_tab_header.get_density_tokens(theme)),
            // ...create_token_values(mat_tab_header_bg.$prefix,mat_tab_header_bg.get_density_tokens(theme)),
        // }
    }
  }
  function typography(theme: TypographyConfig) {
    return{
          // ...keys.declare_custom_properties(mdc_tab.get_typography_tokens(theme),mdc_tab.$custom_property_prefix_secondary),
          // ...keys.declare_custom_properties(mdc_tab_indicator.get_typography_tokens(theme),mdc_tab_indicator.$custom_property_prefix),
          ...create_token_values(mat_tab_header.$prefix, mat_tab_header.get_typography_tokens(theme)),
          // ...create_token_values(mat_tab_header_bg.$prefix, mat_tab_header_bg.get_typography_tokens(theme))
    }
  }
export function matTabsTheme(theme: Theme): Object {
    return {
      '.mat-mdc-tab-group': {
            ...base(theme),
            ...color(theme),
            ...density(theme)
      },
      '.mat-mdc-tab-header': {
        ...typography(theme.typography)
    }
    };
}


