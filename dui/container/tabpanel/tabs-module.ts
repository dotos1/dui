

import {ObserversModule} from '@angular/cdk/observers';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {ComponentFactoryResolver, NgModule} from '@angular/core';
import {MatCommonModule, MatRippleModule } from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import {TabPanel} from './tabpanel.component';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';

@NgModule({
  imports: [
    CommonModule,
    MatCommonModule,
    PortalModule,
    TranslateModule,
    MatRippleModule,
    ObserversModule,
    FlexLayoutModule,
    ScrollingModule,
    MatTabsModule
  ],
  exports: [
    TabPanel
  ],
  declarations: [
    TabPanel
  ]
})
export class DuiTabsModule {
  entryComponents = [TabPanel];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
