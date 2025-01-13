
import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';

export const $prefix=["mat", "option"];

export function get_unthemable_tokens() {
  return {};
}

export function get_color_tokens($theme, $palette_name= 'primary') {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $active_state_layer_color= inspection.get_theme_color($theme, 'foreground', 'base',($is_dark? 0.08: 0.04));

  return {
    'selected-state-label-text-color': inspection.get_theme_color($theme, $palette_name),
    'label-text-color': inspection.get_theme_color($theme, 'foreground', 'text'),
    'hover-state-layer-color': $active_state_layer_color,
    'focus-state-layer-color': $active_state_layer_color,
    'selected-state-layer-color': $active_state_layer_color,
  };
}

export function get_typography_tokens($theme) {
  // if ($theme == null) {
  //   $theme= mdc-helpers.private-fallback-typography-from-mdc();
  // }

  return {
    'label-text-font': inspection.get_theme_typography($theme, 'body-1', 'font-family'),
    'label-text-line-height': inspection.get_theme_typography($theme, 'body-1', 'line-height'),
    'label-text-size': inspection.get_theme_typography($theme, 'body-1', 'font-size'),
    'label-text-tracking': inspection.get_theme_typography($theme, 'body-1', 'letter-spacing'),
    'label-text-weight': inspection.get_theme_typography($theme, 'body-1', 'font-weight')
  };
}

export function get_density_tokens($theme) {
  let $scale= theming.clamp_density(inspection.get_theme_density($theme), -5);
  return {
    'option-height': {
      '0': '48px',
      '-1': '44px',
      '-2': '40px',
      '-3': '36px',
      '-4': '32px',
      '-5': '28px',
    }[$scale]
  };
}
