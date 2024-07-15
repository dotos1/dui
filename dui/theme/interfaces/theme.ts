import { Palette } from './palette';
import { Foreground } from './foreground';
import { Background } from './background';
import { TypographyConfig } from './typography-config';

export interface Theme {
    readonly primary: Palette;
    readonly accent: Palette;
    readonly warn: Palette;
    readonly type: 'light'|'dark'|'darkblue';
    readonly foreground: Foreground;
    readonly background: Background;
    readonly density: number;
    readonly typography:TypographyConfig
}
