import * as inspection from '../../mdc/inspection';
import * as elevation from '../../mdc/elevation-theme';
import {invert,rgba} from '../../mat-color';
export const $prefix=["mat", "sidenav"];

export function get_unthemable_tokens() {
  return {
    'container-shape': 0,
    'container-elevation-shadow': elevation.elevation_box_shadow(16),
    'container-width': 'auto',
  };
}

// Tokens that can be configured through Angular Material's color theming API.
export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) ==  'dark';
  let $scrim_opacity = 0.6;
  let $scrim_color= inspection.get_theme_color($theme, 'background', 'card');
  let $fallback_scrim_color= ($is_dark ? rgba('#fff', $scrim_opacity): rgba('#000', $scrim_opacity));

  return {
    'container-divider-color': inspection.get_theme_color($theme, 'foreground', 'divider'),
    'container-background-color': inspection.get_theme_color($theme, 'background', 'dialog'),
    'container-text-color': inspection.get_theme_color($theme, 'foreground', 'text'),
    'content-background-color': inspection.get_theme_color($theme, 'background', 'background'),
    'content-text-color': inspection.get_theme_color($theme, 'foreground', 'text'),
    'scrim-color': invert($scrim_color)
  };
}

export function get_typography_tokens($theme) {
  return {};
}

// Tokens that can be configured through Angular Material's density theming API.
export function get_density_tokens($theme) {
  return {};
}

