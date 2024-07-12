import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function matControlPlaceholderColor(theme: Theme): string {
    return matColor(theme.foreground, 'secondary-text');
}
