import * as inspection from '../../mdc/inspection';
export const $prefix=["mdc", "form-field"];
export const $custom_property_prefix= 'form-field';

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
    'label-text-font': inspection.get_theme_typography($theme, 'body-2', 'font-family'),
    'label-text-line-height': inspection.get_theme_typography($theme, 'body-2', 'line-height'),
    'label-text-size': inspection.get_theme_typography($theme, 'body-2', 'font-size'),
    'label-text-tracking': inspection.get_theme_typography($theme, 'body-2', 'letter-spacing'),
    'label-text-weight': inspection.get_theme_typography($theme, 'body-2', 'font-weight'),
  };
}
export function get_density_tokens($theme) {
  return {};
}


