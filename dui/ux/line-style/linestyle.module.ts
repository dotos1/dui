import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormModule } from '@dotos/dui/form';
import { LineStyleSelector } from './linestyle';
import { LineSizeSelector } from './linesize';
import { Dui } from '@dotos/dui/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@dotos/dui/common/icon';
import { ColorCircleModule, ColorCompactModule } from '@dotos/dui/common/colorpicker/components';
import { TranslateModule } from '@dotos/dui/i18n';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    PortalModule,
    MatInputModule,
    MatAutocompleteModule,
    TranslateModule.forChild(),
    ColorCompactModule,
    MatMenuModule,
    ColorCircleModule,
    MatButtonModule,
    OverlayModule,
    IconModule,
    FormModule
  ],
  declarations: [
    LineStyleSelector,
    LineSizeSelector
  ],
  exports:[
    LineStyleSelector,
    LineSizeSelector
  ]
})
export class LineStyleModule {
  entryComponents = [
    LineStyleSelector,
    LineSizeSelector
  ];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
