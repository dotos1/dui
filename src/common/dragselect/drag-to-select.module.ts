/**
 * @fileoverview Module `src/common/dragselect/drag-to-select.module.ts` providing drag to select module definitions and implementation.
 * @zh 模块文件 `src/common/dragselect/drag-to-select.module.ts`，提供拖拽转换为下拉选择模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { DEFAULT_CONFIG } from './config';
import { KeyboardEventsService } from './keyboard-events.service';
import { DragToSelectConfig } from './models';
import { SelectContainerComponent } from './select-container.component';
import { SelectItemDirective } from './select-item.directive';
import { ShortcutService } from './shortcut.service';
import { CONFIG, USER_CONFIG } from './tokens';
import { mergeDeep } from './utils';


/**
 * Constant/variable `COMPONENTS` defining components in `src/common/dragselect`.
 * @zh 常量/变量 `COMPONENTS`，定义 `src/common/dragselect` 中的组件列表。
 */
const COMPONENTS = [SelectContainerComponent, SelectItemDirective];

/**
 * Executes `CONFIG_FACTORY` to handle config factory.
 * @zh 执行 `CONFIG_FACTORY`，用于配置工厂。
 * @param config - config parameter (`Partial<DragToSelectConfig>`) / 配置参数（`Partial<DragToSelectConfig>`）
 */
export function CONFIG_FACTORY(config: Partial<DragToSelectConfig>) {
  return mergeDeep(DEFAULT_CONFIG, config);
}

/**
 * Angular module `DragToSelectModule` declaring and exporting drag to select module components, directives, pipes, and providers.
 * @zh Angular 模块 `DragToSelectModule`，声明并导出拖拽转换为下拉选择模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [CommonModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})

export class DragToSelectModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param config - config parameter (`Partial<DragToSelectConfig>`) / 配置参数（`Partial<DragToSelectConfig>`）
   * @returns Result of type `ModuleWithProviders<DragToSelectModule>` / 类型为 `ModuleWithProviders<DragToSelectModule>` 的返回值
   */
  static forRoot(config: Partial<DragToSelectConfig> = {}): ModuleWithProviders<DragToSelectModule> {
    return {
      ngModule: DragToSelectModule,
      providers: [
        ShortcutService,
        KeyboardEventsService,
        { provide: USER_CONFIG, useValue: config },
        {
          provide: CONFIG,
          useFactory: CONFIG_FACTORY,
          deps: [USER_CONFIG]
        }
      ]
    };
  }
}
