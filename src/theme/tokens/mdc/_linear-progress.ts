import * as inspection from '../../mdc/inspection';

export const $prefix=["mdc", "linear-progress"];
export const $custom_property_prefix= 'linear-progress';

export function get_unthemable_tokens() {
  let $height= '4px';

  return {
    'active-indicator-height': $height,
    'track-height': $height,
    'track-shape': 0,
  };
}

export function get_color_tokens($theme, $palette_name= 'primary') {
  let $palette_color= inspection.get_theme_color($theme, $palette_name);
  return {
    'active-indicator-color': $palette_color,
    // 'track-color': $palette_color
    // 'track-color': if(
    //     meta.type-of($palette-color) == color,
    //     color.adjust($palette-color, $alpha: -0.75),
    //     $palette-color
    // )
  };
}
export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  return {};
}
