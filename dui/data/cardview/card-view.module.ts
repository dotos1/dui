
import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';

import { Dui } from '@dotos/dui/core';
import { MatDatetimepickerModule } from '@dotos/dui/form/date/picker';
import { MatNativeDatetimeModule } from '@dotos/dui/form/date/adapter';
import { TranslateModule } from '@dotos/dui/i18n';

import { CardViewContentProxyDirective } from './directives';
import { 
  CardViewComponent,CardViewBoolItemComponent,CardViewDateItemComponent,
  CardViewItemDispatcherComponent,CardViewMapItemComponent,CardViewTextItemComponent,
  CardViewKeyValuePairsItemComponent,CardViewSelectItemComponent,CardViewArrayItemComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    TranslateModule,//.forChild(),
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatMenuModule,
    MatCardModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  declarations: [
    CardViewComponent,
    CardViewBoolItemComponent,
    CardViewDateItemComponent,
    CardViewMapItemComponent,
    CardViewTextItemComponent,
    CardViewKeyValuePairsItemComponent,
    CardViewSelectItemComponent,
    CardViewItemDispatcherComponent,
    CardViewContentProxyDirective,
    CardViewArrayItemComponent
  ],
  exports: [
    CardViewComponent,
    CardViewBoolItemComponent,
    CardViewDateItemComponent,
    CardViewMapItemComponent,
    CardViewTextItemComponent,
    CardViewSelectItemComponent,
    CardViewKeyValuePairsItemComponent,
    CardViewArrayItemComponent
  ]
})
export class CardViewModule {
  entryComponents = [    CardViewBoolItemComponent,
    CardViewDateItemComponent,
    CardViewMapItemComponent,
    CardViewTextItemComponent,
    CardViewSelectItemComponent,
    CardViewKeyValuePairsItemComponent,
    CardViewArrayItemComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
 }
