
import { Theme } from '@dotos/dui/theme';

export function dotosSearchBoxTheme(theme: Theme): Object {
  const typography=theme. typography;
  const type: string = typography['type'];
  let px16: string = type === 'loose' ? '16px' : type === 'normal' ? '14px' : '12px';

  return {
    " .mat-mdc-form-field": {
      "--mat-form-field-container-vertical-padding": px16 +" !important"
    }
  };
}

