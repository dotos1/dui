/**
 * @fileoverview Module `src/theme/theme.service.ts` providing M2 dynamic theme service & `<style>` tag JSS serializer.
 * Restores 100% of `7.4.52` public signatures, M2 palette resolution, `light`/`dark`/`darkblue` modes,
 * `loose`/`normal`/`compact` densities & typography, and `<style>` DOM cascade order (`core` -> `material-theme` -> `loadTheme`).
 * @zh 模块文件 `src/theme/theme.service.ts`，提供 M2 动态主题服务与 `<style>` 标签 JSS 序列化器，100% 恢复 `7.4.52` 签名、配色、密度及 DOM 层叠顺序。
 */

import { Injectable, Provider } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatColors } from '@dotos1/dui/core/color';
import { ServiceLocator } from '@dotos1/dui/core/services';
import { LocalStorageService } from '@dotos1/dui/core/storage';
import { BehaviorSubject } from 'rxjs';

import { Palette, Theme, TypographyConfig } from './interfaces';
import { matCore } from './mat-core';
import { matDarkTheme } from './mat-dark-theme';
import { matDarkBlueTheme } from './mat-darkblue-theme';
import { matLightTheme } from './mat-light-theme';
import { matPalette } from './mat-palette';
import { materialTheme } from './mat-theme';
import { mergeThemeStyleMaps } from './theme/mat-themes';
import { DotosConfig } from './types';
import { TypographyMap } from './typography-theme';

/**
 * Interface `DuiStyleSheet` representing an attachable/detachable `<style>` tag stylesheet handle.
 * @zh 接口 `DuiStyleSheet`，表示挂载至 `<head>` 内 `<style>` 标签的可装卸样式表句柄。
 */
