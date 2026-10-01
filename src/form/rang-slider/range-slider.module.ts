import {CommonModule} from '@angular/common';
import { ComponentFactoryResolver, NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCommonModule} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HammerModule} from '@angular/platform-browser';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';
import { FormModule } from '../components';

import { RangeSliderFieldComponent } from './range-slider.field';
import { MatSliderModule } from '@angular/material/slider';
import { FlexLayoutModule } from 'ngx-flexible-layout';

@NgModule({
  declarations: [RangeSliderFieldComponent],
  exports: [RangeSliderFieldComponent],
  imports: [
    CommonModule,
    HammerModule,
    MatCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSliderModule,
     FlexLayoutModule,
    FormModule.forChild(),
    TranslateModule
  ]
})
export class RangeSliderModule {
  entryComponents = [RangeSliderFieldComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
