import * as inspection from '../../mdc/inspection';

export const $prefix=["mat", "legacy-button-toggle"];

export function get_unthemable_tokens() {
  return {
    'height': '36px',
    'shape': '2px',
    'focus-state-layer-opacity': 1,
  };
}

export function get_color_tokens($theme) {
  return {
    'text-color': inspection.get_theme_color($theme, 'foreground',  'hint-text'),
    'state-layer-color': inspection.get_theme_color($theme, 'background', 'focused-button'),
    'selected-state-text-color': inspection.get_theme_color($theme, 'foreground',  'secondary-text'),
    'selected-state-background-color': inspection.get_theme_color(  $theme, 'background', 'selected-button'),
    'disabled-state-text-color': inspection.get_theme_color($theme, 'foreground',  'disabled-button'),
    'disabled-state-background-color': inspection.get_theme_color( $theme, 'background', 'disabled-button-toggle'),
    'disabled-selected-state-background-color': inspection.get_theme_color(
        $theme, 'background', 'selected-disabled-button')
    };
}

export function get_typography_tokens($theme) {
  return {
    'label-text-font': inspection.get_theme_typography($theme, 'body-1', 'font-family'),
    'label-text-line-height': inspection.get_theme_typography($theme, 'body-1', 'line-height'),
    'label-text-size': inspection.get_theme_typography($theme, 'body-1', 'font-size'),
    'label-text-tracking': inspection.get_theme_typography($theme, 'body-1', 'letter-spacing'),
    'label-text-weight': inspection.get_theme_typography($theme, 'body-1', 'font-weight'),
  };
}

export function get_density_tokens($theme) {
  return {};
}

