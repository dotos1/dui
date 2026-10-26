/**
 * @fileoverview Module `src/theme/mdc/theme-utils.ts` providing theme utils definitions and implementation.
 * @zh 模块文件 `src/theme/mdc/theme-utils.ts`，提供主题工具集相关的定义与实现。
 */


import * as elevation from './elevation-theme';

/**
 * Executes `resolve_theme` to handle resolve theme.
 * @zh 执行 `resolve_theme`，用于解析主题。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $elevation_keys - elevation keys parameter (`any`) / 层级阴影键列表参数（`any`）
 */
export function resolve_theme($theme, $elevation_keys) {
    let $shadow_color= $theme["container-shadow-color"];
    $elevation_keys.forEach(($key)=> {
      let $elevation= $theme[$key];
      if($elevation != null) {
        $theme[$key]= {
            shadow: elevation._shadow($elevation, $shadow_color)
        };;
      }
    });
    return $theme;
  }
  /**
   * Executes `resolve_theme_typography` to handle resolve theme typography.
   * @zh 执行 `resolve_theme_typography`，用于解析主题排版。
   * @param $theme - theme parameter (`any`) / 主题参数（`any`）
   * @param $token_prefixes - token prefixes parameter (`any`) / 令牌前缀参数（`any`）
   */
  function resolve_theme_typography($theme,  $token_prefixes) {

    // @each $token-prefix in $token-prefixes {
    //   $typography-theme: meta.call(
    //     $resolver,
    //     $font: map.get($theme, '#{$token-prefix}-font'),
    //     $line-height: map.get($theme, '#{$token-prefix}-line-height'),
    //     $size: map.get($theme, '#{$token-prefix}-size'),
    //     $tracking: map.get($theme, '#{$token-prefix}-tracking'),
    //     $weight: map.get($theme, '#{$token-prefix}-weight')
    //   );
  
    //   $theme: map.merge(
    //     $theme,
    //     (
    //       '#{$token-prefix}-font': map.get($typography-theme, font),
    //       '#{$token-prefix}-line-height': map.get($typography-theme, line-height),
    //       '#{$token-prefix}-size': map.get($typography-theme, size),
    //       '#{$token-prefix}-tracking': map.get($typography-theme, tracking),
    //       '#{$token-prefix}-weight': map.get($typography-theme, weight),
    //     )
    //   );
    // }
  
    return $theme;
  }
  /**
   * Executes `fab_theme` to handle fab theme.
   * @zh 执行 `fab_theme`，用于fab主题。
   * @param $theme - theme parameter (`any`) / 主题参数（`any`）
   */
  export function fab_theme($theme){
    let $elevation_keys=[
      "container-elevation",
      "hover-container-elevation",
      "focus-container-elevation",
      "pressed-container-elevation",
      "disabled-container-elevation",
      "lowered-container-elevation",
      "lowered-focus-container-elevation",
      "lowered-hover-container-elevation",
      "lowered-pressed-container-elevation"
    ];
    return resolve_theme($theme, $elevation_keys);
  }
  /**
   * Executes `button_theme` to handle button theme.
   * @zh 执行 `button_theme`，用于按钮主题。
   * @param $theme - theme parameter (`any`) / 主题参数（`any`）
   */
  export function button_theme($theme){
    let $elevation_keys=[
      "container-elevation",
      "hover-container-elevation",
      "focus-container-elevation",
      "pressed-container-elevation",
      "disabled-container-elevation"
    ];
    return resolve_theme($theme, $elevation_keys);
  }
  /**
   * Executes `chip_theme` to handle chip theme.
   * @zh 执行 `chip_theme`，用于纸片标签主题。
   * @param $theme - theme parameter (`any`) / 主题参数（`any`）
   */
  export function chip_theme($theme){//TODO
    let $elevation_keys=[
      "container-elevation",
    ];
    return resolve_theme($theme, $elevation_keys);
  }
  /**
   * Executes `dialog_theme` to handle dialog theme.
   * @zh 执行 `dialog_theme`，用于对话框主题。
   * @param $theme - theme parameter (`any`) / 主题参数（`any`）
   */
  export function dialog_theme($theme){
    let $elevation_keys=[
      "container-elevation",
    ];
    return resolve_theme($theme, $elevation_keys);
  }
  /**
   * Executes `list_theme` to handle list theme.
   * @zh 执行 `list_theme`，用于列表主题。
   * @param $theme - theme parameter (`any`) / 主题参数（`any`）
   */
  export function list_theme($theme){//TODO
    let $elevation_keys=[
      "list-item-container-elevation",
    ];
    return resolve_theme($theme, $elevation_keys);
  }
  /**
   * Executes `menu_theme` to handle menu theme.
   * @zh 执行 `menu_theme`，用于菜单主题。
   * @param $theme - theme parameter (`any`) / 主题参数（`any`）
   */
  export function menu_theme($theme){
    let $elevation_keys=[
      "container-elevation",
    ];
    return resolve_theme($theme, $elevation_keys);
  }
  /**
   * Executes `snackbar_theme` to handle snackbar theme.
   * @zh 执行 `snackbar_theme`，用于snackbar主题。
   * @param $theme - theme parameter (`any`) / 主题参数（`any`）
   */
  export function snackbar_theme($theme){
    let $elevation_keys=[
      "container-elevation",
    ];
    return resolve_theme($theme, $elevation_keys);
  }
  /**
   * Executes `tab_theme` to handle tab theme.
   * @zh 执行 `tab_theme`，用于选项卡主题。
   * @param $theme - theme parameter (`any`) / 主题参数（`any`）
   */
  export function tab_theme($theme){
    let $elevation_keys=[
      "label-tex",
    ];
    return resolve_theme_typography($theme, $elevation_keys);
  }