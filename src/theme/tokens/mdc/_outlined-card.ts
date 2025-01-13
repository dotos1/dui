import * as inspection from '../../mdc/inspection';
import { matElevationColor } from '../../utils/elevation';

export const $prefix=["mdc", "outlined-card"];
export const $custom_property_prefix= 'outlined-card';

export function get_unthemable_tokens() {
    return {
      "container-shape": "4px",
      "outline-width": "1px",
    };
}
export function get_color_tokens($theme) {
    let elevation= inspection.get_theme_color($theme, "foreground", "elevation");
    return {
        "container-color": inspection.get_theme_color($theme, "background", "card"),
        "outline-color": `rgba(${inspection.get_theme_color($theme, "foreground", "base")}, 0.12)`,
        "container-elevation": 0,
        "container-shadow-color": elevation != null ? elevation :matElevationColor
    };
}
export function get_typography_tokens($theme) {
    return {};
}
export function get_density_tokens($theme) {
    return {};
}