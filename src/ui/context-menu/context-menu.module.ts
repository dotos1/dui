

import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';
import { IconModule } from '@dotos/dui/common/icon';
import { ExtensionsModule } from '@dotos/dui/common/dynamic';

import { ContextMenuItemComponent } from './context-menu-item.component';
import { OutsideEventDirective } from './context-menu-outside-event.directive';
import { ContextMenuComponent } from './context-menu.component';
import { ContextMenuService } from './context-menu.service';
@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    IconModule,
    ExtensionsModule
  ],
  declarations: [
    ContextMenuComponent,
    ContextMenuItemComponent,
    OutsideEventDirective
  ],
  exports: [
    OutsideEventDirective,
    ContextMenuComponent,
    ContextMenuItemComponent,
  ],
  providers: [
    ContextMenuService
  ]
})
export class ContextMenuModule {
  entryComponents = [ContextMenuComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}


