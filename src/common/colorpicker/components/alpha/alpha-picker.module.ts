import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { AlphaModule, CheckboardModule } from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import { AlphaPickerComponent } from './alpha-picker.component';

@NgModule({
  declarations: [AlphaPickerComponent],
  exports: [AlphaPickerComponent],
  imports: [CommonModule, AlphaModule, CheckboardModule],
})
export class ColorAlphaModule {
  entryComponents = [AlphaPickerComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
