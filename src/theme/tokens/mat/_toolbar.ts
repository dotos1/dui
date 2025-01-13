
import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
export const $prefix=["mat", "toolbar"];

export function get_unthemable_tokens() {
  return {};
}

// Tokens that can be configured through Angular Material's color theming API.
export function get_color_tokens($theme) {
  return private_get_color_palette_color_tokens(
    inspection.get_theme_color($theme, 'background', 'app-bar'),
   inspection.get_theme_color($theme, 'foreground', 'text'),
  );
}

// Tokens that can be configured through Angular Material's typography theming API.
export function get_typography_tokens($theme) {
  return {
    'title-text-font': inspection.get_theme_typography($theme, 'headline-6', 'font-family'),
    'title-text-line-height': inspection.get_theme_typography($theme, 'headline-6', 'line-height'),
    'title-text-size': inspection.get_theme_typography($theme, 'headline-6', 'font-size'),
    'title-text-tracking': inspection.get_theme_typography($theme, 'headline-6', 'letter-spacing'),
    'title-text-weight': inspection.get_theme_typography($theme, 'headline-6', 'font-weight'),
  };
}

// Tokens that can be configured through Angular Material's density theming API.
export function get_density_tokens($theme) {
  let $density_scale= theming.clamp_density(inspection.get_theme_density($theme), -3);
  let $standard_scale= {
    "0": "64px",
    "-1": "60px",
    "-2": "56px",
    "-3": "52px",
  };

  let $mobile_scale= {
    "0": "56px",
    "-1": "52px",
    "-2": "48px",
    "-3": "44px",
  };

  return {
    "standard-height": $standard_scale[$density_scale],
    "mobile-height": $mobile_scale[$density_scale],
  };
}

export function private_get_color_palette_color_tokens($background_color, $text_color) {
  return {
    'container-background-color': $background_color,
    'container-text-color': $text_color,
  };
}
