import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
import * as palette from '../../mdc/_palette';

export const $prefix=["mdc", "checkbox"];
export const $custom_property_prefix= 'checkbox';

export function get_unthemable_tokens() {
  return {
    'disabled-selected-checkmark-color': '#fff',
    'selected-focus-state-layer-opacity': 0.16,
    'selected-hover-state-layer-opacity': 0.04,
    'selected-pressed-state-layer-opacity': 0.16,
    'unselected-focus-state-layer-opacity': 0.16,
    'unselected-hover-state-layer-opacity': 0.04,
    'unselected-pressed-state-layer-opacity': 0.16,
  };
}

export function get_color_tokens($theme, $palette_name= "accent") {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $foreground_base= inspection.get_theme_color($theme, 'foreground', 'base');
  let $palette_default= inspection.get_theme_color($theme, $palette_name, 'default');
  let $disabled_color= inspection.get_theme_color($theme, 'foreground', 'base',0.38);
  let $palette_selected= inspection.get_theme_color($theme, $palette_name);
  let $border_color=  inspection.get_theme_color($theme, 'foreground', 'base',0.54);
  let $active_border_color=palette.get_palette("grey")[ ($is_dark? 200: 900)];
  let $selected_checkmark_color= inspection.get_theme_color($theme, $palette_name, 'default-contrast', 1);
  return {
    'disabled-selected-icon-color': $disabled_color,
    'disabled-unselected-icon-color': $disabled_color,
    'selected-checkmark-color': $selected_checkmark_color,
    'selected-focus-icon-color': $palette_selected,
    'selected-hover-icon-color': $palette_selected,
    'selected-icon-color': $palette_selected,
    'selected-pressed-icon-color': $palette_selected,
    'unselected-focus-icon-color': $active_border_color,
    'unselected-hover-icon-color': $active_border_color,
    'unselected-icon-color': $border_color,
    'unselected-pressed-icon-color': $border_color,
    'selected-focus-state-layer-color': $palette_default,
    'selected-hover-state-layer-color': $palette_default,
    'selected-pressed-state-layer-color': $palette_default,
    'unselected-focus-state-layer-color': $foreground_base,
    'unselected-hover-state-layer-color': $foreground_base,
   ' unselected-pressed-state-layer-color': $foreground_base,
  };
}

export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  let $scale= theming.clamp_density(inspection.get_theme_density($theme), -3);

  return {
    "state-layer-size":{
      '0': '40px',
      '-1': '36px',
      '-2': '32px',
      '-3': '28px',
    }[$scale]
  };
}

