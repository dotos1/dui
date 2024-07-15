
import * as inspection from '../../mdc/inspection';

export const $prefix=["mat", "grid-list"];

export function get_unthemable_tokens() {
  return {};
}

// Tokens that can be configured through Angular Material's color theming API.
export function get_color_tokens($theme) {
  return {};
}

export function get_typography_tokens($theme) {
  return {
    'tile-header-primary-text-size': inspection.get_theme_typography($theme, 'body-2', 'font-size'),
    'tile-header-secondary-text-size': inspection.get_theme_typography($theme, 'caption', 'font-size'),
    'tile-footer-primary-text-size': inspection.get_theme_typography($theme, 'body-2', 'font-size'),
    'tile-footer-secondary-text-size': inspection.get_theme_typography($theme, 'caption', 'font-size'),
  };
}

export function get_density_tokens($theme) {
  return {};
}
