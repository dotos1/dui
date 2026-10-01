import * as elevation from './elevation-theme';
import * as cp from './custom-properties';
import * as keys from '../mdc/keys';
export const $private_is_internal_build= false;

export function resolve_elevation($tokens, $elevation_token, $shadow_color_token): Object {
    let $elevation = $tokens[$elevation_token];
    let $shadow_color= $tokens[$shadow_color_token];
    return {
        ...$tokens,
        "$elevation-token": elevation.elevation_box_shadow($elevation, $shadow_color),
        "$shadow-color-token": null,
    }
}
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