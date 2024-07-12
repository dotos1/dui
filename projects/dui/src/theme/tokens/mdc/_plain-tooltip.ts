import * as inspection from '../../mdc/inspection';

export const $prefix=["mdc", "plain-tooltip"];
export const $custom_property_prefix= 'plain-tooltip';

export function get_unthemable_tokens() {
  return {
    'container-shape': '4px',
    'supporting-text-line-height': '16px',
    'supporting-text-type': null,
  };
}

export function get_color_tokens($theme) {
  return {
    'container-color': inspection.get_theme_color($theme, 'background', 'tooltip'),
    'supporting-text-color': '#fff',
  };
}

export function get_typography_tokens($theme) {
  return {
    'supporting-text-font': inspection.get_theme_typography($theme, 'caption', 'font-family'),
    'supporting-text-size': inspection.get_theme_typography($theme, 'caption', 'font-size'),
    'supporting-text-weight': inspection.get_theme_typography($theme, 'caption', 'font-weight'),
    'supporting-text-tracking': inspection.get_theme_typography($theme, 'caption', 'letter-spacing'),
  };
}

export function get_density_tokens($theme) {
  return {};
}

