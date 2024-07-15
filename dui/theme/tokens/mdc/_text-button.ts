import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';

export const $prefix=["mdc", "text-button"];
export const $custom_property_prefix= 'text-button';

export function get_unthemable_tokens() {
  return {
    'container-shape': '4px',
  };
}

export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';

  return {
    'label-text-color': inspection.get_theme_color($theme, 'foreground',  'text', 1),
    'disabled-label-text-color': inspection.get_theme_color($theme, 'foreground',  'disabled-button',
      ($is_dark? 0.5: 0.38)),
  };
}
export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $palette= $theme[$palette_name];

  return {
    'label-text-color': inspection.get_theme_color($theme, $palette_name)
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
    'container-height': {
      '0': '36px',
      '-1': '32px',
      '-2': '28px',
      '-3': '24px',
    }[$scale]
  };
}

