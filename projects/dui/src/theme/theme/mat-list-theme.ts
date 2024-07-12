import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import * as keys from '../mdc/keys';
import { create_token_values } from '../mdc/token-utils';
import * as inspection from '../mdc/inspection';
import * as  mdc_checkbox from '../tokens/mdc/_checkbox';
import * as  mdc_radio from '../tokens/mdc/_radio';
import * as  mdc_list from '../tokens/mdc/_list';
import * as  mat_list from '../tokens/mat/_list';


function base(theme: Theme): Object {
    return{
          ...keys.declare_custom_properties(mdc_list.get_unthemable_tokens(),mdc_list.$custom_property_prefix),
          ...create_token_values(mat_list.$prefix,mat_list.get_unthemable_tokens()),
    }
  }
  
  function color(theme: Theme): Object {
    return{
          ...keys.declare_custom_properties(mdc_list.get_color_tokens(theme),mdc_list.$custom_property_prefix),
          ...create_token_values(mat_list.$prefix,mat_list.get_color_tokens(theme)),
    }
  }
  
  function density(theme: Theme): Object {
    let $density_scale= inspection.get_theme_density(theme);
    return{
        ...keys.declare_custom_properties(mdc_list.get_density_tokens(theme),mdc_list.$custom_property_prefix),
        ...create_token_values(mat_list.$prefix,mat_list.get_density_tokens(theme)),
        ".mdc-list-item__start,.mdc-list-item__end": {
            ...keys.declare_custom_properties(mdc_radio.get_density_tokens(theme),mdc_radio.$custom_property_prefix),
          },
          ".mat-mdc-list-item": {
            "&.mdc-list-item--with-leading-avatar, &.mdc-list-item--with-leading-checkbox,&.mdc-list-item--with-leading-icon": {
              "&.mdc-list-item--with-one-line": {
                height: {
                  '0': '56px',
                  '-1': '52px',
                  '-2': '48px',
                  '-3': '44px',
                  '-4': '40px',
                  '-5': '40px',
                }[$density_scale]
              },
      
              "&.mdc-list-item--with-two-lines": {
                height: {
                  '0': '72px',
                  '-1': '68px',
                  '-2': '64px',
                  '-3': '60px',
                  '-4': '56px',
                  '-5': '56px',
                }[$density_scale]
              }
            }
          }
    }
  }
  function typography(theme: TypographyConfig): Object {
    return{
            ...keys.declare_custom_properties(mdc_list.get_typography_tokens(theme),mdc_list.$custom_property_prefix),
            ...create_token_values(mat_list.$prefix, mat_list.get_typography_tokens(theme)),
            ".mdc-list-group__subheader":{
                "font": inspection.get_theme_typography(theme, "subtitle-1", "font"),
                "letter-spacing": inspection.get_theme_typography(theme,"subtitle-1", "letter-spacing")
            }
    }
}
export function matListTheme(theme: Theme): Object {
    return {
      ".mat-list .mdc-list-item__start,.mdc-list-item__end": {
        ...keys.declare_custom_properties(mdc_radio.get_color_tokens(theme,'primary'),mdc_radio.$custom_property_prefix),
      },
      " .mat-list .mat-accent": {
          ".mdc-list-item__start,.mdc-list-item__end": {
              ...keys.declare_custom_properties(mdc_radio.get_color_tokens(theme,'accent'),mdc_radio.$custom_property_prefix),
          }
      },
      ".mat-list .mat-warn": {
          ".mdc-list-item__start,.mdc-list-item__end": {
              ...keys.declare_custom_properties(mdc_radio.get_color_tokens(theme,'warn'),mdc_radio.$custom_property_prefix),
          }
      },
      ".mat-list .mat-mdc-list-option": {
              ...keys.declare_custom_properties(mdc_checkbox.get_color_tokens(theme,'primary'),mdc_checkbox.$custom_property_prefix),
      },
      ".mat-list .mat-mdc-list-option.mat-accent": {
          ...keys.declare_custom_properties(mdc_checkbox.get_color_tokens(theme,'accent'),mdc_checkbox.$custom_property_prefix),
      },
      ".mat-list .mat-mdc-list-option.mat-warn": {
              ...keys.declare_custom_properties(mdc_checkbox.get_color_tokens(theme,'warn'),mdc_checkbox.$custom_property_prefix),
      },
      ".mat-list .mat-mdc-list-base.mat-mdc-list-base":{
          // @include evolution-mixins.list-selected-ink-color(inspection.get-theme-color($theme, primary));
      },
      ".mat-list .mat-mdc-list-base .mdc-list-item--disabled": {
          ".mdc-list-item__start,.mdc-list-item__content,.mdc-list-item__end": {
            opacity: 1
          }
      },
      '.mat-mdc-list-item': {
        ...typography(theme.typography)
      },
        '.mdc-list': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
