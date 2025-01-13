import { matColor } from '../mat-color';
import * as typography from './_typography-getters';
import * as theming from './theming';
function private_is_theme_object($value) {
    return typeof($value) == 'object' && (
      $value.primary!=undefined ||$value.density!=undefined || $value.typography!=undefined) 
      ||$value.length == 0;
  }

function get_color_config($theme, $default= null) {
    if(private_is_theme_object($theme)){
        return $theme;
    }
    if($theme.color) {
      return $theme.color;
    }
    return $default;
  }

export function get_theme_color($theme, $palette_name, ...$args) {
    let $colors= get_color_config($theme);
    let $palette= $colors[$palette_name];
    return matColor($palette, ...$args);
}
export function get_theme_type($theme) {
  let $colors= get_color_config($theme);
  return $colors["type"]=='light'?  "light":"dark";
}
export function get_theme_density($theme) {
  let $scale= theming.get_density_config($theme);
  return theming.clamp_density($scale, -5);
}
export function get_theme_typography($theme, $typescale, $property) {

  let $typography= typography.private_typography_to_2018_config( $theme);
  if($property == "font" ){
    let $font_weight= typography.font_weight($typography, $typescale);
    let $font_size= typography.font_size($typography, $typescale);
    let $line_height= typography.line_height($typography, $typescale);
    let $font_family= typography.font_family($typography, $typescale);
    return `${$font_weight} /${$font_size}/${$line_height} ${$font_family}`;
  }
  else if($property == "font-family") {
    let $result= typography.font_family($typography, $typescale);
    return $result || typography.font_family($typography);
  }
  else if($property == "font-size") {
    return typography.font_size($typography, $typescale);
  }
  else if($property == "font-weight" ){
    return typography.font_weight($typography, $typescale);
  }
  else if($property == "line-height" ){
    return typography.line_height($typography, $typescale);
  }
  else if($property == "letter-spacing" ){
    return typography.letter_spacing($typography, $typescale);
  }
  else {
    throw new Error('Valid typography properties are: #{$_typography-properties}. Got:'+$property) ;
  }
}