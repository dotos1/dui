import { TypographyConfig } from '../interfaces/typography-config';

export function matLineHeight(config: TypographyConfig, level: string): number | string {
    return config[level]['line-height'];
}
