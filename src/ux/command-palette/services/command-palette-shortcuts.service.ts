/**
 * @fileoverview Module `src/ux/command-palette/services/command-palette-shortcuts.service.ts` providing command palette shortcuts service definitions and implementation.
 * @zh 模块文件 `src/ux/command-palette/services/command-palette-shortcuts.service.ts`，提供命令调色板快捷键列表服务相关的定义与实现。
 */

import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommandPaletteCreatorService } from './command-palette-creator-service';

/**
 * Injectable Angular service `CommandPaletteShortcutsService` managing command palette shortcuts service state and operations in `src/ux/command-palette/services`.
 * @zh 可注入的 Angular 服务 `CommandPaletteShortcutsService`，管理 `src/ux/command-palette/services` 中的命令调色板快捷键列表服务状态与业务操作。
 */
@Injectable()
export class CommandPaletteShortcutsService {

  /**
   * Property `onDestroy$` (`Subject<void>`) storing on destroy (default: `new Subject<void>()`).
   * @zh 属性 `onDestroy$`（类型：`Subject<void>`），用于存储或配置当销毁（默认值：`new Subject<void>()`）。
   */
  private readonly onDestroy$: Subject<void> = new Subject<void>();

  /**
   * Property `modifierKeys` (`string[]`) storing modifier keys (default: `['Control', 'Meta']`).
   * @zh 属性 `modifierKeys`（类型：`string[]`），用于存储或配置modifier键列表（默认值：`['Control', 'Meta']`）。
   */
  private readonly modifierKeys: string[] = ['Control', 'Meta'];
  /**
   * Property `keyK` (`string`) storing key k (default: `'KeyK'`).
   * @zh 属性 `keyK`（类型：`string`），用于存储或配置键K（默认值：`'KeyK'`）。
   */
  private readonly keyK: string = 'KeyK';
  /**
   * Property `keyEscape` (`string`) storing key escape (default: `'Escape'`).
   * @zh 属性 `keyEscape`（类型：`string`），用于存储或配置键Escape（默认值：`'Escape'`）。
   */
  private readonly keyEscape: string = 'Escape';

  /**
   * Creates an instance of `CommandPaletteShortcutsService` and initializes its dependencies and internal state.
   * @zh 创建 `CommandPaletteShortcutsService` 实例，并初始化其依赖项与内部状态。
   * @param document - Injected or initial document (`Document`) / 注入或传入的文档对象（`Document`）
   * @param commandPaletteCreatorService - Injected or initial command palette creator service (`CommandPaletteCreatorService`) / 注入或传入的命令调色板Creator服务（`CommandPaletteCreatorService`）
   */
  constructor(
    @Inject(DOCUMENT) public readonly document: Document,
    private readonly commandPaletteCreatorService: CommandPaletteCreatorService
  ) {
  }

  /**
   * Executes `listen` to handle listen.
   * @zh 执行 `listen`，用于监听。
   */
  listen(): void {
    fromEvent<KeyboardEvent>(this.document, 'keydown')
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe((event: KeyboardEvent) => {
        if (this.canOpenDialog(event)) {
          this.commandPaletteCreatorService.create();
        }

        if (event.code === this.keyEscape) {
          this.commandPaletteCreatorService.destroy();
        }
      });
  }

  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   */
  destroy(): void {
    this.onDestroy$.next();
  }

  /**
   * Executes `canOpenDialog` to handle can open dialog.
   * @zh 执行 `canOpenDialog`，用于是否可以打开对话框。
   * @param event - event parameter (`KeyboardEvent`) / 事件参数（`KeyboardEvent`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private canOpenDialog(event: KeyboardEvent): boolean {
    return event.code === this.keyK && this.modifierKeys.some(key => event.getModifierState(key));
  }
}
