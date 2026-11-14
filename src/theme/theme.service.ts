/**
 * @fileoverview Module `src/theme/theme.service.ts` providing M3 CSS-variable & native CSSStyleSheet theme service.
 * @zh 模块文件 `src/theme/theme.service.ts`，提供基于 M3 `--mat-sys-*` 系统变量与原生 `CSSStyleSheet` 的零 JSS 主题服务实现。
 */

import { Injectable, Provider, Signal, signal } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import {
  argbFromHex,
  CorePalette,
  hexFromArgb,
  themeFromSourceColor,
} from '@material/material-color-utilities';
import { BehaviorSubject } from 'rxjs';
import { MatColors } from '@dotos/dui/core/color';
import { ServiceLocator } from '@dotos/dui/core/services';
import { LocalStorageService } from '@dotos/dui/core/storage';

import { Palette, Theme, TypographyConfig } from './interfaces';
import { matCore } from './mat-core';
import { matDarkTheme } from './mat-dark-theme';
import { matDarkBlueTheme } from './mat-darkblue-theme';
import { matLightTheme } from './mat-light-theme';
import { matPalette } from './mat-palette';
import { materialTheme } from './mat-theme';
import { DotosConfig } from './types';
import { TypographyMap } from './typography-theme';

/**
 * Interface `DuiStyleSheet` representing an attachable/detachable native stylesheet handle.
 * @zh 接口 `DuiStyleSheet`，表示可挂载与卸载的原生样式表句柄（替代历史 JSS `StyleSheet`）。
 */
