import { TypographyConfig } from '../interfaces';
import { Theme } from '../interfaces/theme';
import { create_token_values } from '../mdc/token-utils';
import * as mat_sidenav from '../tokens/mat/_sidenav';

function base(theme: Theme): Object {
    return{ 
        ...create_token_values(mat_sidenav.$prefix, mat_sidenav.get_unthemable_tokens()),
    }
}
  
function color(theme: Theme): Object {
    return{
        ...create_token_values(mat_sidenav.$prefix, mat_sidenav.get_color_tokens(theme)),
    }
}
  
function density(theme: Theme): Object {
    return{
    }
}
 function typography(config: TypographyConfig): Object {
    return {};
}
export function matSidenavTheme(theme: Theme): Object {
    return {
        '.mat-drawer-container': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        },
    };
}
