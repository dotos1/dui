import { Theme } from '../interfaces/theme';
import { create_token_values } from '../mdc/token-utils';
import * as  mat_sort from '../tokens/mat/_sort';

function base(theme: Theme): Object {
  return{
  
  }
}

function color(theme: Theme): Object {
  return{
        ...create_token_values(mat_sort.$prefix,mat_sort.get_color_tokens(theme)),
    }
}
function density(theme: Theme): Object {
  return{
  }
}
export function matSortTheme(theme: Theme): Object {
    return {
        '.mat-mdc-snack-bar': {
            ...base(theme),
            ...color(theme),
            ...density(theme)
        }
    };
}
