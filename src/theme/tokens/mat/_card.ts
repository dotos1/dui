import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';

export const $prefix=["mat", "card"];

export function get_color_tokens($theme) {
    return {
      "subtitle-text-color": inspection.get_theme_color($theme, "foreground", "secondary-text"),
    };
}
export function get_unthemable_tokens() {
    return {};
}
export function get_typography_tokens($theme) {
    return {
      "title-text-font": inspection.get_theme_typography($theme, "headline-6", "font-family"),
      "title-text-line-height": inspection.get_theme_typography($theme, "headline-6", "line-height"),
      "title-text-size": inspection.get_theme_typography($theme, "headline-6", "font-size"),
      "title-text-tracking": inspection.get_theme_typography($theme, "headline-6", "letter-spacing"),
      "title-text-weight": inspection.get_theme_typography($theme, "headline-6", "font-weight"),
      "subtitle-text-font": inspection.get_theme_typography($theme, "subtitle-2", "font-family"),
      "subtitle-text-line-height": inspection.get_theme_typography($theme, "subtitle-2", "line-height"),
      "subtitle-text-size": inspection.get_theme_typography($theme, "subtitle-2", "font-size"),
      "subtitle-text-tracking": inspection.get_theme_typography($theme, "subtitle-2", "letter-spacing"),
      "subtitle-text-weight": inspection.get_theme_typography($theme, "subtitle-2", "font-weight"),
    };
}
export function get_density_tokens($theme) {
  let $scale= theming.clamp_density(inspection.get_theme_density($theme), -5);
  return {
    'padding-offset': {
      '0': '8px',
      '-1': '7px',
      '-2': '6px',
      '-3': '5px',
    }[$scale]
  };
} 