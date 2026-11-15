/**
 * @fileoverview Module `src/form/select/search/mat-select-search.module.ts` providing mat select search module definitions and implementation.
 * @zh 模块文件 `src/form/select/search/mat-select-search.module.ts`，提供Material下拉选择搜索模块相关的定义与实现。
 */


import { NgModule } from '@angular/core';
import { MatSelectSearchComponent } from './mat-select-search.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

import { MatSelectSearchClearDirective } from './mat-select-search-clear.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectNoEntriesFoundDirective } from './mat-select-no-entries-found.directive';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@dotos1/dui/translator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/**
 * Constant/variable `MatSelectSearchVersion` defining mat select search version in `src/form/select/search`.
 * @zh 常量/变量 `MatSelectSearchVersion`，定义 `src/form/select/search` 中的Material下拉选择搜索Version。
 */
export const MatSelectSearchVersion = '8.0.1';
export { MatSelectSearchClearDirective };
export { MatSelectNoEntriesFoundDirective };

/**
 * Angular module `MatSelectSearchModule` declaring and exporting mat select search module components, directives, pipes, and providers.
 * @zh Angular 模块 `MatSelectSearchModule`，声明并导出Material下拉选择搜索模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
     TranslateModule,
     MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  declarations: [
    MatSelectSearchComponent,
    MatSelectSearchClearDirective,
    MatSelectNoEntriesFoundDirective
  ],
  exports: [
    MatSelectSearchComponent,
    MatSelectSearchClearDirective,
    MatSelectNoEntriesFoundDirective
  ]
})
export class MatSelectSearchModule {
}
