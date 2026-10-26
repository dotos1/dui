/**
 * @fileoverview Module `src/container/dock-layout/dock-layout.module.ts` providing dock layout module definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/dock-layout.module.ts`，提供停靠面板布局模块相关的定义与实现。
 */

import { ModuleWithProviders, NgModule } from "@angular/core";
import { DockLayoutComponentService } from "./dock-layout-component.service";
import { DockLayoutHostComponent } from "./dock-layout-host.component";
import { TranslateModule, TranslationService } from "@dotos/dui/translator";

/**
 * Angular module `DockLayoutModule` declaring and exporting dock layout module components, directives, pipes, and providers.
 * @zh Angular 模块 `DockLayoutModule`，声明并导出停靠面板布局模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [DockLayoutHostComponent],
  providers: [DockLayoutComponentService],
  imports: [
    TranslateModule,
  ],
  exports: [DockLayoutHostComponent],
})
export class DockLayoutModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @returns Result of type `ModuleWithProviders<DockLayoutModule>` / 类型为 `ModuleWithProviders<DockLayoutModule>` 的返回值
   */
  static forRoot(): ModuleWithProviders<DockLayoutModule> {
    return {
      ngModule: DockLayoutModule,
      providers: [DockLayoutComponentService],
    };
  }
  /**
   * Creates an instance of `DockLayoutModule` and initializes its dependencies and internal state.
   * @zh 创建 `DockLayoutModule` 实例，并初始化其依赖项与内部状态。
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   */
  constructor(
    translateService: TranslationService) {
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
