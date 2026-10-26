/**
 * @fileoverview Module `src/form/select/search/default-options.ts` providing default options definitions and implementation.
 * @zh 模块文件 `src/form/select/search/default-options.ts`，提供默认配置选项相关的定义与实现。
 */

import { InjectionToken } from '@angular/core';
import { MatSelectSearchComponent } from './mat-select-search.component';


/**
 * Constant/variable `configurableDefaultOptions` defining configurable default options in `src/form/select/search`.
 * @zh 常量/变量 `configurableDefaultOptions`，定义 `src/form/select/search` 中的configurable默认配置选项。
 */
export const configurableDefaultOptions = [
  'ariaLabel',
  'clearSearchInput',
  'closeIcon',
  'closeSvgIcon',
  'disableInitialFocus',
  'disableScrollToActiveOnOptionsChanged',
  'enableClearOnEscapePressed',
  'noEntriesFoundLabel',
  'placeholderLabel',
  'preventHomeEndKeyPropagation',
  'searching',
] as const;

/**
 * Type alias `ConfigurableDefaultOptions` representing configurable default options (`typeof configurableDefaultOptions[number]`).
 * @zh 类型别名 `ConfigurableDefaultOptions`，表示Configurable默认配置选项（`typeof configurableDefaultOptions[number]`）。
 */
export type ConfigurableDefaultOptions = typeof configurableDefaultOptions[number];

/**
 * Angular dependency-injection token `MAT_SELECTSEARCH_DEFAULT_OPTIONS` for providing mat selectsearch default options.
 * @zh Angular 依赖注入令牌 `MAT_SELECTSEARCH_DEFAULT_OPTIONS`，用于提供与注入MaterialSELECTSEARCH默认配置选项。
 */
export const MAT_SELECTSEARCH_DEFAULT_OPTIONS = new InjectionToken<MatSelectSearchOptions>('mat-selectsearch-default-options');


/**
 * Type alias `MatSelectSearchOptions` representing mat select search options (`Readonly<Partial<Pick<MatSelectSearchComponent, ConfigurableDefaultOpt...`).
 * @zh 类型别名 `MatSelectSearchOptions`，表示Material下拉选择搜索配置选项（`Readonly<Partial<Pick<MatSelectSearchComponent, ConfigurableDefaultOpt...`）。
 */
export type MatSelectSearchOptions = Readonly<Partial<Pick<MatSelectSearchComponent, ConfigurableDefaultOptions>>>;
