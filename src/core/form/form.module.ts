import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMessage } from './template/form.validation-message';
import { FormTemplateType } from './template/field-template.type';
import { DuiBase } from '@dotos/dui/base';
import { TranslateModule } from '@dotos/dui/translator';

@NgModule({
    imports: [ TranslateModule,CommonModule],
    declarations: [
        FormTemplateType,
        ValidationMessage
    ],
    exports: [
        FormTemplateType,
        ValidationMessage
    ]
})
export class AbstractFormModule {
  entryComponents = [FormTemplateType,ValidationMessage];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    DuiBase.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
