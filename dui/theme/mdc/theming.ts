export function clamp_density($density_scale, $min, $max= 0) {
    if($density_scale == "minimum") {
      return $min;
    }
    if($density_scale == "maximum") {
      return $max;
    }
    if(typeof $density_scale != 'number') {
      return 0;
    }
    if($density_scale < $min) {
      return $min;
    }
    if($density_scale > $max) {
      return $max;
    }
    return $density_scale;
}

export function get_density_config($theme_or_config, $default= -2) {
    return $theme_or_config["density"]!=undefined? $theme_or_config["density"]: $default;
}