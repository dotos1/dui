import * as inspection from '../../mdc/inspection';
import { matElevationColor } from '../../utils/elevation';
export const $prefix=["mdc", "elevated-card"];
export const $custom_property_prefix= 'elevated-card';


export function get_unthemable_tokens() {
    return {
      "container-shape": "4px",
    };
}
export function get_color_tokens($theme) {
  let elevation= inspection.get_theme_color($theme, "foreground", "elevation");
  return {
    "container-color": inspection.get_theme_color($theme, "background", "card"),
    "container-elevation": 1,
    "container-shadow-color": elevation != null ? elevation :matElevationColor
  };
}
export function get_typography_tokens($theme) {
    return {};
}
export function get_density_tokens($theme) {
    return {};
}
