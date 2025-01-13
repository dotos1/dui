import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as  mdc_table from '../tokens/mat/_table';


function base(theme: Theme): Object {
    return{ 
        ...create_token_values(mdc_table.$prefix,mdc_table.get_unthemable_tokens()),
    }
  }
  
  function color(theme: Theme): Object {
    return{
          ...create_token_values(mdc_table.$prefix,mdc_table.get_color_tokens(theme)),
      }
  }
  
  function density(theme: Theme): Object {
    return{
      ...create_token_values(mdc_table.$prefix,mdc_table.get_density_tokens(theme)),
    }
  }
  function typography(theme: TypographyConfig) {
    return{
      ...create_token_values(mdc_table.$prefix, mdc_table.get_typography_tokens(theme))
    }
  }
export function matTableTheme(theme: Theme): Object {
    return {
        '.mat-mdc-table': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
