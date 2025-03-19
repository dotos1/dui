import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormModule } from '@dotos/dui/form';
import { Dui } from '@dotos/dui/core';
import { ColorPickerButton } from './color-button';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@dotos/dui/common/icon';
import { ColorCircleModule, ColorCompactModule } from '@dotos/dui/common/colorpicker/components';
import { TranslateModule } from '@dotos/dui/translator';
import { MatIconModule } from '@angular/material/icon';
import { GoogColorModule } from '@dotos/dui/common/colorpicker/components';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    PortalModule,
    TranslateModule.forChild(),
    ColorCompactModule,
    MatMenuModule,
    MatIconModule,
    GoogColorModule,
    ColorCircleModule,
    MatButtonModule,
    OverlayModule,
    IconModule,
    FormModule
  ],
  declarations: [
    ColorPickerButton
  ],
  exports:[
    ColorPickerButton,
  ]
})
export class ColorPickerButtonModule {
  entryComponents = [
    ColorPickerButton,
  ];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
