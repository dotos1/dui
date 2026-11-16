/**
 * @fileoverview Module `src/ux/query-builder/angular2-query-builder.module.ts` providing angular2 query builder module definitions and implementation.
 * @zh 模块文件 `src/ux/query-builder/angular2-query-builder.module.ts`，提供angular2查询构建器模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, } from '@angular/forms';
import { QueryBuilderComponent } from './query-builder.component';
import { QueryArrowIconDirective } from './query-arrow-icon.directive';
import { QueryFieldDirective } from './query-field.directive';
import { QueryInputDirective } from './query-input.directive';
import { QueryEntityDirective } from './query-entity.directive';
import { QueryOperatorDirective } from './query-operator.directive';
import { QueryButtonGroupDirective } from './query-button-group.directive';
import { QuerySwitchGroupDirective } from './query-switch-group.directive';
import { QueryRemoveButtonDirective } from './query-remove-button.directive';
import { QueryEmptyWarningDirective } from './query-empty-warning.directive';
import { TranslateModule } from '@dotos1/dui/translator';

/**
 * Angular module `QueryBuilderModule` declaring and exporting query builder module components, directives, pipes, and providers.
 * @zh Angular 模块 `QueryBuilderModule`，声明并导出查询构建器模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule
  ],
  declarations: [
    QueryBuilderComponent,
    QueryInputDirective,
    QueryOperatorDirective,
    QueryFieldDirective,
    QueryEntityDirective,
    QueryButtonGroupDirective,
    QuerySwitchGroupDirective,
    QueryRemoveButtonDirective,
    QueryEmptyWarningDirective,
    QueryArrowIconDirective
  ],
  exports: [
    QueryBuilderComponent,
    QueryInputDirective,
    QueryOperatorDirective,
    QueryFieldDirective,
    QueryEntityDirective,
    QueryButtonGroupDirective,
    QuerySwitchGroupDirective,
    QueryRemoveButtonDirective,
    QueryEmptyWarningDirective,
    QueryArrowIconDirective
  ]
})
export class QueryBuilderModule { }
