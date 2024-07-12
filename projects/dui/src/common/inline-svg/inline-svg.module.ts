import { NgModule, ModuleWithProviders, ComponentFactoryResolver } from '@angular/core';
import { Dui } from '@dotos/dui/core';

import { InlineSVGComponent } from './inline-svg.component';
import { InlineSVGConfig } from './inline-svg.config';
import { InlineSVGDirective } from './inline-svg.directive';

@NgModule({
  declarations: [InlineSVGDirective, InlineSVGComponent],
  exports: [InlineSVGDirective,InlineSVGComponent]
})
export class InlineSVGModule {
  entryComponents = [InlineSVGComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
  static forRoot(config?: InlineSVGConfig): ModuleWithProviders<InlineSVGModule> {
    return {
      ngModule: InlineSVGModule,
      providers: [
        { provide: InlineSVGConfig, useValue: config }
      ]
    };
  }
}
