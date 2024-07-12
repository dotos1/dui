import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as keys from '../mdc/keys';
import { button_theme } from '../mdc/theme-utils';
import * as  mdc_filled from '../tokens/mdc/_filled-button';
import * as  mat_filled from '../tokens/mat/_filled-button';
import * as  mdc_outlined from '../tokens/mdc/_outlined-button';
import * as  mat_outlined from '../tokens/mat/_outlined-button';
import * as  mdc_protected from '../tokens/mdc/_protected-button';
import * as  mat_protected from '../tokens/mat/_protected-button';
import * as  mdc_text from '../tokens/mdc/_text-button';
import * as  mat_text from '../tokens/mat/_text-button';

function base(theme: Theme): Object {

  return{
        ...keys.declare_custom_properties(button_theme(mdc_text.get_unthemable_tokens()),mdc_text.$custom_property_prefix),
        ...keys.declare_custom_properties(button_theme(mdc_filled.get_unthemable_tokens()),mdc_filled.$custom_property_prefix),
        ...keys.declare_custom_properties(button_theme(mdc_protected.get_unthemable_tokens()),mdc_protected.$custom_property_prefix),
        ...keys.declare_custom_properties(button_theme(mdc_outlined.get_unthemable_tokens()),mdc_outlined.$custom_property_prefix),

        ...create_token_values(mat_text.$prefix,mat_text.get_unthemable_tokens()),
        ...create_token_values(mat_filled.$prefix,mat_filled.get_unthemable_tokens()),
        ...create_token_values(mat_protected.$prefix,mat_protected.get_unthemable_tokens()),
        ...create_token_values(mat_outlined.$prefix,mat_outlined.get_unthemable_tokens()),
  }
}
function _text_button_variant($theme, $palette) {
  let $mdc_tokens= ($palette ?mdc_text.private_get_color_palette_color_tokens($theme, $palette):mdc_text.get_color_tokens($theme));
  let $mat_tokens= ($palette?mat_text.private_get_color_palette_color_tokens($theme, $palette): mat_text.get_color_tokens($theme));

  return{
        ...keys.declare_custom_properties(button_theme($mdc_tokens),mdc_text.$custom_property_prefix),
        ...create_token_values(mat_text.$prefix,$mat_tokens),
  }
}
function _filled_button_variant($theme, $palette) {
  let $mdc_tokens= ($palette ?mdc_filled.private_get_color_palette_color_tokens($theme, $palette):mdc_filled.get_color_tokens($theme));
  let $mat_tokens= ($palette?mat_filled.private_get_color_palette_color_tokens($theme, $palette): mat_filled.get_color_tokens($theme));
  return{
        ...keys.declare_custom_properties(button_theme($mdc_tokens),mdc_filled.$custom_property_prefix),
        ...create_token_values(mat_filled.$prefix,$mat_tokens),
  }
}
function _protected_button_variant($theme, $palette) {
  let $mdc_tokens= ($palette ?mdc_protected.private_get_color_palette_color_tokens($theme, $palette):mdc_protected.get_color_tokens($theme));
  let $mat_tokens= ($palette?mat_protected.private_get_color_palette_color_tokens($theme, $palette): mat_protected.get_color_tokens($theme));
  return{
        ...keys.declare_custom_properties(button_theme($mdc_tokens),mdc_protected.$custom_property_prefix),
        ...create_token_values(mat_protected.$prefix,$mat_tokens),
  }
}
function _outlined_button_variant($theme, $palette) {
  let $mdc_tokens= ($palette ?mdc_outlined.private_get_color_palette_color_tokens($theme, $palette):mdc_outlined.get_color_tokens($theme));
  let $mat_tokens= ($palette?mat_outlined.private_get_color_palette_color_tokens($theme, $palette): mat_outlined.get_color_tokens($theme));
  return{
        ...keys.declare_custom_properties(button_theme($mdc_tokens),mdc_outlined.$custom_property_prefix),
        ...create_token_values(mat_outlined.$prefix,$mat_tokens),
  }
}
function color(theme: Theme): Object {
  return{
    ..._text_button_variant(theme, null),
    ..._filled_button_variant(theme, null),
    ..._protected_button_variant(theme, null),
    ..._outlined_button_variant(theme, null)
  }
}

