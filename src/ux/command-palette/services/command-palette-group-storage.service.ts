/**
 * @fileoverview Module `src/ux/command-palette/services/command-palette-group-storage.service.ts` providing command palette group storage service definitions and implementation.
 * @zh 模块文件 `src/ux/command-palette/services/command-palette-group-storage.service.ts`，提供命令调色板分组存储服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { CommandItemGroup } from '../model/command-item-group';

/**
 * Injectable Angular service `CommandPaletteGroupStorageService` managing command palette group storage service state and operations in `src/ux/command-palette/services`.
 * @zh 可注入的 Angular 服务 `CommandPaletteGroupStorageService`，管理 `src/ux/command-palette/services` 中的命令调色板分组存储服务状态与业务操作。
 */
@Injectable()
export class CommandPaletteGroupStorageService {

  /**
   * Property `storedSections$` (`ReplaySubject<CommandItemGroup[]>`) storing stored sections (default: `new ReplaySubject(1)`).
   * @zh 属性 `storedSections$`（类型：`ReplaySubject<CommandItemGroup[]>`），用于存储或配置已状态仓库Sections（默认值：`new ReplaySubject(1)`）。
   */
  private storedSections$: ReplaySubject<CommandItemGroup[]> = new ReplaySubject(1);
  /**
   * Property `storedSections` (`CommandItemGroup[]`) storing stored sections (default: `[]`).
   * @zh 属性 `storedSections`（类型：`CommandItemGroup[]`），用于存储或配置已状态仓库Sections（默认值：`[]`）。
   */
  private storedSections: CommandItemGroup[] = [];

  /**
   * Executes `select` to handle select.
   * @zh 执行 `select`，用于下拉选择。
   * @returns Result of type `Observable<CommandItemGroup[]>` / 类型为 `Observable<CommandItemGroup[]>` 的返回值
   */
  select(): Observable<CommandItemGroup[]> {
    return this.storedSections$.asObservable();
  }

  /**
   * Executes `get` to handle get.
   * @zh 执行 `get`，用于获取。
   * @returns Result of type `CommandItemGroup[]` / 类型为 `CommandItemGroup[]` 的返回值
   */
  get(): CommandItemGroup[] {
    return this.storedSections;
  }

  /**
   * Executes `set` to handle set.
   * @zh 执行 `set`，用于集合。
   * @param sections - sections parameter (`CommandItemGroup[]`) / sections参数（`CommandItemGroup[]`）
   */
  set(sections: CommandItemGroup[]): void {
    this.storedSections = sections;
    this.storedSections$.next(sections);
  }
}
