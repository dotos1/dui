
import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
export const $prefix=["mat", "table"];

export function get_unthemable_tokens() {
  return {
    "row-item-outline-width": "1px",
  };
}

// Tokens that can be configured through Angular Material's color theming API.
export function get_color_tokens($theme) {
  return {
    "background-color": inspection.get_theme_color($theme, 'background', 'card'),
    "header-headline-color": inspection.get_theme_color($theme, 'foreground', 'text'),
    "row-item-label-text-color": inspection.get_theme_color($theme, 'foreground', 'text'),
    "row-item-outline-color": inspection.get_theme_color($theme, 'foreground', 'divider'),
  };
}

// Tokens that can be configured through Angular Material's typography theming API.
export function get_typography_tokens($theme) {
  let $cell_font_family= inspection.get_theme_typography($theme, 'body-2', 'font-family');
  let $cell_line_height= inspection.get_theme_typography($theme, 'body-2', 'line-height');
  let $cell_font_size= inspection.get_theme_typography($theme, 'body-2', 'font-size');
  let $cell_font_weight= inspection.get_theme_typography($theme, 'body-2', 'font-weight');
  let $cell_letter_spacing= inspection.get_theme_typography($theme, 'body-2', 'letter-spacing');

  return {
    "header-headline-font": inspection.get_theme_typography($theme, 'subtitle-2', 'font-family'),
    "header-headline-line-height": inspection.get_theme_typography($theme, 'subtitle-2', 'line-height'),
    "header-headline-size": inspection.get_theme_typography($theme, 'subtitle-2', 'font-size'),
    "header-headline-weight": inspection.get_theme_typography($theme, 'subtitle-2', 'font-weight'),
    "header-headline-tracking": inspection.get_theme_typography($theme, 'subtitle-2', 'letter-spacing'),

    // Plain cells and footer cells have the same typography.
    "row-item-label-text-font": $cell_font_family,
    "row-item-label-text-line-height": $cell_line_height,
    "row-item-label-text-size": $cell_font_size,
    "row-item-label-text-weight": $cell_font_weight,
    "row-item-label-text-tracking": $cell_letter_spacing,

    "footer-supporting-text-font": $cell_font_family,
    "footer-supporting-text-line-height": $cell_line_height,
    "footer-supporting-text-size": $cell_font_size,
    "footer-supporting-text-weight": $cell_font_weight,
    "footer-supporting-text-tracking": $cell_letter_spacing,
  };
}

// Tokens that can be configured through Angular Material's density theming API.
export function get_density_tokens($theme) {
  let $scale= theming.clamp_density(inspection.get_theme_density($theme), -4);
  let $header_scale= {
    '0': '56px',
    '-1': '52px',
    '-2': '48px',
    '-3': '44px',
    '-4': '40px'
  };
  let $cell_scale= {
    '0': '52px',
    '-1': '48px',
    '-2': '44px',
    '-3': '40px',
    '-4': '36px'
  };
  return {
    "header-container-height": $header_scale[$scale],
    "footer-container-height": $cell_scale[$scale],
    "row-item-container-height": $cell_scale[$scale]
  };
}

