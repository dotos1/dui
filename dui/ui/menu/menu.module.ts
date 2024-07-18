import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule, MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

import { IconModule } from '@dotos/dui/common/icon';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ExtensionsModule } from '@dotos/dui/common/dynamic';

import { MenuBarComponent } from './menu-bar.component';
import { MenuItemComponent } from './menu-item.component';
import { MenuDirective } from './menu-item.directive';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatListModule,
    MatCheckboxModule,
    IconModule,
    ExtensionsModule,
    FlexLayoutModule,
    TranslateModule,
    RouterModule
  ],
  exports: [
    MenuBarComponent,
    MenuItemComponent,
    MenuDirective
  ],
  declarations: [
    MenuBarComponent,
    MenuItemComponent,
    MenuDirective
  ]
})
export class MenuModule {
  entryComponents = [
     MatDivider,
     MenuBarComponent,
    MenuItemComponent,];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
