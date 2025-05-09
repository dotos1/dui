import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Dui } from '@dotos/dui/core';
import { TranslateModule, TranslationService } from '@dotos/dui/translator';
import { FormModule } from '../components/form.module';
import { FieldSelect } from './select.field';
import { SelectPipeModule } from '../base/select.module';

import { SelectOptionsService } from './options.service';
import { MatSelectSearchModule } from './search/mat-select-search.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    PortalModule,
    OverlayModule,
    SelectPipeModule,
    TranslateModule,
    MatSelectSearchModule,
    MatPseudoCheckboxModule,
    FormModule,
  ],
  declarations: [
    FieldSelect
  ],
  exports: [
    FieldSelect
  ],
  providers: [
    SelectOptionsService
  ]
})
export class SelectFieldModule {
  entryComponents = [ FieldSelect];
  constructor(componentFactoryResolver: ComponentFactoryResolver,  translateService: TranslationService,) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
