import {Theme} from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as keys from '../mdc/keys';
import * as  mdc_chip from '../tokens/mdc/_chip';
import * as  mat_chip from '../tokens/mat/_chip';


function base(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_chip.get_unthemable_tokens(),mdc_chip.$custom_property_prefix),
        ...create_token_values(mat_chip.$prefix,mat_chip.get_unthemable_tokens()),
  }
}

function color(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_chip.get_color_tokens(theme),mdc_chip.$custom_property_prefix),
        ...create_token_values(mat_chip.$prefix,mat_chip.get_color_tokens(theme)),
  }
}

function density(theme: Theme): Object {
  return{

        ...keys.declare_custom_properties(mdc_chip.get_density_tokens(theme),mdc_chip.$custom_property_prefix),
        ...create_token_values(mat_chip.$prefix,mat_chip.get_density_tokens(theme))

  }
}
function typography(theme: TypographyConfig): Object {
  return{
          ...keys.declare_custom_properties(mdc_chip.get_typography_tokens(theme),mdc_chip.$custom_property_prefix),
          ...create_token_values(mat_chip.$prefix, mat_chip.get_typography_tokens(theme))
  }
}
export function matChipsTheme(theme: Theme): Object {
    return {
      ".mat-mdc-standard-chip &.mat-mdc-chip-selected, &.mat-mdc-chip-highlighted": {
          "&.mat-primary": {
            ...keys.declare_custom_properties(mdc_chip.get_color_tokens(theme,'primary'),mdc_chip.$custom_property_prefix),
            ...create_token_values(mat_chip.$prefix,mat_chip.get_color_tokens(theme,'primary')),
          },
          "&.mat-accent": {
            ...keys.declare_custom_properties(mdc_chip.get_color_tokens(theme,'accent'),mdc_chip.$custom_property_prefix),
            ...create_token_values(mat_chip.$prefix,mat_chip.get_color_tokens(theme,'accent')),
          },
          "&.mat-warn": {
            ...keys.declare_custom_properties(mdc_chip.get_color_tokens(theme,'warn'),mdc_chip.$custom_property_prefix),
            ...create_token_values(mat_chip.$prefix,mat_chip.get_color_tokens(theme,'warn')),
          }
        },
        '.mat-mdc-standard-chip': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
