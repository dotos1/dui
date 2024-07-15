import { declaration,is_custom_prop,create_varname,create,set_fallback } from './custom-properties';
const $_store={};
const $_options={};
const $_links={};

function _is_map($map) {
    return typeof $map == 'object' && !is_custom_prop($map);
}
function is_key(...$key) {
    let $ckey= combine($key);
    return !!$_store[$ckey];
  }
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

  function _create_varname($key) {
    $key= combine($key);
    let $prefix= $_options[$key]?$_options[$key]["custom-property-prefix"]:null;
    if($prefix) {
      $key= combine($prefix, $key);
    }
  
    return create_varname($key);
  }
  function resolve(...$key) {
    let $ckey= combine($key);
  
    let $value= $_store[$ckey];
    if(is_key($value)) {
      $value= resolve($value);
    }
  
    return $value;
  }
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
function create_theme_properties($theme, $prefix= null) : Object{
    let $theme_with_props={};
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
export function declare_custom_properties($theme, $prefix= null) : Object{
    $theme= create_theme_properties($theme, $prefix);
    let rv={};
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