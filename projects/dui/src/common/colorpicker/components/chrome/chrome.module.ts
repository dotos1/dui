import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule, } from '@angular/core';

import { AlphaModule, CheckboardModule, EditableInputModule, HueModule, SaturationModule, } from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import { ChromeFieldsComponent } from './chrome-fields.component';
import { ChromeComponent } from './chrome.component';

@NgModule({
  declarations: [
    ChromeComponent,
    ChromeFieldsComponent
  ],
  exports: [ChromeComponent, ChromeFieldsComponent],
  imports: [
    CommonModule,
    AlphaModule,
    CheckboardModule,
    EditableInputModule,
    HueModule,
    SaturationModule,
  ],
})
export class ColorChromeModule {
  entryComponents = [ChromeComponent,
    ChromeFieldsComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver, this.entryComponents);
  }
}
