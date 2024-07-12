import * as inspection from '../../mdc/inspection';

export const $prefix=["mat", "divider"];


export function get_unthemable_tokens() {
  return {
    "width": "1px"
  };
}

export function get_color_tokens($theme) {
  return {
    color: inspection.get_theme_color($theme, "foreground", "divider")
  };
}

export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  return {};
}
