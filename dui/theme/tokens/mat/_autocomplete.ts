
import * as inspection from '../../mdc/inspection';
import * as elevation from '../../mdc/elevation-theme';

export const $prefix=["mat", "autocomplete"];

export function get_unthemable_tokens() {
  return {
    "container-shape": "4px",
    "container-elevation-shadow": elevation.elevation_box_shadow(8),
  };
}

export function get_color_tokens($theme) {
  return {
    "background-color": inspection.get_theme_color($theme, "background", "card")
  };
}

export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  return {};
}