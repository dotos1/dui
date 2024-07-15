import * as theming from '../../mdc/theming';
import * as inspection from '../../mdc/inspection';
import * as sass from '../../mdc/_sass-utils';

export const $prefix=["mat", "standard-button-toggle"];

export function get_unthemable_tokens() {
  return {
    'shape': '4px',
    'hover-state-layer-opacity': 0.04,
    'focus-state-layer-opacity': 0.12,
  };
}

export function get_color_tokens($theme) {
  let $theme_divider_color= inspection.get_theme_color($theme, 'foreground',  'divider');

  // let $divider_color= if(
  //     meta.type-of($theme-divider-color) == 'color',
  //     theming.private-rgba-to-hex(
  //         $theme_divider_color, inspection.get_theme_color($theme, 'background', 'card')),
  //     $theme_divider_color);
  let $divider_color= $theme_divider_color;

  return {
    'text-color': inspection.get_theme_color($theme, 'foreground',  'text'),
    'background-color': inspection.get_theme_color($theme, 'background', 'card'),
    'state-layer-color': sass.safe_color_change(
        inspection.get_theme_color($theme, 'background', 'focused-button'), 1),
    'selected-state-background-color': inspection.get_theme_color(
        $theme, 'background', 'selected-button'),
    'selected-state-text-color': inspection.get_theme_color($theme, 'foreground',  'text'),
    'disabled-state-text-color': inspection.get_theme_color($theme, 'foreground',  'disabled-button'),
    'disabled-state-background-color': inspection.get_theme_color($theme, 'background', 'card'),
    'disabled-selected-state-text-color': inspection.get_theme_color($theme, 'foreground',  'text'),
    'disabled-selected-state-background-color':
      inspection.get_theme_color($theme, 'background', 'selected-disabled-button'),
    'divider-color': $divider_color,
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
  let $density_scale= theming.clamp_density(inspection.get_theme_density($theme), -4);
  let $size_scale={
    "0": "48px",
    "-1": "44px",
    "-2": "40px",
    "-3": "36px",
    "-4": "24px",
  };
  return {
    height: $size_scale[$density_scale]
  };
}
