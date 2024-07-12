import * as inspection from '../../mdc/inspection';

export const $prefix=["mat", "optgroup"];

export function get_unthemable_tokens() {
  return {};
}

export function get_color_tokens($theme) {
  return {
    'label-text-color': inspection.get_theme_color($theme, 'foreground',  'text'),
  };
}
export function get_typography_tokens($theme) {
  return {
    'label-text-font': inspection.get_theme_typography($theme, 'body-1', 'font-family'),
    'label-text-line-height': inspection.get_theme_typography($theme, 'body-1', 'line-height'),
    'label-text-size': inspection.get_theme_typography($theme, 'body-1', 'font-size'),
    'label-text-tracking': inspection.get_theme_typography($theme, 'body-1', 'letter-spacing'),
    'label-text-weight': inspection.get_theme_typography($theme, 'body-1', 'font-weight')
  };
}

export function get_density_tokens($theme) {
  return {};
}