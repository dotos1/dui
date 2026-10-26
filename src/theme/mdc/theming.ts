/**
 * @fileoverview Module `src/theme/mdc/theming.ts` providing theming definitions and implementation.
 * @zh 模块文件 `src/theme/mdc/theming.ts`，提供主题定制相关的定义与实现。
 */

/**
 * Executes `clamp_density` to handle clamp density.
 * @zh 执行 `clamp_density`，用于限制范围密度。
 * @param $density_scale - density scale parameter (`any`) / 密度缩放参数（`any`）
 * @param $min - min parameter (`any`) / 最小值参数（`any`）
 * @param $max - max parameter (`any`) / 最大值参数（`any`）
 */
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

/**
 * Executes `get_density_config` to handle get density config.
 * @zh 执行 `get_density_config`，用于获取密度配置。
 * @param $theme_or_config - theme or config parameter (`any`) / 主题or配置参数（`any`）
 * @param $default - default parameter (`any`) / 默认参数（`any`）
 */
export function get_density_config($theme_or_config, $default= -2) {
    return $theme_or_config["density"]!=undefined? $theme_or_config["density"]: $default;
}