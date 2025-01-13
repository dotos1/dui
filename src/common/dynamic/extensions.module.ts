

import { DynamicExtensionComponent } from './dynamic.component';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
  imports:[
    MatMenuModule
  ],
  declarations: [
    DynamicExtensionComponent
  ],
  exports: [
    DynamicExtensionComponent
  ]
})
export class ExtensionsModule {

}
