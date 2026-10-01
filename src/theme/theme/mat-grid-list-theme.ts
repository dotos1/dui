import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces/typography-config';
import * as  mat_grid from '../tokens/mat/_grid-list';
import { create_token_values } from '../mdc/token-utils';

function typography(theme: TypographyConfig): Object {
    return{
      ...create_token_values(mat_grid.$prefix,mat_grid.get_typography_tokens(theme)),
    }
  }
export function matGridListTheme(theme: Theme): Object {
    return {
        '.mat-grid-list': {
            ...typography(theme.typography)
        }
}
}
