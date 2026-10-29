/**
 * @fileoverview Module `src/theme/mdc/inspection.ts` providing inspection definitions and implementation.
 * @zh 模块文件 `src/theme/mdc/inspection.ts`，提供inspection相关的定义与实现。
 */

import { matColor } from '../mat-color';
import * as typography from './_typography-getters';
import * as theming from './theming';
/**
 * Executes `private_is_theme_object` to handle private is theme object.
 * @zh 执行 `private_is_theme_object`，用于内部是否为主题对象。
 * @param $value - value parameter (`any`) / 值参数（`any`）
 */
function private_is_theme_object($value) {
    return typeof($value) == 'object' && (
      $value.primary!=undefined ||$value.density!=undefined || $value.typography!=undefined) 
      ||$value.length == 0;
  }

/**
 * Executes `get_color_config` to handle get color config.
 * @zh 执行 `get_color_config`，用于获取颜色配置。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $default - default parameter (`any`) / 默认参数（`any`）
 */
function get_color_config($theme, $default= null) {
    if(private_is_theme_object($theme)){
        return $theme;
    }
    if($theme.color) {
      return $theme.color;
    }
    return $default;
  }

/**
 * Executes `get_theme_color` to handle get theme color.
 * @zh 执行 `get_theme_color`，用于获取主题颜色。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 * @param $args - args parameter (`any[]`) / 参数列表参数（`any[]`）
 */
export function get_theme_color($theme, $palette_name, ...$args) {
    let $colors= get_color_config($theme);
    let $palette= $colors[$palette_name];
    return matColor($palette, ...$args);
}
/**
 * Executes `get_theme_type` to handle get theme type.
 * @zh 执行 `get_theme_type`，用于获取主题类型。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_theme_type($theme) {
  let $colors= get_color_config($theme);
  return $colors["type"]=='light'?  "light":"dark";
}
/**
 * Executes `get_theme_density` to handle get theme density.
 * @zh 执行 `get_theme_density`，用于获取主题密度。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_theme_density($theme) {
  let $scale= theming.get_density_config($theme);
  return theming.clamp_density($scale, -5);
}
/**
 * Executes `get_theme_typography` to handle get theme typography.
 * @zh 执行 `get_theme_typography`，用于获取主题排版。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $typescale - typescale parameter (`any`) / typescale参数（`any`）
 * @param $property - property parameter (`any`) / 属性参数（`any`）
 */
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