import * as inspection from '../../mdc/inspection';
export const $prefix=["mdc", "snackbar"];
export const $custom_property_prefix= 'snackbar';


export function get_unthemable_tokens() {
  return {
    'container-shape': '4px',
  };
}

export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $surface= inspection.get_theme_color($theme, 'background', 'card');

  return {
    'container-color':  $surface,
    'supporting-text-color': $surface
  };
}

export function get_typography_tokens($theme) {
  return {
    'supporting-text-font': inspection.get_theme_typography($theme, 'body-2', 'font-family'),
    'supporting-text-line-height': inspection.get_theme_typography($theme, 'body-2', 'line-height'),
    'supporting-text-size': inspection.get_theme_typography($theme, 'body-2', 'font-size'),
    'supporting-text-weight': inspection.get_theme_typography($theme, 'body-2', 'font-weight'),
  };
}

export function get_density_tokens($theme) {
  return {};
}