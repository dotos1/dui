import * as inspection from '../../mdc/inspection';
import * as palette from '../../mdc/_palette';
export const $prefix=["mat", "chip"];

export function get_unthemable_tokens() {
  return {
    "disabled-container-opacity": 0.4,
    "trailing-action-opacity": 0.54,
    "trailing-action-focus-opacity": 1,
    "trailing-action-state-layer-color": "transparent",
    "selected-trailing-action-state-layer-color": "transparent",
    "trailing-action-hover-state-layer-opacity": 0,
    "trailing-action-focus-state-layer-opacity": 0,
  };
}

export function get_color_tokens($theme, $palette_name= null) {
  let $foreground= null;
  if($palette_name == null) {
    // let $isdark= inspection.get_theme_type($theme) == "dark";
    // let $palette =palette.get_palette("grey");
    // let $grey50= $palette["50"];
    // let $grey900= $palette["900"];
    // $foreground= $isdark? $grey50: $grey900;
    $foreground= inspection.get_theme_color($theme, 'foreground', 'base');
  }
  else {
    $foreground= inspection.get_theme_color($theme, $palette_name, "default-contrast");
  }
  return {
    "selected-disabled-trailing-icon-color": $foreground,
    "selected-trailing-icon-color": $foreground
  };
}
  
export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  return {};
}
