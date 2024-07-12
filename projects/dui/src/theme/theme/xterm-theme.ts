import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function xTermTheme(theme: Theme): Object {
    return {
        ".xterm .composition-view": {
            "background": matColor(theme.background,'background') +" !important",
            "color": matColor(theme.foreground,'text')
        },
        ".xterm .xterm-viewport": {
            "background-color":  matColor(theme.background,'background')+" !important",
        },
        "div > .handle-active":{
            "background-color":  matColor(theme.foreground,'icon')+" !important"
        },
        ".resize-handle":{
            "background-color": matColor(theme.background,'background')+" !important"
        }
    };
}