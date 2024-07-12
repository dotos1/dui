import {CommonModule} from '@angular/common';
import {ComponentFactoryResolver, NgModule} from '@angular/core';
import { Dui } from '@dotos/dui/core';
import {GridsterComponent} from './gridster.component';
import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterPreviewComponent} from './gridsterPreview.component';

@NgModule({
  declarations: [
    GridsterComponent,
    GridsterItemComponent,
    GridsterPreviewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [GridsterComponent, GridsterItemComponent],
  providers: [],
  bootstrap: []
})
export class GridsterModule {
  entryComponents = [GridsterComponent, GridsterItemComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
