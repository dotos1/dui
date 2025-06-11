

import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';
import { CommonServicesModule } from '@dotos/dui/core/services';
import { ToastrModule } from '@dotos/dui/common/toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToggleHeaderComponent } from './toggle-header.component';
import { ToggleSelectComponent } from './toggle-select.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    ToastrModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    CommonServicesModule,
    TranslateModule
  ],

  declarations: [
    ToggleHeaderComponent,
    ToggleSelectComponent
  ],
  exports: [
    ToggleHeaderComponent,
    ToggleSelectComponent
  ]
})
export class ToggleSelectModule {
  entryComponents = [ToggleSelectComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
