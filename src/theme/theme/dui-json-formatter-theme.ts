/**
 * @fileoverview Module `src/theme/theme/dui-json-formatter-theme.ts` providing dui json formatter theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-json-formatter-theme.ts`，提供DUIJSON格式化器主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `duiJsonFormatterTheme` to handle dui json formatter theme.
 * @zh 执行 `duiJsonFormatterTheme`，用于DUIJSON格式化器主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
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

