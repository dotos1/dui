import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function duiJsonFormatterTheme(theme: Theme): Object {
  const primary: string = matColor(theme.primary);
  const accent: string = matColor(theme.accent);
  const warn: string = matColor(theme.warn);

  return {
    '.dui-json-formatter-wrapper': {
      '.dui-key': {
        '&.dui-key-node': {
          '&:focus,&:hover': {
            'background-color': matColor(theme.background, 'hover')
          }
        }
      },
      '.key': {
        'color': primary
      },
      '.value': {
        '.string': {
          color: warn
        },
        '.number': {
          color: accent
        },
        '.boolean': {
          color: accent
        },
        '.null,.undefined': {
          color: matColor(theme.foreground, 'disabled-text'),
        },
        '.function': {
          color: primary
        },
        '.date': {
          color: matColor(theme.foreground, 'text')
        }
      }
    }
  }
}

