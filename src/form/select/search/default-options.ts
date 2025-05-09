import { InjectionToken } from '@angular/core';
import { MatSelectSearchComponent } from './mat-select-search.component';


export const configurableDefaultOptions = [
  'ariaLabel',
  'clearSearchInput',
  'closeIcon',
  'closeSvgIcon',
  'disableInitialFocus',
  'disableScrollToActiveOnOptionsChanged',
  'enableClearOnEscapePressed',
  'hideClearSearchButton',
  'noEntriesFoundLabel',
  'placeholderLabel',
  'preventHomeEndKeyPropagation',
  'searching',
] as const;

export type ConfigurableDefaultOptions = typeof configurableDefaultOptions[number];

export const MAT_SELECTSEARCH_DEFAULT_OPTIONS = new InjectionToken<MatSelectSearchOptions>('mat-selectsearch-default-options');

/** Global configurable options for MatSelectSearch. */
export type MatSelectSearchOptions = Readonly<Partial<Pick<MatSelectSearchComponent, ConfigurableDefaultOptions>>>;
