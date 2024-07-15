import { Theme } from '../interfaces/theme';
import * as keys from '../mdc/keys';
import * as  tooltip from '../tokens/mdc/_plain-tooltip';
import { TypographyConfig } from '../interfaces';

function base(theme: Theme): Object {
    return{
        ...keys.declare_custom_properties(tooltip.get_unthemable_tokens(),tooltip.$custom_property_prefix),
    }
  }
  
  function color(theme: Theme): Object {
    return{
        ...keys.declare_custom_properties(tooltip.get_color_tokens(theme),tooltip.$custom_property_prefix),
    }
  }
  function density(theme: Theme): Object {
    return{
        ...keys.declare_custom_properties(tooltip.get_density_tokens(theme),tooltip.$custom_property_prefix),
    }
  }
  function typography(theme: TypographyConfig): Object {
    return{
        ...keys.declare_custom_properties(tooltip.get_typography_tokens(theme),tooltip.$custom_property_prefix),
    }
}
export function matTooltipTheme(theme: Theme): Object {
    return {
        '.mdc-tooltip': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
