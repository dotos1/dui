/**
 * @fileoverview Module `src/theme/mdc/_typography-getters.ts` providing typography getters definitions and implementation.
 * @zh 模块文件 `src/theme/mdc/_typography-getters.ts`，提供排版getters相关的定义与实现。
 */

/**
 * Executes `_mat_get_type_value` to handle mat get type value.
 * @zh 执行 `_mat_get_type_value`，用于Material获取类型值。
 * @param $config - config parameter (`any`) / 配置参数（`any`）
 * @param $level - level parameter (`any`) / 层级参数（`any`）
 * @param $name - name parameter (`any`) / 名称参数（`any`）
 */
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

/**
 * Executes `font_size` to handle font size.
 * @zh 执行 `font_size`，用于字体尺寸。
 * @param $config - config parameter (`any`) / 配置参数（`any`）
 * @param $level - level parameter (`any`) / 层级参数（`any`）
 */
export function font_size($config, $level) {
    return _mat_get_type_value($config, $level, "font-size");
}

/**
 * Executes `line_height` to handle line height.
 * @zh 执行 `line_height`，用于线段高度。
 * @param $config - config parameter (`any`) / 配置参数（`any`）
 * @param $level - level parameter (`any`) / 层级参数（`any`）
 */
export function line_height($config, $level) {
    return _mat_get_type_value($config, $level, "line-height");
}
/**
 * Executes `font_weight` to handle font weight.
 * @zh 执行 `font_weight`，用于字体权重/字重。
 * @param $config - config parameter (`any`) / 配置参数（`any`）
 * @param $level - level parameter (`any`) / 层级参数（`any`）
 */
export function font_weight($config, $level) {
    return _mat_get_type_value($config, $level, "font-weight");
}
/**
 * Executes `letter_spacing` to handle letter spacing.
 * @zh 执行 `letter_spacing`，用于letter间距。
 * @param $config - config parameter (`any`) / 配置参数（`any`）
 * @param $level - level parameter (`any`) / 层级参数（`any`）
 */
export function letter_spacing($config, $level) {
    return _mat_get_type_value($config, $level, "letter-spacing");
}
/**
 * Executes `font_family` to handle font family.
 * @zh 执行 `font_family`，用于字体family。
 * @param $config - config parameter (`any`) / 配置参数（`any`）
 * @param $level - level parameter (`any`) / 层级参数（`any`）
 */
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

/**
 * Executes `define_typography_level` to handle define typography level.
 * @zh 执行 `define_typography_level`，用于define排版层级。
 * @param $font_size - font size parameter (`any`) / 字体尺寸参数（`any`）
 * @param $line_height - line height parameter (`any`) / 线段高度参数（`any`）
 * @param $font_weight - font weight parameter (`any`) / 字体权重/字重参数（`any`）
 * @param $font_family - font family parameter (`any`) / 字体family参数（`any`）
 * @param $letter_spacing - letter spacing parameter (`any`) / letter间距参数（`any`）
 */
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
/**
 * Executes `private_typography_to_2018_config` to handle private typography to 2018 config.
 * @zh 执行 `private_typography_to_2018_config`，用于private排版转换为2018配置。
 * @param $config - config parameter (`any`) / 配置参数（`any`）
 * @param $force - force parameter (`any`) / force参数（`any`）
 */
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