import {
    Theme
} from '../interfaces/index';
import { resolve_elevation,create_token_values } from '../mdc/token-utils';
import * as keys from '../mdc/keys';
import { TypographyConfig } from '../interfaces';
import * as  mdc_slider from '../tokens/mdc/_slider';
import * as  mat_slider from '../tokens/mat/_slider';


function base(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_slider.get_unthemable_tokens(),mdc_slider.$custom_property_prefix),
        ...create_token_values(mat_slider.$prefix,mat_slider.get_unthemable_tokens()),
  }
}

function color(theme: Theme): Object {
    let $mdc_color_tokens= resolve_elevation(mdc_slider.get_color_tokens(theme), "handle-elevation",  "handle-shadow-color");
    let $mat_slider_color_tokens= mat_slider.get_color_tokens(theme);
  return{
        ...keys.declare_custom_properties($mdc_color_tokens,mdc_slider.$custom_property_prefix),
        ...create_token_values(mat_slider.$prefix,$mat_slider_color_tokens),
        
        ".mat-accent": {
            ...create_token_values(mat_slider.$prefix,mat_slider.private_get_color_palette_color_tokens(theme,'accent')),
            ...keys.declare_custom_properties(mdc_slider.private_get_color_palette_color_tokens(theme,'accent'),mdc_slider.$custom_property_prefix),
        },

        ".mat-warn": {
            ...create_token_values(mat_slider.$prefix,mat_slider.private_get_color_palette_color_tokens(theme,'warn')),
            ...keys.declare_custom_properties(mdc_slider.private_get_color_palette_color_tokens(theme,'warn'),mdc_slider.$custom_property_prefix),
        }
    }
}

function density(theme: Theme): Object {
  return{
    ...keys.declare_custom_properties(mdc_slider.get_density_tokens(theme),mdc_slider.$custom_property_prefix),
  }
}
function typography(theme: TypographyConfig) {
    return{
        ...keys.declare_custom_properties(mdc_slider.get_typography_tokens(theme),mdc_slider.$custom_property_prefix),
    }
  }
export function matSliderTheme(theme: Theme): Object {
    return {
        '.mat-mdc-slider': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        },
    };
}


