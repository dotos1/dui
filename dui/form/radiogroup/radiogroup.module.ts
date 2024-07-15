import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '../components/form.module';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { RadioGroupField } from './radiogroup.component';
import { SelectPipeModule } from '../base/select.module';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/i18n';
@NgModule({
  declarations: [
    RadioGroupField,
  ],
  imports: [
    CommonModule,
    FormModule,
    TranslateModule,
    SelectPipeModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatRadioModule,
    MatTooltipModule
  ],
  exports: [RadioGroupField]
})
export class RadioGroupModule {
  entryComponents = [RadioGroupField];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
