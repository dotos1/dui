import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';

export const $prefix=["mdc", "outlined-button"];
export const $custom_property_prefix= 'outlined-button';

export function get_unthemable_tokens() {
  return {
    'keep-touch-target': 'false',
    'outline-width': '1px',
    'container-shape': '4px',
  };
}

export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $outline= inspection.get_theme_color($theme, 'foreground',  'divider');
  return {
    'disabled-outline-color': $outline,
    'disabled-label-text-color': inspection.get_theme_color($theme, 'foreground',  'disabled-button',
      ($is_dark? 0.5: 0.38)),
    'label-text-color': inspection.get_theme_color($theme, 'foreground',  'text', 1),
    'outline-color': $outline,
  };
}
export function private_get_color_palette_color_tokens($theme, $palette_name) {
  return {
    'label-text-color': inspection.get_theme_color($theme, $palette_name, 'default'),
    'outline-color': get_color_tokens($theme)['outline-color']
  };
}
export function get_typography_tokens($theme) {
  return {
    'label-text-font': inspection.get_theme_typography($theme, 'button', 'font-family'),
    'label-text-size': inspection.get_theme_typography($theme, 'button', 'font-size'),
    'label-text-tracking': inspection.get_theme_typography($theme, 'button', 'letter-spacing'),
    'label-text-weight': inspection.get_theme_typography($theme, 'button', 'font-weight'),
    'label-text-transform': 'none',
  };
}
export function get_density_tokens($theme) {
  let $scale= theming.clamp_density(inspection.get_theme_density($theme), -3);
  return {
    'container-height':
     {
          0: '36px',
          '-1': '32px',
          '-2': '28px',
          '-3': '24px',
      }[$scale]
    };
}
