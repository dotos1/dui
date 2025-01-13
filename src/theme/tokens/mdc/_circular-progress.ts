import * as inspection from '../../mdc/inspection';
export const $prefix=["mdc", "circular-progress"];
export const $custom_property_prefix= 'circular-progress';

export function get_unthemable_tokens() {
  return {
    'active-indicator-width': '4px',
    'size': '48px',
  };
}

export function get_color_tokens($theme) {
  return {
    'active-indicator-color': inspection.get_theme_color($theme, 'primary')
  };
}

export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  return {};
}