export interface DuiStyleSheet {
  /**
   * Property `cssText` (`string`) storing serialized CSS rules.
   * @zh 属性 `cssText`（类型：`string`），存储序列化后的 CSS 规则文本。
   */
  readonly cssText: string;
  /**
   * Property `element` (`HTMLStyleElement`) storing mounted `<style>` DOM element when attached.
   * @zh 属性 `element`（类型：`HTMLStyleElement`），存储当前挂载在 `<head>` 中的 `<style>` 元素。
   */
  readonly element: HTMLStyleElement | null;
  /**
   * Executes `attach` to mount the `<style>` element into `document.head`.
   * @zh 执行 `attach`，将 `<style>` 标签挂载至 `document.head`。
   * @returns Result of type `DuiStyleSheet` / 类型为 `DuiStyleSheet` 的返回值
   */
  attach(): DuiStyleSheet;
  /**
   * Executes `detach` to remove the `<style>` element from the document.
   * @zh 执行 `detach`，从当前文档移除该 `<style>` 标签。
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
  if (rawValue === null || rawValue === undefined || rawValue === false) {
    return null;
  }
  if (rawValue === '') {
    return propName === 'content' ? '""' : null;
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
 * Splits a comma-separated CSS selector list while respecting parentheses, brackets, and quotes.
 * @zh 在不破坏括号、属性选择器与引号内部逗号的前提下拆分选择器列表。
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
 * Resolves a top-level selector (where `parentSelector` is empty) that may contain legacy flattened `&` tokens,
 * strictly preventing bare universal pseudo-element or pseudo-class selectors (`::after`, `::before`, `:hover`, etc.).
 * @zh 在无父级选择器（顶层 `@global`）时安全解析含遗留扁平 `&` 的选择器，严禁产出全局裸 `::after`/`::before` 等污染选择器。
 * @param rawSelector - top-level selector (`string`) / 顶层选择器（`string`）
 * @returns Resolved CSS selector (`string`) / 安全解析后的 CSS 选择器（`string`）
 */
function resolveTopLevelSelector(rawSelector: string): string {
  if (!rawSelector.includes('&')) {
    return rawSelector;
  }
  const parts = splitSelectorList(rawSelector);
  const resolved: string[] = [];
  let lastPrefix = '';

  for (const rawPart of parts) {
    // Normalize inline compound `&` without whitespace (e.g. `.foo&.disabled` -> `.foo.disabled`)
    const part = rawPart.replace(/(\S)&(?=[.:#\[])/g, '$1').trim();
    if (!part) {
      continue;
    }
    if (!part.includes('&')) {
      const spaceIdx = part.lastIndexOf(' ');
      lastPrefix = spaceIdx > 0 ? part.slice(0, spaceIdx).trim() : part;
      resolved.push(part);
      continue;
    }

    const prefixedAmpMatch = part.match(/^(.+?)\s+&([.:#\[][\s\S]*)$/);
    if (prefixedAmpMatch) {
      lastPrefix = prefixedAmpMatch[1].trim();
      resolved.push(`${lastPrefix}${prefixedAmpMatch[2]}`);
      continue;
    }

    const leadingAmpMatch = part.match(/^&([.:#\[][\s\S]*)$/);
    if (leadingAmpMatch) {
      const suffix = leadingAmpMatch[1];
      if (lastPrefix) {
        resolved.push(`${lastPrefix}${suffix}`);
      } else if (suffix.startsWith(':')) {
        // Scope top-level `&::after` / `&:hover` to `:root` (CSS Nesting top-level `&` semantics), never universal `*::after`
        resolved.push(`:root${suffix}`);
      } else {
        resolved.push(suffix);
      }
      continue;
    }

    const trailingAmpMatch = part.match(/^(.*?\S)\s+&$/);
    if (trailingAmpMatch) {
      resolved.push(trailingAmpMatch[1].trim());
      continue;
    }

    const cleaned = part.replace(/\s*&\s*/g, ' ').trim();
    if (cleaned) {
      resolved.push(cleaned.startsWith(':') ? `:root${cleaned}` : cleaned);
    }
  }
  return resolved.join(', ');
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
    return resolveTopLevelSelector(trimmedChild);
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
 * @zh 将兼容 `7.4.52` JSS 结构的样式对象树（含 `@global`、`@media`、`@keyframes` 与多层 `&` 嵌套）序列化为标准 CSS 文本。
 * @param rules - style object (`Record<string, unknown>`) / 样式规则对象（`Record<string, unknown>`）
 * @param parentSelector - optional parent selector (`string`) / 可选父级选择器（`string`）
 * @returns Serialized CSS string (`string`) / 序列化后的标准 CSS 字符串（`string`）
 */
export function serializeThemeRulesToCss(
  rules: Record<string, unknown>,
  parentSelector: string = ''
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

let sheetSequence = 0;

/**
 * Creates a `<style>`-tag backed `DuiStyleSheet` (never uses `document.adoptedStyleSheets`) so DOM cascade order matches `7.4.52`.
 * @zh 创建基于真实 `<style>` 标签的 `DuiStyleSheet`（不使用 `adoptedStyleSheets`），确保与 `7.4.52` 一致的 DOM 层叠顺序。
 * @param rules - JSS-compatible style object (`Record<string, unknown>`) / JSS 兼容样式规则对象
 * @param role - semantic role attribute (`string`) / 样式表角色标记（`core` | `material-theme` | `component`）
 * @param replaceTarget - optional existing `<style>` element to replace in-place / 可选的原位替换目标 `<style>` 节点
 * @param insertBeforeNode - optional reference node in `document.head` / 可选的插入锚点节点
 * @returns `DuiStyleSheet` instance / `DuiStyleSheet` 实例
 */
function createStyleTagSheet(
  rules: Record<string, unknown>,
  role: string = 'custom',
  replaceTarget: HTMLStyleElement | null = null,
  insertBeforeNode: Node | null = null
): DuiStyleSheet {
  const cssText = serializeThemeRulesToCss(rules);
  const sheetId = `dui-sheet-${++sheetSequence}`;
  let styleEl: HTMLStyleElement | null = null;

  const handle: DuiStyleSheet = {
    cssText,
    get element(): HTMLStyleElement | null {
      return styleEl;
    },
    attach(): DuiStyleSheet {
      if (typeof document === 'undefined' || !document.head) {
        return handle;
      }
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.setAttribute('data-jss', '');
        styleEl.setAttribute('data-dui-sheet', sheetId);
        styleEl.setAttribute('data-dui-role', role);
        styleEl.textContent = cssText;
      }
      if (!styleEl.isConnected) {
        if (replaceTarget && replaceTarget.parentNode === document.head) {
          document.head.replaceChild(styleEl, replaceTarget);
          replaceTarget = null;
        } else if (insertBeforeNode && insertBeforeNode.parentNode === document.head) {
          document.head.insertBefore(styleEl, insertBeforeNode);
        } else {
          document.head.appendChild(styleEl);
        }
      }
      return handle;
    },
    detach(): void {
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    },
    toString(): string {
      return cssText;
    },
  };

  return handle;
}

/**
 * Executes `createMaterialCoreStyles` to create Material core `<style>` stylesheet rules.
 * @zh 执行 `createMaterialCoreStyles`，创建 Material 核心 `<style>` 样式表。
 * @param typographyConfig - typography config parameter (`TypographyConfig`) / 排版配置参数
 * @param override - override style rules (`Object`) / 覆盖样式规则
 * @param _dynamic - dynamic flag kept for `7.4.52` signature parity (`boolean`) / 保持 `7.4.52` 签名兼容的动态参数
 * @returns `DuiStyleSheet` handle / `DuiStyleSheet` 样式表句柄
 */
export function createMaterialCoreStyles(
  typographyConfig: TypographyConfig | null = null,
  override: Object = {},
  _dynamic: boolean = false
): DuiStyleSheet {
  const styles: Record<string, unknown> = {
    '@global': mergeThemeStyleMaps(matCore(typographyConfig), override),
  };
  return createStyleTagSheet(styles, 'core');
}

/**
 * Executes `createMaterialThemeStyles` to create Material + DUI M2 `<style>` stylesheet rules.
 * @zh 执行 `createMaterialThemeStyles`，创建 Material 与 DUI M2 完整 `<style>` 主题样式表。
 * @param theme - runtime theme (`Theme`) / 运行时主题对象（`Theme`）
 * @param override - override style rules (`Object`) / 覆盖样式规则
 * @param _dynamic - dynamic flag kept for `7.4.52` signature parity (`boolean`) / 保持 `7.4.52` 签名兼容的动态参数
 * @returns `DuiStyleSheet` handle / `DuiStyleSheet` 样式表句柄
 */
export function createMaterialThemeStyles(
  theme: Theme,
  override: Object = {},
  _dynamic: boolean = false
): DuiStyleSheet {
  const styles: Record<string, unknown> = {
    '@global': mergeThemeStyleMaps(materialTheme(theme), override),
  };
  return createStyleTagSheet(styles, 'material-theme');
}

/**
 * Injectable Angular service `ThemeService` managing M2 dynamic theme state and `<style>` tag injection in `src/theme`.
 * @zh 可注入的 Angular 服务 `ThemeService`，管理 M2 动态主题状态、三档密度与 `<style>` 标签层叠注入。
 */
@Injectable()
export class ThemeService {
  private _primaryStr: string = '';
  private _accentStr: string = '';
  private _typography: string = 'compact';
  private _warnStr: string = '';
  private _type: string = 'light';
  private _density: number = -1;

  /**
   * Property `formType` (`BehaviorSubject<MatFormFieldAppearance>`) storing active form field appearance.
   * @zh 属性 `formType`（类型：`BehaviorSubject<MatFormFieldAppearance>`），存储当前表单外观模式。
   */
  public formType: BehaviorSubject<MatFormFieldAppearance> =
    new BehaviorSubject<MatFormFieldAppearance>('fill');

  private theme!: Theme;

  /**
   * Property `dotosConfig` (`DotosConfig`) storing current DotOS layout and theme configuration.
   * @zh 属性 `dotosConfig`（类型：`DotosConfig`），存储当前 DotOS 布局与主题配置。
   */
  public dotosConfig!: DotosConfig;

  private _coreStyleSheet?: DuiStyleSheet;
  private _materialThemeStyleSheet?: DuiStyleSheet;

  /**
   * Per-`themeFn` `<style>` handles so distinct components coexist in registration order and repeated calls replace in-place.
   * @zh 每个 `themeFn` 独立维护一张 `<style>` 样式表，不同组件共存且保持注册层叠顺序，同一组件重复调用原位更新。
   */
  private _loadedThemeStyleSheets: Map<(theme: Theme) => unknown, DuiStyleSheet> = new Map();

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
  };

  /**
   * Property `instance` (`ThemeService`) storing singleton service reference.
   * @zh 属性 `instance`（类型：`ThemeService`），存储单例服务实例。
   */
  protected static instance: ThemeService | null = null;

  /**
   * Executes `getInstance` to obtain or lazily construct the `ThemeService` singleton.
   * @zh 执行 `getInstance`，获取或延迟创建 `ThemeService` 单例。
   * @returns `ThemeService` instance / `ThemeService` 实例
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
   * @zh 创建 `ThemeService` 实例并注册为当前单例。
   * @param localStore - Injected local storage service (`LocalStorageService`) / 本地存储服务（`LocalStorageService`）
   */
  public constructor(public localStore: LocalStorageService) {
    ThemeService.instance = this;
  }

  /**
   * Executes `refreshTheme` to load `dotosConfig` from `LocalStorageService` (or fallback to `DEFAULT_CONFIG`) and apply it.
   * @zh 执行 `refreshTheme`，从本地存储读取 `dotosConfig`（不可用时回退至默认配置）并应用主题。
   */
  public refreshTheme(): void {
    const rawConfig = this.localStore ? (this.localStore.get('dotosConfig') as DotosConfig | null) : null;
    this.setTheme(this.isUsableConfig(rawConfig) ? rawConfig : ThemeService.DEFAULT_CONFIG);
  }

  private isUsableConfig(config: DotosConfig | null | undefined): config is DotosConfig {
    return Boolean(
      config &&
        config.theme &&
        config.layout &&
        config.theme.primary &&
        config.theme.accent &&
        config.theme.warn
    );
  }

  /**
   * Executes `getFormType` to return the synchronous `MatFormFieldAppearance` value.
   * @zh 执行 `getFormType`，获取当前表单字段外观模式。
   * @returns Current `MatFormFieldAppearance` / 当前表单外观模式
   */
  public getFormType(): MatFormFieldAppearance {
    return this.formType.getValue();
  }

  /**
   * Executes `setTheme` to store `config` and apply its palette, mode, density, and `formType`.
   * @zh 执行 `setTheme`，保存配置并应用其主辅警色、底色模式、紧凑度与表单样式。
   * @param config - DotOS configuration (`DotosConfig`) / DotOS 配置对象（`DotosConfig`）
   */
  public setTheme(config: DotosConfig): void {
    const usable = this.isUsableConfig(config) ? config : ThemeService.DEFAULT_CONFIG;
    this.dotosConfig = usable;
    const themeCfg = usable.theme ?? ThemeService.DEFAULT_CONFIG.theme!;
    this.changeTheme(
      themeCfg.primary,
      themeCfg.accent,
      themeCfg.warn,
      themeCfg.type,
      usable.layout.pagemodel,
      themeCfg.formType
    );
  }

  /**
   * Parses color strings like `teal-600`, `blue-500`, `deep-purple-A200` into full M2 `Palette` maps.
   * @zh 将 `teal-600`、`blue-500` 等色阶字符串拆解为基础色板与色阶并构造 M2 `Palette`。
   * @param colorStr - Color string (`string`) / 色阶字符串（`string`）
   * @param fallbackColor - Fallback color name (`string`) / 兜底色板名
   * @param fallbackHue - Fallback hue (`string`) / 兜底色阶
   * @returns Constructed M2 `Palette` / 构造完成的 M2 `Palette`
   */
  private toPalette(colorStr: string, fallbackColor: string = 'teal', fallbackHue: string = '600'): Palette {
    if (typeof colorStr === 'string' && colorStr.includes('-')) {
      const separator = colorStr.lastIndexOf('-');
      const colorName = colorStr.substring(0, separator);
      const hue = colorStr.substring(separator + 1);
      const base = MatColors.getColor(colorName) as Palette | false;
      if (base && typeof base === 'object' && base[hue]) {
        return matPalette(base, hue, 100, 900);
      }
    }
    const fallbackBase = MatColors.getColor(fallbackColor) as Palette;
    return matPalette(fallbackBase, fallbackHue, 100, 900);
  }

  private resolveTypographyKey(typography: string): 'loose' | 'normal' | 'compact' {
    if (typography === 'loose' || typography === 'normal' || typography === 'compact') {
      return typography;
    }
    return 'compact';
  }

  private buildTheme(type: string): Theme {
    const primary = this.toPalette(this._primaryStr, 'teal', '600');
    const accent = this.toPalette(this._accentStr, 'orange', '800');
    const warn = this.toPalette(this._warnStr, 'red', '800');
    const typoKey = this.resolveTypographyKey(this._typography);
    const typographyConfig: TypographyConfig = TypographyMap[typoKey];

    if (type === 'dark') {
      return matDarkTheme(primary, accent, warn, this._density, typographyConfig);
    }
    if (type === 'light') {
      return matLightTheme(primary, accent, warn, this._density, typographyConfig);
    }
    return matDarkBlueTheme(primary, accent, warn, this._density, typographyConfig);
  }

  private syncDocumentThemeAttributes(type: string, typography: string): void {
    if (typeof document === 'undefined') {
      return;
    }
    const normalizedType = type === 'dark' || type === 'darkblue' ? type : 'light';
    const normalizedTypo = this.resolveTypographyKey(typography);
    if (document.documentElement) {
      document.documentElement.setAttribute('data-theme', normalizedType);
      document.documentElement.setAttribute('data-density', normalizedTypo);
    }
    if (document.body) {
      document.body.classList.remove('dui-density-loose', 'dui-density-normal', 'dui-density-compact');
      document.body.classList.add(`dui-density-${normalizedTypo}`);
    }
  }

  private firstLoadedComponentNode(): HTMLStyleElement | null {
    for (const sheet of this._loadedThemeStyleSheets.values()) {
      if (sheet.element && sheet.element.isConnected) {
        return sheet.element;
      }
    }
    return null;
  }

  /**
   * Executes `loadTheme` to inject or update a component's dynamic `<style>` stylesheet after `core` and `material-theme`.
   * @zh 执行 `loadTheme`，在 `core` 与 `material-theme` 之后挂载或原位更新组件级 `<style>` 主题样式表。
   * @param themeFn - Component theme factory (`(theme: Theme) => unknown`) / 组件主题生成函数
   */
  public loadTheme(themeFn: (theme: Theme) => unknown): void {
    if (!this._primaryStr) {
      this.refreshTheme();
    }

    this.theme = this.buildTheme(this._type);
    const previousSheet = this._loadedThemeStyleSheets.get(themeFn);
    const previousEl = previousSheet?.element ?? null;
    const styleSheet = createStyleTagSheet(
      { '@global': this.getThemeStyle(themeFn, this.theme) },
      'component',
      previousEl
    );
    if (previousSheet && (!previousEl || !previousEl.isConnected)) {
      this.removeStyleSheet(previousSheet);
    }
    this._loadedThemeStyleSheets.set(themeFn, styleSheet);
    styleSheet.attach();
  }

  private removeStyleSheet(styleSheet?: DuiStyleSheet): void {
    if (styleSheet) {
      styleSheet.detach();
    }
  }

  /**
   * Executes `createThemeStyles` to construct a `<style>`-backed `DuiStyleSheet` for a component `themeFn`.
   * @zh 执行 `createThemeStyles`，为组件主题函数构造基于 `<style>` 标签的 `DuiStyleSheet`。
   * @param theme - Runtime theme (`Theme`) / 运行时主题对象（`Theme`）
   * @param themeFn - Component theme factory (`(theme: Theme) => unknown`) / 组件主题生成函数
   * @param _dynamicThemeStyles - Dynamic flag kept for `7.4.52` parity (`boolean`) / 动态样式参数
   * @returns `DuiStyleSheet` handle / `DuiStyleSheet` 样式表句柄
   */
  public createThemeStyles(
    theme: Theme,
    themeFn: (theme: Theme) => unknown,
    _dynamicThemeStyles: boolean = true
  ): DuiStyleSheet {
    const styles: Record<string, unknown> = {
      '@global': this.getThemeStyle(themeFn, theme),
    };
    return createStyleTagSheet(styles, 'component');
  }

  /**
   * Executes `getThemeStyle` to evaluate `themeFn(theme)` into a plain style rule map.
   * @zh 执行 `getThemeStyle`，调用 `themeFn(theme)` 并返回样式规则对象。
   * @param themeFn - Component theme factory (`(theme: Theme) => unknown`) / 组件主题生成函数
   * @param theme - Runtime theme (`Theme`) / 运行时主题对象（`Theme`）
   * @returns Plain style object (`Record<string, unknown>`) / 样式规则对象
   */
  public getThemeStyle(themeFn: (theme: Theme) => unknown, theme: Theme): Record<string, unknown> {
    const result = themeFn(theme);
    if (isPlainStyleObject(result)) {
      return { ...result };
    }
    return {};
  }

  /**
   * Executes `changeThemeWithConfig` to apply a `DotosConfig` update to the active theme.
   * @zh 执行 `changeThemeWithConfig`，根据传入的 `DotosConfig` 切换当前主题。
   * @param config - DotOS configuration (`DotosConfig`) / DotOS 配置对象（`DotosConfig`）
   */
  public changeThemeWithConfig(config: DotosConfig): void {
    const usable = this.isUsableConfig(config) ? config : ThemeService.DEFAULT_CONFIG;
    this.dotosConfig = usable;
    const themeCfg = usable.theme ?? ThemeService.DEFAULT_CONFIG.theme!;
    this.changeTheme(
      themeCfg.primary,
      themeCfg.accent,
      themeCfg.warn,
      themeCfg.type,
      usable.layout.pagemodel,
      themeCfg.formType
    );
  }

  /**
   * Executes `changeTheme` to switch palettes, mode (`light`/`dark`/`darkblue`), density/typography (`loose`/`normal`/`compact`), and `formType`,
   * updating `<style>` tags in `<head>` in strict `7.4.52` cascade order (`core` -> `material-theme` -> `loadTheme`).
   * @zh 执行 `changeTheme`，即时切换调色板、底色模式、紧凑度字阶与表单外观，并按 `7.4.52` 严格层叠顺序更新 `<head>` 中的 `<style>` 标签。
   * @param primaryStr - Primary palette string (`string`, e.g. `'teal-600'`, `'blue-500'`) / 主色字符串
   * @param accentStr - Accent palette string (`string`, e.g. `'orange-800'`) / 强调色字符串
   * @param warnStr - Warn palette string (`string`, e.g. `'red-800'`) / 警告色字符串
   * @param type - Theme mode (`string`: `'light' | 'dark' | 'darkblue'`) / 底色模式
   * @param typography - Typography & density scale (`string`: `'loose' | 'normal' | 'compact'`) / 字阶与紧凑度档位
   * @param formType - Form field appearance (`MatFormFieldAppearance`) / 表单外观类型
   */
  public changeTheme(
    primaryStr: string,
    accentStr: string,
    warnStr: string,
    type: string,
    typography: string,
    formType: MatFormFieldAppearance = 'fill'
  ): void {
    const resolvedTypo = this.resolveTypographyKey(typography);
    this._primaryStr = primaryStr;
    this._accentStr = accentStr;
    this._warnStr = warnStr;
    this._type = type;
    this._typography = resolvedTypo;
    this._density = resolvedTypo === 'loose' ? 0 : resolvedTypo === 'normal' ? -1 : -2;
    this.formType.next(formType ?? 'fill');
    this.syncDocumentThemeAttributes(type, resolvedTypo);

    const typographyConfig: TypographyConfig = TypographyMap[resolvedTypo];
    const firstComponentEl = this.firstLoadedComponentNode();
    const prevMaterialEl = this._materialThemeStyleSheet?.element ?? null;
    const prevCoreEl = this._coreStyleSheet?.element ?? null;

    // 1. Mount/replace `core` <style> first (before `material-theme` or any component <style>)
    const nextCoreSheet = createStyleTagSheet(
      { '@global': mergeThemeStyleMaps(matCore(typographyConfig)) },
      'core',
      prevCoreEl,
      prevMaterialEl ?? firstComponentEl
    );
    if (this._coreStyleSheet && (!prevCoreEl || !prevCoreEl.isConnected)) {
      this.removeStyleSheet(this._coreStyleSheet);
    }
    this._coreStyleSheet = nextCoreSheet;
    this._coreStyleSheet.attach();

    // 2. Mount/replace `material-theme` <style> second (after `core`, before any `loadTheme` component <style>)
    this.theme = this.buildTheme(type);
    const nextMaterialSheet = createStyleTagSheet(
      { '@global': mergeThemeStyleMaps(materialTheme(this.theme)) },
      'material-theme',
      prevMaterialEl,
      firstComponentEl
    );
    if (this._materialThemeStyleSheet && (!prevMaterialEl || !prevMaterialEl.isConnected)) {
      this.removeStyleSheet(this._materialThemeStyleSheet);
    }
    this._materialThemeStyleSheet = nextMaterialSheet;
    this._materialThemeStyleSheet.attach();

    // 3. Re-evaluate and replace every registered `loadTheme` component <style> in registration order
    Array.from(this._loadedThemeStyleSheets.entries()).forEach(([themeFn, oldSheet]) => {
      const oldEl = oldSheet.element;
      const updatedSheet = createStyleTagSheet(
        { '@global': this.getThemeStyle(themeFn, this.theme) },
        'component',
        oldEl
      );
      if (!oldEl || !oldEl.isConnected) {
        this.removeStyleSheet(oldSheet);
      }
      this._loadedThemeStyleSheets.set(themeFn, updatedSheet);
      updatedSheet.attach();
    });
  }

  /**
   * Executes `getThemeByType` to obtain the current `Theme` (`'default'`) or construct a `Theme` for a specific mode.
   * @zh 执行 `getThemeByType`，获取当前主题（`'default'`）或按指定底色类型构造主题对象。
   * @param type - Theme type (`string`) / 主题类型（`string`）
   * @returns Resolved `Theme` object / 解析后的 `Theme` 对象
   */
  public getThemeByType(type: string): Theme {
    if (type === 'default') {
      return this.getTheme();
    }
    if (!this._primaryStr) {
      this.refreshTheme();
    }
    return this.buildTheme(type);
  }

  /**
   * Executes `getTheme` to return the currently active `Theme` (initializing defaults if not yet initialized).
   * @zh 执行 `getTheme`，返回当前生效的 `Theme` 对象（若尚未初始化则自动加载默认配置）。
   * @returns Active `Theme` object / 当前生效的 `Theme` 对象
   */
  public getTheme(): Theme {
    if (!this.theme) {
      this.refreshTheme();
    }
    return this.theme;
  }
}

/**
 * Constant `THEME_SERVICE_PROVIDER` providing singleton `ThemeService` via `ThemeService.getInstance()`.
 * @zh 常量 `THEME_SERVICE_PROVIDER`，通过 `ThemeService.getInstance()` 提供单例 `ThemeService`。
 */
export const THEME_SERVICE_PROVIDER: Provider = {
  provide: ThemeService,
  useFactory: (): ThemeService => {
    return ThemeService.getInstance();
  },
};
