import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matFontSize, matFontWeight } from '../utils/index';

export function matSpeedDialTheme(theme: Theme): Object {
    const primaryDefault: string = matColor(theme.primary, 'default');
    const foregroundText: string = matColor(theme.primary, 'darker-contrast');


    let config= theme.typography;
    const type: string = config['type'];
    let px48: string = type === 'loose' ? '48px' : '42px';
    let px56: string = type === 'loose' ? '56px' : '49px';

    return {
        '.fab-toggle': {
            'color': foregroundText+" !important",
            'background': primaryDefault+" !important",

            "width": px48 + " !important",
            "height": px48 + " !important",
            "font-weight": matFontWeight(config, "headline"),
            "font-size": matFontSize(config, "headline"),
            "line-height": px48 + " !important",
        },
        '.fab-icon': {
            'color': foregroundText+" !important",
        },
        '.fab-item': {
            'color': foregroundText+" !important",
            'background': primaryDefault+" !important",
            "width": px48 + " !important",
            "height": px48 + " !important",
            "line-height": px48 + " !important",
        },
        '.fab-item-icon': {
            'color': foregroundText+" !important",
        },
        '.item.disabled .fab-item': {
            'color': matColor(theme.foreground, 'disabled-button')
        },

        ".fab-menu": {
            "width": px56 + " !important",
            "height": px56 + " !important"
          },
          ".item": {
            "width": px48 + " !important",
            "height": px48 + " !important",
          }
    };
}
