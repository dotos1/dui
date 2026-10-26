/**
 * @fileoverview Module `src/form/card/form.card.module.ts` providing form card module definitions and implementation.
 * @zh 模块文件 `src/form/card/form.card.module.ts`，提供表单卡片模块相关的定义与实现。
 */

import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '@dotos/dui/form';
import { MatInputModule  } from '@angular/material/input';
import { MatCardModule  } from '@angular/material/card';
import {  MatFormFieldModule, } from '@angular/material/form-field';
import { MatDividerModule  } from '@angular/material/divider';
import { MatPaginatorModule  } from '@angular/material/paginator';
import { FormCard } from './form.card';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';

/**
 * Angular module `FormCardModule` declaring and exporting form card module components, directives, pipes, and providers.
 * @zh Angular 模块 `FormCardModule`，声明并导出表单卡片模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [FormCard],
  imports: [
    CommonModule,
    FormModule.forChild(),
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatCardModule,
    TranslateModule,
    MatPaginatorModule,
    FlexLayoutModule
  ],
  exports: [FormCard],
})
export class FormCardModule {
  /**
   * Property `entryComponents` (`any[]`) storing entry components (default: `[FormCard]`).
   * @zh 属性 `entryComponents`（类型：`any[]`），用于存储或配置条目组件列表（默认值：`[FormCard]`）。
   */
  entryComponents = [FormCard];
  /**
   * Creates an instance of `FormCardModule` and initializes its dependencies and internal state.
   * @zh 创建 `FormCardModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
