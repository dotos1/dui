/**
 * @fileoverview Module `src/form/components/form.module.ts` providing form module definitions and implementation.
 * @zh 模块文件 `src/form/components/form.module.ts`，提供表单模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Dui } from '@dotos1/dui/core';
import { ConfigOption, CoreExtension, FORM_CONFIG, FieldExpressionExtension, FieldFormExtension, 
  FieldValidationExtension, FormBuilder, FormConfig, FormTemplateType } from '@dotos1/dui/core/form';
import { TranslateModule, TranslateStore, TranslationService } from '@dotos1/dui/translator';
import { simpleInterceptorProviders } from '@dotos1/dui/net';
import { Load } from '../action/load.service';
import { LoadingModule } from '@dotos1/dui/common/loading';
import { Submit } from '../action/submit.service';
import { FieldComponent } from './field.component';
import { FormAttributes } from './form.attributes';
import { FormComponent } from './form.component';
import { FormGroup } from './form.group';

/**
 * Executes `defaultFormConfig` to handle default form config.
 * @zh 执行 `defaultFormConfig`，用于默认表单配置。
 * @param formConfig - form config parameter (`FormConfig`) / 表单配置参数（`FormConfig`）
 * @returns Result of type `ConfigOption` / 类型为 `ConfigOption` 的返回值
 */
export function defaultFormConfig(formConfig: FormConfig): ConfigOption {
  return {
    types: [
      { name: 'form-group', component: FormGroup },
      { name: 'form-template', component: FormTemplateType },
    ],
    extensions: [
      { name: 'core', extension: new CoreExtension(formConfig) },
      { name: 'field-validation', extension: new FieldValidationExtension(formConfig) },
      { name: 'field-form', extension: new FieldFormExtension() },
      { name: 'field-expression', extension: new FieldExpressionExtension() },
    ],
  };
}


/**
 * Angular module `FormModule` declaring and exporting form module components, directives, pipes, and providers.
 * @zh Angular 模块 `FormModule`，声明并导出表单模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    // 表单动作 Load 要 LoadingService，而它只由 LoadingModule 提供；只引字段模块（如 CheckboxGroupModule）的
    // 独立组件会报 No provider for LoadingService（门户 G35）
    LoadingModule,
  ],
  declarations: [
    FormAttributes,
    FormComponent,
    FieldComponent,
    FormGroup
  ],
  providers: [
    TranslateStore,
    // 不在这里再提供 TranslationService：它是 providedIn: 'root' 的单例。在模块里重复提供，
    // 每个引入 FormModule 的独立组件 / 懒加载注入器都会新建一份，构造函数按浏览器语言调 translate.use()，
    // 把整个应用的语言切走（门户 G24：中文页里甘特表头变英文）。
    Load,
    Submit
  ],
  exports: [
    FormAttributes,
    FormComponent,
    FormGroup,
    FieldComponent,
  ]
})
export class FormModule {
  /**
   * Property `entryComponents` (`(typeof FormComponent | typeof FormGroup | typeof FieldComponent)[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`(typeof FormComponent | typeof FormGroup | typeof FieldComponent)[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [
    FormComponent,
    FormGroup,
    FieldComponent,];
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @returns Result of type `ModuleWithProviders<FormModule>` / 类型为 `ModuleWithProviders<FormModule>` 的返回值
   */
  static forRoot(): ModuleWithProviders<FormModule> {
    return {
      ngModule: FormModule,
      providers: [
        provideHttpClient(
          withInterceptorsFromDi(),
        ),
        simpleInterceptorProviders,
        { provide: FORM_CONFIG, multi: true, useFactory: defaultFormConfig, deps: [FormConfig] },
       
        FormConfig,
        FormBuilder,
      ],
    };
  }

  /**
   * Executes `forChild` to handle for child.
   * @zh 执行 `forChild`，用于用于子级。
   * @param config - config parameter (`ConfigOption`) / 配置参数（`ConfigOption`）
   * @returns Result of type `ModuleWithProviders<FormModule>` / 类型为 `ModuleWithProviders<FormModule>` 的返回值
   */
  static forChild(config: ConfigOption = {}): ModuleWithProviders<FormModule> {
    return {
      ngModule: FormModule,
      providers: [
        { provide: FORM_CONFIG, useValue: config, multi: true },
        FormBuilder,
      ],
    };
  }
  /**
   * Creates an instance of `FormModule` and initializes its dependencies and internal state.
   * @zh 创建 `FormModule` 实例，并初始化其依赖项与内部状态。
   * @param configService - Injected or initial config service (`FormConfig`) / 注入或传入的配置服务（`FormConfig`）
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   * @param configs - Injected or initial configs (`ConfigOption[]`) / 注入或传入的配置（`ConfigOption[]`）
   */
  constructor(
    configService: FormConfig,
    translateService: TranslationService,
    @Optional() @Inject(FORM_CONFIG) configs: ConfigOption[] = [],
  ) {
    if (!configs) {
      return;
    }
    configs.forEach(config => configService.addConfig(config));
    Dui.registerComponentFactory(this.entryComponents);
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
