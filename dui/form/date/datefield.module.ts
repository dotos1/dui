import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Dui } from '@dotos/dui/core';
import { FormModule } from '@dotos/dui/form';
import { MatDatetimepickerModule } from '@dotos/dui/form/date/picker';
import { NativeDatetimeAdapter } from '@dotos/dui/form/date/adapter';
import { TranslateModule } from '@dotos/dui/translator';
import { DateFieldComponent } from './datefield.component';

@NgModule({
  declarations: [
    DateFieldComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    TranslateModule,
    MatDatetimepickerModule,
    FormModule
  ],
  exports: [
    DateFieldComponent
  ],
  providers: [NativeDatetimeAdapter]
})
export class DateFieldModule {
  entryComponents = [DateFieldComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
