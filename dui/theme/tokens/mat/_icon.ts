import * as inspection from '../../mdc/inspection';

export const $prefix=["mat", "icon"];

export function get_unthemable_tokens() {
  return {};
}

export function get_color_tokens($theme) {
  return {
    'color': inspection.get_theme_color($theme, 'foreground',  'icon')
  };

}

export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  return {};
}

export function private_get_icon_color_tokens($color) {
  return {
    color: $color,
  };
}