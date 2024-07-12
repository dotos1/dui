import { Theme } from '../interfaces/theme';
import { create_token_values } from '../mdc/token-utils';
import * as  mat_stepper from '../tokens/mat/_stepper';
import { TypographyConfig } from '../interfaces';
function base(theme: Theme): Object {
  return{ }
}

function color(theme: Theme): Object {
  return{
        ...create_token_values(mat_stepper.$prefix,mat_stepper.get_color_tokens(theme)),
        ".mat-step-header.mat-accent": {
            ...create_token_values(mat_stepper.$prefix,mat_stepper.private_get_color_palette_color_tokens(theme, "accent")),
        },
        ".mat-step-header.mat-warn": {
            ...create_token_values(mat_stepper.$prefix,mat_stepper.private_get_color_palette_color_tokens(theme, "warn")),
        }
    }
}
function density(theme: Theme): Object {
  return{
    ...create_token_values(mat_stepper.$prefix,mat_stepper.get_density_tokens(theme)),
  }
}
function typography(theme: TypographyConfig) {
  return{
    ...create_token_values(mat_stepper.$prefix, mat_stepper.get_typography_tokens(theme))
  }
}
export function matStepperTheme(theme: Theme): Object {
    return {
        'mat-stepper': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
