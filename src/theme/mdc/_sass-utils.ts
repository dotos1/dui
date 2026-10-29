/**
 * @fileoverview Module `src/theme/mdc/_sass-utils.ts` providing sass utils definitions and implementation.
 * @zh 模块文件 `src/theme/mdc/_sass-utils.ts`，提供sass工具集相关的定义与实现。
 */

import { rgba} from "../mat-color";
/**
 * Executes `safe_color_change` to handle safe color change.
 * @zh 执行 `safe_color_change`，用于安全颜色变更。
 * @param $color - color parameter (`any`) / 颜色参数（`any`）
 * @param alpha - alpha parameter (`any`) / 透明度参数（`any`）
 */
export function safe_color_change($color, alpha) {
    // $args: meta.keywords($args);
    // @return if(meta.type-of($color) == 'color', color.change($color, $args...), $color);
    return rgba($color,alpha);
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
      $map['first']=$rest[0];
    }else{
      if(!$map[$first]) 
        $map['first']={};
      map_set($map['first'],$rest);
    }
  }