import { ComponentFactoryResolver, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { A11yModule } from '@angular/cdk/a11y';
import { PanelComponent } from './panel.component';
import { SplitComponent } from './split.component';
import { DuiLayoutToggleDirective, DuiLayoutCloseDirective, DuiLayoutOpenDirective } from './layout.directives';
import { Dui } from '@dotos/dui/core';
@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatCardModule,
    ScrollingModule,
    A11yModule
  ],
  exports: [
    SplitComponent,
    PanelComponent,
    DuiLayoutToggleDirective,
    DuiLayoutCloseDirective,
    DuiLayoutOpenDirective
  ],
  declarations: [
    SplitComponent,
    PanelComponent,
    DuiLayoutToggleDirective,
    DuiLayoutCloseDirective,
    DuiLayoutOpenDirective
  ]
})
export class PanelModule {
  dynamicComponents = [SplitComponent,PanelComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.dynamicComponents);
  }
}
