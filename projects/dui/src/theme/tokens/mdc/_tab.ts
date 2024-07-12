import * as theming from '../../mdc/theming';
import * as inspection from '../../mdc/inspection';

export const $prefix=["mdc", "tab"];
export const $custom_property_prefix= 'tab';
export const $custom_property_prefix_primary= 'primary-navigation-tab';
export const $custom_property_prefix_secondary= 'secondary-navigation-tab';

export function get_unthemable_tokens() {
  return {
    'container-height': '48px',
  };
}

export function get_color_tokens($theme, $palette_name= 'primary') {
  return {};
}

export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  let $scale= theming.clamp_density(inspection.get_theme_density($theme), -4);

  return {
    'container-height': {
      '0': '48px',
      '-1': '44px',
      '-2': '40px',
      '-3': '36px',
      '-4': '32px',
    }[$scale]
  };
}
