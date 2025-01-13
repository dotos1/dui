import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function treeTheme(theme: Theme): Object {

    return {
        '.node-wrapper': {
            '-webkit-tap-highlight-color': matColor(theme.foreground, 'secondary-text'),
            'color': matColor(theme.foreground, 'secondary-text')
        },

        '.tree-node': {
            '-webkit-tap-highlight-color': matColor(theme.foreground, 'secondary-text'),
            'color': matColor(theme.foreground, 'secondary-text')
        },

        '.node-wrapper-active,.node-wrapper.node-wrapper-active:hover,.node-wrapper-node-wrapper-focused': {
            '-webkit-tap-highlight-color': matColor(theme.primary, 500),
            'color': matColor(theme.primary, 500),
            'background': matColor(theme.foreground, 'dividers')
        },
        '.node-wrapper-focused': {
            '-webkit-tap-highlight-color': matColor(theme.primary, 500),
            'color': matColor(theme.primary, 500),
            'background': matColor(theme.foreground, 'dividers')
        },
        '.node-drop-slot.is-dragging-over': {
            'background': matColor(theme.foreground, 'dividers')
        }
    };
}
