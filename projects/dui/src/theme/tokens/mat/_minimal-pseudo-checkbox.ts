import * as inspection from '../../mdc/inspection';

export const $prefix=["mat", "minimal-pseudo-checkbox"];

export function get_unthemable_tokens() {
  return {};
}

export function get_color_tokens($theme, $palette_name= 'accent') {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';

  return {
    'selected-checkmark-color': inspection.get_theme_color($theme, $palette_name),
    'disabled-selected-checkmark-color': ($is_dark? '#686868': '#b0b0b0'),
  };
}

export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  return {};
}

