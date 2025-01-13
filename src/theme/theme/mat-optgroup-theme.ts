import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as  mat_optgroup from '../tokens/mat/_optgroup';
function base(theme: Theme): Object {
    return{ }
}
  
function color(theme: Theme): Object {
    return{
          ...create_token_values(mat_optgroup.$prefix,mat_optgroup.get_color_tokens(theme)),
    }
}
  
function density(theme: Theme): Object {
    return{ }
}
function typography(theme: TypographyConfig) {
    return{
        ...create_token_values(mat_optgroup.$prefix, mat_optgroup.get_typography_tokens(theme))
    }
}
export function matOptgroupTheme(theme: Theme): Object {
    return {
        ".mat-mdc-optgroup": {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
