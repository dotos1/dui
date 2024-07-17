import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from 'ngx-flexible-layout';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from '@dotos/dui/ui/button';
import {  SpeedDialModule } from '@dotos/dui/ui/speeddial';
import { DuiPagingModule } from '@dotos/dui/data/paging';
import { DatatableComponent } from './datatable.component';
import { DatatableCardComponent } from './datatable.card';
import {
  DataTableBodyComponent,
  ProgressBarComponent,
  ScrollerComponent,
  DataTableSelectionComponent,
  DataTableSummaryRowComponent
} from './body/index';

import {
  DataTableFooterComponent,
  // DataTablePagerComponent,
  DataTableFooterTemplateDirective,
  DatatableFooterDirective,
} from './footer/index';

import {
  DataTableColumnDirective,
  DataTableColumnHeaderDirective,
  DataTableColumnCellDirective,
  DataTableColumnCellTreeToggle,
} from './columns/index';

import {
  DataTableHeaderComponent,
  DatatableGroupHeaderDirective,
  DatatableGroupHeaderTemplateDirective,
  DataTableHeaderCellComponent,
} from './header/index';

import {
  DatatableRowDetailDirective,
  DataTableBodyRowComponent,
  DataTableRowWrapperComponent,
  DataTableBodyCellComponent,
  DatatableRowDetailTemplateDirective,
} from './row/index';

import {
  VisibilityDirective,
  LongPressDirective,
  ResizeableDirective,
  OrderableDirective,
  DraggableDirective
} from './directives/index';

import {
  ScrollbarHelper,
  DimensionsHelper,
  ColumnChangesService
} from './services/index';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule, TranslationService } from '@dotos/dui/i18n';
import { Dui } from '@dotos/dui/core';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    DuiPagingModule,
    MatFormFieldModule,
    MatListModule,
    MatButtonModule,
    ButtonModule,
    SpeedDialModule,
    MatListModule,

    TranslateModule,
    MatPseudoCheckboxModule,
    DragDropModule,
  ],
  providers: [
    ScrollbarHelper,
    DimensionsHelper,
    ColumnChangesService
  ],
  declarations: [
    DatatableCardComponent,
    DataTableFooterTemplateDirective,
    VisibilityDirective,
    DraggableDirective,
    ResizeableDirective,
    OrderableDirective,
    LongPressDirective,
    ScrollerComponent,
    DatatableComponent,
    DataTableColumnDirective,
    DataTableHeaderComponent,
    DataTableHeaderCellComponent,
    DataTableBodyComponent,
    DataTableFooterComponent,
    ProgressBarComponent,
    DataTableBodyRowComponent,
    DataTableRowWrapperComponent,
    DatatableRowDetailDirective,
    DatatableGroupHeaderDirective,
    DatatableRowDetailTemplateDirective,
    DataTableBodyCellComponent,
    DataTableSelectionComponent,
    DataTableColumnHeaderDirective,
    DataTableColumnCellDirective,
    DataTableColumnCellTreeToggle,
    DatatableFooterDirective,
    DatatableGroupHeaderTemplateDirective,
    DataTableSummaryRowComponent,
  ],
  exports: [
    DatatableComponent,
    DatatableRowDetailDirective,
    DatatableGroupHeaderDirective,
    DatatableRowDetailTemplateDirective,
    DataTableColumnDirective,
    DataTableColumnHeaderDirective,
    DataTableColumnCellDirective,
    DataTableColumnCellTreeToggle,
    DataTableFooterTemplateDirective,
    DatatableFooterDirective,
    DatatableCardComponent,
    DatatableGroupHeaderTemplateDirective
  ]
})
export class DatatableModule {
  entryComponents = [DatatableCardComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver,translateService: TranslationService) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
    translateService.addTranslationFolder('duix/datatable', 'i18n');
  }
}
