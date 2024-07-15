import * as inspection from '../../mdc/inspection';
import * as sass from '../../mdc/_sass-utils';

export const $prefix=["mdc", "outlined-text-field"];
export const $custom_property_prefix= 'outlined-text-field';

export function get_unthemable_tokens() {
  return {
    'outline-width': '1px',
    'focus-outline-width': '2px',
    'container-shape': '4px',
  };
}
export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $warn_color= inspection.get_theme_color($theme, 'warn');
  let $color_tokens= private_get_color_palette_color_tokens($theme, 'primary');

  let $on_surface= ($is_dark? '#fff': '#000');
  let $text_color_base= inspection.get_theme_color($theme, 'foreground',  'text', 1);
  let $disabled_text_color_base= inspection.get_theme_color($theme, 'foreground',  'disabled-text', 1);
  let $divider_base= inspection.get_theme_color($theme, 'foreground',  'divider', 1);

  return {
    ...$color_tokens, 
    'label-text-color': sass.safe_color_change($text_color_base,  0.6),
    'hover-label-text-color': sass.safe_color_change($text_color_base, 0.6),
    'disabled-label-text-color':
      sass.safe_color_change($disabled_text_color_base, 0.38),

    'input-text-color': sass.safe_color_change($text_color_base,0.87),
    'disabled-input-text-color':
      sass.safe_color_change($disabled_text_color_base, 0.38),
    'input-text-placeholder-color': sass.safe_color_change($text_color_base,  0.6),

    'error-caret-color': $warn_color,
    'error-focus-label-text-color': $warn_color,
    'error-label-text-color': $warn_color,
    'error-hover-label-text-color': $warn_color,

    // Outline tokens
    'outline-color': sass.safe_color_change($divider_base, 0.38),
    'disabled-outline-color': sass.safe_color_change($divider_base, 0.06),
    'hover-outline-color': sass.safe_color_change($divider_base, 0.87),
    'error-focus-outline-color': $warn_color,
    'error-hover-outline-color': $warn_color,
    'error-outline-color': $warn_color,
  };
}

export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $palette_color= inspection.get_theme_color($theme, $palette_name);

  return {
    'caret-color': $palette_color,
    'focus-outline-color': $palette_color,
    'focus-label-text-color': sass.safe_color_change($palette_color, 0.87),
  };
}

export function get_typography_tokens($theme) {
  return {
    'label-text-font': inspection.get_theme_typography($theme, 'body-1', 'font-family'),
    'label-text-size': inspection.get_theme_typography($theme, 'body-1', 'font-size'),
    'label-text-tracking': inspection.get_theme_typography($theme, 'body-1', 'letter-spacing'),
    'label-text-weight': inspection.get_theme_typography($theme, 'body-1', 'font-weight'),
  };
}

export function get_density_tokens($theme) {
  return {    'label-offset-x':'-8px'};
}
