
import * as inspection from '../../mdc/inspection';

export const $prefix=["mat", "snack-bar"];

export function get_unthemable_tokens() {
  return {};
}

export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';

  return {
    'button-color': (
        $is_dark? 'rgba(0, 0, 0, 0.87)': inspection.get_theme_color($theme, 'accent', 'text'))
    };
}

// Tokens that can be configured through Angular Material's typography theming API.
export function get_typography_tokens($theme) {
  return {};
}

// Tokens that can be configured through Angular Material's density theming API.
export function get_density_tokens($theme) {
  return {};
}
