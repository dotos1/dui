import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule, TranslationService } from '@dotos/dui/i18n';
import { Dui } from '@dotos/dui/core';

import { FormModule } from '../components/form.module';
import { TextFieldComponent } from './textfield.component';
import { DisplayFieldComponent } from './displayfield.component';
import { HiddenFieldComponent } from './hiddenfield.component';
import { NumberFieldComponent } from './numberfield.component';
import { TextAreaComponent } from './textarea.component';
import { OptionsService } from './options.service';



@NgModule({
  declarations: [
    TextFieldComponent,
    DisplayFieldComponent,
    HiddenFieldComponent,
    NumberFieldComponent,
    TextAreaComponent
  ],
  imports: [
    CommonModule,
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
    TextFieldComponent,
    DisplayFieldComponent,
    HiddenFieldComponent,
    NumberFieldComponent,
    TextAreaComponent
  ],
  providers: [
    OptionsService
  ]
})
export class CommonFieldModule {
  entryComponents = [
    TextFieldComponent,
    DisplayFieldComponent,
    HiddenFieldComponent,
    NumberFieldComponent,
    TextAreaComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver,
    translateService: TranslationService) {
      Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
