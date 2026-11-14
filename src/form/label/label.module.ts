/**
 * @fileoverview Module `src/form/label/label.module.ts` providing label module definitions and implementation.
 * @zh 模块文件 `src/form/label/label.module.ts`，提供标签模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from '../components/form.module';
import { TranslateModule, TranslationService } from '@dotos/dui/translator';
import { Dui } from '@dotos/dui/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { LabelField } from './label-field';


/**
 * Angular module `LabelFieldModule` declaring and exporting label field module components, directives, pipes, and providers.
 * @zh Angular 模块 `LabelFieldModule`，声明并导出标签字段模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    LabelField
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    TranslateModule,
    FormModule.forChild()
  ],
  exports: [
    LabelField
  ]
})
export class LabelFieldModule {
  /**
   * Property `entryComponents` (`(typeof LabelField)[]`) storing entry components (default: `[ LabelField ]`).
   * @zh 属性 `entryComponents`（类型：`(typeof LabelField)[]`），用于存储或配置条目组件列表（默认值：`[ LabelField ]`）。
   */
  entryComponents = [
    LabelField
  ];
  /**
   * Creates an instance of `LabelFieldModule` and initializes its dependencies and internal state.
   * @zh 创建 `LabelFieldModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   */
  constructor(translateService: TranslationService) {
      Dui.registerComponentFactory(this.entryComponents);
     translateService.addTranslationFolder('dui', 'i18n');
  }
}
