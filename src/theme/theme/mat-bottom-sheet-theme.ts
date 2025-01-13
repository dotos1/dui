import { Theme } from '../interfaces/theme';
import { create_token_values } from '../mdc/token-utils';
import * as  sheet from '../tokens/mat/_bottom-sheet';
import { TypographyConfig } from '../interfaces';

function base(theme: Theme): Object {
  return{
      ...create_token_values(sheet.$prefix,sheet.get_unthemable_tokens())
  }
}

function color(theme: Theme): Object {
  return{
      ...create_token_values(sheet.$prefix,sheet.get_color_tokens(theme))
  }
}
function density(theme: Theme): Object {
  return{
      ...create_token_values(sheet.$prefix, sheet.get_density_tokens(theme))
  }
}
function typography(theme: TypographyConfig): Object {
  return{
    ...create_token_values(sheet.$prefix,sheet.get_typography_tokens(theme)),
  }
}
export function matBottomSheetTheme(theme: Theme): Object {
    return {
        '.mat-bottom-sheet': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
