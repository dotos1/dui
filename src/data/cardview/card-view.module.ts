/**
 * @fileoverview Module `src/data/cardview/card-view.module.ts` providing card view module definitions and implementation.
 * @zh 模块文件 `src/data/cardview/card-view.module.ts`，提供卡片视图模块相关的定义与实现。
 */


import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
import { FlexLayoutModule } from 'ngx-flexible-layout';

import { Dui } from '@dotos/dui/core';
import { MatDatetimepickerModule } from '@dotos/dui/form/date/picker';
import { MatNativeDatetimeModule } from '@dotos/dui/form/date/adapter';
import { TranslateModule } from '@dotos/dui/translator';

import { CardViewContentProxyDirective } from './directives';
import { 
  CardViewComponent,CardViewBoolItemComponent,CardViewDateItemComponent,
  CardViewItemDispatcherComponent,CardViewMapItemComponent,CardViewTextItemComponent,
  CardViewKeyValuePairsItemComponent,CardViewSelectItemComponent,CardViewArrayItemComponent
} from './components';

/**
 * Angular module `CardViewModule` declaring and exporting card view module components, directives, pipes, and providers.
 * @zh Angular 模块 `CardViewModule`，声明并导出卡片视图模块相关的组件、指令、管道与服务提供者。
 */
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
  /**
   * Property `entryComponents` (`(typeof CardViewBoolItemComponent | typeof CardViewDateItemComponent | typeof CardViewMapItemComponent | typeof CardViewTextItemComponent | typeof CardViewSelectItemComponent | typeof CardViewKeyValuePairsItemComponent | typeof CardViewArrayItemComponent)[]`) storing entry components.
   * @zh 属性 `entryComponents`（类型：`(typeof CardViewBoolItemComponent | typeof CardViewDateItemComponent | typeof CardViewMapItemComponent | typeof CardViewTextItemComponent | typeof CardViewSelectItemComponent | typeof CardViewKeyValuePairsItemComponent | typeof CardViewArrayItemComponent)[]`），用于存储或配置条目组件列表。
   */
  entryComponents = [    CardViewBoolItemComponent,
    CardViewDateItemComponent,
    CardViewMapItemComponent,
    CardViewTextItemComponent,
    CardViewSelectItemComponent,
    CardViewKeyValuePairsItemComponent,
    CardViewArrayItemComponent];
  /**
   * Creates an instance of `CardViewModule` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
 }
