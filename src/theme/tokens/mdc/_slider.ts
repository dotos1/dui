import * as inspection from '../../mdc/inspection';
import * as elevation from '../../mdc/elevation-theme';

export const $prefix=["mdc", "slider"];
export const $custom_property_prefix= 'slider';

export function get_unthemable_tokens() {
  return {
    'active-track-height': '6px',
    'active-track-shape': '9999px',
    'handle-height': '20px',
    'handle-shape': '50%',
    'handle-width': '20px',
    'inactive-track-height': '4px',
    'inactive-track-shape': '9999px',
    'with-overlap-handle-outline-width': '1px',
    'with-tick-marks-active-container-opacity': 0.6,
    'with-tick-marks-container-shape': '50%',
    'with-tick-marks-container-size': '2px',
    'with-tick-marks-inactive-container-opacity': 0.6,
  };
}

export function get_color_tokens($theme) {
  let $elevation= inspection.get_theme_color($theme, 'foreground',  'elevation');
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $on_surface= ($is_dark ?'#fff': '#000');
  let $theme_color_tokens= private_get_color_palette_color_tokens($theme, 'primary');

  return {
    ...$theme_color_tokens,
      'disabled-active-track-color': $on_surface,
      'disabled-handle-color': $on_surface,
      'disabled-inactive-track-color': $on_surface,
      'label-container-color': $on_surface,
      'label-label-text-color': ($is_dark? '#000': '#fff'),
      'with-overlap-handle-outline-color':' #fff',
      'with-tick-marks-disabled-container-color': $on_surface,
      'handle-elevation': 1,
      'handle-shadow-color': ($elevation != null? $elevation: elevation.$color),
  };
}

export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $color= inspection.get_theme_color($theme, $palette_name);
  let $on_color= inspection.get_theme_color($theme, $palette_name, 'default-contrast');

  return {
    'handle-color': $color,
    'focus-handle-color': $color,
    'hover-handle-color': $color,
    'active-track-color': $color,
    'inactive-track-color': $color,
    'with-tick-marks-inactive-container-color': $color,
    'with-tick-marks-active-container-color': $on_color,
  };
}

export function get_typography_tokens($theme) {
  return {
    'label-label-text-font': inspection.get_theme_typography($theme, 'subtitle-2', 'font-family'),
    'label-label-text-size': inspection.get_theme_typography($theme, 'subtitle-2', 'font-size'),
    'label-label-text-line-height': inspection.get_theme_typography($theme, 'subtitle-2', 'line-height'),
    'label-label-text-tracking': inspection.get_theme_typography($theme, 'subtitle-2', 'letter-spacing'),
    'label-label-text-weight': inspection.get_theme_typography($theme, 'subtitle-2', 'font-weight'),
  };
}

export function get_density_tokens($theme) {
  return {};
}
