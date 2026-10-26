/**
 * @fileoverview Module `src/ux/command-palette/command-palette.service.ts` providing command palette service definitions and implementation.
 * @zh 模块文件 `src/ux/command-palette/command-palette.service.ts`，提供命令调色板服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { CommandPaletteShortcutsService } from './services/command-palette-shortcuts.service';
import { CommandPaletteGroupStorageService } from './services/command-palette-group-storage.service';
import { CommandItemGroup } from './model/command-item-group';

/**
 * Injectable Angular service `CommandPaletteService` managing command palette service state and operations in `src/ux/command-palette`.
 * @zh 可注入的 Angular 服务 `CommandPaletteService`，管理 `src/ux/command-palette` 中的命令调色板服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class CommandPaletteService {

  /**
   * Creates an instance of `CommandPaletteService` and initializes its dependencies and internal state.
   * @zh 创建 `CommandPaletteService` 实例，并初始化其依赖项与内部状态。
   * @param commandPaletteShortcutsService - Injected or initial command palette shortcuts service (`CommandPaletteShortcutsService`) / 注入或传入的命令调色板快捷键列表服务（`CommandPaletteShortcutsService`）
   * @param commandPaletteSectionsStorageS... - Injected or initial command palette sections storage s (`CommandPaletteGroupStorageService`) / 注入或传入的命令调色板Sections存储S（`CommandPaletteGroupStorageService`）
   */
  constructor(
    private readonly commandPaletteShortcutsService: CommandPaletteShortcutsService,
    private readonly commandPaletteSectionsStorageService: CommandPaletteGroupStorageService
  ) {
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   */
  init(): void {
    this.commandPaletteShortcutsService.listen();
  }

  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   */
  destroy(): void {
    this.commandPaletteShortcutsService.destroy();
  }

  /**
   * Executes `addGroups` to handle add groups.
   * @zh 执行 `addGroups`，用于添加分组。
   * @param groups - groups parameter (`CommandItemGroup[]`) / 分组参数（`CommandItemGroup[]`）
   */
  addGroups(groups: CommandItemGroup[]): void {
    this.commandPaletteSectionsStorageService.set(groups);
  }

  /**
   * Executes `removeGroups` to handle remove groups.
   * @zh 执行 `removeGroups`，用于移除分组。
   * @param groupsName - groups name parameter (`string[]`) / 分组名称参数（`string[]`）
   */
  removeGroups(groupsName: string[]): void {
    const savedSections = this.commandPaletteSectionsStorageService.get();
    this.commandPaletteSectionsStorageService.set(savedSections.filter(s => groupsName.some(n => n !== s.title)));
  }
}
