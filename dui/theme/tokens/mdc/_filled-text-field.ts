import {mix} from '../../mat-color';
import * as inspection from '../../mdc/inspection';
import * as sass from '../../mdc/_sass-utils';

export const $prefix=["mdc", "filled-text-field"];
export const $custom_property_prefix= 'filled-text-field';

export function get_unthemable_tokens() {
  return {
    'active-indicator-height': '1px',
    'focus-active-indicator-height': '2px',
    'container-shape': '4px',
  };
}
export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $surface= inspection.get_theme_color($theme, 'background', 'card');
  let $warn_color= inspection.get_theme_color($theme, 'warn');
  let $color_tokens= private_get_color_palette_color_tokens($theme, 'primary');
  let $on_surface= ($is_dark? '#fff': '#000');

  let $text_color_base= inspection.get_theme_color($theme, 'foreground',  'text', 1);
  let $disabled_text_color_base=inspection.get_theme_color($theme, 'foreground',  'disabled-text', 1);
  let $divider_base= inspection.get_theme_color($theme, 'foreground',  'divider', 1);

  return {
    ...$color_tokens, 
    'container-color':sass.safe_color_change($surface, 0),
    'disabled-container-color': _variable_safe_mix($on_surface, $surface, 0.02),

    'label-text-color': sass.safe_color_change($text_color_base, 0.6),
    'hover-label-text-color': sass.safe_color_change($text_color_base, 0.6),
    'disabled-label-text-color':  sass.safe_color_change($disabled_text_color_base, 0.38),

    'input-text-color': sass.safe_color_change($text_color_base, 0.87),
    'disabled-input-text-color': sass.safe_color_change($disabled_text_color_base, 0.38),
    'input-text-placeholder-color': sass.safe_color_change($text_color_base,0.6),

    'error-hover-label-text-color': $warn_color,
    'error-focus-label-text-color': $warn_color,
    'error-label-text-color': $warn_color,
    'error-caret-color': $warn_color,

    'active-indicator-color': sass.safe_color_change($divider_base,0.42),
    'disabled-active-indicator-color': sass.safe_color_change($divider_base,0.06),
    'hover-active-indicator-color': sass.safe_color_change($divider_base,0.87),
    'error-active-indicator-color': $warn_color,
    'error-focus-active-indicator-color': $warn_color,
    'error-hover-active-indicator-color': $warn_color,
  };
}

function _variable_safe_mix($first_color, $second_color, $amount) {
  // if (meta.type-of($first-color) == color and meta.type-of($second-color) == color) {
  //   @return color.mix($first-color, $second-color, $amount);c
  // }
  // let $mixcolor= $first_color;
  let $mixcolor= mix($first_color, $second_color, $amount);
  return $mixcolor;
}

export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $palette= $theme[$palette_name];
  let $palette_color= inspection.get_theme_color($theme, $palette_name);
  return {
    'caret-color': $palette_color,
    'focus-active-indicator-color': $palette_color,
    'focus-label-text-color': sass.safe_color_change($palette_color,0.87),
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
  return {

  };
}
