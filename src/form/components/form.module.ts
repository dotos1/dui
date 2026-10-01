import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFactoryResolver, Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { Dui } from '@dotos/dui/core';
import { ConfigOption, CoreExtension, FORM_CONFIG, FieldExpressionExtension, FieldFormExtension, 
  FieldValidationExtension, FormBuilder, FormConfig, FormTemplateType } from '@dotos/dui/core/form';
import { TranslateModule, TranslateStore, TranslationService } from '@dotos/dui/translator';
import { simpleInterceptorProviders } from '@dotos/dui/net';
import { Load } from '../action/load.service';
import { Submit } from '../action/submit.service';
import { FieldComponent } from './field.component';
import { FormAttributes } from './form.attributes';
import { FormComponent } from './form.component';
import { FormGroup } from './form.group';

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


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [
    FormAttributes,
    FormComponent,
    FieldComponent,
    FormGroup
  ],
  providers: [
    TranslateStore,
    TranslationService,
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
  entryComponents = [
    FormComponent,
    FormGroup,
    FieldComponent,];
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

  static forChild(config: ConfigOption = {}): ModuleWithProviders<FormModule> {
    return {
      ngModule: FormModule,
      providers: [
        { provide: FORM_CONFIG, useValue: config, multi: true },
        FormBuilder,
      ],
    };
  }
  constructor(
    configService: FormConfig,
    translateService: TranslationService,
    componentFactoryResolver: ComponentFactoryResolver,
    @Optional() @Inject(FORM_CONFIG) configs: ConfigOption[] = [],
  ) {
    if (!configs) {
      return;
    }
    configs.forEach(config => configService.addConfig(config));
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
