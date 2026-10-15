import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {  EditableInputModule,  RaisedModule,  SwatchModule,} from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import { GoogColorComponent } from './google-color.component';

import { GoogColorPickerComponent } from './google.component';
import { GoogleColorService } from './google-color.services';

@NgModule({
  declarations: [
    GoogColorPickerComponent,
    GoogColorComponent
  ],
  exports: [GoogColorPickerComponent, GoogColorComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, EditableInputModule, SwatchModule, RaisedModule],
  providers: [
    GoogleColorService
  ]
})
export class GoogColorModule {
  entryComponents = [
    GoogColorPickerComponent,
      GoogColorComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
