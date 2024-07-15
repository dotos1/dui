import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';

export const $prefix=["mat", "radio"];

export function get_unthemable_tokens() {
  return {};
}

export function get_color_tokens($theme, $palette_name= "accent") {
  return {
    "ripple-color": inspection.get_theme_color($theme, "foreground", "base"),
    "checked-ripple-color": inspection.get_theme_color($theme, $palette_name, "default"),
    "disabled-label-color": inspection.get_theme_color($theme, "foreground", "disabled-text"),
    "label-text-color": inspection.get_theme_color($theme, "foreground", "text")
  };
}

export function get_typography_tokens($theme) {
  return {
    "label-text-font": inspection.get_theme_typography($theme, "body-2", "font-family"),
    "label-text-line-height": inspection.get_theme_typography($theme, "body-2", "line-height"),
    "label-text-size": inspection.get_theme_typography($theme, "body-2", "font-size"),
    "label-text-tracking": inspection.get_theme_typography($theme, "body-2", "letter-spacing"),
    "label-text-weight": inspection.get_theme_typography($theme, "body-2", "font-weight")
   };
}

export function get_density_tokens($theme) {
  let $density_scale= theming.clamp_density(inspection.get_theme_density($theme), -3);

  return {
    "touch-target-display": ($density_scale < -1? "none": "block"),
  };
}

