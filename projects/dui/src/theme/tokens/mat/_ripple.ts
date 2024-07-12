import * as inspection from '../../mdc/inspection';
import { rgba} from '../../mat-color'
export const $prefix=["mat", "ripple"];

export function get_unthemable_tokens() {
  return {};
}

export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $base= inspection.get_theme_color($theme, 'foreground', 'base');
  let $color= $base;
  return {
    color: rgba($color, 0.1),
  };
}
export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  return {};
}

