
import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';

export const $prefix=["mat", "tree"];

export function get_unthemable_tokens() {
  return {};
}

export function get_color_tokens($theme) {
  // let $foreground_base= inspection.get_theme_color($theme, "foreground", "base");
  return {
    'container-background-color': inspection.get_theme_color($theme, "background", "card"),
    'node-text-color': inspection.get_theme_color($theme, "foreground", "text"),
  };
}

export function get_typography_tokens($theme) {
  return {
    'node-text-font': inspection.get_theme_typography($theme, 'body-2', 'font-family'),
    'node-text-size': inspection.get_theme_typography($theme, 'body-2', 'font-size'),
    'node-text-weight': inspection.get_theme_typography($theme, 'body-2', 'font-weight'),
  };
}

export function get_density_tokens($theme) {
  let $density_scale= theming.clamp_density(inspection.get_theme_density($theme), -4);
  let $min_height_scale= {
    "0": "48px",
    "-1": "44px",
    "-2": "40px",
    "-3": "36px",
    "-4": "28px",
  };
  return{
    "node-min-height": $min_height_scale[$density_scale]
  };
}