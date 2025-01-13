import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function duiButtonGroupTheme(theme: Theme): Object {
  const primary: string = matColor(theme.primary);
  const accent: string = matColor(theme.accent);
  const warn: string = matColor(theme.warn);
  const background: string = matColor(theme.background);
  const foreground: string = matColor(theme.foreground);

  return {

  }
}
