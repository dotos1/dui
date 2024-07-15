
import * as inspection from '../../mdc/inspection';
export const $prefix=["mat", "bottom-sheet)"];

export function get_unthemable_tokens() {
  return {
    "container-shape": "4px",
  };
}

export function get_color_tokens($theme) {
    return {
        "container-text-color": inspection.get_theme_color($theme, "foreground", "text"),
        "container-background-color": inspection.get_theme_color($theme, "background", "dialog"),
    };
}

export function get_typography_tokens($theme) {
    return {
        "container-text-font": inspection.get_theme_typography($theme, "body-2", "font-family"),
        "container-text-line-height": inspection.get_theme_typography($theme, "body-2", "line-height"),
        "container-text-size": inspection.get_theme_typography($theme, "body-2", "font-size"),
        "container-text-tracking": inspection.get_theme_typography($theme, "body-2", "letter-spacing"),
        "container-text-weight": inspection.get_theme_typography($theme, "body-2", "font-weight"),
    };
}

export function get_density_tokens($theme) {
  return {};
} 