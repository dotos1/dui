function _mat_get_type_value($config, $level, $name) {
    if(typeof $config != 'object') {
      throw new Error('Typography config must be a map. Received #{meta.type-of($config)}.');
    }
  
    if(!$config[$level]){
        throw new Error('Typography config does not have a level called "#{$level}". ' +
             'Available levels are: #{map.keys($config)}.');
    }
  
    return $config[$level][$name];
}

export function font_size($config, $level) {
    return _mat_get_type_value($config, $level, "font-size");
}

export function line_height($config, $level) {
    return _mat_get_type_value($config, $level, "line-height");
}
export function font_weight($config, $level) {
    return _mat_get_type_value($config, $level, "font-weight");
}
export function letter_spacing($config, $level) {
    return _mat_get_type_value($config, $level, "letter-spacing");
}
export function font_family($config, $level= null) {
    if(typeof $config != 'object') {
        throw new Error('Typography config must be a map. Received #{meta.type-of($config)}.');
    }
  
    let $font_family= $config["font-family"];
  
    if ($level !== null) {
      $font_family= _mat_get_type_value($config, $level, "font-family");
    }
    // Guard against unquoting non-string values, because it's deprecated.
    return typeof $font_family == "string"? $font_family.replace(/"/g, '').replace(/'/g, ''): $font_family;
}

function define_typography_level(
    $font_size,
    $line_height= $font_size,
    $font_weight= 400,
    $font_family= null,
    $letter_spacing= "normal") {
  
    return {
      "font-size": $font_size,
      "line-height": $line_height,
      "font-weight": $font_weight,
      "font-family": $font_family,
      "letter-spacing": $letter_spacing
    };
  }
export function private_typography_to_2018_config($config, $force= false) {
    if($config == null ){
        return null;
    }
    
    if($force || $config["headline-1"]==null) {
        return {
          "headline-1": $config["display-4"],
          "headline-2": $config["display-3"],
          "headline-3": $config["display-2"],
          "headline-4": $config["display-1"],
          "headline-5": $config["headline"],
          "headline-6": $config["title"],
          "subtitle-1": $config["subheading-2"],
          "font-family": $config["font-family"],
    
          "subtitle-2": $config["body-2"],
          "body-1": $config["subheading-1"],
    
          "body-2": $config["body-1"],
          "button": $config["button"],
          "caption": $config["caption"],
          "overline": ($config["overline"]? $config["overline"]: define_typography_level("12px", "32px", 500)
          )
        };
      }
      return $config;
}