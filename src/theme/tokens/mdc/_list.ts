import * as inspection from '../../mdc/inspection';

export const $prefix=["mdc", "list"];
export const $custom_property_prefix= 'list';
 
export function get_unthemable_tokens() {
  return {
    'list-item-container-shape': 0,
    'list-item-leading-avatar-shape': '50%',
    'list-item-container-color': 'transparent',

    'list-item-leading-avatar-color': 'transparent',
    'list-item-leading-icon-size': '24px',
    'list-item-leading-avatar-size': '40px',
    'list-item-trailing-icon-size': '24px',
    'list-item-disabled-state-layer-color': 'transparent',
    'list-item-disabled-state-layer-opacity': 0,
    'list-item-disabled-label-text-opacity': 0.38,
    'list-item-disabled-leading-icon-opacity': 0.38,
    'list-item-disabled-trailing-icon-opacity': 0.38,
  };
}

export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $foreground_base= inspection.get_theme_color($theme, 'foreground', 'base');
  let $foreground_text= inspection.get_theme_color($theme, 'foreground',  'text');
  let $foreground_secondary_text= inspection.get_theme_color($theme, 'foreground',  'secondary-text');
  let $foreground_hint_text= inspection.get_theme_color($theme, 'foreground',  'hint-text');
  let $text_icon_on_background=$foreground_base;
  let $selected_background = inspection.get_theme_color($theme, 'background',  'selected-button');
  let $focus_background = inspection.get_theme_color($theme, 'background',  'selected-button');

  return {
    'list-item-selected-container-color': $selected_background ,
    'list-item-label-text-color': $foreground_text,
    'list-item-supporting-text-color': $foreground_secondary_text,
    'list-item-leading-icon-color': $text_icon_on_background,
    'list-item-trailing-supporting-text-color': $foreground_hint_text,
    'list-item-trailing-icon-color': $text_icon_on_background,
    'list-item-selected-trailing-icon-color': $text_icon_on_background,
    'list-item-disabled-label-text-color': $foreground_base,
    'list-item-disabled-leading-icon-color': $foreground_base,
    'list-item-disabled-trailing-icon-color': $foreground_base,
    'list-item-hover-label-text-color': $foreground_text,
    'list-item-hover-leading-icon-color': $text_icon_on_background,
    'list-item-hover-trailing-icon-color': $text_icon_on_background,
    'list-item-focus-label-text-color': $foreground_text,
    'list-item-hover-state-layer-color': $focus_background ,
    'list-item-hover-state-layer-opacity': ($is_dark? 0.24: 0.12),
    'list-item-focus-state-layer-color': $focus_background ,
    'list-item-focus-state-layer-opacity': ($is_dark? 0.24:0.12),
  };
}

export function get_typography_tokens($theme) {
  return {
    'list-item-label-text-font': inspection.get_theme_typography($theme, 'body-1', 'font-family'),
    'list-item-label-text-line-height': inspection.get_theme_typography($theme, 'body-1', 'line-height'),
    'list-item-label-text-size': inspection.get_theme_typography($theme, 'body-1', 'font-size'),
    'list-item-label-text-tracking': inspection.get_theme_typography($theme, 'body-1', 'letter-spacing'),
    'list-item-label-text-weight': inspection.get_theme_typography($theme, 'body-1', 'font-weight'),
    'list-item-supporting-text-font': inspection.get_theme_typography($theme, 'body-2', 'font-family'),
    'list-item-supporting-text-line-height':inspection.get_theme_typography(
        $theme, 'body-2', 'line-height'),
    'list-item-supporting-text-size': inspection.get_theme_typography($theme, 'body-2', 'font-size'),
    'list-item-supporting-text-tracking': inspection.get_theme_typography(
        $theme, 'body-2', 'letter-spacing'),
    'list-item-supporting-text-weight': inspection.get_theme_typography($theme, 'body-2', 'font-weight'),
    'list-item-trailing-supporting-text-font': inspection.get_theme_typography(
        $theme, 'caption', 'font-family'),
    'list-item-trailing-supporting-text-line-height': inspection.get_theme_typography(
        $theme, 'caption', 'line-height'),
    'list-item-trailing-supporting-text-size': inspection.get_theme_typography(
        $theme, 'caption', 'font-size'),
    'list-item-trailing-supporting-text-tracking': inspection.get_theme_typography(
        $theme, 'caption', 'letter-spacing'),
    'list-item-trailing-supporting-text-weight': inspection.get_theme_typography(
        $theme, 'caption', 'font-weight'),
    };
}

export function get_density_tokens($theme) {
  let $scale= inspection.get_theme_density($theme);
  return {
    'list-item-one-line-container-height':{
      '0': '48px',
      '-1': '44px',
      '-2': '40px',
      '-3': '36px',
      '-4': '32px',
      '-5': '24px',
    }[$scale],
    'list-item-two-line-container-height': {
      '0': '64px',
      '-1': '60px',
      '-2': '56px',
      '-3': '52px',
      '-4': '48px',
      '-5': '48px',
    }[$scale],
    'list-item-three-line-container-height':{
      '0': '88px',
      '-1': '84px',
      '-2': '80px',
      '-3': '76px',
      '-4': '72px',
      '-5': '56px',
    }[$scale],
  };
}
