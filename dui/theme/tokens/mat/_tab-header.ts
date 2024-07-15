import * as inspection from '../../mdc/inspection';

export const $prefix=["mat", "tab-header"];

export function get_unthemable_tokens() {
  return {
    'divider-color': 'transparent',
    'divider-height': 0,
  };
}

export function get_color_tokens($theme, $palette_name= 'primary') {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $inactive_label_text_color= inspection.get_theme_color($theme, 'foreground',  'text', 0.6);
  let $active_label_text_color= inspection.get_theme_color($theme, $palette_name, 'default');
  let $ripple_color= inspection.get_theme_color($theme, $palette_name, 'default');

  return {
    'disabled-ripple-color': inspection.get_theme_color($theme, 'foreground',  'disabled'),
    'pagination-icon-color': inspection.get_theme_color($theme, 'foreground',  'icon', 1),

    'inactive-label-text-color': $inactive_label_text_color,
    'active-label-text-color': $active_label_text_color,
 
    'active-ripple-color': $ripple_color,
    'inactive-ripple-color': $ripple_color,
    'inactive-focus-label-text-color': $inactive_label_text_color,
    'inactive-hover-label-text-color': $inactive_label_text_color,
    'active-focus-label-text-color': $active_label_text_color,
    'active-hover-label-text-color': $active_label_text_color,
    'active-focus-indicator-color': $active_label_text_color,
    'active-hover-indicator-color': $active_label_text_color,
  };
}

export function get_typography_tokens($theme) {
  return {
    'label-text-font': inspection.get_theme_typography($theme, 'button', 'font-family'),
    'label-text-size': inspection.get_theme_typography($theme, 'button', 'font-size'),
    'label-text-tracking': inspection.get_theme_typography($theme, 'button', 'letter-spacing'),
    'label-text-line-height': inspection.get_theme_typography($theme, 'button', 'line-height'),
    'label-text-weight': inspection.get_theme_typography($theme, 'button', 'font-weight'),
  };
}
export function get_density_tokens($theme) {
  return {};
}
