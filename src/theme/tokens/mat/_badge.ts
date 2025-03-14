
import * as inspection from '../../mdc/inspection';


export const $prefix=["mat", "badge"];

export function get_unthemable_tokens() {
    let $default_size= 22;
    let $small_size= $default_size-6;
    let $large_size= $default_size+6;
  
    return {
      "container-shape": "50%",
      "container-size": "unset",
      "small-size-container-size": "unset",
      "large-size-container-size": "unset",
  
      "legacy-container-size": $default_size+"px",
      "legacy-small-size-container-size": $small_size+"px",
      "legacy-large-size-container-size": $large_size+"px",
  
      "container-offset": ($default_size/-2)+"px 0",
      "small-size-container-offset": ($small_size/-2)+"px 0",
      "large-size-container-offset": ($large_size/-2)+"px 0",
  
      "container-overlap-offset": ($default_size/-2)+"px",
      "small-size-container-overlap-offset": ($small_size/-2)+"px",
      "large-size-container-overlap-offset": ($large_size/-2)+"px",
  
      "container-padding": "0px",
      "small-size-container-padding": "0px",
      "large-size-container-padding": "0px",
    };
}
export function private_get_color_palette_color_tokens($theme, $palette_name= "primary") {
  return {
    "background-color": inspection.get_theme_color($theme, $palette_name),
    "text-color": inspection.get_theme_color($theme, $palette_name, "default-contrast"),
  };
}

export function get_color_tokens($theme) {

  let $disabled_background= inspection.get_theme_color($theme, "foreground", "disabled-button");
  return {
  
    "disabled-state-background-color": $disabled_background,
    "disabled-state-text-color": inspection.get_theme_color($theme, "foreground", "disabled-text"),
  };
}


export function get_typography_tokens($theme) {
    let $base_size= 12;

    return {
      "text-font": inspection.get_theme_typography($theme, "body-2", "font-family"),
      "text-size": $base_size+"px",
      "text-weight": 600,
      "small-size-text-size": $base_size * 0.75+"px",
      "large-size-text-size": $base_size * 2+"px",
    };
}

export function get_density_tokens($theme) {
  return {};
}