function density(theme: Theme): Object {
  return{
    ...keys.declare_custom_properties(button_theme(mdc_text.get_density_tokens(theme)),mdc_text.$custom_property_prefix),
    ...keys.declare_custom_properties(button_theme(mdc_filled.get_density_tokens(theme)),mdc_filled.$custom_property_prefix),
    ...keys.declare_custom_properties(button_theme(mdc_protected.get_density_tokens(theme)),mdc_protected.$custom_property_prefix),
    ...keys.declare_custom_properties(button_theme(mdc_outlined.get_density_tokens(theme)),mdc_outlined.$custom_property_prefix),

    ...create_token_values(mat_text.$prefix,mat_text.get_density_tokens(theme)),
    ...create_token_values(mat_filled.$prefix,mat_filled.get_density_tokens(theme)),
    ...create_token_values(mat_protected.$prefix,mat_protected.get_density_tokens(theme)),
    ...create_token_values(mat_outlined.$prefix,mat_outlined.get_density_tokens(theme)),
  }
}
function typography(theme: TypographyConfig): Object {
   
  return{
    ...keys.declare_custom_properties(button_theme(mdc_text.get_typography_tokens(theme)),mdc_text.$custom_property_prefix),
    ...keys.declare_custom_properties(button_theme(mdc_filled.get_typography_tokens(theme)),mdc_filled.$custom_property_prefix),
    ...keys.declare_custom_properties(button_theme(mdc_protected.get_typography_tokens(theme)),mdc_protected.$custom_property_prefix),
    ...keys.declare_custom_properties(button_theme(mdc_outlined.get_typography_tokens(theme)),mdc_outlined.$custom_property_prefix),

    ...create_token_values(mat_text.$prefix,mat_text.get_typography_tokens(theme)),
    ...create_token_values(mat_filled.$prefix,mat_filled.get_typography_tokens(theme)),
    ...create_token_values(mat_protected.$prefix,mat_protected.get_typography_tokens(theme)),
    ...create_token_values(mat_outlined.$prefix,mat_outlined.get_typography_tokens(theme)),
  }
}
export function matButtonTheme(theme: Theme): Object {

  return {
    ".mat-mdc-button": {
      "&.mat-primary": {
        ..._text_button_variant(theme, "primary")
      },
      "&.mat-accent": {
        ..._text_button_variant(theme, "accent")
      },
      "&.mat-warn": {
        ..._text_button_variant(theme, "warn")
      }
    },
    ".mat-mdc-unelevated-button": {
      "&.mat-primary": {
        ..._filled_button_variant(theme, "primary")
      },
      "&.mat-accent": {
        ..._filled_button_variant(theme, "accent")
      },
      "&.mat-warn": {
        ..._filled_button_variant(theme, "warn")
      }
    },
    ".mat-mdc-raised-button": {
      "&.mat-primary": {
        ..._protected_button_variant(theme, "primary")
      },
      "&.mat-accent": {
        ..._protected_button_variant(theme, "accent")
      },
      "&.mat-warn": {
        ..._protected_button_variant(theme, "warn")
      }
    },
    ".mat-mdc-outlined-button": {
      "&.mat-primary": {
        ..._outlined_button_variant(theme, "primary")
      },
      "&.mat-accent": {
        ..._outlined_button_variant(theme, "accent")
      },
      "&.mat-warn": {
        ..._outlined_button_variant(theme, "warn")
      }
    },
    ".mdc-button": {
      ...base(theme),
      ...color(theme),
      ...density(theme),
      ...typography(theme.typography)
    }
  };
}

