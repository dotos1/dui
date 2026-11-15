/**
 * @fileoverview Official Angular Material 22 M2 runtime theme resolvers and 7.4.52 `mat*Theme` public exports.
 * Resolves build-time sentinel templates (`src/theme/m2-token-templates.ts`) against any runtime `Theme`
 * (`primary`, `accent`, `warn`, `light` | `dark` | `darkblue`, `loose` | `normal` | `compact`) with zero HCT.
 * @zh 基于构建期哨兵模板（`src/theme/m2-token-templates.ts`）的运行时 M2 主题解析器与 7.4.52 `mat*Theme` 公开导出。
 */

import { matRippleColorOpacity } from '../constants';
import { Palette, Theme, TypographyConfig } from '../interfaces';
import {
  M2_BASE_BLOCKS,
  M2_COLOR_TEMPLATES,
  M2_DENSITY_TEMPLATES,
  M2_TYPOGRAPHY_TEMPLATES,
  M2CssBlock,
  M2DensityKey,
  M2ThemeMode,
  M2TypographyKey,
} from '../m2-token-templates';
import { matColor, rgba } from '../mat-color';
import { matTypographyFontShorthand } from '../typography/mat-typography-font-shorthand';
import { matTypographyLevelToStyles } from '../typography/mat-typography-level-to-styles';
import {
  divideRule,
  matFontFamily,
  matFontSize,
  matFontWeight,
  matLineHeight,
  multiplyRule,
  roundRule,
  subtractRule,
} from '../utils';
import { TypographyMap } from '../typography-theme';

const SENTINEL_PLACEHOLDER_RE = /\{\{(primary|accent|warn)\.([A-Za-z0-9_-]+)(?:@([0-9.]+))?\}\}/g;

function normalizeHexOrRgba(palette: Palette, slot: string, alphaStr?: string): string {
  const dict: Readonly<Record<string, unknown>> = { ...palette };
  const raw: unknown = dict[slot];
  if (typeof raw !== 'string') {
    return 'rgba(0,0,0,1)';
  }
  if (alphaStr !== undefined) {
    const parsedAlpha = Number.parseFloat(alphaStr);
    return matColor(palette, slot, Number.isFinite(parsedAlpha) ? parsedAlpha : 1);
  }
  const trimmed = raw.trim();
  if (trimmed.startsWith('#')) {
    return trimmed;
  }
  return matColor(palette, slot);
}

/**
 * Resolves sentinel placeholders (`{{primary.default}}`, `{{accent.default@0.25}}`, etc.) in a CSS value.
 * @zh 将模板字符串中的哨兵占位符替换为运行时 `Theme` 调色板对应的真实颜色值。
 * @param templateValue - Sentinel template value (`string`) / 含哨兵占位符的 CSS 属性值（`string`）
 * @param theme - Runtime theme (`Theme`) / 运行时主题对象（`Theme`）
 * @returns Resolved CSS property value (`string`) / 解析后的 CSS 属性值（`string`）
 */
export function resolveM2TemplateValue(templateValue: string, theme: Theme): string {
  if (!templateValue.includes('{{')) {
    return templateValue;
  }
  return templateValue.replace(
    SENTINEL_PLACEHOLDER_RE,
    (_full: string, paletteName: string, slot: string, alphaStr?: string): string => {
      const palette: Palette =
        paletteName === 'accent'
          ? theme.accent
          : paletteName === 'warn'
            ? theme.warn
            : theme.primary;
      return normalizeHexOrRgba(palette, slot, alphaStr);
    }
  );
}

function normalizeThemeMode(type: string | undefined): M2ThemeMode {
  if (type === 'dark' || type === 'darkblue') {
    return type;
  }
  return 'light';
}

function normalizeDensityKey(density: number | undefined): M2DensityKey {
  if (density === 0) {
    return '0';
  }
  if (density === -1) {
    return '-1';
  }
  return '-2';
}

