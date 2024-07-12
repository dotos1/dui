import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import * as keys from '../mdc/keys';
import { resolve_elevation,create_token_values } from '../mdc/token-utils';
import * as  elevated from '../tokens/mdc/_elevated-card';
import * as  outlined from '../tokens/mdc/_outlined-card';
import * as  card from '../tokens/mat/_card';


function base(theme: Theme): Object {
    return{
        ...keys.declare_custom_properties(elevated.get_unthemable_tokens(),elevated.$custom_property_prefix),
        ...keys.declare_custom_properties(outlined.get_unthemable_tokens(),outlined.$custom_property_prefix),
        ...create_token_values(card.$prefix,card.get_unthemable_tokens())
    }
}

function color(theme: Theme): Object {
    let elevated_card_tokens= resolve_elevation(
        elevated.get_color_tokens(theme),
        "container-elevation",
        "container-shadow-color"
    );
    let outlined_card_tokens= resolve_elevation(
        outlined.get_color_tokens(theme),
        "container-elevation",
        "container-shadow-color"
    );
    let $mat_card_color_tokens= card.get_color_tokens(theme);
    return{
        ...keys.declare_custom_properties(elevated_card_tokens,elevated.$custom_property_prefix),
        ...keys.declare_custom_properties(outlined_card_tokens,outlined.$custom_property_prefix),
        ...create_token_values(card.$prefix,$mat_card_color_tokens)
    }
}

function density(theme: Theme): Object {
    return{
        ...keys.declare_custom_properties(elevated.get_density_tokens(theme),elevated.$custom_property_prefix),
        ...keys.declare_custom_properties(outlined.get_density_tokens(theme),outlined.$custom_property_prefix),
        ...create_token_values(card.$prefix, card.get_density_tokens(theme))
    }
}
function typography(theme: TypographyConfig): Object {
   
    return{
            ...keys.declare_custom_properties(elevated.get_typography_tokens(theme),elevated.$custom_property_prefix),
            ...keys.declare_custom_properties(outlined.get_typography_tokens(theme),outlined.$custom_property_prefix),
            ...create_token_values(card.$prefix, card.get_typography_tokens(theme))
    }
}
export function matCardTheme(theme: Theme): Object {
    return {
        '.mat-mdc-card' : {
                ...base(theme),
                ...color(theme),
                ...density(theme),
                ...typography(theme.typography)
        },
        ".mdc-card":{
             "color":"var( --mat-card-subtitle-text-color)"
        },
        ".mat-mdc-card-header":{
            "padding-top":"var( --mat-card-padding-offset) !important",
            "padding-bottom":"var( --mat-card-padding-offset) !important",
            "padding-left":"var( --mat-card-padding-offset) !important"
        },
        ".mat-mdc-card-header-text":{
            "width":"100%"
        }
    };
}

