import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Dui } from '@dotos/dui/core';
import { DuiToolbarComponent, Spacer, Fill, TextItem, Separator } from './toolbar.component';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatDividerModule,
    MatToolbarModule
  ],
  declarations: [
    Separator,
    Spacer,
    Fill,
    TextItem,
    DuiToolbarComponent,
  ],
  exports: [
    Separator,
    Spacer,
    Fill,
    TextItem,
    DuiToolbarComponent,
  ]
})
export class DuiToolbarModule {
  entryComponents = [
      DuiToolbarComponent,
    Separator,
    Spacer,
    Fill,
    TextItem];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
