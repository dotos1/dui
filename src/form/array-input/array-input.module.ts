/**
 * @fileoverview Module `src/form/array-input/array-input.module.ts` providing array input module definitions and implementation.
 * @zh 模块文件 `src/form/array-input/array-input.module.ts`，提供数组输入属性模块相关的定义与实现。
 */

import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

import { Dui } from '@dotos/dui/core';
import { TranslateModule, TranslationService } from '@dotos/dui/translator';

import { FormModule } from '../components/form.module';
import { ArrayInputComponent } from './array-input.component';
import { CommonFieldModule } from '../field';

/**
 * Angular module `ArrayInputModule` declaring and exporting array input module components, directives, pipes, and providers.
 * @zh Angular 模块 `ArrayInputModule`，声明并导出数组输入属性模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    ArrayInputComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    CommonFieldModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule,
    MatChipsModule,
    FormModule.forChild(),
  ],
  exports: [
    ArrayInputComponent
  ]
})
export class ArrayInputModule {
  /**
   * Property `entryComponents` (`any[]`) storing entry components (default: `[ ArrayInputComponent]`).
   * @zh 属性 `entryComponents`（类型：`any[]`），用于存储或配置条目组件列表（默认值：`[ ArrayInputComponent]`）。
   */
  entryComponents = [
    ArrayInputComponent];
  /**
   * Creates an instance of `ArrayInputModule` and initializes its dependencies and internal state.
   * @zh 创建 `ArrayInputModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver,
    translateService: TranslationService) {
      Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
