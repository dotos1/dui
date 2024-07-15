import { TypographyConfig } from '../interfaces/typography-config';

export function matFontWeight(config: TypographyConfig, level: string): number | string {
    return config[level]['font-weight'];
}
