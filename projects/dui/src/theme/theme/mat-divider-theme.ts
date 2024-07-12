import { Theme } from '../interfaces/theme';

import { create_token_values } from '../mdc/token-utils';
import * as  mat_divider from '../tokens/mat/_divider';

function base(theme: Theme): Object {
    return{
          ...create_token_values(mat_divider.$prefix,mat_divider.get_unthemable_tokens()),
    }
  }
  
  function color(theme: Theme): Object {
    return{
          ...create_token_values(mat_divider.$prefix,mat_divider.get_color_tokens(theme)),
    }
  }
  
  function density(theme: Theme): Object {
    return{
    }
  }
export function matDividerTheme(theme: Theme): Object {
    return {
        '.mat-divider': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
        },
    };
}
