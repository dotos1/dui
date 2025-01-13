import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
export const $prefix=["mat", "menu"];

export function get_unthemable_tokens() {
  return {
    'container-shape': '4px',
    'divider-bottom-spacing': "0px",
    'divider-top-spacing':  "0px",
    'item-spacing': '16px',
    'item-icon-size': '24px',
    'item-leading-spacing': '16px',
    'item-trailing-spacing': '16px',
    'item-with-icon-leading-spacing': '16px',
    'item-with-icon-trailing-spacing': '16px',
  };
}

export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $active_state_layer_color= inspection.get_theme_color($theme, 'foreground',  'base',($is_dark? 0.08: 0.04));
  let $text_color= inspection.get_theme_color($theme, 'foreground',  'text');

  return {
    'item-label-text-color': $text_color,
    'item-icon-color': $text_color,
    'item-hover-state-layer-color': $active_state_layer_color,
    'item-focus-state-layer-color': $active_state_layer_color,
    'container-color': inspection.get_theme_color($theme, 'background', 'card'),
    'divider-color': inspection.get_theme_color($theme, 'foreground',  'divider'),
  };
}

export function get_typography_tokens($theme) {
  return {
    'item-label-text-font': inspection.get_theme_typography($theme, 'body-2', 'font-family'),
    'item-label-text-size': inspection.get_theme_typography($theme, 'body-2', 'font-size'),
    'item-label-text-tracking': inspection.get_theme_typography($theme, 'body-2', 'letter-spacing'),
    'item-label-text-line-height': inspection.get_theme_typography($theme, 'body-2', 'line-height'),
    'item-label-text-weight': inspection.get_theme_typography($theme, 'body-2', 'font-weight'),
  };
}

export function get_density_tokens($theme) {
  let $scale= theming.clamp_density(inspection.get_theme_density($theme), -5);
  return {
    'menu-height': {
      '0': '44px',
      '-1': '40px',
      '-2': '36px',
      '-3': '32px',
      '-4': '28px',
      '-5': '24px',
    }[$scale]
  };
}
 