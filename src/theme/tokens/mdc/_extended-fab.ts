import * as inspection from '../../mdc/inspection';

export const $prefix=["mdc", "extended-fab"];
export const $custom_property_prefix= 'extended-fab';

export function get_unthemable_tokens() {
  return {
    'container-height': '48px',
    'container-shape': '24px',
  };
}
export function get_color_tokens($theme) {
  return {
    'container-elevation': 6,
    'focus-container-elevation': 8,
    'hover-container-elevation': 8,
    'pressed-container-elevation': 12,
    'container-shadow-color': '#000',
  };
}
export function get_typography_tokens($theme) {
  return {
    'label-text-font': inspection.get_theme_typography($theme, 'button', 'font-family'),
    'label-text-size': inspection.get_theme_typography($theme, 'button', 'font-size'),
    'label-text-tracking': inspection.get_theme_typography($theme, 'button', 'letter-spacing'),
    'label-text-weight': inspection.get_theme_typography($theme, 'button', 'font-weight')
  };
}
export function get_density_tokens($theme) {
  return {};
}
