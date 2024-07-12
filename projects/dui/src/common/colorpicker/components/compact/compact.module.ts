import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';

import {  EditableInputModule,  RaisedModule,  SwatchModule,} from '@dotos/dui/common/colorpicker/common';
import { Dui } from '@dotos/dui/core';
import { CompactColorComponent } from './compact-color.component';
import { CompactFieldsComponent } from './compact-fields.component';
import { CompactComponent } from './compact.component';

@NgModule({
  declarations: [
    CompactComponent,
    CompactColorComponent,
    CompactFieldsComponent,
  ],
  exports: [CompactComponent, CompactColorComponent, CompactFieldsComponent],
  imports: [CommonModule, EditableInputModule, SwatchModule, RaisedModule],
})
export class ColorCompactModule {
  entryComponents = [
      CompactComponent,
    CompactColorComponent,
    CompactFieldsComponent,];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
