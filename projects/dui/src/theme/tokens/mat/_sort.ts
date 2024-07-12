import * as inspection from '../../mdc/inspection';

export const $prefix=["mat", "sort"];

export function get_unthemable_tokens() {
  return {};
}

export function get_color_tokens($theme) {
  let $table_background= inspection.get_theme_color($theme, 'background', 'card');
  let $text_color= inspection.get_theme_color($theme, 'foreground',  'secondary-text');
  let $arrow_color= null;


  // @if (meta.type-of($table-background) == color and meta.type-of($text-color) == color) {
  //   $text-opacity: opacity($text-color);
  //   $arrow-color: color.mix($table-background, rgba($text-color, 1), (1 - $text-opacity) * 100%);
  // }
  // @else {
    $arrow_color=$text_color;
  // }

  return {
    'arrow-color': $arrow_color,
  };
}

export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  return {};
}
