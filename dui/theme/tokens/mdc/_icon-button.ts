import * as theming from '../../mdc/theming';
import * as inspection from '../../mdc/inspection';

export const $prefix=["mdc", "icon-button"];
export const $custom_property_prefix= 'icon-button';

export function get_unthemable_tokens() {
  return {
    'icon-size': '24px',
  };
}
export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  return {
    'icon-color': 'inherit',
    'disabled-icon-color': ($is_dark? "rgba('#fff', 0.5)":"rgba('#000', 0.38)"),
  };
}
export function private_get_color_palette_color_tokens($theme, $palette_name) {
  return {
    'icon-color': inspection.get_theme_color($theme, $palette_name)
  };
}
export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  let $scale= theming.clamp_density(inspection.get_theme_density($theme), -5);
  return {
    'state-layer-size': {
      '0': '48px',
      '-1': '44px',
      '-2': '40px',
      '-3': '36px',
      '-4': '32px',
      '-5': '28px',
    }[$scale]
  };
}