import { TypographyConfig } from '../interfaces/typography-config';

export function matFontSize(config: TypographyConfig, level: string): number | string {
    return config[level]['font-size'];
}
