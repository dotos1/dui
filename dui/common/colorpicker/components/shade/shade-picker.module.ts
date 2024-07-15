import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { ShadeModule } from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import { ShadeSliderComponent } from './shade-picker.component';


@NgModule({
  declarations: [ShadeSliderComponent],
  exports: [ShadeSliderComponent],
  imports: [CommonModule, ShadeModule],
})
export class ColorShadeModule {
  entryComponents = [ShadeSliderComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
