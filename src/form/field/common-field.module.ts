/**
 * @fileoverview Module `src/form/field/common-field.module.ts` providing common field module definitions and implementation.
 * @zh 模块文件 `src/form/field/common-field.module.ts`，提供通用字段模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule, TranslationService } from '@dotos1/dui/translator';
import { Dui } from '@dotos1/dui/core';

import { FormModule } from '../components/form.module';
import { TextFieldComponent } from './textfield.component';
import { DisplayFieldComponent } from './displayfield.component';
import { HiddenFieldComponent } from './hiddenfield.component';
import { NumberFieldComponent } from './numberfield.component';
import { TextAreaComponent } from './textarea.component';
import { OptionsService } from './options.service';



/**
 * Angular module `CommonFieldModule` declaring and exporting common field module components, directives, pipes, and providers.
 * @zh Angular 模块 `CommonFieldModule`，声明并导出通用字段模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    TextFieldComponent,
    DisplayFieldComponent,
    HiddenFieldComponent,
    NumberFieldComponent,
    TextAreaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule,
    MatChipsModule,
    FormModule.forChild()
  ],
  exports: [
    TextFieldComponent,
    DisplayFieldComponent,
    HiddenFieldComponent,
    NumberFieldComponent,
    TextAreaComponent
  ],
  providers: [
    OptionsService
  ]
})
export class CommonFieldModule {
  /**
   * Property `entryComponents` (`(typeof TextFieldComponent | typeof HiddenFieldComponent | typeof NumberFieldComponent)[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`(typeof TextFieldComponent | typeof HiddenFieldComponent | typeof NumberFieldComponent)[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [
    TextFieldComponent,
    DisplayFieldComponent,
    HiddenFieldComponent,
    NumberFieldComponent,
    TextAreaComponent];
  /**
   * Creates an instance of `CommonFieldModule` and initializes its dependencies and internal state.
   * @zh 创建 `CommonFieldModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   */
  constructor(translateService: TranslationService) {
      Dui.registerComponentFactory(this.entryComponents);
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
