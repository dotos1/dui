import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

import { Dui } from '@dotos/dui/core';
import { TranslateModule, TranslationService } from '@dotos/dui/translator';

import { FormModule } from '../components/form.module';
import { ArrayInputComponent } from './array-input.component';
import { CommonFieldModule } from '../field';

@NgModule({
  declarations: [
    ArrayInputComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    CommonFieldModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule,
    MatChipsModule,
    FormModule,
  ],
  exports: [
    ArrayInputComponent
  ]
})
export class ArrayInputModule {
  entryComponents = [
    ArrayInputComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver,
    translateService: TranslationService) {
      Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
