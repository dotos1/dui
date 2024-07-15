import * as inspection from '../../mdc/inspection';

export const $prefix=["mat", "tab-header-with-background"];

export function get_unthemable_tokens() {
  return {};
}

export function get_color_tokens($theme, $palette_name= 'primary') {
  return {
    'background-color': inspection.get_theme_color($theme, $palette_name, 'default'),
    'foreground-color': inspection.get_theme_color($theme, $palette_name, 'default-contrast'),
  };
}
export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  return {};
}
