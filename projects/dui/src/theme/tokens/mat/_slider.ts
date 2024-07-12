import * as inspection from '../../mdc/inspection';

export const $prefix=["mat", "slider"];

export function get_unthemable_tokens() {
  return {
    "value-indicator-width": "auto",
    "value-indicator-height": "32px",
    "value-indicator-caret-display": "block",
    "value-indicator-border-radius": "4px",
    "value-indicator-padding": "0 12px",
    "value-indicator-text-transform": "none",
    "value-indicator-container-transform": "translateX(-50%)"
  };
}

export function get_color_tokens($theme) {
  let $theme_color_tokens= private_get_color_palette_color_tokens($theme, "primary");
  let $is_dark= inspection.get_theme_type($theme) == "dark";
  return {
    ...$theme_color_tokens,
      "value-indicator-opacity": $is_dark?0.9: 0.6
  };
}

export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $ripple_color= inspection.get_theme_color($theme, $palette_name);
  let $hover_ripple_color= ($ripple_color == null? null: `rgba(${$ripple_color}, 0.05)`);
  let $focus_ripple_color= ($ripple_color == null? null: `rgba(${$ripple_color}, 0.2)`);
  return {
    "ripple-color": $ripple_color,
    "hover-state-layer-color": $hover_ripple_color,
    "focus-state-layer-color": $focus_ripple_color
  };
}

export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  return {};
}
