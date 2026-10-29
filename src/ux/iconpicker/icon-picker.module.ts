/**
 * @fileoverview Module `src/ux/iconpicker/icon-picker.module.ts` providing icon picker module definitions and implementation.
 * @zh 模块文件 `src/ux/iconpicker/icon-picker.module.ts`，提供图标选择器模块相关的定义与实现。
 */

import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';

import { FlexLayoutModule } from 'ngx-flexible-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormModule } from '@dotos/dui/form';
import { Dui, StyleModule } from '@dotos/dui/core';

import { IconPickerField } from './icon-picker.field';

import { IconPickerComponent } from './icon-picker.component';
import { SearchIconPipe } from './search-icon.pipe';
import { TextDirective } from './text.directive';
import { TranslateModule, TranslationService } from '@dotos/dui/translator';
import { IconModule } from '@dotos/dui/common/icon';
import { MatButtonModule } from '@angular/material/button';


/**
 * Angular module `IconPickerModule` declaring and exporting icon picker module components, directives, pipes, and providers.
 * @zh Angular 模块 `IconPickerModule`，声明并导出图标选择器模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    IconModule,
    OverlayModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    PortalModule,
    StyleModule,
    MatIconModule,
    A11yModule,
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    FlexLayoutModule,
    FormModule.forChild()
  ],
  exports: [
     
    IconPickerField,
  ],
  declarations: [
    IconPickerField,
    TextDirective,
    IconPickerComponent,
    SearchIconPipe
  ]
})
export class IconPickerModule {
  /**
   * Property `entryComponents` (`(typeof IconPickerField | typeof IconPickerComponent)[]`) storing entry components (default: `[ IconPickerField, IconPickerComponent]`).
   * @zh 属性 `entryComponents`（类型：`(typeof IconPickerField | typeof IconPickerComponent)[]`），用于存储或配置条目组件列表（默认值：`[ IconPickerField, IconPickerComponent]`）。
   */
  entryComponents = [
    IconPickerField,
    IconPickerComponent];
  /**
   * Creates an instance of `IconPickerModule` and initializes its dependencies and internal state.
   * @zh 创建 `IconPickerModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver,
    translateService: TranslationService) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
