import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from '../components/form.module';
import { TranslateModule, TranslationService } from '@dotos/dui/translator';
import { Dui } from '@dotos/dui/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { LabelField } from './label-field';


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
  entryComponents = [
    LabelField
  ];
  constructor(componentFactoryResolver: ComponentFactoryResolver,
    translateService: TranslationService) {
      Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
     translateService.addTranslationFolder('dui', 'i18n');
  }
}
