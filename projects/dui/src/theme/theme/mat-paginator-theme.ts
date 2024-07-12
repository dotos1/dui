import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as  mat_paginator from '../tokens/mat/_paginator';
function base(theme: Theme): Object {
    return{ }
}
  
function color(theme: Theme): Object {
    return{
        ...create_token_values(mat_paginator.$prefix,mat_paginator.get_color_tokens(theme)),
    }
}
  
function density(theme: Theme): Object {
    return{
        ...create_token_values(mat_paginator.$prefix,mat_paginator.get_density_tokens(theme)),
    }
}
function typography(theme: TypographyConfig) {
    return{
        ...create_token_values(mat_paginator.$prefix, mat_paginator.get_typography_tokens(theme))
    }
}
export function matPaginatorTheme(theme: Theme): Object {
    return {
        '.mat-mdc-paginator': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
