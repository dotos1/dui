import * as inspection from '../../mdc/inspection';

export const $prefix=["mdc", "tab-indicator"];
export const $custom_property_prefix= 'tab-indicator';

export function get_unthemable_tokens() {
  return {
    'active-indicator-height': '2px',
    'active-indicator-shape': 0,
  };
}

export function get_color_tokens($theme, $palette_name= 'primary') {
  return {
    'active-indicator-color': inspection.get_theme_color($theme, $palette_name, 'default'),
  };
}

export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  return {};
}