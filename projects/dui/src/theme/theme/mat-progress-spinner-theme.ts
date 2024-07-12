import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import * as keys from '../mdc/keys';
import * as inspection from '../mdc/inspection';
import * as  mdc_progress from '../tokens/mdc/_circular-progress';

function base(theme: Theme): Object {
    return{ 
        ...keys.declare_custom_properties(mdc_progress.get_unthemable_tokens(),mdc_progress.$custom_property_prefix),
    }
}
  
function color(theme: Theme): Object {
    return{
            ...keys.declare_custom_properties(mdc_progress.get_color_tokens(theme),mdc_progress.$custom_property_prefix),
           ".mat-accent": {
                ...keys.declare_custom_properties({
                    "active-indicator-color": inspection.get_theme_color(theme, "accent")
                },mdc_progress.$custom_property_prefix),
            },
            ".mat-warn": {
                ...keys.declare_custom_properties({
                    "active-indicator-color": inspection.get_theme_color(theme, "warn")
                },mdc_progress.$custom_property_prefix),
            }
    }
}
  
function density(theme: Theme): Object {
    return{
    }
}
 function typography(config: TypographyConfig): Object {
    return {};
}
export function matProgressSpinnerTheme(theme: Theme): Object {
    return {
        '.mat-mdc-progress-spinner': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
