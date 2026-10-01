import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

import { IconModule } from '@dotos/dui/common/icon';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';
import { MenuModule } from '@dotos/dui/ui/menu';

import { FabButtonComponent } from './fab.button';
import { ExtSpeedDialComponent } from './speeddial.component';
import { SpeedDialActionsComponent, SpeedDialComponent } from './speed-dial';
import { SpeedDialTriggerComponent } from './speed-dial-trigger';



@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MenuModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    TranslateModule,
    MatTooltipModule,
    IconModule
  ],
  declarations: [
    SpeedDialComponent,
    FabButtonComponent,
    ExtSpeedDialComponent,
    SpeedDialActionsComponent,
    SpeedDialTriggerComponent,
  ],
  exports: [
    SpeedDialActionsComponent,
    SpeedDialComponent,
    SpeedDialTriggerComponent,
    ExtSpeedDialComponent,
    FabButtonComponent
  ],
})
export class SpeedDialModule {
  entryComponents = [
    SpeedDialActionsComponent,
    SpeedDialComponent,
    SpeedDialTriggerComponent,
    ExtSpeedDialComponent,
    FabButtonComponent
  ];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
