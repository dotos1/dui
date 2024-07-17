
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from 'ngx-flexible-layout';

import { TranslateModule } from '@dotos/dui/i18n';
import { TranslateLoaderService } from '@dotos/dui/i18n';
import { Dui } from '@dotos/dui/core';
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
  ],
  providers: [TranslateLoaderService]
})
export class CardModule {
  entryComponents = [DuiCardComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
