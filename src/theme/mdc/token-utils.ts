/**
 * @fileoverview Module `src/theme/mdc/token-utils.ts` providing token utils definitions and implementation.
 * @zh 模块文件 `src/theme/mdc/token-utils.ts`，提供令牌工具集相关的定义与实现。
 */

import * as elevation from './elevation-theme';
import * as cp from './custom-properties';
import * as keys from '../mdc/keys';
/**
 * Constant/variable `$private_is_internal_build` defining private is internal build in `src/theme/mdc`.
 * @zh 常量/变量 `$private_is_internal_build`，定义 `src/theme/mdc` 中的private是否为内部构建。
 */
export const $private_is_internal_build= false;

/**
 * Executes `resolve_elevation` to handle resolve elevation.
 * @zh 执行 `resolve_elevation`，用于解析层级阴影。
 * @param $tokens - tokens parameter (`any`) / 设计令牌参数（`any`）
 * @param $elevation_token - elevation token parameter (`any`) / 层级阴影令牌参数（`any`）
 * @param $shadow_color_token - shadow color token parameter (`any`) / 阴影颜色令牌参数（`any`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function resolve_elevation($tokens, $elevation_token, $shadow_color_token): Object {
    let $elevation = $tokens[$elevation_token];
    let $shadow_color= $tokens[$shadow_color_token];
    return {
        ...$tokens,
        "$elevation-token": elevation.elevation_box_shadow($elevation, $shadow_color),
        "$shadow-color-token": null,
    }
}
/**
 * Executes `_configure_token_prefix` to handle configure token prefix.
 * @zh 执行 `_configure_token_prefix`，用于configure令牌前缀。
 * @param $prefix - prefix parameter (`any`) / 前缀参数（`any`）
 * @param content - content parameter (`any`) / 内容参数（`any`）
 */
function _configure_token_prefix($prefix,content) {
    let $first =$prefix[0];
    let $rest = $prefix.slice(1);
    let $_component_prefix= '';
    $rest.forEach($item => {
      $_component_prefix= $_component_prefix == ''? $item: $_component_prefix+"-"+$item;
    });
    // include mdc.configure($varname_prefix: $first) {
    //   @content;
    // }
    return $_component_prefix;
}
/**
 * Executes `create_token_values` to handle create token values.
 * @zh 执行 `create_token_values`，用于创建令牌值列表。
 * @param $prefix - prefix parameter (`string[]`) / 前缀参数（`string[]`）
 * @param $tokens - tokens parameter (`any`) / 设计令牌参数（`any`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function create_token_values($prefix: string[], $tokens): Object {
    let $first =$prefix[0];
    let $rest = $prefix.slice(1);
    let $_component_prefix= '';
    $rest.forEach($item => {
      $_component_prefix= $_component_prefix == ''? $item: $_component_prefix+"-"+$item;
    });
    let varname_prefix_pre=cp.$_config.varname_prefix;
    cp.$_config.varname_prefix =$first;
    let rv= keys.declare_custom_properties($tokens, $_component_prefix);
    cp.$_config.varname_prefix =varname_prefix_pre;
    return rv;
};