import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SliderToggleField } from './slide-toggle.component';
import { FormModule } from '../components/form.module';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/i18n';

@NgModule({
  declarations: [SliderToggleField],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    TranslateModule,
    FormModule.forChild(),
    MatSlideToggleModule,
  ],
})
export class SliderToggleFieldModule {
  entryComponents = [SliderToggleField];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
