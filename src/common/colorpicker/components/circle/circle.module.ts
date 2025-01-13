import { CommonModule } from '@angular/common';
import {ComponentFactoryResolver, NgModule,} from '@angular/core';
import { CircleComponent } from './circle.component';
import { CircleSwatchComponent } from './circle-swatch.component';
import { SwatchModule } from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';


@NgModule({
  declarations: [CircleComponent, CircleSwatchComponent],
  exports: [CircleComponent, CircleSwatchComponent],
  imports: [CommonModule, SwatchModule],
})
export class ColorCircleModule {
  entryComponents = [ CircleComponent, CircleSwatchComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
