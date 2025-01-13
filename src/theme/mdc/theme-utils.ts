
import * as elevation from './elevation-theme';

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
  export function chip_theme($theme){//TODO
    let $elevation_keys=[
      "container-elevation",
    ];
    return resolve_theme($theme, $elevation_keys);
  }
  export function dialog_theme($theme){
    let $elevation_keys=[
      "container-elevation",
    ];
    return resolve_theme($theme, $elevation_keys);
  }
  export function list_theme($theme){//TODO
    let $elevation_keys=[
      "list-item-container-elevation",
    ];
    return resolve_theme($theme, $elevation_keys);
  }
  export function menu_theme($theme){
    let $elevation_keys=[
      "container-elevation",
    ];
    return resolve_theme($theme, $elevation_keys);
  }
  export function snackbar_theme($theme){
    let $elevation_keys=[
      "container-elevation",
    ];
    return resolve_theme($theme, $elevation_keys);
  }
  export function tab_theme($theme){
    let $elevation_keys=[
      "label-tex",
    ];
    return resolve_theme_typography($theme, $elevation_keys);
  }