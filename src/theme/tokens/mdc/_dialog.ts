import * as inspection from '../../mdc/inspection';

export const $prefix=["mdc", "dialog"];
export const $custom_property_prefix= 'dialog';

export function get_unthemable_tokens() {
  return {
    'container-elevation': 24,
    'container-shadow-color': '#000',
    'container-shape': '4px',
  };
}

export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $text_base= inspection.get_theme_color($theme, 'foreground', 'text', 1);
  return {
    'container-color': inspection.get_theme_color($theme, 'background', 'dialog'),
    'subhead-color': $text_base,
    'supporting-text-color': $text_base,
  };
}

export function get_typography_tokens($theme) {
  return {
    'subhead-font': inspection.get_theme_typography($theme, 'headline-6', 'font-family'),
    'subhead-line-height': inspection.get_theme_typography($theme, 'headline-6', 'line-height'),
    'subhead-size': inspection.get_theme_typography($theme, 'headline-6', 'font-size'),
    'subhead-weight': inspection.get_theme_typography($theme, 'headline-6', 'font-weight'),
    'subhead-tracking': inspection.get_theme_typography($theme, 'headline-6', 'letter-spacing'),
    'supporting-text-font': inspection.get_theme_typography($theme, 'body-1', 'font-family'),
    'supporting-text-line-height': inspection.get_theme_typography($theme, 'body-1', 'line-height'),
    'supporting-text-size': inspection.get_theme_typography($theme, 'body-1', 'font-size'),
    'supporting-text-weight': inspection.get_theme_typography($theme, 'body-1', 'font-weight'),
    'supporting-text-tracking': inspection.get_theme_typography($theme, 'body-1', 'letter-spacing'),
  };
}

export function get_density_tokens($theme) {
  return {};
}
