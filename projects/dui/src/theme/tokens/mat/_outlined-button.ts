import {rgba} from '../../mat-color';
import * as theming from '../../mdc/theming';
import * as inspection from '../../mdc/inspection';
import * as ripple from '../../mdc/_ripple-theme';

export const $prefix=["mat", "outlined-button"];

export function get_unthemable_tokens() {
  return {
    'horizontal-padding': '15px', 
    'icon-spacing': '8px',
    'icon-offset': '-4px',
  };
}

// Tokens that can be configured through Angular Material's color theming API.
export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $ripple_opacities= ($is_dark? ripple.$light_ink_opacities : ripple.$dark_ink_opacities);

  return {
    'state-layer-color': inspection.get_theme_color($theme, 'foreground', 'base'),
    'disabled-state-layer-color': inspection.get_theme_color($theme, 'foreground', 'base'),
    'ripple-color': inspection.get_theme_color($theme, 'foreground',  'base', 0.1),
    'hover-state-layer-opacity': $ripple_opacities.hover,
    'focus-state-layer-opacity': $ripple_opacities.focus,
    'pressed-state-layer-opacity': $ripple_opacities.press,
  };
}

export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $color= inspection.get_theme_color($theme, $palette_name);
  let $ripple_opacity= 0.1;

  return {
    'state-layer-color': $color,
    'ripple-color':  rgba($color, $ripple_opacity)
  }
}

export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  let $density_scale= theming.clamp_density(inspection.get_theme_density($theme), -3);
  return {
    'touch-target-display': ($density_scale < -1? 'none': 'block'),
  };
}

