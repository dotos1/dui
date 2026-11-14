/**
 * @fileoverview Module `src/common/clipboard/clipboard.module.ts` providing clipboard module definitions and implementation.
 * @zh 模块文件 `src/common/clipboard/clipboard.module.ts`，提供clipboard模块相关的定义与实现。
 */



import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';
import { CommonServicesModule } from '@dotos/dui/core/services';
import { ToastrModule } from '@dotos/dui/common/toastr';
import { ClipboardDirective } from './clipboard.directive';
import { ClipboardComponent } from './clipboard.component';
import { ClipboardService } from './clipboard.service';
import { CopyButtonComponent } from './copy-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

/**
 * Angular module `ClipboardModule` declaring and exporting clipboard module components, directives, pipes, and providers.
 * @zh Angular 模块 `ClipboardModule`，声明并导出Clipboard模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    ToastrModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    CommonServicesModule,
    TranslateModule
  ],
  providers: [
    ClipboardService
  ],
  declarations: [
    CopyButtonComponent,
    ClipboardDirective,
    ClipboardComponent
  ],
  exports: [
    CopyButtonComponent,
    ClipboardDirective
  ]
})
export class ClipboardModule {
  /**
   * Property `entryComponents` (`(typeof ClipboardComponent)[]`) storing entry components (default: `[ClipboardComponent]`).
   * @zh 属性 `entryComponents`（类型：`(typeof ClipboardComponent)[]`），用于存储或配置条目组件列表（默认值：`[ClipboardComponent]`）。
   */
  entryComponents = [ClipboardComponent];
  /**
   * Creates an instance of `ClipboardModule` and initializes its dependencies and internal state.
   * @zh 创建 `ClipboardModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
