import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
export const $prefix=["mat", "switch"];

export function get_unthemable_tokens() {
  return {
    'disabled-selected-handle-opacity': 0.38,
    'disabled-unselected-handle-opacity': 0.38,
    'unselected-handle-size': '20px',
    'selected-handle-size': '20px',
    'pressed-handle-size': '20px',
    'with-icon-handle-size': '20px',
    
    'selected-handle-horizontal-margin': 0,
    'selected-with-icon-handle-horizontal-margin': 0,
    'selected-pressed-handle-horizontal-margin': 0,
    'unselected-handle-horizontal-margin': 0,
    'unselected-with-icon-handle-horizontal-margin': 0,
    'unselected-pressed-handle-horizontal-margin': 0,
    'visible-track-opacity': 1,
    'hidden-track-opacity': 1,
    'visible-track-transition': 'transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1)',
    'hidden-track-transition': 'transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1)',

    'track-outline-width': '1px',
    'track-outline-color': 'transparent',
    'selected-track-outline-width': '1px',
    'disabled-unselected-track-outline-width': '1px',
    'disabled-unselected-track-outline-color': 'transparent',
  };
}

export function get_color_tokens($theme) {
  return {
    "label-text-color": inspection.get_theme_color($theme, "foreground", "text")
  };
}

export function get_typography_tokens($theme) {
  return {
    "label-text-font": inspection.get_theme_typography($theme, "body-2", "font-family"),
    "label-text-line-height": inspection.get_theme_typography($theme, "body-2", "line-height"),
    "label-text-size": inspection.get_theme_typography($theme, "body-2", "font-size"),
    "label-text-tracking": inspection.get_theme_typography($theme, "body-2", "letter-spacing"),
    "label-text-weight": inspection.get_theme_typography($theme, "body-2", "font-weight")
   };
}

export function get_density_tokens($theme) {
  return {};
}