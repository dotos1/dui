import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as  select from '../tokens/mat/_select';

function base(theme: Theme): Object {
    let $mat_tokens= select.get_unthemable_tokens();

    return {
        ...create_token_values(select.$prefix, $mat_tokens)
    }
}
function color(theme: Theme): Object {
    return {
        ...create_token_values(select.$prefix,select.get_color_tokens(theme)),
        ".mat-mdc-form-field.mat-accent":{
            ...create_token_values(select.$prefix, select.get_color_tokens(theme, "accent"))
          },
          ".mat-mdc-form-field.mat-warn":{
            ...create_token_values(select.$prefix,select.get_color_tokens(theme, "warn"))
          }
    }
}
  
function density(theme) {
    return {
        ...create_token_values(select.$prefix, select.get_density_tokens(theme))
    }
  }
  function typography(theme:TypographyConfig) {
    return{
        ...create_token_values(select.$prefix, select.get_typography_tokens(theme))
    }
}
export function matSelectTheme(theme: Theme): Object {
    return {
        '.mat-mdc-select,.mat-mdc-select-panel' : {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}

