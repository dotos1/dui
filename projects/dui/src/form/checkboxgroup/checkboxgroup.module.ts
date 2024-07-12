import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CheckboxGroupField } from './checkboxgroup.component';
import { MatCheckGroup } from './checkboxgroup.exp';
import { SelectPipeModule } from '../base/select.module';
import { FormModule } from '../components/form.module';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/i18n';

@NgModule({
  declarations: [
    CheckboxGroupField,
    MatCheckGroup
  ],
  imports: [
    CommonModule,
    FormModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    SelectPipeModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  exports: [CheckboxGroupField, MatCheckGroup],
})
export class CheckboxGroupModule {
  entryComponents = [CheckboxGroupField];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
