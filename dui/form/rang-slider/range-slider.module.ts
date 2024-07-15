import {CommonModule} from '@angular/common';
import { ComponentFactoryResolver, NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCommonModule} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HammerModule} from '@angular/platform-browser';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/i18n';
import { FormModule } from '../components';
import {RangeSlider} from './range-slider.component';
import { RangeSliderFieldComponent } from './range-slider.field';

@NgModule({
  declarations: [RangeSlider,RangeSliderFieldComponent],
  exports: [RangeSlider,RangeSliderFieldComponent],
  imports: [
    CommonModule,
    HammerModule,
    MatCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
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
