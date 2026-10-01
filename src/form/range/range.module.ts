import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from 'ngx-flexible-layout';

import { Dui } from '@dotos/dui/core';
import { FormModule } from '@dotos/dui/form';
import { TranslateModule } from '@dotos/dui/translator';

import { DateRangeFieldComponent } from './daterange.field';
import { NumberRangeFieldComponent } from './numberrange.field';

@NgModule({
  declarations: [
    DateRangeFieldComponent,
    NumberRangeFieldComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatSliderModule,
    TranslateModule,
    FormModule.forChild()
  ],
  exports: [
    DateRangeFieldComponent,
    NumberRangeFieldComponent
  ]
})
export class RangeFieldModule {
  entryComponents = [DateRangeFieldComponent, NumberRangeFieldComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver, this.entryComponents);
  }
}
