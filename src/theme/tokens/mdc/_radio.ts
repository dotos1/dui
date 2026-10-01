import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
import * as palette from '../../mdc/_palette';
export const $prefix=["mdc", "radio"];
export const $custom_property_prefix= 'radio';

export function get_unthemable_tokens() {
  return {
    'disabled-selected-icon-opacity': 0.38,
    'disabled-unselected-icon-opacity': 0.38,
    'state-layer-size': '40px',
  };
}

export function get_color_tokens($theme, $palette_name= 'accent') {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $palette_color= inspection.get_theme_color($theme, $palette_name, 'default');
  let $icon_color= palette.get_palette("grey")[($is_dark? 200: 900)];

  return {
    'disabled-selected-icon-color': inspection.get_theme_color($theme, 'foreground',  'icon', 1),
    'disabled-unselected-icon-color': inspection.get_theme_color($theme, 'foreground',  'icon', 1),
    'unselected-hover-icon-color': $icon_color,
    'unselected-icon-color': inspection.get_theme_color($theme, 'foreground',  'icon', 0.54),
    'unselected-pressed-icon-color': inspection.get_theme_color($theme, 'foreground',  'icon', 0.54),
    'selected-focus-icon-color': $palette_color,
    'selected-hover-icon-color': $palette_color,
    'selected-icon-color': $palette_color,
    'selected-pressed-icon-color': $palette_color,
  };
}

export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  let $scale= theming.clamp_density(inspection.get_theme_density($theme), -3);

  return {
    'state-layer-size': {
      '0': '40px',
      '-1': '36px',
      '-2': '32px',
      '-3': '28px',
    }[$scale]
  };
}


