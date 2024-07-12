import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as  mat_expansion from '../tokens/mat/_expansion';


function base(theme: Theme): Object {
    return{
          ...create_token_values(mat_expansion.$prefix,mat_expansion.get_unthemable_tokens()),
    }
  }
  
  function color(theme: Theme): Object {
    return{
          ...create_token_values(mat_expansion.$prefix,mat_expansion.get_color_tokens(theme)),
    }
  }
  
  function density(theme: Theme): Object {
    return{
        ...create_token_values(mat_expansion.$prefix,mat_expansion.get_density_tokens(theme)),
    }
  }
  function typography(theme: TypographyConfig): Object {
    return{
            ...create_token_values(mat_expansion.$prefix, mat_expansion.get_typography_tokens(theme))
    }
  }
export function matExpansionPanelTheme(theme: Theme): Object {
    return {
        '.mat-expansion-panel': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        },
    }; 
}
