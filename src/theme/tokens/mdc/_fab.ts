import * as inspection from '../../mdc/inspection';
export const $prefix=["mdc", "fab"];
export const $custom_property_prefix= 'fab';

export function get_unthemable_tokens() {
  return {
    'container-shape': '50%',
    'icon-size': '24px',
  };
}
export function private_get_color_palette_color_tokens($theme, $palette_name) {
  return {
    'container-color': inspection.get_theme_color($theme, $palette_name, 'default'),
  };
}
export function get_color_tokens($theme) {
  return {
    'container-color': inspection.get_theme_color($theme, 'background', 'card'),
    'container-elevation': 6,
    'focus-container-elevation': 8,
    'hover-container-elevation': 8,
    'pressed-container-elevation': 12,
    'container-shadow-color': '#000',
  };
}
export function get_typography_tokens($theme) {
  return {};
}
export function get_density_tokens($theme) {
  return {};
}