function normalizeTypographyKey(typography: TypographyConfig | undefined, density: number | undefined): M2TypographyKey {
  const t = typography?.type;
  if (t === 'loose' || t === 'normal' || t === 'compact') {
    return t;
  }
  if (density === 0) {
    return 'loose';
  }
  if (density === -1) {
    return 'normal';
  }
  return 'compact';
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Deep-merges multiple JSS/CSS style maps so shared selectors (`html`, `.mat-mdc-card`, etc.) preserve all declarations.
 * @zh 深度合并多个主题样式规则映射，确保共用选择器（如 `html`）的声明互不覆盖丢失。
 * @param maps - Array of style maps (`readonly unknown[]`) / 待合并的样式映射列表
 * @returns Merged style map (`Record<string, unknown>`) / 合并后的样式规则表
 */
export function mergeThemeStyleMaps(...maps: ReadonlyArray<unknown>): Record<string, unknown> {
  const target: Record<string, unknown> = {};
  for (const mapItem of maps) {
    if (!isPlainRecord(mapItem)) {
      continue;
    }
    for (const [key, val] of Object.entries(mapItem)) {
      const existing = target[key];
      if (isPlainRecord(existing) && isPlainRecord(val)) {
        target[key] = mergeThemeStyleMaps(existing, val);
      } else {
        target[key] = val;
      }
    }
  }
  return target;
}

function blocksToStyleMap(
  blocks: readonly M2CssBlock[],
  theme: Theme,
  tokenPrefixFilter?: readonly string[]
): Record<string, unknown> {
  const out: Record<string, Record<string, string>> = {};
  for (const block of blocks) {
    let bucket = out[block.selector];
    for (const [prop, rawVal] of Object.entries(block.declarations)) {
      if (
        tokenPrefixFilter &&
        !tokenPrefixFilter.some((prefix) => prop.startsWith(prefix) || block.selector.includes(prefix))
      ) {
        continue;
      }
      if (!bucket) {
        bucket = {};
        out[block.selector] = bucket;
      }
      bucket[prop] = resolveM2TemplateValue(rawVal, theme);
    }
  }
  return out;
}

/**
 * Resolves the complete Material 22 M2 token stylesheet map (base + color + density + typography) for a runtime `Theme`.
 * @zh 为指定运行时 `Theme` 解析完整的 Material 22 M2 令牌样式映射（基础 + 色彩 + 密度 + 排版）。
 * @param theme - Runtime theme (`Theme`) / 运行时主题对象（`Theme`）
 * @param tokenPrefixFilter - Optional token/selector prefixes / 可选的组件令牌前缀过滤列表
 * @returns Style map (`Record<string, unknown>`) / 解析后的样式规则表
 */
export function resolveM2BlocksForTheme(
  theme: Theme,
  tokenPrefixFilter?: readonly string[]
): Record<string, unknown> {
  const mode = normalizeThemeMode(theme.type);
  const densityKey = normalizeDensityKey(theme.density);
  const typographyKey = normalizeTypographyKey(theme.typography, theme.density);

  return mergeThemeStyleMaps(
    blocksToStyleMap(M2_BASE_BLOCKS, theme, tokenPrefixFilter),
    blocksToStyleMap(M2_COLOR_TEMPLATES[mode], theme, tokenPrefixFilter),
    blocksToStyleMap(M2_DENSITY_TEMPLATES[densityKey], theme, tokenPrefixFilter),
    blocksToStyleMap(M2_TYPOGRAPHY_TEMPLATES[typographyKey], theme, tokenPrefixFilter)
  );
}

/**
 * Executes `matControlPlaceholderColor` to compute placeholder text color for form controls.
 * @zh 执行 `matControlPlaceholderColor`，计算表单控件占位符文本颜色。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Placeholder color string (`string`) / 占位符颜色字符串
 */
export function matControlPlaceholderColor(theme: Theme): string {
  return matColor(theme.foreground, 'secondary-text');
}

/**
 * Executes `matRippleTheme` to generate `.mat-ripple-element` color rules.
 * @zh 执行 `matRippleTheme`，生成水波纹元素颜色规则。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matRippleTheme(theme: Theme): Record<string, unknown> {
  return mergeThemeStyleMaps(resolveM2BlocksForTheme(theme, ['--mat-ripple-']), {
    '.mat-ripple-element': {
      'background-color': rgba(theme.foreground.base, matRippleColorOpacity),
    },
  });
}

/**
 * Executes `matPseudoCheckboxTheme` to generate M2 pseudo-checkbox colors and density sizes.
 * @zh 执行 `matPseudoCheckboxTheme`，生成 M2 伪复选框颜色与三档密度尺寸规则。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matPseudoCheckboxTheme(theme: Theme): Record<string, unknown> {
  const typoKey = normalizeTypographyKey(theme.typography, theme.density);
  const px2 = typoKey === 'loose' ? '2px' : typoKey === 'normal' ? '1.8px' : '1.6px';
  const px20 = typoKey === 'loose' ? '20px !important' : typoKey === 'normal' ? '18px !important' : '16px !important';
  const px20a = typoKey === 'loose' ? '20px' : typoKey === 'normal' ? '18px' : '15px';
  const padding = multiplyRule(px2, 2);
  const checkmarkSize = subtractRule(px20a, multiplyRule(padding, 2));

  return mergeThemeStyleMaps(
    resolveM2BlocksForTheme(theme, ['--mat-full-pseudo-checkbox-', '--mat-minimal-pseudo-checkbox-']),
    {
      '.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-indeterminate, .mat-accent .mat-pseudo-checkbox-checked, .mat-accent .mat-pseudo-checkbox-indeterminate':
        {
          color: matColor(theme.accent),
        },
      '.mat-primary .mat-pseudo-checkbox-checked, .mat-primary .mat-pseudo-checkbox-indeterminate': {
        color: matColor(theme.primary),
      },
      '.mat-warn .mat-pseudo-checkbox-checked, .mat-warn .mat-pseudo-checkbox-indeterminate': {
        color: matColor(theme.warn),
      },
      '.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-indeterminate': {
        '&.mat-pseudo-checkbox-disabled': {
          background: theme.type === 'light' ? '#b0b0b0' : '#686868',
        },
      },
      '.mat-pseudo-checkbox': {
        width: px20,
        height: px20,
      },
      '.mat-pseudo-checkbox-indeterminate::after': {
        top: subtractRule(divideRule(subtractRule(px20a, px2), 2), px2) + '!important',
        width: subtractRule(px20a, multiplyRule(px2, 2)) + '!important',
      },
      '.mat-pseudo-checkbox-checked::after': {
        top:
          subtractRule(
            subtractRule(subtractRule(divideRule(px20a, 2), divideRule(checkmarkSize, 4)), divideRule(px20a, 10)),
            px2
          ) + '!important',
        left: subtractRule(padding, multiplyRule(px2, 1.5)) + '!important',
        width: checkmarkSize + '!important',
        height: divideRule(subtractRule(checkmarkSize, px2), 2) + '!important',
      },
    }
  );
}

/**
 * Executes `matOptionTheme` to generate M2 option tokens and `min-height` density rules.
 * @zh 执行 `matOptionTheme`，生成 M2 下拉选项令牌与三档密度高度规则。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matOptionTheme(theme: Theme): Record<string, unknown> {
  const typoKey = normalizeTypographyKey(theme.typography, theme.density);
  const optionMinHeight = typoKey === 'loose' ? '48px !important' : typoKey === 'normal' ? '44px !important' : '40px !important';
  return mergeThemeStyleMaps(resolveM2BlocksForTheme(theme, ['--mat-option-']), {
    '.mat-mdc-option': {
      'min-height': optionMinHeight,
    },
  });
}

/**
 * Executes `matOptgroupTheme` to generate M2 option-group tokens.
 * @zh 执行 `matOptgroupTheme`，生成 M2 选项分组令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matOptgroupTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-optgroup-']);
}

/**
 * Executes `matCoreTheme` to generate M2 core tokens, `.mat-app-background`, and `px`-based M2 typography classes.
 * @zh 执行 `matCoreTheme`，生成 M2 核心令牌、`.mat-app-background` 与基于 `px` 的 M2 字阶类规则。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matCoreTheme(theme: Theme): Record<string, unknown> {
  const typoKey = normalizeTypographyKey(theme.typography, theme.density);
  const config: TypographyConfig = theme.typography ?? TypographyMap[typoKey];
  const px12 = typoKey === 'loose' ? '12px' : typoKey === 'normal' ? '10px' : '9px';
  const px56 = typoKey === 'loose' ? '56px' : typoKey === 'normal' ? '49px' : '42px';
  const px64 = typoKey === 'loose' ? '64px' : typoKey === 'normal' ? '56px' : '48px';

  return mergeThemeStyleMaps(
    resolveM2BlocksForTheme(theme, ['--mat-app-', '--dui-']),
    matRippleTheme(theme),
    matOptionTheme(theme),
    matOptgroupTheme(theme),
    matPseudoCheckboxTheme(theme),
    {
      '.mat-app-background': {
        'background-color': matColor(theme.background, 'background'),
        color: matColor(theme.foreground, 'text'),
      },
      '.mat-theme-loaded-marker': {
        display: 'none',
      },
      '.mat-h1, .mat-headline, .mat-typography h1': {
        ...(matTypographyLevelToStyles(config, 'headline') as Record<string, unknown>),
        margin: '0 0 ' + px12,
      },
      '.mat-h2, .mat-typography h2': {
        ...(matTypographyLevelToStyles(config, 'title') as Record<string, unknown>),
        margin: '0 0 ' + px12,
      },
      '.mat-title': {
        ...(matTypographyLevelToStyles(config, 'subheading-2') as Record<string, unknown>),
        margin: '0 0 ' + px12,
      },
      '.mat-h3, .mat-subheading-2, .mat-typography h3': {
        ...(matTypographyLevelToStyles(config, 'subheading-2') as Record<string, unknown>),
        margin: '0 0 ' + px12,
      },
      '.mat-h4, .mat-subheading-1, .mat-typography h4': {
        ...(matTypographyLevelToStyles(config, 'subheading-1') as Record<string, unknown>),
        margin: '0 0 ' + px12,
      },
      '.mat-h5, .mat-typography h5': {
        ...(matTypographyFontShorthand(
          multiplyRule(matFontSize(config, 'body-1'), 0.83),
          matFontWeight(config, 'body-1'),
          matLineHeight(config, 'body-1'),
          matFontFamily(config, 'body-1')
        ) as Record<string, unknown>),
        margin: '0 0 ' + px12,
      },
      '.mat-h6, .mat-typography h6': {
        ...(matTypographyFontShorthand(
          multiplyRule(matFontSize(config, 'body-1'), 0.67),
          matFontWeight(config, 'body-1'),
          matLineHeight(config, 'body-1'),
          matFontFamily(config, 'body-1')
        ) as Record<string, unknown>),
        margin: '0 0 ' + px12,
      },
      '.mat-body-strong, .mat-body-2': matTypographyLevelToStyles(config, 'body-2'),
      '.mat-body, .mat-body-1, .mat-typography': matTypographyLevelToStyles(config, 'body-1'),
      '.mat-body p, .mat-body-1 p, .mat-typography p': {
        margin: '0 0 ' + px12,
      },
      '.mat-small, .mat-caption': matTypographyLevelToStyles(config, 'caption'),
      '.mat-display-4, .mat-typography .mat-display-4': {
        ...(matTypographyLevelToStyles(config, 'display-4') as Record<string, unknown>),
        margin: '0 0 ' + px56,
        'letter-spacing': '-0.05em',
      },
      '.mat-display-3, .mat-typography .mat-display-3': {
        ...(matTypographyLevelToStyles(config, 'display-3') as Record<string, unknown>),
        margin: '0 0 ' + px64,
        'letter-spacing': '-0.02em',
      },
      '.mat-display-2, .mat-typography .mat-display-2': {
        ...(matTypographyLevelToStyles(config, 'display-2') as Record<string, unknown>),
        margin: '0 0 ' + px64,
        'letter-spacing': '-0.005em',
      },
      '.mat-display-1, .mat-typography .mat-display-1': {
        ...(matTypographyLevelToStyles(config, 'display-1') as Record<string, unknown>),
        margin: '0 0 ' + px64,
      },
    }
  );
}

/**
 * Executes `matAutocompleteTheme` to generate M2 autocomplete tokens.
 * @zh 执行 `matAutocompleteTheme`，生成自动补全组件 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matAutocompleteTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-autocomplete-']);
}

/**
 * Executes `matBadgeTheme` to generate M2 badge tokens.
 * @zh 执行 `matBadgeTheme`，生成徽章组件 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matBadgeTheme(theme: Theme): Record<string, unknown> {
  return mergeThemeStyleMaps(resolveM2BlocksForTheme(theme, ['--mat-badge-']), {
    '.mat-badge-content': {
      'min-width': '0px !important',
      'min-height': '0px !important',
    },
  });
}

/**
 * Executes `matButtonTheme` to generate M2 button tokens and min-height rules.
 * @zh 执行 `matButtonTheme`，生成按钮组件 M2 令牌与高度规则。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matButtonTheme(theme: Theme): Record<string, unknown> {
  return mergeThemeStyleMaps(resolveM2BlocksForTheme(theme, ['--mat-button-']), {
    '.mat-mdc-button': {
      'min-height': 'var(--mat-button-text-container-height)',
    },
    '.mat-mdc-unelevated-button': {
      'min-height': 'var(--mat-button-filled-container-height)',
    },
    '.mat-mdc-outlined-button': {
      'min-height': 'var(--mat-button-outlined-container-height)',
    },
  });
}

/**
 * Executes `matFabTheme` to generate M2 FAB button tokens, sizing, and disabled elevation rules.
 * @zh 执行 `matFabTheme`，生成悬浮操作按钮 M2 令牌、尺寸与禁用态阴影覆盖规则。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matFabTheme(theme: Theme): Record<string, unknown> {
  return mergeThemeStyleMaps(resolveM2BlocksForTheme(theme, ['--mat-fab-']), {
    '.mat-mdc-fab': {
      width: 'var(--mat-fab-extended-container-height) !important',
      height: 'var(--mat-fab-extended-container-height) !important',
    },
    '.mat-mdc-fab.mat-mdc-button-disabled, .mat-mdc-mini-fab.mat-mdc-button-disabled': {
      'box-shadow': 'var(--mat-fab-container-elevation-shadow) !important',
    },
  });
}

/**
 * Executes `matIconButtonTheme` to generate M2 icon-button tokens, density sizing, and disabled icon color rules.
 * @zh 执行 `matIconButtonTheme`，生成图标按钮 M2 令牌、密度尺寸与禁用态图标颜色覆盖规则。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matIconButtonTheme(theme: Theme): Record<string, unknown> {
  const typoKey = normalizeTypographyKey(theme.typography, theme.density);
  const stateLayerSize = typoKey === 'loose' ? 48 : typoKey === 'normal' ? 44 : 40;
  return mergeThemeStyleMaps(resolveM2BlocksForTheme(theme, ['--mat-icon-button-']), {
    '.mat-mdc-icon-button.mat-mdc-button-base': {
      width: 'var(--mat-icon-button-state-layer-size)',
      height: 'var(--mat-icon-button-state-layer-size)',
      padding: `${(stateLayerSize - 24) / 2}px`,
    },
    '.mat-mdc-icon-button.mat-mdc-button-disabled .mat-icon': {
      color: 'var(--mat-icon-button-disabled-icon-color) !important',
    },
  });
}

/**
 * Executes `matButtonToggleTheme` to generate M2 button-toggle tokens.
 * @zh 执行 `matButtonToggleTheme`，生成按钮切换组 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matButtonToggleTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-button-toggle-', '--mat-standard-button-toggle-', '--mat-legacy-button-toggle-']);
}

/**
 * Executes `matCardTheme` to generate M2 card tokens and S-5 header layout rules.
 * @zh 执行 `matCardTheme`，生成卡片 M2 令牌与 S-5 头部内边距规则。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matCardTheme(theme: Theme): Record<string, unknown> {
  const typoKey = normalizeTypographyKey(theme.typography, theme.density);
  const padOffset = typoKey === 'loose' ? '8px !important' : typoKey === 'normal' ? '7px !important' : '6px !important';
  return mergeThemeStyleMaps(resolveM2BlocksForTheme(theme, ['--mat-card-']), {
    '.mdc-card': {
      color: 'var(--mat-card-subtitle-text-color)',
    },
    '.mat-mdc-card-header': {
      'padding-top': padOffset,
      'padding-bottom': padOffset,
      'padding-left': padOffset,
    },
    '.mat-mdc-card-header-text': {
      width: '100%',
    },
  });
}

/**
 * Executes `matCheckboxTheme` to generate M2 checkbox tokens.
 * @zh 执行 `matCheckboxTheme`，生成复选框 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matCheckboxTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-checkbox-']);
}

/**
 * Executes `matChipsTheme` to generate M2 chip tokens.
 * @zh 执行 `matChipsTheme`，生成纸片组件 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matChipsTheme(theme: Theme): Record<string, unknown> {
  return mergeThemeStyleMaps(resolveM2BlocksForTheme(theme, ['--mat-chip-']), {
    '.mat-mdc-chip-set .mat-mdc-chip': {
      'margin-top': '4px !important',
      'margin-bottom': '4px !important',
    },
  });
}

/**
 * Executes `matTableTheme` to generate M2 table tokens.
 * @zh 执行 `matTableTheme`，生成表格组件 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matTableTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-table-']);
}

/**
 * Executes `matDatepickerTheme` to generate M2 datepicker tokens.
 * @zh 执行 `matDatepickerTheme`，生成日期选择器 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matDatepickerTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-datepicker-']);
}

/**
 * Executes `matDialogTheme` to generate M2 dialog tokens and container elevation shadow.
 * @zh 执行 `matDialogTheme`，生成对话框 M2 令牌与容器阴影规则。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matDialogTheme(theme: Theme): Record<string, unknown> {
  return mergeThemeStyleMaps(resolveM2BlocksForTheme(theme, ['--mat-dialog-']), {
    '.mat-mdc-dialog-container': {
      'box-shadow': 'var(--mat-dialog-container-elevation-shadow)',
    },
  });
}

/**
 * Executes `matDividerTheme` to generate M2 divider tokens.
 * @zh 执行 `matDividerTheme`，生成分割线 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matDividerTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-divider-']);
}

/**
 * Executes `matExpansionPanelTheme` to generate M2 expansion-panel tokens.
 * @zh 执行 `matExpansionPanelTheme`，生成折叠面板 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matExpansionPanelTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-expansion-']);
}

/**
 * Executes `matFormFieldTheme` to generate M2 form-field tokens and S-5 label/input offset rules.
 * @zh 执行 `matFormFieldTheme`，生成表单域 M2 令牌与标签/输入偏移规则。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matFormFieldTheme(theme: Theme): Record<string, unknown> {
  return mergeThemeStyleMaps(resolveM2BlocksForTheme(theme, ['--mat-form-field-']), {
    '.mat-mdc-text-field-wrapper': {
      '--mat-mdc-form-field-label-offset-x': '-8px',
    },
  });
}

/**
 * Executes `matGridListTheme` to generate M2 grid-list tokens.
 * @zh 执行 `matGridListTheme`，生成网格列表 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matGridListTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-grid-list-']);
}

/**
 * Executes `matIconTheme` to generate M2 icon tokens and SVG stroke S-5 rules.
 * @zh 执行 `matIconTheme`，生成图标 M2 令牌与 SVG 描边同步规则。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matIconTheme(theme: Theme): Record<string, unknown> {
  return mergeThemeStyleMaps(resolveM2BlocksForTheme(theme, ['--mat-icon-']), {
    '.mat-icon': {
      color: 'var(--mat-icon-color)',
      'flex-shrink': '1 !important',
      'min-height': '0px !important',
      svg: {
        stroke: 'var(--mat-icon-color) !important',
      },
    },
    '.mat-icon svg': {
      stroke: 'var(--mat-icon-color) !important',
    },
  });
}

/**
 * Executes `matInputTheme` to generate M2 input element color, caret, and placeholder rules.
 * @zh 执行 `matInputTheme`，生成输入框文本颜色、光标颜色与占位符规则。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matInputTheme(theme: Theme): Record<string, unknown> {
  const typoKey = normalizeTypographyKey(theme.typography, theme.density);
  const config: TypographyConfig = theme.typography ?? TypographyMap[typoKey];
  const rawLineHeight = matLineHeight(config, 'input');
  const lineHeightNum = typeof rawLineHeight === 'number' ? rawLineHeight : Number.parseFloat(String(rawLineHeight));
  const lineSpacing = -( (Number.isFinite(lineHeightNum) ? lineHeightNum : 1) - 1 ) / 2;
  const placeholderRule = {
    color: matControlPlaceholderColor(theme),
  };

  return {
    '.mat-mdc-input-element:disabled': {
      color: 'var(--mat-form-field-filled-disabled-input-text-color)',
    },
    'input.mat-mdc-input-element': {
      color: matColor(theme.foreground, 'text'),
      'margin-top': `${roundRule(lineSpacing)}em !important`,
    },
    '.mat-mdc-input-element': {
      'caret-color': matColor(theme.primary),
      '&::placeholder': placeholderRule,
      '&::-webkit-input-placeholder': placeholderRule,
    },
    '.mat-accent .mat-mdc-input-element': {
      'caret-color': matColor(theme.accent),
    },
    '.mat-warn .mat-mdc-input-element, .mat-mdc-form-field-invalid .mat-mdc-input-element': {
      'caret-color': matColor(theme.warn),
    },
  };
}

/**
 * Executes `matListTheme` to generate M2 list tokens and S-5 disabled-item opacity rules.
 * @zh 执行 `matListTheme`，生成列表组件 M2 令牌与禁用项不透明度规则。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matListTheme(theme: Theme): Record<string, unknown> {
  return mergeThemeStyleMaps(resolveM2BlocksForTheme(theme, ['--mat-list-', '.mdc-list-item']), {
    '.mat-list .mat-mdc-list-base .mdc-list-item--disabled': {
      '.mdc-list-item__start, .mdc-list-item__content, .mdc-list-item__end': {
        opacity: 1,
      },
    },
  });
}

/**
 * Executes `matMenuTheme` to generate M2 menu tokens and S-5 item min-height/icon rules.
 * @zh 执行 `matMenuTheme`，生成菜单组件 M2 令牌与菜单项高度及图标颜色规则。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matMenuTheme(theme: Theme): Record<string, unknown> {
  const typoKey = normalizeTypographyKey(theme.typography, theme.density);
  const menuMinHeight = typoKey === 'loose' ? '44px !important' : typoKey === 'normal' ? '40px !important' : '36px !important';
  return mergeThemeStyleMaps(resolveM2BlocksForTheme(theme, ['--mat-menu-']), {
    '.mat-mdc-menu-panel': {
      'animation-name': 'none !important',
      'animation-timing-function': 'ease !important',
      'transform-origin': 'top left !important',
    },
    '.mat-mdc-menu-item': {
      'min-height': menuMinHeight,
    },
    '.mat-mdc-menu-item .mat-icon-no-color': {
      color: 'var(--mat-icon-color) !important',
    },
  });
}

/**
 * Executes `matSortTheme` to generate M2 sort-header tokens.
 * @zh 执行 `matSortTheme`，生成排序表头 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matSortTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-sort-']);
}

/**
 * Executes `matPaginatorTheme` to generate M2 paginator tokens.
 * @zh 执行 `matPaginatorTheme`，生成分页器 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matPaginatorTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-paginator-']);
}

/**
 * Executes `matProgressBarTheme` to generate M2 progress-bar tokens.
 * @zh 执行 `matProgressBarTheme`，生成进度条 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matProgressBarTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-progress-bar-']);
}

/**
 * Executes `matProgressSpinnerTheme` to generate M2 progress-spinner tokens.
 * @zh 执行 `matProgressSpinnerTheme`，生成环形进度指示器 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matProgressSpinnerTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-progress-spinner-']);
}

/**
 * Executes `matRadioTheme` to generate M2 radio-button tokens.
 * @zh 执行 `matRadioTheme`，生成单选按钮 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matRadioTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-radio-']);
}

/**
 * Executes `matSelectTheme` to generate M2 select tokens.
 * @zh 执行 `matSelectTheme`，生成下拉选择组件 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matSelectTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-select-']);
}

/**
 * Executes `matSidenavTheme` to generate M2 sidenav/drawer tokens.
 * @zh 执行 `matSidenavTheme`，生成侧边抽屉容器 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matSidenavTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-sidenav-']);
}

/**
 * Executes `matSlideToggleTheme` to generate M2 slide-toggle tokens.
 * @zh 执行 `matSlideToggleTheme`，生成滑块开关 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matSlideToggleTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-slide-toggle-']);
}

/**
 * Executes `matSliderTheme` to generate M2 slider tokens.
 * @zh 执行 `matSliderTheme`，生成滑动条 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matSliderTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-slider-']);
}

/**
 * Executes `matStepperTheme` to generate M2 stepper tokens.
 * @zh 执行 `matStepperTheme`，生成步进器 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matStepperTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-stepper-']);
}

/**
 * Executes `matTabsTheme` to generate M2 tabs tokens.
 * @zh 执行 `matTabsTheme`，生成标签页 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matTabsTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-tab-']);
}

/**
 * Executes `matToolbarTheme` to generate M2 toolbar tokens.
 * @zh 执行 `matToolbarTheme`，生成工具栏 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matToolbarTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-toolbar-']);
}

/**
 * Executes `matTooltipTheme` to generate M2 tooltip tokens.
 * @zh 执行 `matTooltipTheme`，生成文字提示 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matTooltipTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-tooltip-']);
}

/**
 * Executes `matSnackBarTheme` to generate M2 snack-bar tokens.
 * @zh 执行 `matSnackBarTheme`，生成消息条 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matSnackBarTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-snack-bar-']);
}

/**
 * Executes `matTreeTheme` to generate M2 tree tokens.
 * @zh 执行 `matTreeTheme`，生成树形控件 M2 令牌。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Style map (`Record<string, unknown>`) / 样式规则表
 */
export function matTreeTheme(theme: Theme): Record<string, unknown> {
  return resolveM2BlocksForTheme(theme, ['--mat-tree-']);
}
