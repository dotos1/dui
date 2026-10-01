import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
export const $prefix=["mat", "expansion"];

export function get_unthemable_tokens() {
  return {
    "container-shape": "4px",
    "legacy-header-indicator-display": "inline-block",
    "header-indicator-display": "none",
  };
}

export function get_color_tokens($theme) {
  return {
    "container-background-color": inspection.get_theme_color($theme, "background", "card"),
    "container-text-color": inspection.get_theme_color($theme, "foreground", "text"),
    "actions-divider-color": inspection.get_theme_color($theme, "foreground", "divider"),
    "header-hover-state-layer-color": inspection.get_theme_color($theme, "background", "hover"),
    "header-focus-state-layer-color": inspection.get_theme_color($theme, "background", "hover"),
    "header-disabled-state-text-color": inspection.get_theme_color(
        $theme, "foreground", "disabled-button"),
    "header-text-color": inspection.get_theme_color($theme, "foreground", "text"),
    "header-description-color": inspection.get_theme_color($theme, "foreground", "secondary-text"),
    "header-indicator-color": inspection.get_theme_color($theme, "foreground", "secondary-text"),
    };
}

export function get_typography_tokens($theme) {
  return {
    "header-text-font": inspection.get_theme_typography($theme, "subtitle-2", "font-family"),
    "header-text-size": inspection.get_theme_typography($theme, "subtitle-2", "font-size"),
    "header-text-weight": inspection.get_theme_typography($theme, "subtitle-2", "font-weight"),
    "header-text-line-height": "inherit",
    "header-text-tracking": "inherit",
    "container-text-font": inspection.get_theme_typography($theme, "body-2", "font-family"),
    "container-text-line-height": inspection.get_theme_typography($theme, "body-2", "line-height"),
    "container-text-size": inspection.get_theme_typography($theme, "body-2", "font-size"),
    "container-text-tracking": inspection.get_theme_typography($theme, "body-2", "letter-spacing"),
    "container-text-weight": inspection.get_theme_typography($theme, "body-2", "font-weight"),
  };
}

export function get_density_tokens($theme) {
  let $scale= theming.clamp_density(inspection.get_theme_density($theme), -3);
  let $collapsed_scale= {
    "0": "48px",
    "-1": "44px",
    "-2": "40px",
    "-3": "36px",
  };
  let $expanded_scale= {
    "0": "64px",
    "-1": "60px",
    "-2": "56px",
    "-3": "48px",
  };
  return {
    "header-collapsed-state-height": $collapsed_scale[$scale],
    "header-expanded-state-height": $expanded_scale[$scale]
  };
}

