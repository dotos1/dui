import * as ripple from '../../mdc/_ripple-theme';
import * as theming from '../../mdc/theming';
import * as inspection from '../../mdc/inspection';

export const $prefix=["mat", "fab-small"];

export function get_unthemable_tokens() {
  return {};
}

export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $ripple_opacities= ($is_dark?
    ripple.$light_ink_opacities:
    ripple.$dark_ink_opacities
  );

  return {
    'foreground-color': inspection.get_theme_color($theme, 'foreground', 'base'),
    'state-layer-color': inspection.get_theme_color($theme, 'foreground', 'base'),
    'disabled-state-layer-color': inspection.get_theme_color($theme, 'foreground', 'base'),
    'ripple-color': inspection.get_theme_color($theme, 'foreground',  'base', 0.1),
    'hover-state-layer-opacity': $ripple_opacities.hover,
    'focus-state-layer-opacity': $ripple_opacities.focus,
    'pressed-state-layer-opacity': $ripple_opacities.press,
    'disabled-state-container-color': inspection.get_theme_color($theme, 'background', 'disabled-button',
      0.12),
    'disabled-state-foreground-color': inspection.get_theme_color($theme, 'foreground',  'disabled-button',
      ($is_dark? 0.5: 0.38)),
  };
}

export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $foreground_color= null;
  let $state_layer_color= null;
  let $ripple_color= null;
  let $contrast_color= inspection.get_theme_color($theme, $palette_name, 'default-contrast');

  // if (meta.type-of($contrast_color) != 'color') {
  //   let $is_dark= inspection.get_theme_type($theme) == 'dark';
  //   let $container_color= inspection.get_theme_color($theme, $palette_name);
  //   let $contrast_tone= mdc-helpers.variable-safe-contrast-tone($container_color, $is_dark);
  //   let  $color= ($contrast_tone == 'dark'? '#000': '#fff');
  //   $foreground_color= $color;
  //   $state_layer_color= $color;
  //   $ripple_color= rgba($color, 0.1);
  // }
  // else {
    $foreground_color= inspection.get_theme_color($theme, $palette_name, 'default-contrast', 1);
    $state_layer_color=inspection.get_theme_color($theme, $palette_name, 'default-contrast', 1);
    $ripple_color= inspection.get_theme_color($theme, $palette_name, 'default-contrast', 0.1);
  // }
  return {
    'foreground-color': $foreground_color,
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

