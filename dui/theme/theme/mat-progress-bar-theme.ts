import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import * as keys from '../mdc/keys';

import * as  mdc_progress from '../tokens/mdc/_linear-progress';

function base(theme: Theme): Object {
    return{ 
        ...keys.declare_custom_properties(mdc_progress.get_unthemable_tokens(),mdc_progress.$custom_property_prefix),
    }
}
  
function color(theme: Theme): Object {
    return{
            ...keys.declare_custom_properties(mdc_progress.get_color_tokens(theme,"primary"),mdc_progress.$custom_property_prefix),
           " &.mat-accent": {
                ...keys.declare_custom_properties(mdc_progress.get_color_tokens(theme,"accent"),mdc_progress.$custom_property_prefix),
            },
            "&.mat-warn": {
                ...keys.declare_custom_properties(mdc_progress.get_color_tokens(theme,"warn"),mdc_progress.$custom_property_prefix),
              }
    }
}
  
function density(theme: Theme): Object {
    return{
    }
}
export function typography(config: TypographyConfig): Object {
    return {};
}
export function matProgressBarTheme(theme: Theme): Object {
    return {
        '.mat-mdc-progress-bar': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
