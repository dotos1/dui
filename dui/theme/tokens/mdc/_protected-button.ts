import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';

export const $prefix=["mdc", "protected-button"];
export const $custom_property_prefix= 'protected-button';

export function get_unthemable_tokens() {
  return {
    'container-shape': '4px',
    'keep-touch-target': 'false',
  };
}

export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';

  return {
    'container-color': inspection.get_theme_color($theme, 'background', 'card'),
    'label-text-color': inspection.get_theme_color($theme, 'foreground',  'text', 1),
    'disabled-container-color': inspection.get_theme_color($theme, 'foreground',  'disabled-button',
      0.12),
    'disabled-label-text-color': inspection.get_theme_color($theme, 'foreground',  'disabled-button',
      ($is_dark? 0.5: 0.38)),
    'container-elevation': 2,
    'disabled-container-elevation': 0,
    'focus-container-elevation': 4,
    'hover-container-elevation': 4,
    'pressed-container-elevation': 8,
    'container-shadow-color': '#000',
  };
}
export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $container_color= inspection.get_theme_color($theme, $palette_name, 'default');
  let $label_text_color= inspection.get_theme_color($theme, $palette_name, 'default-contrast', 1);

  return {
    'container-color': $container_color,
    'label-text-color': $label_text_color,
  };
}
export function get_typography_tokens($theme) {
  return {
    'label-text-font': inspection.get_theme_typography($theme, 'button', 'font-family'),
    'label-text-size': inspection.get_theme_typography($theme, 'button', 'font-size'),
    'label-text-tracking': inspection.get_theme_typography($theme, 'button', 'letter-spacing'),
    'label-text-weight': inspection.get_theme_typography($theme, 'button', 'font-weight'),
    'label-text-transform': 'none',
  };
}

export function get_density_tokens($theme) {
  let  $scale= theming.clamp_density(inspection.get_theme_density($theme), -3);
  return {
    'container-height':{
          '0': '36px',
          '-1': '34px',
          '-2': '32px',
          '-3': '30px',
      }[$scale]
    };
}

