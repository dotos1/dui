import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule, MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

import { MenuModule } from '@dotos/dui/ui/menu';
import { IconModule } from '@dotos/dui/common/icon';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/i18n';

import { ButtonComponent } from './button.component';
@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MenuModule,
    IconModule,
    TranslateModule,
    MatDividerModule,
    RouterModule
  ],
  exports: [
    ButtonComponent,
    MenuModule
  ],
  declarations: [
    ButtonComponent
  ]
})
export class ButtonModule {
  entryComponents = [
     MatDivider,
    ButtonComponent,];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
