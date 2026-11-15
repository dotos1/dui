/**
 * @fileoverview Module `src/form/wrapper/wrapper.module.ts` providing wrapper module definitions and implementation.
 * @zh 模块文件 `src/form/wrapper/wrapper.module.ts`，提供包装器模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '../components/form.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from 'ngx-flexible-layout';

import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

import { PopoverModule } from '@dotos1/dui/common/popover';
import { ButtonModule } from '@dotos1/dui/ui/button';
import { ConfigOption, AbstractFormModule } from '@dotos1/dui/core/form';

import { WrapperEditorField } from './editor-field';
import { ExtFieldWrapper } from './field-wrapper';
import { WrapperFormField } from './form-field';
import { LabelWrapperField } from './label-field';
import { FormSection } from './form.section';
import { RepeatTypeComponent } from './repeat-section.type';
import { RowEditorComponent } from './row.editor';
import { Fieldset } from './fieldset';
import { Dui } from '@dotos1/dui/core';
import { TranslateModule } from '@dotos1/dui/translator';
import { MatButtonModule } from '@angular/material/button';

/**
 * Constant/variable `FIELD_TYPE_COMPONENTS` defining field type components in `src/form/wrapper`.
 * @zh 常量/变量 `FIELD_TYPE_COMPONENTS`，定义 `src/form/wrapper` 中的字段类型组件列表。
 */
export const FIELD_TYPE_COMPONENTS = [
  FormSection,
  ExtFieldWrapper,
  WrapperFormField,
  LabelWrapperField,
  Fieldset,
  WrapperEditorField,
  RepeatTypeComponent,
  RowEditorComponent
];

/**
 * Constant/variable `MATERIAL_FORMLY_CONFIG` defining material formly config in `src/form/wrapper`.
 * @zh 常量/变量 `MATERIAL_FORMLY_CONFIG`，定义 `src/form/wrapper` 中的MATERIALFORMLY配置。
 */
export const MATERIAL_FORMLY_CONFIG: ConfigOption = {
  wrappers: [
    { name: 'label-field', component: LabelWrapperField },
    { name: 'form-field', component: WrapperFormField },
    { name: 'editor-field', component: WrapperEditorField },
    { name: 'fieldset', component: Fieldset },
    { name: 'field-wrapper', component: ExtFieldWrapper },
  ]
};

/**
 * Angular module `FormWrapperModule` declaring and exporting form wrapper module components, directives, pipes, and providers.
 * @zh Angular 模块 `FormWrapperModule`，声明并导出表单包装器模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: FIELD_TYPE_COMPONENTS,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    FlexLayoutModule,
    MatIconModule,
    MatExpansionModule,
    AbstractFormModule,
    ButtonModule,
    PopoverModule,
    TranslateModule,
    FormModule.forChild(MATERIAL_FORMLY_CONFIG),
  ],
  exports: FIELD_TYPE_COMPONENTS
})
export class FormWrapperModule {
  /**
   * Property `entryComponents` (`(typeof FormSection | typeof ExtFieldWrapper | typeof WrapperFormField | typeof LabelWrapperField | typeof Fieldset | typeof WrapperEditorField | typeof RepeatTypeComponent | typeof RowEditorComponent)[]`) storing entry components (default: `FIELD_TYPE_COMPONENTS`).
   * @zh 属性 `entryComponents`（类型：`(typeof FormSection | typeof ExtFieldWrapper | typeof WrapperFormField | typeof LabelWrapperField | typeof Fieldset | typeof WrapperEditorField | typeof RepeatTypeComponent | typeof RowEditorComponent)[]`），用于存储或配置条目组件列表（默认值：`FIELD_TYPE_COMPONENTS`）。
   */
  entryComponents = FIELD_TYPE_COMPONENTS;
  /**
   * Creates an instance of `FormWrapperModule` and initializes its dependencies and internal state.
   * @zh 创建 `FormWrapperModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
