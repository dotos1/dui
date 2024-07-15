import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as  mat_option from '../tokens/mat/_option';
function base(theme: Theme): Object {
    return{ }
}
  
function color(theme: Theme): Object {
   
    return{
        ...create_token_values(mat_option.$prefix,mat_option.get_color_tokens(theme)),
        ".mat-accent": {
          ...create_token_values(mat_option.$prefix,mat_option.get_color_tokens(theme,'accent')),
        },
        ".mat-warn": {
          ...create_token_values(mat_option.$prefix,mat_option.get_color_tokens(theme,'warn')),
        }
    }
}
  
function density(theme: Theme): Object {
    return{

          ...create_token_values(mat_option.$prefix,mat_option.get_density_tokens(theme)),


      }
}
function typography(theme: TypographyConfig) {
    return{
        ...create_token_values(mat_option.$prefix, mat_option.get_typography_tokens(theme))
    }
}
export function matOptionTheme(theme: Theme): Object {
    return {
        ".mat-mdc-option":{
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography),
            "min-height": "var( --mat-option-option-height) !important",
        },
    };
} 
