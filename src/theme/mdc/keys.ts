/**
 * @fileoverview Module `src/theme/mdc/keys.ts` providing keys definitions and implementation.
 * @zh 模块文件 `src/theme/mdc/keys.ts`，提供键列表相关的定义与实现。
 */

import { declaration,is_custom_prop,create_varname,create,set_fallback } from './custom-properties';
/**
 * Constant/variable `$_store` defining store in `src/theme/mdc`.
 * @zh 常量/变量 `$_store`，定义 `src/theme/mdc` 中的状态仓库。
 */
const $_store: Record<string, unknown> = {};
/**
 * Constant/variable `$_options` defining options in `src/theme/mdc`.
 * @zh 常量/变量 `$_options`，定义 `src/theme/mdc` 中的配置选项。
 */
const $_options: Record<string, unknown> = {};
/**
 * Constant/variable `$_links` defining links in `src/theme/mdc`.
 * @zh 常量/变量 `$_links`，定义 `src/theme/mdc` 中的链接。
 */
const $_links: Record<string, unknown> = {};

/**
 * Executes `_is_map` to handle is map.
 * @zh 执行 `_is_map`，用于是否为映射表。
 * @param $map - map parameter (`any`) / 映射表参数（`any`）
 */
function _is_map($map) {
    return typeof $map == 'object' && !is_custom_prop($map);
}
/**
 * Executes `is_key` to handle is key.
 * @zh 执行 `is_key`，用于是否为键。
 * @param $key - key parameter (`any[]`) / 键参数（`any[]`）
 */
function is_key(...$key) {
    let $ckey= combine($key);
    return !!$_store[$ckey];
  }
/**
 * Executes `combine` to handle combine.
 * @zh 执行 `combine`，用于组合。
 * @param $parts - parts parameter (`any[]`) / parts参数（`any[]`）
 */
function combine(...$parts) {
    let $key= '';
    $parts.forEach($part => {
    
      if($part) {
        if ($key == '') {
          $key= $part;
        } else {
          $key= $key+"-"+$part;
        }
      }
    });
  
    return $key;
  }

  /**
   * Executes `_create_varname` to handle create varname.
   * @zh 执行 `_create_varname`，用于创建varname。
   * @param $key - key parameter (`any`) / 键参数（`any`）
   */
  function _create_varname($key) {
    $key= combine($key);
    let $prefix= $_options[$key]?$_options[$key]["custom-property-prefix"]:null;
    if($prefix) {
      $key= combine($prefix, $key);
    }
  
    return create_varname($key);
  }
  /**
   * Executes `resolve` to handle resolve.
   * @zh 执行 `resolve`，用于解析。
   * @param $key - key parameter (`any[]`) / 键参数（`any[]`）
   */
  function resolve(...$key) {
    let $ckey= combine($key);
  
    let $value= $_store[$ckey];
    if(is_key($value)) {
      $value= resolve($value);
    }
  
    return $value;
  }
 /**
  * Executes `create_custom_property` to handle create custom property.
  * @zh 执行 `create_custom_property`，用于创建自定义属性。
  * @param $key - key parameter (`any`) / 键参数（`any`）
  */
 function create_custom_property($key) {
    $key= combine($key);
    let $prop= create(_create_varname($key));
    let $link= $_links[$key];
    if($link) {
      $prop= set_fallback($prop, create_custom_property($link));
    }
    console.log("create_custom_property",$prop);
    
    return set_fallback($prop, resolve($key, true));
  }
  /**
   * Executes `map_set` to handle map set.
   * @zh 执行 `map_set`，用于映射表集合。
   * @param $map - map parameter (`any`) / 映射表参数（`any`）
   * @param $args - args parameter (`any[]`) / 参数列表参数（`any[]`）
   */
  export function map_set($map, ...$args) {
    let $first =$args[0];
    let $rest = $args.slice(1);
    
    if($rest.length==1){
      $map[$first]=$rest[0];
    }else{
      if(!$map[$first]) 
        $map[$first]={};
      map_set($map[$first],...$rest);
    }
  }
/**
 * Executes `create_theme_properties` to handle create theme properties.
 * @zh 执行 `create_theme_properties`，用于创建主题属性列表。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $prefix - prefix parameter (`any`) / 前缀参数（`any`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function create_theme_properties($theme, $prefix= null) : Object{
    let $theme_with_props: Record<string, unknown> = {};
    Object.keys($theme).forEach($name => {
        let $value = $theme[$name];
        if($value != null) {
            if(is_key($value)) {
                $value= create_custom_property($value);
            }
    
            let $key= combine($prefix, $name);
    
            if(_is_map($value)) {
                Object.keys($value).forEach($k => {
                  let $v=$value[$k];
                  //$theme_with_props[$name][$k]= create(_create_varname(combine($key, $k)), $v);
                  map_set($theme_with_props,$name,$k,create(_create_varname(combine($key, $k)), $v));
                });
            } else {
                $theme_with_props[$name]= create(_create_varname($key), $value);
            }
      }
    });
    
    return $theme_with_props;
  }
/**
 * Executes `declare_custom_properties` to handle declare custom properties.
 * @zh 执行 `declare_custom_properties`，用于声明自定义属性列表。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $prefix - prefix parameter (`any`) / 前缀参数（`any`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function declare_custom_properties($theme, $prefix= null) : Object{
    $theme= create_theme_properties($theme, $prefix);
    let rv: Record<string, unknown> = {};
    Object.keys($theme).forEach($key => {
        let $value = $theme[$key];

      if(_is_map($value)) {

        Object.keys($value).forEach($k => {
            let $v = $value[$k];
            rv={
              ...rv,
              ...declaration($v)
            }
        })
      } else {
        rv={
          ...rv,
          ...declaration($value)
        }
      }
    });
    return  rv;
  }