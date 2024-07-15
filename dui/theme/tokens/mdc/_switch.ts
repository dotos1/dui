import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
import * as elevation from '../../mdc/elevation-theme';

export const $prefix=["mdc", "switch"];
export const $custom_property_prefix= 'switch';

export function get_unthemable_tokens() {
  return {
    'disabled-handle-opacity': null,
    'disabled-selected-icon-opacity': 0.38,
    'disabled-track-opacity': 0.12,
    'disabled-unselected-icon-opacity': 0.38,
    'handle-height': '20px',
    'handle-shape': '10px',
    'handle-width': '20px',
    'selected-icon-size': '18px',
    'track-height': '14px',
    'track-shape': '7px',
    'track-width': '36px',
    'unselected-icon-size': '18px',
    'selected-focus-state-layer-opacity': 0.12,
    'selected-hover-state-layer-opacity': 0.04,
    'selected-pressed-state-layer-opacity': 0.1,
    'unselected-focus-state-layer-opacity': 0.12,
    'unselected-hover-state-layer-opacity': 0.04,
    'unselected-pressed-state-layer-opacity': 0.1,
  };
}

export function get_color_tokens($theme) {
  let $elevation= inspection.get_theme_color($theme, 'foreground',  'elevation');
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $on_surface= ($is_dark? '#f5f5f5': '#424242');
  let $hairline= ($is_dark? '#616161': '#e0e0e0');
  let $on_surface_variant= ($is_dark? '#9e9e9e': '#616161');
  let $on_surface_state_content= ($is_dark? '#fafafa': '#212121');
  let $disabled_handle_color= ($is_dark?  '#424242':'#212121');
  let $icon_color= ($is_dark?  '#212121':'#ffffff');

  let $theme_color_tokens= private_get_color_palette_color_tokens($theme, 'primary');

  return {
    ...$theme_color_tokens,
      'disabled-selected-handle-color': $disabled_handle_color,
      'disabled-selected-icon-color': $icon_color,
      'disabled-selected-track-color': $on_surface,
      'disabled-unselected-handle-color': $disabled_handle_color,
      'disabled-unselected-icon-color': $icon_color,
      'disabled-unselected-track-color': $on_surface,
      'handle-surface-color': 'surface',
      'handle-elevation': 1,
      'handle-shadow-color': ($elevation != null? $elevation: elevation.$color),
      'disabled-handle-elevation': 0,
      'selected-icon-color': $icon_color,
      'unselected-focus-handle-color': $on_surface_state_content,
      'unselected-focus-state-layer-color': $on_surface,
      'unselected-focus-track-color': $hairline,
      'unselected-handle-color': $on_surface_variant,
      'unselected-hover-handle-color': $on_surface_state_content,
      'unselected-hover-state-layer-color': $on_surface,
      'unselected-hover-track-color': $hairline,
      'unselected-icon-color': $icon_color,
      'unselected-pressed-handle-color': $on_surface_state_content,
      'unselected-pressed-state-layer-color': $on_surface,
      'unselected-pressed-track-color': $hairline,
      'unselected-track-color': $hairline,
    };
}

export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $palette_color= inspection.get_theme_color($theme, $palette_name, ($is_dark? 400: 600));
  let $state_content= inspection.get_theme_color($theme, $palette_name, ($is_dark? 400: 800));
  let $inverse= inspection.get_theme_color($theme, $palette_name, ($is_dark? 600: 400));

  return {
    'selected-focus-state-layer-color': $palette_color,
    'selected-handle-color': $palette_color,
    'selected-hover-state-layer-color': $palette_color,
    'selected-pressed-state-layer-color': $palette_color,
    'selected-focus-handle-color': $state_content,
    'selected-hover-handle-color': $state_content,
    'selected-pressed-handle-color': $state_content,
    'selected-focus-track-color': $inverse,
    'selected-hover-track-color': $inverse,
    'selected-pressed-track-color': $inverse,
    'selected-track-color': $inverse,
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
