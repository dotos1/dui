import * as elevation from '../../mdc/elevation-theme';
import * as inspection from '../../mdc/inspection';
import {rgba} from '../../mat-color';


export const $prefix=["mat", "datepicker"];


const $_selected_fade_amount= 0.6;
const $_today_fade_amount= 0.2;

export function private_get_range_background_color($color) {
  return rgba($color, 0.2);
}

function private_get_default_overlap_selected_color($overlap_color) {
  return $overlap_color;
  // return color.adjust($overlap_color, $lightness: -30%);
}

const $private_default_comparison_color= private_get_range_background_color("#f9ab00");

const $private_default_overlap_color= "#a8dab5";

export function get_unthemable_tokens() {
  return {
    "calendar-container-shape": "4px",
    "calendar-container-touch-shape": "4px",
    "calendar-container-elevation-shadow": elevation.elevation_box_shadow(4),
    "calendar-container-touch-elevation-shadow": elevation.elevation_box_shadow(24),
 };
}

export function get_color_tokens($theme) {
  let $inactive_icon_color= inspection.get_theme_color($theme, "foreground", "icon");
  let $text_color= inspection.get_theme_color($theme, "foreground", "text");
  let $secondary_text_color= inspection.get_theme_color($theme, "foreground", "secondary-text");
  let $disabled_text_color= inspection.get_theme_color($theme, "foreground", "disabled-text");
  let $divider_color= inspection.get_theme_color($theme, "foreground", "divider");
  let $hint_text_color= inspection.get_theme_color($theme, "foreground", "hint-text");
  let $preview_outline_color= $divider_color;
  let $today_disabled_outline_color= null;
  let $is_dark= inspection.get_theme_type($theme) == "dark";

  let $primary_color= inspection.get_theme_color($theme, "primary");
  let $range_tokens= get_range_color_tokens(private_get_range_background_color($primary_color));
  let $calendar_tokens= private_get_calendar_color_palette_color_tokens($theme, "primary");
  let $toggle_tokens= private_get_toggle_color_palette_color_tokens($theme, "primary");

  // @if meta.type-of($preview_outline_color) == color {
  //   $preview-outline-opacity: math.min(opacity($preview_outline_color) * 2, 1);
  //   $preview_outline_color: rgba($preview_outline_color, $preview-outline-opacity);
  // }

  // if (meta.type-of($hint_text_color) == color) {
  //   $today_disabled_outline_color: color.adjust($hint_text_color, $alpha: -$_today-fade-amount);
  // }
  // else {
    $today_disabled_outline_color= $disabled_text_color;
  // }

  return {
    ...$calendar_tokens, 
    ...$toggle_tokens, 
    ...$range_tokens, 
      "toggle-icon-color": $inactive_icon_color,
      "calendar-body-label-text-color": $secondary_text_color,
      "calendar-period-button-text-color": inspection.get_theme_color($theme, "foreground", "text", 1),
      "calendar-period-button-icon-color": $inactive_icon_color,
      "calendar-navigation-button-icon-color": $inactive_icon_color,
      "calendar-header-divider-color": $divider_color,
      "calendar-header-text-color": $secondary_text_color,

      "calendar-date-today-outline-color": $hint_text_color,
      "calendar-date-today-disabled-state-outline-color": $today_disabled_outline_color,
      "calendar-date-text-color": $text_color,
      "calendar-date-outline-color": "transparent",
      "calendar-date-disabled-state-text-color": $disabled_text_color,
      "calendar-date-preview-state-outline-color": $preview_outline_color,

      "range-input-separator-color": $text_color,
      "range-input-disabled-state-separator-color": $disabled_text_color,
      "range-input-disabled-state-text-color": $disabled_text_color,

      "calendar-container-background-color": inspection.get_theme_color($theme, "background", "card"),
      "calendar-container-text-color": $text_color,
  }
}

export function get_typography_tokens($theme) {
  return {
    "calendar-text-font": inspection.get_theme_typography($theme, "body-1", "font-family"),
    "calendar-text-size": "13px", 

    "calendar-body-label-text-size": inspection.get_theme_typography($theme, "button", "font-size"),
    "calendar-body-label-text-weight": inspection.get_theme_typography($theme, "button", "font-weight"),

    "calendar-period-button-text-size": inspection.get_theme_typography($theme, "button", "font-size"),
    "calendar-period-button-text-weight": inspection.get_theme_typography($theme, "button", "font-weight"),

    "calendar-header-text-size": "11px",
    "calendar-header-text-weight": inspection.get_theme_typography($theme, "body-1", "font-weight"),
 };
}

export function private_get_calendar_color_palette_color_tokens($theme, $palette_name) {
  let $palette_color= inspection.get_theme_color($theme, $palette_name);
  let $default_contrast= inspection.get_theme_color($theme, $palette_name, "default-contrast");
  let $active_background_color=$palette_color;
  let $active_disabled_color= null;

  // if (meta.type-of($palette-color) == color) {
  //   $active_disabled_color= color.adjust($palette-color, $alpha: -$_selected-fade-amount);
  // }
  // else {
    $active_disabled_color= inspection.get_theme_color($theme, "foreground", "disabled-button");
  // }

  return {
    "calendar-date-selected-state-text-color": $default_contrast,
    "calendar-date-selected-state-background-color": $palette_color,
    "calendar-date-selected-disabled-state-background-color": $active_disabled_color,
    "calendar-date-today-selected-state-outline-color": $default_contrast,
    "calendar-date-focus-state-background-color": $active_background_color,
    "calendar-date-hover-state-background-color": $active_background_color,
 };
}

export function private_get_toggle_color_palette_color_tokens($theme, $palette_name) {
  return {
    "toggle-active-state-icon-color": inspection.get_theme_color($theme, $palette_name, "text"),
 };
}
export function get_range_color_tokens(
  $range_color,
  $comparison_color= $private_default_comparison_color,
  $overlap_color= $private_default_overlap_color,
  $overlap_selected_color= private_get_default_overlap_selected_color($overlap_color)) {

  return {
    "calendar-date-in-range-state-background-color": $range_color,
    "calendar-date-in-comparison-range-state-background-color": $comparison_color,
    "calendar-date-in-overlap-range-state-background-color": $overlap_color,
    "calendar-date-in-overlap-range-selected-state-background-color": $overlap_selected_color,
  };
}

export function get_density_tokens($theme) {
  return {};
}