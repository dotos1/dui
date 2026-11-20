/**
 * @fileoverview Module `src/form/toggle-select/toggle-select.module.ts` providing toggle select module definitions and implementation.
 * @zh 模块文件 `src/form/toggle-select/toggle-select.module.ts`，提供开关下拉选择模块相关的定义与实现。
 */



import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Dui } from '@dotos1/dui/core';
import { TranslateModule } from '@dotos1/dui/translator';
import { CommonServicesModule } from '@dotos1/dui/core/services';
import { ToastrModule } from '@dotos1/dui/common/toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToggleHeaderComponent, ToggleOption } from './toggle-header.component';
import { ToggleSelectComponent } from './toggle-select.component';
import { ToggleSelectFieldComponent } from './toggle-select.field';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Angular module `ToggleSelectModule` declaring and exporting toggle select module components, directives, pipes, and providers.
 * @zh Angular 模块 `ToggleSelectModule`，声明并导出开关下拉选择模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    ToastrModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    CommonServicesModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    ToggleHeaderComponent,
    ToggleOption,
    ToggleSelectComponent,
    ToggleSelectFieldComponent
  ],
  exports: [
    ToggleHeaderComponent,
    ToggleOption,
    ToggleSelectComponent,
    ToggleSelectFieldComponent
  ]
})




export class ToggleSelectModule {
  /**
   * Property `entryComponents` storing entry components registered as xtypes (default: `[ToggleSelectComponent, ToggleSelectFieldComponent]`).
   * @zh 属性 `entryComponents`，按 xtype 登记的组件（默认值：`[ToggleSelectComponent, ToggleSelectFieldComponent]`）；dui-form 里用 `toggle-select-field`。
   */
  entryComponents = [ToggleSelectComponent, ToggleSelectFieldComponent];
  /**
   * Creates an instance of `ToggleSelectModule` and initializes its dependencies and internal state.
   * @zh 创建 `ToggleSelectModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
