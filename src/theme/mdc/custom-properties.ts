/**
 * @fileoverview Module `src/theme/mdc/custom-properties.ts` providing custom properties definitions and implementation.
 * @zh 模块文件 `src/theme/mdc/custom-properties.ts`，提供自定义属性列表相关的定义与实现。
 */


/**
 * Constant/variable `$_config` defining config in `src/theme/mdc`.
 * @zh 常量/变量 `$_config`，定义 `src/theme/mdc` 中的配置。
 */
export const $_config= {
    emit_custom_properties: true,
    emit_fallback_values: true,
    emit_fallback_vars: true,
    emit_declaration_fallback: true,
    varname_prefix: 'mdc',
}

/**
 * Executes `is_custom_prop` to handle is custom prop.
 * @zh 执行 `is_custom_prop`，用于是否为自定义属性。
 * @param $value - value parameter (`any`) / 值参数（`any`）
 */
export function is_custom_prop($value) {
    return typeof $value == 'object' &&  $value['varname'];
}
/**
 * Executes `get_varname` to handle get varname.
 * @zh 执行 `get_varname`，用于获取varname。
 * @param $custom_prop - custom prop parameter (`any`) / 自定义属性参数（`any`）
 */
function get_varname($custom_prop) {
    return $custom_prop['varname'];
}
/**
 * Executes `get_fallback` to handle get fallback.
 * @zh 执行 `get_fallback`，用于获取fallback。
 * @param $custom_prop - custom prop parameter (`any`) / 自定义属性参数（`any`）
 * @param $shallow - shallow parameter (`any`) / shallow参数（`any`）
 */
function get_fallback($custom_prop, $shallow= false) {
    let $fallback= $custom_prop['fallback'];
    if(is_custom_prop($fallback) && !$shallow){
      return get_fallback($fallback);
    }
  
    return $fallback;
}
/**
 * Executes `create_varname` to handle create varname.
 * @zh 执行 `create_varname`，用于创建varname。
 * @param $name - name parameter (`any`) / 名称参数（`any`）
 */
export function create_varname($name) {
    let $varname_prefix= $_config['varname_prefix'];
    return `--${$varname_prefix}-${$name}`;
}
/**
 * Executes `create` to handle create.
 * @zh 执行 `create`，用于创建。
 * @param $varname - varname parameter (`any`) / varname参数（`any`）
 * @param $fallback - fallback parameter (`any`) / fallback参数（`any`）
 */
export function create($varname, $fallback= null) {
    if($varname.slice(0, 2) != '--') {
      $varname= create_varname($varname);
    }
  
    return {varname: $varname, fallback: $fallback};
  }
/**
 * Executes `set_fallback` to handle set fallback.
 * @zh 执行 `set_fallback`，用于集合fallback。
 * @param $custom_prop - custom prop parameter (`any`) / 自定义属性参数（`any`）
 * @param $new_fallback - new fallback parameter (`any`) / 新fallback参数（`any`）
 * @param $shallow - shallow parameter (`any`) / shallow参数（`any`）
 */
export function set_fallback($custom_prop, $new_fallback, $shallow= false) {
    let $varname= get_varname($custom_prop);
    let $first_fallback= get_fallback($custom_prop, true);
  
    if(is_custom_prop($first_fallback) && !$shallow) {
      $new_fallback= set_fallback($first_fallback, $new_fallback);
    }
  
    return create($varname, $new_fallback);
  }
/**
 * Executes `create_var` to handle create var.
 * @zh 执行 `create_var`，用于创建var。
 * @param $custom_prop - custom prop parameter (`any`) / 自定义属性参数（`any`）
 */
function create_var($custom_prop) {
    if(!$_config.emit_custom_properties) {
      return get_fallback($custom_prop);
    }
  
    let $varname= get_varname($custom_prop);
    let $fallback= get_fallback($custom_prop, true);
  
    let $emit_fallback_vars=$_config.emit_fallback_vars;
    let $fallback_is_prop= is_custom_prop($fallback);
    if($fallback_is_prop && $emit_fallback_vars) {
      return `var(${$varname}, ${create_var($fallback)})`;
    }
  
    let $emit_fallback_values= $_config.emit_fallback_values;
    if($fallback && !$fallback_is_prop && $emit_fallback_values) {
      return `var(${$varname}, ${$fallback})`;
    }
  
    return `var(${$varname})`;
  }
/**
 * Executes `get_declaration_value` to handle get declaration value.
 * @zh 执行 `get_declaration_value`，用于获取declaration值。
 * @param $custom_prop - custom prop parameter (`any`) / 自定义属性参数（`any`）
 */
function get_declaration_value($custom_prop) {
    return create_var($custom_prop);
}
/**
 * Executes `get_declaration_fallback` to handle get declaration fallback.
 * @zh 执行 `get_declaration_fallback`，用于获取declarationfallback。
 * @param $custom_prop - custom prop parameter (`any`) / 自定义属性参数（`any`）
 */
function get_declaration_fallback($custom_prop) {
    let $emit_custom_properties= $_config.emit_custom_properties;
    let $emit_fallback_values= $_config.emit_fallback_values;
    let $emit_declaration_fallback= $_config.emit_declaration_fallback;
    if (!$emit_custom_properties ||
      !$emit_fallback_values ||
      !$emit_declaration_fallback)
    {
      return null;
    }
  
    return get_fallback($custom_prop);
  }
/**
 * Executes `declaration` to handle declaration.
 * @zh 执行 `declaration`，用于declaration。
 * @param $property - property parameter (`any`) / 属性参数（`any`）
 * @param $custom_prop - custom prop parameter (`any`) / 自定义属性参数（`any`）
 * @param $gss - gss parameter (`any`) / gss参数（`any`）
 * @param $important - important parameter (`any`) / important参数（`any`）
 */
export function declaration($property, $custom_prop= null, $gss: Record<string, string> = {}, $important= false) {
    if($property) {
      let $value= null;
      let $fallback_value= null;
      if( is_custom_prop($property)){

        if ($_config.emit_custom_properties) {
          $custom_prop= $property;
          $property= get_varname($custom_prop);
          $value= get_fallback($custom_prop, true);

          if(is_custom_prop($value)) {
            $value= create_var($value);
          }
        }
      } else {
        if (!is_custom_prop($custom_prop)) {
          throw new Error("Invalid custom property: #{$custom_prop}. Must be a Map with 'varname' and 'fallback'.");
        }
  
        $value = get_declaration_value($custom_prop);
        $fallback_value= get_declaration_fallback($custom_prop);
      }
  
      return css_declaration(
        $property,
        $value,
        $fallback_value,
        $gss,
        $important
      );
    }
    return null;
  }
/**
 * Executes `css_declaration` to handle css declaration.
 * @zh 执行 `css_declaration`，用于CSS样式declaration。
 * @param $property - property parameter (`any`) / 属性参数（`any`）
 * @param $value - value parameter (`any`) / 值参数（`any`）
 * @param $fallback_value - fallback value parameter (`any`) / fallback值参数（`any`）
 * @param $gss - gss parameter (`any`) / gss参数（`any`）
 * @param $important - important parameter (`any`) / important参数（`any`）
 */
export function css_declaration(
    $property,
    $value,
    $fallback_value= null,
    $gss: Record<string, string> = {},
    $important= false
  ) {
    let rv: Record<string, string> = {};
    if ($value != null) {
      let $important_rule= $important? ' !important': '';
      if($fallback_value) {
        rv[$property]=$fallback_value+' '+$important_rule;
      }
  
      rv[$property]= $value+$important_rule;
    }
    return rv;
  }