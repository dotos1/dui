import * as theming from '../../mdc/theming';
import * as ripple from '../../mdc/_ripple-theme';
import * as inspection from '../../mdc/inspection';

export const $prefix=["mat", "protected-button"];

export function get_unthemable_tokens() {
  return {
    'horizontal-padding': '16px',
    'icon-spacing': '8px',
    'icon-offset': '-4px',
  };
}

export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $ripple_opacities= ($is_dark? ripple.$light_ink_opacities: ripple.$dark_ink_opacities);

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
  let $state_layer_color= null;
  let $ripple_color= null;
  let $contrast_color= inspection.get_theme_color($theme, $palette_name, 'default-contrast');

  // @if ( meta.type-of($contrast-color) != 'color') {
  //   $is_dark: inspection.get_theme_type($theme) == 'dark';
  //   $container-color: inspection.get_theme_color($theme, $palette_name);
  //   $contrast-tone: mdc-helpers.variable-safe-contrast-tone($container-color, $is_dark);
  //   $color: if($contrast-tone == 'dark', #000, #fff);
  //   $state-layer-color: $color;
  //   $ripple-color: rgba($color, 0.1);
  // }
  // @else {
    $state_layer_color= inspection.get_theme_color($theme, $palette_name, 'default-contrast', 1);
    $ripple_color= inspection.get_theme_color($theme, $palette_name,'default-contrast', 0.1);
  // }

  return {
    'state-layer-color': $state_layer_color,
    'ripple-color': $ripple_color,
  };
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
