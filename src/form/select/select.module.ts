/**
 * @fileoverview Module `src/form/select/select.module.ts` providing select module definitions and implementation.
 * @zh 模块文件 `src/form/select/select.module.ts`，提供下拉选择模块相关的定义与实现。
 */

import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Dui } from '@dotos/dui/core';
import { TranslateModule, TranslationService } from '@dotos/dui/translator';
import { FormModule } from '../components/form.module';
import { FieldSelect } from './select.field';
import { SelectPipeModule } from '../base/select.module';

import { SelectOptionsService } from './options.service';
import { MatSelectSearchModule } from './search/mat-select-search.module';

/**
 * Angular module `SelectFieldModule` declaring and exporting select field module components, directives, pipes, and providers.
 * @zh Angular 模块 `SelectFieldModule`，声明并导出下拉选择字段模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    PortalModule,
    OverlayModule,
    SelectPipeModule,
    TranslateModule,
    MatSelectSearchModule,
    MatPseudoCheckboxModule,
    FormModule.forChild(),
  ],
  declarations: [
    FieldSelect
  ],
  exports: [
    FieldSelect
  ],
  providers: [
    SelectOptionsService
  ]
})
export class SelectFieldModule {
  /**
   * Property `entryComponents` (`any[]`) storing entry components (default: `[ FieldSelect]`).
   * @zh 属性 `entryComponents`（类型：`any[]`），用于存储或配置条目组件列表（默认值：`[ FieldSelect]`）。
   */
  entryComponents = [ FieldSelect];
  /**
   * Creates an instance of `SelectFieldModule` and initializes its dependencies and internal state.
   * @zh 创建 `SelectFieldModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver,  translateService: TranslationService,) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
