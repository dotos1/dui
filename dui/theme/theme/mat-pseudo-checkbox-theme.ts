import { Theme } from '../interfaces/theme';

import { matColor } from '../mat-color';
import { multiplyRule, subtractRule, divideRule
} from '../utils/index';

export function matPseudoCheckboxTheme(theme: Theme): Object {
    const type: string = theme.typography['type'];
    let px2: string = type === 'loose' ? '2px' : type === 'normal' ? '1.8px' : '1.6px';
    let px20: string = type === 'loose' ? '20px !important' : type === 'normal' ? '18px !important' : '16px !important';
    let px20a: string = type === 'loose' ? '20px' : type === 'normal' ? '18px' : '15px';

    let padding = multiplyRule(px2, 2);
    let checkmarkSize = subtractRule(px20a, multiplyRule(padding, 2));


    return {
        // '.mat-pseudo-checkbox': {
        //     color: matColor(theme.foreground, 'secondary-text'),
        //     '&::after': {
        //         color: matColor(theme.background, 'background')
        //     }
        // },
        // Default to the accent color. Note that the pseudo checkboxes are meant to inherit the
        // theme from their parent, rather than implementing their own theming, which is why we
        // don't attach to the `mat-*` classes.
        '.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-indeterminate, .mat-accent .mat-pseudo-checkbox-checked, .mat-accent .mat-pseudo-checkbox-indeterminate': {
            color: matColor(theme.accent)
        },
        '.mat-primary .mat-pseudo-checkbox-checked, .mat-primary .mat-pseudo-checkbox-indeterminate': {
            color: matColor(theme.primary)
        },
        '.mat-warn .mat-pseudo-checkbox-checked, .mat-warn .mat-pseudo-checkbox-indeterminate': {
            color: matColor(theme.warn)
        },
        '.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-indeterminate': {
            '&.mat-pseudo-checkbox-disabled': {
                background: theme.type=='light'?'#b0b0b0': '#686868'
            }
        },
        '.mat-pseudo-checkbox': {
            "width": px20,
            "height": px20,
        },
        '.mat-pseudo-checkbox-indeterminate::after': {
            'top': subtractRule(divideRule(subtractRule(px20a, px2), 2), px2) + '!important',
            'width': subtractRule(px20a, multiplyRule(px2, 2)) + '!important'
        },
        '.mat-pseudo-checkbox-checked::after': {
            'top': subtractRule(subtractRule(subtractRule(divideRule(px20a, 2), divideRule(checkmarkSize, 4)), divideRule(px20a, 10)), px2) + '!important',
            'left': subtractRule(padding, multiplyRule(px2, 1.5)) + '!important',
            'width': checkmarkSize + '!important',
            'height': divideRule(subtractRule(checkmarkSize, px2), 2) + '!important'
        }
    };
}
