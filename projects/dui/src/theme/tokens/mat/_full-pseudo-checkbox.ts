import * as inspection from '../../mdc/inspection';

export const $prefix=["mat", "full-pseudo-checkbox"];

export function get_unthemable_tokens() {
  return {};
}

export function get_color_tokens($theme, $palette_name= 'accent') {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $disabled_color= ($is_dark? '#686868': '#b0b0b0');
  let $checkmark_color= inspection.get_theme_color($theme, 'background', 'background');

  return {
    'selected-icon-color': inspection.get_theme_color($theme, $palette_name),
    'selected-checkmark-color': $checkmark_color,
    'unselected-icon-color': inspection.get_theme_color($theme, 'foreground',  'secondary-text'),
    'disabled-selected-checkmark-color': $checkmark_color,
    'disabled-unselected-icon-color': $disabled_color,
    'disabled-selected-icon-color': $disabled_color,
  };
}

export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  return {};
}


