
import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';

export const $prefix=["mat", "paginator"];

export function get_unthemable_tokens() {
  return {};
}

export function get_color_tokens($theme) {
  let $foreground_base=inspection.get_theme_color($theme, 'foreground', 'base');
  return {
    'container-text-color': $foreground_base,
    'container-background-color': inspection.get_theme_color($theme, 'background', 'card'),
    'enabled-icon-color': $foreground_base,
    'disabled-icon-color': $foreground_base,
  };
}

export function get_typography_tokens($theme) {
  return {
    'container-text-font': inspection.get_theme_typography($theme, 'caption', 'font-family'),
    'container-text-line-height': inspection.get_theme_typography($theme, 'caption', 'line-height'),
    'container-text-size': inspection.get_theme_typography($theme, 'caption', 'font-size'),
    'container-text-tracking': inspection.get_theme_typography($theme, 'caption', 'letter-spacing'),
    'container-text-weight': inspection.get_theme_typography($theme, 'caption', 'font-weight'),
    'select-trigger-text-size': inspection.get_theme_typography($theme, 'caption', 'font-size'),
  };
}

export function get_density_tokens($theme) {
  let $density_scale= theming.clamp_density(inspection.get_theme_density($theme), -5);
  let $size_scale={
    "0": "56px",
    "-1": "52px",
    "-2": "48px",
    "-3": "40px",
    "-4": "40px",
    "-5": "40px",
  };
  let $form_field_density_scale= ($density_scale > -4? -4 :$density_scale);
  let $density_config ={
    height: {
      default: 56,
      maximum: 56,
      minimum: 36,
    }
  }
  let $form_field_height= 56;
  let $form_field_vertical_deduction= (56 - $form_field_height)/2;
  let $form_field_vertical_padding=(16 - $form_field_vertical_deduction)+'px';

  return {
    'container-size': $size_scale[$density_scale],
    'form-field-container-height': $form_field_height+"px",
    'form-field-container-vertical-padding': $form_field_vertical_padding,
  };
}

