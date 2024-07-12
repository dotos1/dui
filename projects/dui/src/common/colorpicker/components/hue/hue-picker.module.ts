import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { HueModule } from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import { HuePickerComponent } from './hue-picker.component';

@NgModule({
  declarations: [HuePickerComponent],
  exports: [HuePickerComponent],
  imports: [CommonModule, HueModule],
})
export class ColorHueModule {
  entryComponents = [HuePickerComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
