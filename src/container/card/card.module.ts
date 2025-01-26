
import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from 'ngx-flexible-layout';

import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';
import { DuiCardComponent } from './card.component';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    FlexLayoutModule,
    MatListModule,
    TranslateModule,
    FlexLayoutModule,
    MatPaginatorModule,
    MatSelectModule,
  ],
  exports: [
    DuiCardComponent
  ],
  declarations: [
    DuiCardComponent
  ]
})
export class CardModule {
  entryComponents = [DuiCardComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