export interface DuiStyleSheet {
  /**
   * Property `cssText` (`string`) storing serialized CSS rules.
   * @zh 属性 `cssText`（类型：`string`），存储序列化后的 CSS 规则文本。
   */
  readonly cssText: string;
  /**
   * Executes `attach` to mount the stylesheet into `document.adoptedStyleSheets` or `<head>`.
   * @zh 执行 `attach`，将样式表挂载至 `document.adoptedStyleSheets` 或 `<head>`。
   * @returns Result of type `DuiStyleSheet` / 类型为 `DuiStyleSheet` 的返回值
   */
  attach(): DuiStyleSheet;
  /**
   * Executes `detach` to unmount the stylesheet from the document.
   * @zh 执行 `detach`，从当前文档卸载该样式表。
   */
  detach(): void;
  /**
   * Executes `toString` to return the serialized CSS text.
   * @zh 执行 `toString`，返回序列化后的 CSS 文本。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  toString(): string;
}

/**
 * Interface `ResolvedTheme` exposing reactive M3 & DUI resolved theme tokens for Signal consumers.
 * @zh 接口 `ResolvedTheme`，向 Signal 消费者暴露解析后的 M3 与 DUI 主题令牌快照。
 */
export interface ResolvedTheme {
  /**
   * Property `type` (`"dark" | "light" | "darkblue"`) storing active theme mode.
   * @zh 属性 `type`（类型：`"dark" | "light" | "darkblue"`），存储当前主题模式。
   */
  readonly type: 'light' | 'dark' | 'darkblue';
  /**
   * Property `density` (`0 | -1 | -2`) storing active Material density scale.
   * @zh 属性 `density`（类型：`0 | -1 | -2`），存储当前密度档位。
   */
  readonly density: 0 | -1 | -2;
  /**
   * Property `typography` (`string`) storing layout density/typography key (`compact` | `normal` | `loose`).
   * @zh 属性 `typography`（类型：`string`），存储排版与紧凑度档位名。
   */
  readonly typography: string;
  /**
   * Property `formType` (`MatFormFieldAppearance`) storing form field appearance.
   * @zh 属性 `formType`（类型：`MatFormFieldAppearance`），存储表单外观模式。
   */
  readonly formType: MatFormFieldAppearance;
  /**
   * Property `primaryHex` (`string`) storing resolved primary seed hex color.
   * @zh 属性 `primaryHex`（类型：`string`），存储解析后的主色 HEX 值。
   */
  readonly primaryHex: string;
  /**
   * Property `accentHex` (`string`) storing resolved accent/tertiary seed hex color.
   * @zh 属性 `accentHex`（类型：`string`），存储解析后的强调色 HEX 值。
   */
  readonly accentHex: string;
  /**
   * Property `warnHex` (`string`) storing resolved warn/error seed hex color.
   * @zh 属性 `warnHex`（类型：`string`），存储解析后的警告色 HEX 值。
   */
  readonly warnHex: string;
  /**
   * Property `cssVariables` (`Readonly<Record<string, string>>`) storing computed `--mat-sys-*` and `--dui-*` variables.
   * @zh 属性 `cssVariables`（类型：`Readonly<Record<string, string>>`），存储计算后的 `--mat-sys-*` 与 `--dui-*` 变量映射。
   */
  readonly cssVariables: Readonly<Record<string, string>>;
}

/**
 * Constant `UNITLESS_CSS_PROPERTIES` listing CSS properties whose numeric values must remain unitless.
 * @zh 常量 `UNITLESS_CSS_PROPERTIES`，列出数值不应追加 `px` 单位的 CSS 属性集合。
 */
const UNITLESS_CSS_PROPERTIES: ReadonlySet<string> = new Set<string>([
  'animation-iteration-count',
  'aspect-ratio',
  'border-image-outset',
  'border-image-slice',
  'border-image-width',
  'box-flex',
  'box-flex-group',
  'box-ordinal-group',
  'column-count',
  'columns',
  'fill-opacity',
  'flex',
  'flex-grow',
  'flex-positive',
  'flex-shrink',
  'flex-negative',
  'flex-order',
  'flood-opacity',
  'font-weight',
  'grid-area',
  'grid-column',
  'grid-column-end',
  'grid-column-span',
  'grid-column-start',
  'grid-row',
  'grid-row-end',
  'grid-row-span',
  'grid-row-start',
  'line-clamp',
  'line-height',
  'opacity',
  'order',
  'orphans',
  'scale',
  'stop-opacity',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
  'tab-size',
  'widows',
  'z-index',
  'zoom',
]);

/**
 * Constant `DARKBLUE_SURFACE_VARIABLES` defining DotOS industrial `darkblue` M3 surface overrides.
 * @zh 常量 `DARKBLUE_SURFACE_VARIABLES`，定义 DotOS 工业深蓝（`darkblue`）模式的 M3 表面色令牌覆写。
 */
const DARKBLUE_SURFACE_VARIABLES: Readonly<Record<string, string>> = {
  '--mat-sys-background': '#0b1628',
  '--mat-sys-surface': '#0b1628',
  '--mat-sys-surface-dim': '#07101e',
  '--mat-sys-surface-bright': '#1f365c',
  '--mat-sys-surface-container-lowest': '#060d18',
  '--mat-sys-surface-container-low': '#0e1b31',
  '--mat-sys-surface-container': '#11223d',
  '--mat-sys-surface-container-high': '#182e52',
  '--mat-sys-surface-container-highest': '#203b67',
  '--mat-sys-on-surface': '#e2e8f6',
  '--mat-sys-on-surface-variant': '#9fb0cd',
};

/**
 * Converts a camelCase or whitespace-padded CSS property name into standard kebab-case.
 * @zh 将驼峰或带空白前缀的 CSS 属性名规范化为标准短横线命名（保留 `--` 自定义属性）。
 * @param rawProp - raw property name (`string`) / 原始属性名（`string`）
 * @returns Normalized CSS property name (`string`) / 规范化后的 CSS 属性名（`string`）
 */
function toCssPropertyName(rawProp: string): string {
  const trimmed = rawProp.trim();
  if (trimmed.startsWith('--')) {
    return trimmed;
  }
  return trimmed.replace(/[A-Z]/g, (ch: string) => `-${ch.toLowerCase()}`);
}

/**
 * Formats a primitive CSS value, appending `px` to non-zero numbers for dimensional properties.
 * @zh 格式化基础 CSS 属性值，对非无单位属性的数值自动补充 `px`。
 * @param propName - kebab-case CSS property name (`string`) / 规范化后的 CSS 属性名（`string`）
 * @param rawValue - raw value (`unknown`) / 原始属性值（`unknown`）
 * @returns Formatted CSS declaration value (`string | null`) / 格式化后的 CSS 属性值（`string | null`）
 */
function formatCssValue(propName: string, rawValue: unknown): string | null {
  if (rawValue === null || rawValue === undefined || rawValue === false || rawValue === '') {
    return null;
  }
  if (typeof rawValue === 'number') {
    if (!Number.isFinite(rawValue)) {
      return null;
    }
    if (rawValue === 0 || propName.startsWith('--') || UNITLESS_CSS_PROPERTIES.has(propName)) {
      return String(rawValue);
    }
    return `${rawValue}px`;
  }
  if (typeof rawValue === 'string') {
    return rawValue;
  }
  if (Array.isArray(rawValue)) {
    const joined = rawValue
      .map((item: unknown) => formatCssValue(propName, item))
      .filter((v): v is string => v !== null);
    return joined.length > 0 ? joined.join(', ') : null;
  }
  return null;
}

/**
 * Splits a comma-separated CSS selector list while respecting parentheses and brackets.
 * @zh 在不破坏括号与属性选择器内部逗号的前提下拆分选择器列表。
 * @param selector - selector string (`string`) / 选择器字符串（`string`）
 * @returns Array of trimmed selector segments (`string[]`) / 去空白后的选择器片段数组（`string[]`）
 */
function splitSelectorList(selector: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let start = 0;

  for (let i = 0; i < selector.length; i++) {
    const ch = selector[i];
    if (quote) {
      if (ch === quote && selector[i - 1] !== '\\') {
        quote = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(' || ch === '[') {
      depth++;
    } else if (ch === ')' || ch === ']') {
      depth = Math.max(0, depth - 1);
    } else if (ch === ',' && depth === 0) {
      const part = selector.slice(start, i).trim();
      if (part) {
        parts.push(part);
      }
      start = i + 1;
    }
  }
  const tail = selector.slice(start).trim();
  if (tail) {
    parts.push(tail);
  }
  return parts;
}

/**
 * Resolves a child selector against a parent selector, supporting `&` nesting (suffix, prefix, and multi-selector).
 * @zh 将子选择器与父选择器合并，完整支持 `&` 嵌套（后缀、前缀及逗号多选择器笛卡尔展开）。
 * @param parentSelector - parent selector (`string`) / 父级选择器（`string`）
 * @param childSelector - child selector (`string`) / 子级选择器（`string`）
 * @returns Combined CSS selector (`string`) / 合并后的完整 CSS 选择器（`string`）
 */
function combineNestedSelector(parentSelector: string, childSelector: string): string {
  const trimmedChild = childSelector.trim();
  if (!parentSelector) {
    return trimmedChild.replace(/&/g, '').trim();
  }
  const parents = splitSelectorList(parentSelector);
  const children = splitSelectorList(trimmedChild);
  const combined: string[] = [];

  for (const parent of parents) {
    for (const child of children) {
      if (child.includes('&')) {
        combined.push(child.replace(/&/g, parent));
      } else {
        combined.push(`${parent} ${child}`);
      }
    }
  }
  return combined.join(', ');
}

/**
 * Checks whether an unknown value is a plain style object rather than an array or primitive.
 * @zh 判断给定值是否为普通样式键值对象。
 * @param value - candidate value (`unknown`) / 待检测值（`unknown`）
 * @returns Type guard boolean (`value is Record<string, unknown>`) / 是否为普通对象
 */
function isPlainStyleObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Serializes a JSS-compatible style object tree (including `@global`, `@media`, `@keyframes`, and `&` nesting) into standard CSS text.
 * @zh 将兼容历史 JSS 结构的样式对象树（含 `@global`、`@media`、`@keyframes` 与多层 `&` 嵌套）序列化为原生 CSS 文本。
 * @param rules - style object (`Record<string, unknown>`) / 样式规则对象（`Record<string, unknown>`）
 * @param parentSelector - optional parent selector (`string`) / 可选父级选择器（`string`）
 * @returns Serialized CSS string (`string`) / 序列化后的标准 CSS 字符串（`string`）
 */
export function serializeThemeRulesToCss(
  rules: Record<string, unknown>,
  parentSelector: string = '',
): string {
  const declarations: string[] = [];
  const childBlocks: string[] = [];

  for (const [rawKey, rawVal] of Object.entries(rules)) {
    if (rawVal === null || rawVal === undefined || rawVal === false) {
      continue;
    }
    const key = rawKey.trim();
    if (!key) {
      continue;
    }

    if (key === '@global' && isPlainStyleObject(rawVal)) {
      const globalCss = serializeThemeRulesToCss(rawVal, parentSelector);
      if (globalCss) {
        childBlocks.push(globalCss);
      }
      continue;
    }

    if (key.startsWith('@keyframes') && isPlainStyleObject(rawVal)) {
      const frames: string[] = [];
      for (const [stepKey, stepVal] of Object.entries(rawVal)) {
        if (isPlainStyleObject(stepVal)) {
          const stepCss = serializeThemeRulesToCss(stepVal, stepKey.trim());
          if (stepCss) {
            frames.push(stepCss);
          }
        }
      }
      if (frames.length > 0) {
        childBlocks.push(`${key} {\n${frames.join('\n')}\n}`);
      }
      continue;
    }

    if (
      (key.startsWith('@media') || key.startsWith('@supports') || key.startsWith('@container')) &&
      isPlainStyleObject(rawVal)
    ) {
      const innerCss = serializeThemeRulesToCss(rawVal, parentSelector);
      if (innerCss) {
        childBlocks.push(`${key} {\n${innerCss}\n}`);
      }
      continue;
    }

    if (key === 'fallbacks') {
      if (Array.isArray(rawVal)) {
        for (const fb of rawVal) {
          if (isPlainStyleObject(fb)) {
            for (const [fbProp, fbVal] of Object.entries(fb)) {
              const propName = toCssPropertyName(fbProp);
              const formatted = formatCssValue(propName, fbVal);
              if (formatted !== null) {
                declarations.push(`  ${propName}: ${formatted};`);
              }
            }
          }
        }
      } else if (isPlainStyleObject(rawVal)) {
        for (const [fbProp, fbVal] of Object.entries(rawVal)) {
          const propName = toCssPropertyName(fbProp);
          const formatted = formatCssValue(propName, fbVal);
          if (formatted !== null) {
            declarations.push(`  ${propName}: ${formatted};`);
          }
        }
      }
      continue;
    }

    if (isPlainStyleObject(rawVal)) {
      const nextSelector = combineNestedSelector(parentSelector, key);
      const nestedCss = serializeThemeRulesToCss(rawVal, nextSelector);
      if (nestedCss) {
        childBlocks.push(nestedCss);
      }
      continue;
    }

    const propName = toCssPropertyName(key);
    const formatted = formatCssValue(propName, rawVal);
    if (formatted !== null) {
      declarations.push(`  ${propName}: ${formatted};`);
    }
  }

  const output: string[] = [];
  if (parentSelector && declarations.length > 0) {
    output.push(`${parentSelector} {\n${declarations.join('\n')}\n}`);
  }
  if (childBlocks.length > 0) {
    output.push(childBlocks.join('\n'));
  }
  return output.join('\n');
}

/**
 * Checks whether the current browser environment supports constructable `CSSStyleSheet` and `document.adoptedStyleSheets`.
 * @zh 检测当前运行环境是否原生支持可构造 `CSSStyleSheet` 与 `document.adoptedStyleSheets`。
 * @returns Boolean indicating native adoptedStyleSheets availability (`boolean`) / 是否支持原生 `adoptedStyleSheets`
 */
function supportsAdoptedStyleSheets(): boolean {
  if (typeof document === 'undefined' || typeof CSSStyleSheet === 'undefined') {
    return false;
  }
  return (
    typeof CSSStyleSheet.prototype.replaceSync === 'function' &&
    Array.isArray((document as Document & { adoptedStyleSheets?: CSSStyleSheet[] }).adoptedStyleSheets)
  );
}

/**
 * Counter `sheetSequence` generating deterministic fallback sheet IDs in non-browser/JSDOM test environments.
 * @zh 计数器 `sheetSequence`，用于在非浏览器或 JSDOM 测试环境中生成确定性的样式表标识。
 */
let sheetSequence = 0;

/**
 * Creates a zero-JSS `DuiStyleSheet` backed by `document.adoptedStyleSheets` (with `<style data-dui-sheet>` fallback for SSR/JSDOM).
 * @zh 创建零 JSS 依赖的原生 `DuiStyleSheet`，优先挂载到 `document.adoptedStyleSheets`，在 SSR/JSDOM 下自动回退为 `<style data-dui-sheet>`。
 * @param rules - style object (`Record<string, unknown>`) / 样式规则对象（`Record<string, unknown>`）
 * @returns Attachable stylesheet instance (`DuiStyleSheet`) / 可挂载的原生样式表实例（`DuiStyleSheet`）
 */
function createNativeStyleSheet(rules: Record<string, unknown>): DuiStyleSheet {
  const cssText = serializeThemeRulesToCss(rules);
  const sheetId = `dui-sheet-${++sheetSequence}`;
  let nativeSheet: CSSStyleSheet | null = null;
  let fallbackStyleEl: HTMLStyleElement | null = null;

  const handle: DuiStyleSheet = {
    cssText,
    attach(): DuiStyleSheet {
      if (typeof document === 'undefined') {
        return handle;
      }
      if (supportsAdoptedStyleSheets()) {
        if (!nativeSheet) {
          nativeSheet = new CSSStyleSheet();
          nativeSheet.replaceSync(cssText);
        }
        const current = document.adoptedStyleSheets;
        if (!current.includes(nativeSheet)) {
          document.adoptedStyleSheets = [...current, nativeSheet];
        }
      } else if (document.head) {
        if (!fallbackStyleEl) {
          fallbackStyleEl = document.createElement('style');
          fallbackStyleEl.setAttribute('data-dui-sheet', sheetId);
          fallbackStyleEl.textContent = cssText;
        }
        if (!fallbackStyleEl.isConnected) {
          document.head.appendChild(fallbackStyleEl);
        }
      }
      return handle;
    },
    detach(): void {
      if (typeof document === 'undefined') {
        return;
      }
      if (nativeSheet && supportsAdoptedStyleSheets()) {
        document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
          (sheet: CSSStyleSheet) => sheet !== nativeSheet,
        );
      }
      if (fallbackStyleEl && fallbackStyleEl.parentNode) {
        fallbackStyleEl.parentNode.removeChild(fallbackStyleEl);
      }
    },
    toString(): string {
      return cssText;
    },
  };

  return handle;
}

/**
 * Normalizes a 3-digit or 6-digit hex color string into `#rrggbb`.
 * @zh 将 `#rgb` 或 `#rrggbb` 颜色字符串规范化为标准 6 位十六进制 `#rrggbb`。
 * @param raw - candidate hex string (`string`) / 待规范化的颜色字符串（`string`）
 * @returns Normalized `#rrggbb` string or `null` (`string | null`) / 规范化后的 HEX 或 `null`
 */
function normalizeHexColor(raw: string): string | null {
  const trimmed = raw.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const r = trimmed[1];
    const g = trimmed[2];
    const b = trimmed[3];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return null;
}

/**
 * Resolves either a legacy Material named color (`teal-600`, `orange-800`) or a `#HEX` color into `#rrggbb`.
 * @zh 将历史色板名（如 `teal-600`、`orange-800`）或任意 `#HEX` 色值统一解析为 `#rrggbb`。
 * @param colorStr - color identifier (`string`) / 颜色标识字符串（`string`）
 * @param fallbackHex - fallback `#rrggbb` color (`string`) / 兜底 `#rrggbb` 色值（`string`）
 * @returns Resolved `#rrggbb` color (`string`) / 解析后的 `#rrggbb` 色值（`string`）
 */
export function resolveThemeHexColor(colorStr: string | undefined | null, fallbackHex: string): string {
  if (!colorStr || typeof colorStr !== 'string') {
    return fallbackHex;
  }
  const directHex = normalizeHexColor(colorStr);
  if (directHex) {
    return directHex;
  }
  const separator = colorStr.lastIndexOf('-');
  if (separator > 0) {
    const family = colorStr.substring(0, separator);
    const hue = colorStr.substring(separator + 1);
    const paletteObj = MatColors.getColor(family) as Record<string, unknown> | false;
    if (paletteObj && typeof paletteObj === 'object') {
      const candidate = paletteObj[hue] ?? paletteObj['500'];
      if (typeof candidate === 'string') {
        const mappedHex = normalizeHexColor(candidate);
        if (mappedHex) {
          return mappedHex;
        }
      }
    }
  } else {
    const paletteObj = MatColors.getColor(colorStr) as Record<string, unknown> | false;
    if (paletteObj && typeof paletteObj === 'object' && typeof paletteObj['500'] === 'string') {
      const mappedHex = normalizeHexColor(paletteObj['500']);
      if (mappedHex) {
        return mappedHex;
      }
    }
  }
  return fallbackHex;
}

/**
 * Builds a legacy-compatible `Palette` from an arbitrary `#HEX` seed color using M3 tonal palettes.
 * @zh 基于任意 `#HEX` 种子色与 M3 色相调色板构造向后兼容的 `Palette` 对象。
 * @param hexColor - `#rrggbb` seed color (`string`) / `#rrggbb` 种子色（`string`）
 * @returns Material-compatible `Palette` (`Palette`) / 兼容旧契约的 `Palette` 对象
 */
function buildPaletteFromHex(hexColor: string): Palette {
  const tonal = CorePalette.of(argbFromHex(hexColor)).a1;
  const white87 = 'rgba(white, 0.87)';
  const black87 = 'rgba(black, 0.87)';
  const base: Palette = {
    50: hexFromArgb(tonal.tone(95)),
    100: hexFromArgb(tonal.tone(90)),
    200: hexFromArgb(tonal.tone(80)),
    300: hexFromArgb(tonal.tone(70)),
    400: hexFromArgb(tonal.tone(60)),
    500: hexColor,
    600: hexFromArgb(tonal.tone(40)),
    700: hexFromArgb(tonal.tone(30)),
    800: hexFromArgb(tonal.tone(25)),
    900: hexFromArgb(tonal.tone(15)),
    A100: hexFromArgb(tonal.tone(85)),
    A200: hexFromArgb(tonal.tone(75)),
    A400: hexFromArgb(tonal.tone(55)),
    A700: hexFromArgb(tonal.tone(35)),
    contrast: {
      50: black87,
      100: black87,
      200: black87,
      300: black87,
      400: 'white',
      500: 'white',
      600: 'white',
      700: white87,
      800: white87,
      900: white87,
      A100: black87,
      A200: black87,
      A400: 'white',
      A700: white87,
    },
  };
  return matPalette(base, 500, 100, 900);
}

/**
 * Computes all M3 `--mat-sys-*` and `--dui-*` CSS variables from primary/accent/warn seed colors and theme mode.
 * @zh 根据主色、强调色、警告色种子与主题模式（`light` | `dark` | `darkblue`）计算完整 M3 `--mat-sys-*` 与 `--dui-*` 变量表。
 * @param primaryHex - primary `#rrggbb` (`string`) / 主色 HEX（`string`）
 * @param accentHex - accent `#rrggbb` (`string`) / 强调色 HEX（`string`）
 * @param warnHex - warn `#rrggbb` (`string`) / 警告色 HEX（`string`）
 * @param mode - theme mode (`"dark" | "light" | "darkblue"`) / 主题模式（`"dark" | "light" | "darkblue"`）
 * @returns Map of CSS variable names to values (`Record<string, string>`) / CSS 变量名值映射表
 */
export function computeM3SystemVariables(
  primaryHex: string,
  accentHex: string,
  warnHex: string,
  mode: 'light' | 'dark' | 'darkblue',
): Record<string, string> {
  const m3Primary = themeFromSourceColor(argbFromHex(primaryHex));
  const m3Accent = CorePalette.of(argbFromHex(accentHex)).a1;
  const m3Warn = CorePalette.of(argbFromHex(warnHex)).a1;

  const p = m3Primary.palettes.primary;
  const s = m3Primary.palettes.secondary;
  const t = m3Accent;
  const n = m3Primary.palettes.neutral;
  const nv = m3Primary.palettes.neutralVariant;
  const e = m3Warn;

  const isDark = mode === 'dark' || mode === 'darkblue';
  const vars: Record<string, string> = isDark
    ? {
        '--mat-sys-background': hexFromArgb(n.tone(6)),
        '--mat-sys-error': hexFromArgb(e.tone(80)),
        '--mat-sys-error-container': hexFromArgb(e.tone(30)),
        '--mat-sys-inverse-on-surface': hexFromArgb(n.tone(20)),
        '--mat-sys-inverse-primary': hexFromArgb(p.tone(40)),
        '--mat-sys-inverse-surface': hexFromArgb(n.tone(90)),
        '--mat-sys-on-background': hexFromArgb(n.tone(90)),
        '--mat-sys-on-error': hexFromArgb(e.tone(20)),
        '--mat-sys-on-error-container': hexFromArgb(e.tone(90)),
        '--mat-sys-on-primary': hexFromArgb(p.tone(20)),
        '--mat-sys-on-primary-container': hexFromArgb(p.tone(90)),
        '--mat-sys-on-primary-fixed': hexFromArgb(p.tone(10)),
        '--mat-sys-on-primary-fixed-variant': hexFromArgb(p.tone(30)),
        '--mat-sys-on-secondary': hexFromArgb(s.tone(20)),
        '--mat-sys-on-secondary-container': hexFromArgb(s.tone(90)),
        '--mat-sys-on-secondary-fixed': hexFromArgb(s.tone(10)),
        '--mat-sys-on-secondary-fixed-variant': hexFromArgb(s.tone(30)),
        '--mat-sys-on-surface': hexFromArgb(n.tone(90)),
        '--mat-sys-on-surface-variant': hexFromArgb(nv.tone(80)),
        '--mat-sys-on-tertiary': hexFromArgb(t.tone(20)),
        '--mat-sys-on-tertiary-container': hexFromArgb(t.tone(90)),
        '--mat-sys-on-tertiary-fixed': hexFromArgb(t.tone(10)),
        '--mat-sys-on-tertiary-fixed-variant': hexFromArgb(t.tone(30)),
        '--mat-sys-outline': hexFromArgb(nv.tone(60)),
        '--mat-sys-outline-variant': hexFromArgb(nv.tone(30)),
        '--mat-sys-primary': hexFromArgb(p.tone(80)),
        '--mat-sys-primary-container': hexFromArgb(p.tone(30)),
        '--mat-sys-primary-fixed': hexFromArgb(p.tone(90)),
        '--mat-sys-primary-fixed-dim': hexFromArgb(p.tone(80)),
        '--mat-sys-scrim': hexFromArgb(n.tone(0)),
        '--mat-sys-secondary': hexFromArgb(s.tone(80)),
        '--mat-sys-secondary-container': hexFromArgb(s.tone(30)),
        '--mat-sys-secondary-fixed': hexFromArgb(s.tone(90)),
        '--mat-sys-secondary-fixed-dim': hexFromArgb(s.tone(80)),
        '--mat-sys-shadow': hexFromArgb(n.tone(0)),
        '--mat-sys-surface': hexFromArgb(n.tone(6)),
        '--mat-sys-surface-bright': hexFromArgb(n.tone(24)),
        '--mat-sys-surface-container': hexFromArgb(n.tone(12)),
        '--mat-sys-surface-container-high': hexFromArgb(n.tone(17)),
        '--mat-sys-surface-container-highest': hexFromArgb(n.tone(22)),
        '--mat-sys-surface-container-low': hexFromArgb(n.tone(10)),
        '--mat-sys-surface-container-lowest': hexFromArgb(n.tone(4)),
        '--mat-sys-surface-dim': hexFromArgb(n.tone(6)),
        '--mat-sys-surface-tint': hexFromArgb(p.tone(80)),
        '--mat-sys-surface-variant': hexFromArgb(nv.tone(30)),
        '--mat-sys-tertiary': hexFromArgb(t.tone(80)),
        '--mat-sys-tertiary-container': hexFromArgb(t.tone(30)),
        '--mat-sys-tertiary-fixed': hexFromArgb(t.tone(90)),
        '--mat-sys-tertiary-fixed-dim': hexFromArgb(t.tone(80)),
        '--mat-sys-neutral-variant20': hexFromArgb(nv.tone(20)),
        '--mat-sys-neutral10': hexFromArgb(n.tone(10)),
      }
    : {
        '--mat-sys-background': hexFromArgb(n.tone(98)),
        '--mat-sys-error': hexFromArgb(e.tone(40)),
        '--mat-sys-error-container': hexFromArgb(e.tone(90)),
        '--mat-sys-inverse-on-surface': hexFromArgb(n.tone(95)),
        '--mat-sys-inverse-primary': hexFromArgb(p.tone(80)),
        '--mat-sys-inverse-surface': hexFromArgb(n.tone(20)),
        '--mat-sys-on-background': hexFromArgb(n.tone(10)),
        '--mat-sys-on-error': hexFromArgb(e.tone(100)),
        '--mat-sys-on-error-container': hexFromArgb(e.tone(30)),
        '--mat-sys-on-primary': hexFromArgb(p.tone(100)),
        '--mat-sys-on-primary-container': hexFromArgb(p.tone(30)),
        '--mat-sys-on-primary-fixed': hexFromArgb(p.tone(10)),
        '--mat-sys-on-primary-fixed-variant': hexFromArgb(p.tone(30)),
        '--mat-sys-on-secondary': hexFromArgb(s.tone(100)),
        '--mat-sys-on-secondary-container': hexFromArgb(s.tone(30)),
        '--mat-sys-on-secondary-fixed': hexFromArgb(s.tone(10)),
        '--mat-sys-on-secondary-fixed-variant': hexFromArgb(s.tone(30)),
        '--mat-sys-on-surface': hexFromArgb(n.tone(10)),
        '--mat-sys-on-surface-variant': hexFromArgb(nv.tone(30)),
        '--mat-sys-on-tertiary': hexFromArgb(t.tone(100)),
        '--mat-sys-on-tertiary-container': hexFromArgb(t.tone(30)),
        '--mat-sys-on-tertiary-fixed': hexFromArgb(t.tone(10)),
        '--mat-sys-on-tertiary-fixed-variant': hexFromArgb(t.tone(30)),
        '--mat-sys-outline': hexFromArgb(nv.tone(50)),
        '--mat-sys-outline-variant': hexFromArgb(nv.tone(80)),
        '--mat-sys-primary': hexFromArgb(p.tone(40)),
        '--mat-sys-primary-container': hexFromArgb(p.tone(90)),
        '--mat-sys-primary-fixed': hexFromArgb(p.tone(90)),
        '--mat-sys-primary-fixed-dim': hexFromArgb(p.tone(80)),
        '--mat-sys-scrim': hexFromArgb(n.tone(0)),
        '--mat-sys-secondary': hexFromArgb(s.tone(40)),
        '--mat-sys-secondary-container': hexFromArgb(s.tone(90)),
        '--mat-sys-secondary-fixed': hexFromArgb(s.tone(90)),
        '--mat-sys-secondary-fixed-dim': hexFromArgb(s.tone(80)),
        '--mat-sys-shadow': hexFromArgb(n.tone(0)),
        '--mat-sys-surface': hexFromArgb(n.tone(98)),
        '--mat-sys-surface-bright': hexFromArgb(n.tone(98)),
        '--mat-sys-surface-container': hexFromArgb(n.tone(94)),
        '--mat-sys-surface-container-high': hexFromArgb(n.tone(92)),
        '--mat-sys-surface-container-highest': hexFromArgb(n.tone(90)),
        '--mat-sys-surface-container-low': hexFromArgb(n.tone(96)),
        '--mat-sys-surface-container-lowest': hexFromArgb(n.tone(100)),
        '--mat-sys-surface-dim': hexFromArgb(n.tone(87)),
        '--mat-sys-surface-tint': hexFromArgb(p.tone(40)),
        '--mat-sys-surface-variant': hexFromArgb(nv.tone(90)),
        '--mat-sys-tertiary': hexFromArgb(t.tone(40)),
        '--mat-sys-tertiary-container': hexFromArgb(t.tone(90)),
        '--mat-sys-tertiary-fixed': hexFromArgb(t.tone(90)),
        '--mat-sys-tertiary-fixed-dim': hexFromArgb(t.tone(80)),
        '--mat-sys-neutral-variant20': hexFromArgb(nv.tone(20)),
        '--mat-sys-neutral10': hexFromArgb(n.tone(10)),
      };

  if (mode === 'darkblue') {
    Object.assign(vars, DARKBLUE_SURFACE_VARIABLES);
  }

  vars['--dui-primary'] = vars['--mat-sys-primary'];
  vars['--dui-on-primary'] = vars['--mat-sys-on-primary'];
  vars['--dui-primary-container'] = vars['--mat-sys-primary-container'];
  vars['--dui-accent'] = vars['--mat-sys-tertiary'];
  vars['--dui-warn'] = vars['--mat-sys-error'];
  vars['--dui-surface'] = vars['--mat-sys-surface'];
  vars['--dui-surface-container'] = vars['--mat-sys-surface-container'];
  vars['--dui-on-surface'] = vars['--mat-sys-on-surface'];
  vars['--dui-outline-variant'] = vars['--mat-sys-outline-variant'];
  vars['--dui-hover'] = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';
  vars['--dui-selected'] = vars['--mat-sys-primary-container'];

  return vars;
}

/**
 * Executes `createMaterialCoreStyles` to build CDK/focus/ripple core stylesheet without JSS.
 * @zh 执行 `createMaterialCoreStyles`，无 JSS 生成 CDK 浮层、波纹与焦点核心原生样式表。
 * @param typographyConfig - typography config parameter (`TypographyConfig`) / 排版配置参数（`TypographyConfig`）
 * @param override - override parameter (`Record<string, unknown>`) / 样式覆写对象（`Record<string, unknown>`）
 * @param _dynamic - dynamic flag kept for signature compatibility (`boolean`) / 保持签名兼容的动态标记（`boolean`）
 * @returns Result of type `DuiStyleSheet` / 类型为 `DuiStyleSheet` 的返回值
 */
export function createMaterialCoreStyles(
  typographyConfig: TypographyConfig | null = null,
  override: Record<string, unknown> = {},
  _dynamic: boolean = false,
): DuiStyleSheet {
  const styles: Record<string, unknown> = {
    '@global': {
      ...(matCore(typographyConfig) as Record<string, unknown>),
      ...override,
    },
  };
  return createNativeStyleSheet(styles);
}

/**
 * Executes `createMaterialThemeStyles` to build DUI custom component stylesheet without JSS.
 * @zh 执行 `createMaterialThemeStyles`，无 JSS 生成 DUI 自研组件原生样式表。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @param override - override parameter (`Record<string, unknown>`) / 样式覆写对象（`Record<string, unknown>`）
 * @param _dynamic - dynamic flag kept for signature compatibility (`boolean`) / 保持签名兼容的动态标记（`boolean`）
 * @returns Result of type `DuiStyleSheet` / 类型为 `DuiStyleSheet` 的返回值
 */
export function createMaterialThemeStyles(
  theme: Theme,
  override: Record<string, unknown> = {},
  _dynamic: boolean = false,
): DuiStyleSheet {
  const styles: Record<string, unknown> = {
    '@global': {
      ...materialTheme(theme),
      ...override,
    },
  };
  return createNativeStyleSheet(styles);
}

/**
 * Injectable Angular service `ThemeService` managing M3 CSS variables, Signal state, and native `adoptedStyleSheets`.
 * @zh 可注入的 Angular 服务 `ThemeService`，统一管理 M3 `--mat-sys-*` 变量注入、`Signal<ResolvedTheme>` 响应式令牌与原生 `adoptedStyleSheets` 样式表。
 */
@Injectable()
export class ThemeService {
  /**
   * Property `_primaryStr` (`string`) storing primary color identifier.
   * @zh 属性 `_primaryStr`（类型：`string`），存储主色字符串或 HEX。
   */
  private _primaryStr: string = 'teal-600';

  /**
   * Property `_accentStr` (`string`) storing accent color identifier.
   * @zh 属性 `_accentStr`（类型：`string`），存储强调色字符串或 HEX。
   */
  private _accentStr: string = 'orange-800';

  /**
   * Property `_typography` (`string`) storing typography/density key.
   * @zh 属性 `_typography`（类型：`string`），存储排版与密度模式名。
   */
  private _typography: string = 'compact';

  /**
   * Property `_warnStr` (`string`) storing warn color identifier.
   * @zh 属性 `_warnStr`（类型：`string`），存储警告色字符串或 HEX。
   */
  private _warnStr: string = 'red-800';

  /**
   * Property `_type` (`"dark" | "light" | "darkblue"`) storing active theme mode.
   * @zh 属性 `_type`（类型：`"dark" | "light" | "darkblue"`），存储当前主题模式。
   */
  private _type: 'light' | 'dark' | 'darkblue' = 'light';

  /**
   * Property `_density` (`0 | -1 | -2`) storing active Material density scale (default: `-1`).
   * @zh 属性 `_density`（类型：`0 | -1 | -2`），存储当前密度档位（默认值：`-1`）。
   */
  private _density: 0 | -1 | -2 = -1;

  /**
   * Property `formType` (`BehaviorSubject<MatFormFieldAppearance>`) storing form field appearance stream.
   * @zh 属性 `formType`（类型：`BehaviorSubject<MatFormFieldAppearance>`），存储表单外观状态流。
   */
  public formType: BehaviorSubject<MatFormFieldAppearance> = new BehaviorSubject<MatFormFieldAppearance>('fill');

  /**
   * Property `_tokens` (`WritableSignal<ResolvedTheme>`) backing the public `tokens` Signal.
   * @zh 内部可写信号 `_tokens`，支撑对外只读的 `tokens` Signal。
   */
  private readonly _tokens = signal<ResolvedTheme>({
    type: 'light',
    density: -1,
    typography: 'compact',
    formType: 'fill',
    primaryHex: '#00897b',
    accentHex: '#ef6c00',
    warnHex: '#c62828',
    cssVariables: computeM3SystemVariables('#00897b', '#ef6c00', '#c62828', 'light'),
  });

  /**
   * Property `tokens` (`Signal<ResolvedTheme>`) exposing reactive resolved theme tokens for Zoneless/Signal components.
   * @zh 只读信号 `tokens`（类型：`Signal<ResolvedTheme>`），向 Zoneless / Signal 组件暴露实时解析后的主题令牌。
   */
  public readonly tokens: Signal<ResolvedTheme> = this._tokens.asReadonly();

  /**
   * Property `theme` (`Theme`) storing legacy-compatible `Theme` object.
   * @zh 属性 `theme`（类型：`Theme`），存储向后兼容的 `Theme` 对象。
   */
  private theme!: Theme;

  /**
   * Property `dotosConfig` (`DotosConfig`) storing active DotOS configuration.
   * @zh 属性 `dotosConfig`（类型：`DotosConfig`），存储当前 DotOS 主题布局配置。
   */
  public dotosConfig!: DotosConfig;

  /**
   * Property `_coreStyleSheet` (`DuiStyleSheet`) storing attached core stylesheet.
   * @zh 属性 `_coreStyleSheet`（类型：`DuiStyleSheet`），存储核心样式表句柄。
   */
  private _coreStyleSheet?: DuiStyleSheet;

  /**
   * Property `_materialThemeStyleSheet` (`DuiStyleSheet`) storing attached DUI theme stylesheet.
   * @zh 属性 `_materialThemeStyleSheet`（类型：`DuiStyleSheet`），存储 DUI 组件主题样式表句柄。
   */
  private _materialThemeStyleSheet?: DuiStyleSheet;

  // 每个 themeFn 对应一张独立样式表：同一组件重复 loadTheme 时原地替换，不同组件的样式表互不覆盖。
  /**
   * Property `_loadedThemeStyleSheets` (`Map<(theme: Theme) => unknown, DuiStyleSheet>`) storing per-component loaded stylesheets.
   * @zh 属性 `_loadedThemeStyleSheets`（类型：`Map<(theme: Theme) => unknown, DuiStyleSheet>`），按 `themeFn` 缓存已加载的组件样式表。
   */
  private _loadedThemeStyleSheets: Map<(theme: Theme) => unknown, DuiStyleSheet> = new Map();

  /**
   * 未提供 `dotosConfig`（或其字段缺失）时使用的兜底主题配置。
   * @zh 未提供 `dotosConfig`（或其字段缺失）时使用的兜底主题配置。
   */
  private static readonly DEFAULT_CONFIG: DotosConfig = {
    isDesktop: false,
    layout: {
      folded: false,
      pagemodel: 'compact',
      sidepanel: {
        hidden: false,
        position: 'right',
      },
      style: 'horizontal-layout',
      variant: 'vertical',
      width: 'fullwidth',
    },
    routerAnimation: 'none',
    theme: {
      formType: 'fill',
      accent: 'orange-800',
      type: 'light',
      primary: 'teal-600',
      warn: 'red-800',
    },
  } as DotosConfig;

  /**
   * Property `instance` (`ThemeService`) storing singleton instance.
   * @zh 属性 `instance`（类型：`ThemeService`），存储单例实例。
   */
  protected static instance: ThemeService | null = null;

  /**
   * Executes `getInstance` to obtain or lazily initialize the singleton `ThemeService`.
   * @zh 执行 `getInstance`，获取或按需初始化 `ThemeService` 单例。
   * @returns Result of type `ThemeService` / 类型为 `ThemeService` 的返回值
   */
  public static getInstance(): ThemeService {
    if (ThemeService.instance === null) {
      const localStore: LocalStorageService = ServiceLocator.injector.get(LocalStorageService);
      ThemeService.instance = new ThemeService(localStore);
    }
    return ThemeService.instance;
  }

  /**
   * Creates an instance of `ThemeService` and registers it as the active singleton.
   * @zh 创建 `ThemeService` 实例并注册为当前活跃单例。
   * @param localStore - Injected local storage service (`LocalStorageService`) / 注入的本地存储服务（`LocalStorageService`）
   */
  public constructor(public localStore: LocalStorageService) {
    ThemeService.instance = this;
  }

  /**
   * Executes `refreshTheme` to load `dotosConfig` from localStorage (or fallback defaults) and apply the theme.
   * @zh 执行 `refreshTheme`，从 `localStorage` 读取 `dotosConfig`（缺失时回落默认配置）并刷新主题。
   */
  public refreshTheme(): void {
    // dotosConfig 来自 localStorage，属于外部可篡改输入；结构不完整时回退默认配置。
    const config = this.localStore?.get('dotosConfig') as DotosConfig | undefined;
    this.setTheme(this.isUsableConfig(config) ? config : ThemeService.DEFAULT_CONFIG);
  }

  /**
   * Executes `isUsableConfig` to validate that `config` has required `theme` and `layout` fields.
   * @zh 执行 `isUsableConfig`，校验配置对象是否包含完整的 `theme` 与 `layout` 必填字段。
   * @param config - candidate config (`DotosConfig`) / 待校验配置（`DotosConfig`）
   * @returns Type guard boolean (`config is DotosConfig`) / 是否为合法可用配置
   */
  private isUsableConfig(config: DotosConfig | undefined): config is DotosConfig {
    return !!(
      config &&
      config.theme &&
      config.layout &&
      config.theme.primary &&
      config.theme.accent &&
      config.theme.warn
    );
  }

  /**
   * Executes `getFormType` to return the current `MatFormFieldAppearance`.
   * @zh 执行 `getFormType`，获取当前表单字段外观模式。
   * @returns Current form appearance (`MatFormFieldAppearance`) / 当前表单外观（`MatFormFieldAppearance`）
   */
  public getFormType(): MatFormFieldAppearance {
    return this.formType.getValue();
  }

  /**
   * Executes `setTheme` to store `config` and apply its color, mode, density, and form appearance settings.
   * @zh 执行 `setTheme`，保存配置并应用主色、强调色、警告色、明暗模式、密度与表单外观。
   * @param config - DotOS configuration (`DotosConfig`) / DotOS 配置对象（`DotosConfig`）
   */
  public setTheme(config: DotosConfig): void {
    const safeConfig = this.isUsableConfig(config) ? config : ThemeService.DEFAULT_CONFIG;
    this.dotosConfig = safeConfig;
    const primary = safeConfig.theme.primary;
    const accent = safeConfig.theme.accent;
    const warn = safeConfig.theme.warn;
    const page = safeConfig.layout.pagemodel || 'compact';
    const type = safeConfig.theme.type || 'light';
    const formType = (safeConfig.theme.formType as MatFormFieldAppearance) || 'fill';

    this.changeTheme(primary, accent, warn, type, page, formType);
  }

  /**
   * Converts either a named Material color (`teal-600`) or `#HEX` string into a legacy-compatible `Palette`.
   * @zh 将 `teal-600` 色名或任意 `#HEX` 字符串转换为兼容历史契约的 `Palette`。
   * @param colorStr - color string (`string`) / 颜色字符串（`string`）
   * @param fallbackHex - fallback `#rrggbb` (`string`) / 兜底 `#rrggbb`（`string`）
   * @returns Resolved `Palette` (`Palette`) / 解析后的 `Palette`
   */
  private toPalette(colorStr: string, fallbackHex: string): Palette {
    const safeStr = colorStr || '';
    const directHex = normalizeHexColor(safeStr);
    if (directHex) {
      return buildPaletteFromHex(directHex);
    }
    const separator = safeStr.lastIndexOf('-');
    if (separator > 0) {
      const base = MatColors.getColor(safeStr.substring(0, separator)) as Palette | false;
      const hue = safeStr.substring(separator + 1);
      if (base && typeof base === 'object' && base[hue]) {
        return matPalette(base, hue, 100, 900);
      }
    }
    return buildPaletteFromHex(resolveThemeHexColor(safeStr, fallbackHex));
  }

  /**
   * Normalizes an arbitrary mode string into `'light' | 'dark' | 'darkblue'`.
   * @zh 将主题类型字符串规范化为 `'light' | 'dark' | 'darkblue'`。
   * @param type - raw theme type (`string`) / 原始主题类型（`string`）
   * @returns Normalized mode (`'light' | 'dark' | 'darkblue'`) / 规范化后的主题模式
   */
  private normalizeThemeType(type: string): 'light' | 'dark' | 'darkblue' {
    if (type === 'dark') {
      return 'dark';
    }
    if (type === 'darkblue') {
      return 'darkblue';
    }
    return 'light';
  }

  /**
   * Builds a `Theme` object for the specified theme mode based on current palette and typography settings.
   * @zh 依据当前主色、强调色、警告色、密度与排版配置构造指定模式的 `Theme` 对象。
   * @param type - theme mode (`string`) / 主题模式（`string`）
   * @returns Constructed `Theme` (`Theme`) / 构造完成的 `Theme` 对象
   */
  private buildTheme(type: string): Theme {
    const primary = this.toPalette(this._primaryStr, '#00897b');
    const accent = this.toPalette(this._accentStr, '#ef6c00');
    const warn = this.toPalette(this._warnStr, '#c62828');
    const typographyConfig: TypographyConfig =
      TypographyMap[this._typography] ?? TypographyMap['compact'];

    if (type === 'dark') {
      return matDarkTheme(primary, accent, warn, this._density, typographyConfig);
    }
    if (type === 'darkblue') {
      return matDarkBlueTheme(primary, accent, warn, this._density, typographyConfig);
    }
    return matLightTheme(primary, accent, warn, this._density, typographyConfig);
  }

  /**
   * Applies M3 `--mat-sys-*` & `--dui-*` CSS custom properties, `data-theme`, and density class to the DOM.
   * @zh 将 M3 `--mat-sys-*` 与 `--dui-*` 变量写入 `documentElement`，并同步 `data-theme` 与 `body` 密度类。
   * @param cssVariables - computed CSS variables (`Record<string, string>`) / 计算后的 CSS 变量表
   * @param mode - normalized theme mode (`"dark" | "light" | "darkblue"`) / 主题模式
   * @param density - Material density scale (`0 | -1 | -2`) / 密度档位
   */
  private applyDomSystemVariables(
    cssVariables: Record<string, string>,
    mode: 'light' | 'dark' | 'darkblue',
    density: 0 | -1 | -2,
  ): void {
    if (typeof document === 'undefined' || !document.documentElement) {
      return;
    }
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
    root.style.colorScheme = mode === 'light' ? 'light' : 'dark';
    for (const [prop, val] of Object.entries(cssVariables)) {
      root.style.setProperty(prop, val);
    }

    if (document.body) {
      document.body.classList.remove(
        'dui-density-compact',
        'dui-density-normal',
        'dui-density-loose',
      );
      const densityClass =
        density === 0
          ? 'dui-density-loose'
          : density === -1
            ? 'dui-density-normal'
            : 'dui-density-compact';
      document.body.classList.add(densityClass);
    }
  }

  /**
   * Executes `loadTheme` to register and attach a component-level theme stylesheet via `adoptedStyleSheets`.
   * @zh 执行 `loadTheme`，为组件级 `themeFn` 生成并挂载原生样式表，并在后续切换主题时自动重算。
   * @param themeFn - component theme factory (`(theme: Theme) => unknown`) / 组件主题工厂函数（`(theme: Theme) => unknown`）
   */
  public loadTheme(themeFn: (theme: Theme) => unknown): void {
    if (!this.theme) {
      this.refreshTheme();
    }
    this.removeStyleSheet(this._loadedThemeStyleSheets.get(themeFn));
    const styleSheet = this.createThemeStyles(this.theme, themeFn, true);
    this._loadedThemeStyleSheets.set(themeFn, styleSheet);
    styleSheet.attach();
  }

  /**
   * Detaches a previously attached `DuiStyleSheet`.
   * @zh 卸载已挂载的 `DuiStyleSheet` 样式表。
   * @param styleSheet - optional stylesheet handle (`DuiStyleSheet`) / 样式表句柄（`DuiStyleSheet`）
   */
  private removeStyleSheet(styleSheet?: DuiStyleSheet): void {
    if (styleSheet) {
      styleSheet.detach();
    }
  }

  /**
   * Executes `createThemeStyles` to serialize `themeFn(theme)` into a native `DuiStyleSheet`.
   * @zh 执行 `createThemeStyles`，将 `themeFn(theme)` 序列化为原生 `DuiStyleSheet`。
   * @param theme - active `Theme` (`Theme`) / 当前 `Theme` 对象（`Theme`）
   * @param themeFn - component theme factory (`(theme: Theme) => unknown`) / 组件主题函数（`(theme: Theme) => unknown`）
   * @param _dynamicThemeStyles - compatibility boolean (`boolean`) / 兼容参数（`boolean`）
   * @returns Native stylesheet handle (`DuiStyleSheet`) / 原生样式表句柄（`DuiStyleSheet`）
   */
  public createThemeStyles(
    theme: Theme,
    themeFn: (theme: Theme) => unknown,
    _dynamicThemeStyles: boolean = true,
  ): DuiStyleSheet {
    const styles: Record<string, unknown> = {
      '@global': {
        ...this.getThemeStyle(themeFn, theme),
      },
    };
    return createNativeStyleSheet(styles);
  }

  /**
   * Executes `getThemeStyle` to evaluate `themeFn(theme)` safely as a plain object.
   * @zh 执行 `getThemeStyle`，安全求值 `themeFn(theme)` 并返回样式键值对象。
   * @param themeFn - component theme factory (`(theme: Theme) => unknown`) / 组件主题函数（`(theme: Theme) => unknown`）
   * @param theme - active `Theme` (`Theme`) / 当前 `Theme` 对象（`Theme`）
   * @returns Evaluated style map (`Record<string, unknown>`) / 求值后的样式映射对象
   */
  public getThemeStyle(
    themeFn: (theme: Theme) => unknown,
    theme: Theme,
  ): Record<string, unknown> {
    const evaluated = themeFn(theme);
    return isPlainStyleObject(evaluated) ? { ...evaluated } : {};
  }

  /**
   * Executes `changeThemeWithConfig` to switch theme directly from a `DotosConfig` object.
   * @zh 执行 `changeThemeWithConfig`，根据传入的 `DotosConfig` 切换当前主题。
   * @param config - DotOS configuration (`DotosConfig`) / DotOS 配置对象（`DotosConfig`）
   */
  public changeThemeWithConfig(config: DotosConfig): void {
    const safeConfig = this.isUsableConfig(config) ? config : ThemeService.DEFAULT_CONFIG;
    this.dotosConfig = safeConfig;
    const type = safeConfig.theme.type || 'light';
    const primary = safeConfig.theme.primary;
    const accent = safeConfig.theme.accent;
    const warn = safeConfig.theme.warn;
    const page = safeConfig.layout.pagemodel || 'compact';
    const formType = (safeConfig.theme.formType as MatFormFieldAppearance) || 'fill';
    this.changeTheme(primary, accent, warn, type, page, formType);
  }

  /**
   * Executes `changeTheme` to recompute M3 CSS variables, update `tokens` Signal, and refresh attached stylesheets.
   * @zh 执行 `changeTheme`，重算 M3 `--mat-sys-*` 变量、更新 `tokens` Signal，并刷新所有已挂载样式表。
   * @param primaryStr - primary color name or `#HEX` (`string`) / 主色名称或 `#HEX`（`string`）
   * @param accentStr - accent color name or `#HEX` (`string`) / 强调色名称或 `#HEX`（`string`）
   * @param warnStr - warn color name or `#HEX` (`string`) / 警告色名称或 `#HEX`（`string`）
   * @param type - theme mode `'light' | 'dark' | 'darkblue'` (`string`) / 主题模式（`string`）
   * @param typography - density/typography key `'compact' | 'normal' | 'loose'` (`string`) / 排版密度档位（`string`）
   * @param formType - Material form field appearance (`MatFormFieldAppearance`) / 表单字段外观（`MatFormFieldAppearance`）
   */
  public changeTheme(
    primaryStr: string,
    accentStr: string,
    warnStr: string,
    type: string,
    typography: string,
    formType: MatFormFieldAppearance = 'fill',
  ): void {
    const normalizedMode = this.normalizeThemeType(type);
    const density: 0 | -1 | -2 =
      typography === 'loose' ? 0 : typography === 'normal' ? -1 : -2;

    this._primaryStr = primaryStr || 'teal-600';
    this._accentStr = accentStr || 'orange-800';
    this._warnStr = warnStr || 'red-800';
    this._type = normalizedMode;
    this._typography = typography || 'compact';
    this._density = density;
    this.formType.next(formType || 'fill');

    const primaryHex = resolveThemeHexColor(this._primaryStr, '#00897b');
    const accentHex = resolveThemeHexColor(this._accentStr, '#ef6c00');
    const warnHex = resolveThemeHexColor(this._warnStr, '#c62828');
    const cssVariables = computeM3SystemVariables(primaryHex, accentHex, warnHex, normalizedMode);

    this.applyDomSystemVariables(cssVariables, normalizedMode, density);
    this._tokens.set({
      type: normalizedMode,
      density,
      typography: this._typography,
      formType: formType || 'fill',
      primaryHex,
      accentHex,
      warnHex,
      cssVariables,
    });

    const typographyConfig: TypographyConfig =
      TypographyMap[this._typography] ?? TypographyMap['compact'];
    this.removeStyleSheet(this._coreStyleSheet);
    this._coreStyleSheet = createMaterialCoreStyles(typographyConfig, {}, true);
    this._coreStyleSheet.attach();

    this.theme = this.buildTheme(normalizedMode);
    this.removeStyleSheet(this._materialThemeStyleSheet);
    this._materialThemeStyleSheet = createMaterialThemeStyles(this.theme, {}, true);
    this._materialThemeStyleSheet.attach();

    Array.from(this._loadedThemeStyleSheets.entries()).forEach(([themeFn, oldSheet]) => {
      this.removeStyleSheet(oldSheet);
      const newSheet = this.createThemeStyles(this.theme, themeFn, true);
      this._loadedThemeStyleSheets.set(themeFn, newSheet);
      newSheet.attach();
    });
  }

  /**
   * Executes `getThemeByType` to obtain the current or mode-specific `Theme` object.
   * @zh 执行 `getThemeByType`，获取当前或指定模式的 `Theme` 对象。
   * @param type - `'default'` or mode name (`string`) / `'default'` 或模式名称（`string`）
   * @returns Resolved `Theme` (`Theme`) / 对应的 `Theme` 对象
   */
  public getThemeByType(type: string): Theme {
    if (type === 'default') {
      return this.getTheme();
    }
    return this.buildTheme(type);
  }

  /**
   * Executes `getTheme` to return the active `Theme` object (initializing defaults if needed).
   * @zh 执行 `getTheme`，返回当前活跃的 `Theme` 对象（未初始化时自动加载默认主题）。
   * @returns Active `Theme` (`Theme`) / 当前 `Theme` 对象
   */
  public getTheme(): Theme {
    if (!this.theme) {
      this.refreshTheme();
    }
    return this.theme;
  }
}

/**
 * Constant/variable `THEME_SERVICE_PROVIDER` defining singleton `ThemeService` DI provider in `src/theme`.
 * @zh 常量 `THEME_SERVICE_PROVIDER`，定义 `src/theme` 中的 `ThemeService` 单例注入提供者。
 */
export const THEME_SERVICE_PROVIDER: Provider = {
  provide: ThemeService,
  useFactory: (): ThemeService => {
    return ThemeService.getInstance();
  },
};
