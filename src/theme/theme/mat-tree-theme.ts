import { Theme } from '../interfaces/theme';
import { create_token_values } from '../mdc/token-utils';
import * as  mat_tree from '../tokens/mat/_tree';
import { TypographyConfig } from '../interfaces';

function base(theme: Theme): Object {
    return{
    }
  }
  
  function color(theme: Theme): Object {
    return{
        ...create_token_values(mat_tree.$prefix,mat_tree.get_color_tokens(theme)),
    }
  }
  
  function density(theme: Theme): Object {
    return{
        ...create_token_values(mat_tree.$prefix,mat_tree.get_density_tokens(theme)),
    }
  }
  function typography(theme: TypographyConfig): Object {
    return{
        ...create_token_values(mat_tree.$prefix,mat_tree.get_typography_tokens(theme)),
    }
}
export function matTreeTheme(theme: Theme): Object {
    return {
        '.mat-tree': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
