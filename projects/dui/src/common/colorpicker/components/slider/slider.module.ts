import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule, } from '@angular/core';
import { HueModule, SwatchModule } from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import { SliderSwatchComponent } from './slider-swatch.component';
import { SliderSwatchesComponent } from './slider-swatches.component';
import { ColorSliderComponent } from './slider.component';

@NgModule({
  declarations: [
    ColorSliderComponent,
    SliderSwatchComponent,
    SliderSwatchesComponent,
  ],
  exports: [ColorSliderComponent, SliderSwatchComponent, SliderSwatchesComponent],
  imports: [CommonModule, HueModule, SwatchModule],
})
export class ColorSliderModule {
  entryComponents = [
     ColorSliderComponent,
    SliderSwatchComponent,
    SliderSwatchesComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
