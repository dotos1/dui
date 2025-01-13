import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { IframeComponent } from './components/iframe.component';
import { SafePipe } from './pipes/safe.pipe';
import { CommonModule } from '@angular/common';
import { Dui } from '@dotos/dui/core';

@NgModule({
  imports: [CommonModule],
  declarations: [IframeComponent, SafePipe],
  exports: [IframeComponent],
})
export class IFrameModule {
  entryComponents = [IframeComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
