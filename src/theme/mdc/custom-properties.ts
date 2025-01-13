
export const $_config= {
    emit_custom_properties: true,
    emit_fallback_values: true,
    emit_fallback_vars: true,
    emit_declaration_fallback: true,
    varname_prefix: 'mdc',
}

export function is_custom_prop($value) {
    return typeof $value == 'object' &&  $value['varname'];
}
function get_varname($custom_prop) {
    return $custom_prop['varname'];
}
function get_fallback($custom_prop, $shallow= false) {
    let $fallback= $custom_prop['fallback'];
    if(is_custom_prop($fallback) && !$shallow){
      return get_fallback($fallback);
    }
  
    return $fallback;
}
export function create_varname($name) {
    let $varname_prefix= $_config['varname_prefix'];
    return `--${$varname_prefix}-${$name}`;
}
export function create($varname, $fallback= null) {
    if($varname.slice(0, 2) != '--') {
      $varname= create_varname($varname);
    }
  
    return {varname: $varname, fallback: $fallback};
  }
export function set_fallback($custom_prop, $new_fallback, $shallow= false) {
    let $varname= get_varname($custom_prop);
    let $first_fallback= get_fallback($custom_prop, true);
  
    if(is_custom_prop($first_fallback) && !$shallow) {
      $new_fallback= set_fallback($first_fallback, $new_fallback);
    }
  
    return create($varname, $new_fallback);
  }
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
function get_declaration_value($custom_prop) {
    return create_var($custom_prop);
}
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
export function declaration($property, $custom_prop= null, $gss= {}, $important= false) {
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
export function css_declaration(
    $property,
    $value,
    $fallback_value= null,
    $gss={},
    $important= false
  ) {
    let rv={};
    if ($value != null) {
      let $important_rule= $important? ' !important': '';
      if($fallback_value) {
        rv[$property]=$fallback_value+' '+$important_rule;
      }
  
      rv[$property]= $value+$important_rule;
    }
    return rv;
  }