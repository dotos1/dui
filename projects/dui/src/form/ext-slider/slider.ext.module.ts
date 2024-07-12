import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule  } from '@angular/material/form-field';
import {  MatTooltipModule , } from '@angular/material/tooltip';
import {  MatSliderModule  } from '@angular/material/slider';
import { SliderFieldComponent } from './slider.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormModule } from '../components/form.module';
import { Dui } from '@dotos/dui/core';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSliderModule,
    FlexLayoutModule,
    FormModule.forChild(),
    MatTooltipModule
  ],
  declarations: [SliderFieldComponent],
  exports: [SliderFieldComponent],
})
export class SliderFieldModule {
  entryComponents = [SliderFieldComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
