import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
import * as palette from '../../mdc/_palette';


export const $prefix=["mat", "form-field"];
export const $custom_property_prefix= 'form-field';

export function get_unthemable_tokens() {
  return {};
}

export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $color_tokens= private_get_color_palette_color_tokens($theme, 'primary');
  return {
    ...$color_tokens, 
    'disabled-input-text-placeholder-color':
      inspection.get_theme_color($theme, 'foreground', 'icon', 0.38),
    'state-layer-color': inspection.get_theme_color($theme, 'foreground', 'base', 0.87),
    'error-text-color': inspection.get_theme_color($theme, 'warn'),
    'select-option-text-color': ($is_dark? palette.$dark_primary_text: 'inherit'),
    'select-disabled-option-text-color': ($is_dark? palette.$dark_disabled_text: 'GrayText'),
    'leading-icon-color': 'unset',
    'disabled-leading-icon-color': 'unset',
    'trailing-icon-color': 'unset',
    'disabled-trailing-icon-color': 'unset',
    'error-focus-trailing-icon-color': 'unset',
    'error-hover-trailing-icon-color': 'unset',
    'error-trailing-icon-color': 'unset',
    'enabled-select-arrow-color': inspection.get_theme_color($theme, 'foreground', 'icon', 0.54),
    'disabled-select-arrow-color': inspection.get_theme_color($theme, 'foreground', 'icon', 0.38),
    'hover-state-layer-opacity': ($is_dark? 0.08: 0.04),
    'focus-state-layer-opacity': ($is_dark? 0.24: 0.08),
  };
}

export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $palette_color= inspection.get_theme_color($theme, $palette_name);
  return {
    'focus-select-arrow-color': $palette_color
  };
}

export function get_typography_tokens($theme) {
  return {
    'container-text-font': inspection.get_theme_typography($theme, 'body-1', 'font-family'),
    'container-text-line-height': inspection.get_theme_typography($theme, 'body-1', 'line-height'),
    'container-text-size': inspection.get_theme_typography($theme, 'body-1', 'font-size'),
    'container-text-tracking': inspection.get_theme_typography($theme, 'body-1', 'letter-spacing'),
    'container-text-weight': inspection.get_theme_typography($theme, 'body-1', 'font-weight'),
    'outlined-label-text-populated-size': inspection.get_theme_typography($theme, 'body-1', 'font-size'),
    'subscript-text-font': inspection.get_theme_typography($theme, 'caption', 'font-family'),
    'subscript-text-line-height': inspection.get_theme_typography($theme, 'caption', 'line-height'),
    'subscript-text-size': inspection.get_theme_typography($theme, 'caption', 'font-size'),
    'subscript-text-tracking': inspection.get_theme_typography($theme, 'caption', 'letter-spacing'),
    'subscript-text-weight': inspection.get_theme_typography($theme, 'caption', 'font-weight'),
  };
}

// Tokens that can be configured through Angular Material's density theming API.
export function get_density_tokens($theme) {
  let $density_scale= theming.clamp_density(inspection.get_theme_density($theme), -4);
  let $density_config ={
      "-1": 48,
      "0": 56,
      "-2": 40,
  }
  let $height= $density_config[$density_scale+""] ? $density_config[$density_scale+""] :$density_config['-1'] ;
  let $hide_label= $height < 40;
  let $vertical_deduction= (40 - $height)/2;

  let $filled_with_label_padding_top= 24 - $vertical_deduction;
  let $filled_with_label_padding_bottom= 8 - $vertical_deduction;
  let $vertical_padding= 16 - $vertical_deduction;

  return {
    'container-height': $height+'px',
    'filled-label-display': ($hide_label? 'none': 'block'),
    'container-vertical-padding': $vertical_padding +'px',
    'filled-with-label-container-padding-top':
      ($hide_label? $vertical_padding: $filled_with_label_padding_top)+'px',
    'filled-with-label-container-padding-bottom':
      ($hide_label? $vertical_padding: $filled_with_label_padding_bottom)+'px',
  };
}

