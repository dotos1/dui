import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function matBottomSheetTheme(theme: Theme): Object {
  const background: string = matColor(theme.background, 'dialog');
  const foregroundText: string = matColor(theme.foreground, 'text');
  return {
    ' .mat-bottom-sheet-container': {
      "background": background,
      "color": foregroundText
    }
  };
}
