/**
 * @fileoverview Module `src/data/datatable/datatable.module.ts` providing datatable module definitions and implementation.
 * @zh 模块文件 `src/data/datatable/datatable.module.ts`，提供数据表格模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from '@dotos1/dui/ui/button';
import {  SpeedDialModule } from '@dotos1/dui/ui/speeddial';
import { DuiPagingModule } from '@dotos1/dui/data/paging';
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
import { TranslateModule, TranslationService } from '@dotos1/dui/translator';
import { Dui } from '@dotos1/dui/core';

/**
 * Angular module `DatatableModule` declaring and exporting datatable module components, directives, pipes, and providers.
 * @zh Angular 模块 `DatatableModule`，声明并导出数据表格模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
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
  /**
   * Property `entryComponents` (`(typeof DatatableCardComponent)[]`) storing entry components (default: `[DatatableCardComponent]`).
   * @zh 属性 `entryComponents`（类型：`(typeof DatatableCardComponent)[]`），用于存储或配置条目组件列表（默认值：`[DatatableCardComponent]`）。
   */
  entryComponents = [DatatableCardComponent];
  /**
   * Creates an instance of `DatatableModule` and initializes its dependencies and internal state.
   * @zh 创建 `DatatableModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   */
  constructor(translateService: TranslationService) {
    Dui.registerComponentFactory(this.entryComponents);
    translateService.addTranslationFolder('duix/datatable', 'i18n');
  }
}
