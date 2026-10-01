import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { Dui } from '@dotos/dui/core';
import { IconModule } from '@dotos/dui/common/icon';
import { TranslateModule } from '@dotos/dui/translator';
import { ToggleButtonComponent } from './toggle-button.component';
@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatListModule,
    IconModule,
    TranslateModule,
    RouterModule
  ],
  exports: [
    ToggleButtonComponent,
  ],
  declarations: [
    ToggleButtonComponent
  ]
})
export class ToggleButtonModule {
  entryComponents = [ToggleButtonComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
