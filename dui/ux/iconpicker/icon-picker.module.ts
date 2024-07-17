import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';

import { FlexLayoutModule } from 'ngx-flexible-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormModule } from '@dotos/dui/form';
import { Dui, StyleModule } from '@dotos/dui/core';

import { IconPickerField } from './icon-picker.field';
import { IconPickerService } from './icon-picker.service';
import { IconPickerComponent } from './icon-picker.component';
import { SearchIconPipe } from './search-icon.pipe';
import { TextDirective } from './text.directive';
import { TranslateModule, TranslationService } from '@dotos/dui/i18n';
import { FontLoaderService } from './font-loader.service';
import { IconModule } from '@dotos/dui/common/icon';


@NgModule({
  imports: [
    CommonModule,
    IconModule,
    OverlayModule,
    ReactiveFormsModule,
    MatTooltipModule,
    PortalModule,
    StyleModule,
    MatIconModule,
    A11yModule,
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    FlexLayoutModule,
    FormModule,
  ],
  exports: [
     
    IconPickerField,
  ],
  declarations: [
    IconPickerField,
    TextDirective,
    IconPickerComponent,
    SearchIconPipe
  ],
  providers: [
    FontLoaderService,
    IconPickerService
  ]
})
export class IconPickerModule {
  entryComponents = [
    IconPickerField,
    IconPickerComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver,
    translateService: TranslationService) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
