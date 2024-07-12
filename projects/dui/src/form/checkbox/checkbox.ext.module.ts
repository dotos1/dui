import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormModule } from '../components/form.module';
import { CheckboxField } from './checkbox.component';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/i18n';

@NgModule({
  declarations: [CheckboxField],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatCheckboxModule,
    FormModule.forChild()
  ]
})
export class CheckBoxFieldModule {
  entryComponents = [CheckboxField];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
