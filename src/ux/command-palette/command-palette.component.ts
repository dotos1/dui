/**
 * @fileoverview Module `src/ux/command-palette/command-palette.component.ts` providing command palette component definitions and implementation.
 * @zh 模块文件 `src/ux/command-palette/command-palette.component.ts`，提供命令调色板组件相关的定义与实现。
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Fuse from 'fuse.js';
import { CommandItemGroup } from './model/command-item-group';
import { CommandItem } from './model/command-item';
import { CommandPaletteGroupStorageService } from './services/command-palette-group-storage.service';
import { CommandPaletteCreatorService } from './services/command-palette-creator-service';

/**
 * Angular component `CommandPaletteComponent` (selector: 'command-palette') providing command palette component presentation and interaction in `src/ux/command-palette`.
 * @zh Angular 组件 `CommandPaletteComponent`（selector: 'command-palette'），提供命令调色板组件的视图渲染与交互逻辑（位于 `src/ux/command-palette`）。
 */
@Component({
  selector: 'command-palette',
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  
})
export class CommandPaletteComponent implements OnInit, OnDestroy {

  /**
   * Property `filteredGroups` (`CommandItemGroup[]`) storing filtered groups (default: `[]`).
   * @zh 属性 `filteredGroups`（类型：`CommandItemGroup[]`），用于存储或配置已过滤分组（默认值：`[]`）。
   */
  filteredGroups: CommandItemGroup[] = [];
  /**
   * Property `selectedItemIndex` (`number`) storing selected item index (default: `0`).
   * @zh 属性 `selectedItemIndex`（类型：`number`），用于存储或配置已选中条目索引（默认值：`0`）。
   */
  selectedItemIndex: number = 0;

  /**
   * Property `initialGroups` (`CommandItemGroup[]`) storing initial groups (default: `[]`).
   * @zh 属性 `initialGroups`（类型：`CommandItemGroup[]`），用于存储或配置初始分组（默认值：`[]`）。
   */
  private initialGroups: CommandItemGroup[] = [];
  /**
   * Property `allFilteredItems` (`CommandItem[]`) storing all filtered items (default: `[]`).
   * @zh 属性 `allFilteredItems`（类型：`CommandItem[]`），用于存储或配置全部已过滤条目列表（默认值：`[]`）。
   */
  private allFilteredItems: CommandItem[] = [];

  /**
   * Property `fuseOptions` (`{ keys: string[]; threshold: number; }`) storing fuse options (default: `{ keys: ['text'], threshold: 0.4 }`).
   * @zh 属性 `fuseOptions`（类型：`{ keys: string[]; threshold: number; }`），用于存储或配置fuse配置选项（默认值：`{ keys: ['text'], threshold: 0.4 }`）。
   */
  private readonly fuseOptions = { keys: ['text'], threshold: 0.4 };
  /**
   * Property `onDestroy$` (`Subject<void>`) storing on destroy (default: `new Subject<void>()`).
   * @zh 属性 `onDestroy$`（类型：`Subject<void>`），用于存储或配置当销毁（默认值：`new Subject<void>()`）。
   */
  private readonly onDestroy$: Subject<void> = new Subject<void>();

  /**
   * Creates an instance of `CommandPaletteComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CommandPaletteComponent` 实例，并初始化其依赖项与内部状态。
   * @param changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param commandPaletteGroupStorageServ... - Injected or initial command palette group storage serv (`CommandPaletteGroupStorageService`) / 注入或传入的命令调色板分组存储Serv（`CommandPaletteGroupStorageService`）
   * @param commandPaletteCreatorService - Injected or initial command palette creator service (`CommandPaletteCreatorService`) / 注入或传入的命令调色板Creator服务（`CommandPaletteCreatorService`）
   */
  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly commandPaletteGroupStorageService: CommandPaletteGroupStorageService,
    private readonly commandPaletteCreatorService: CommandPaletteCreatorService
  ) {
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.observeGroups();
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /**
   * Executes `onSearchedValue` to handle on searched value.
   * @zh 执行 `onSearchedValue`，用于当已搜索值。
   * @param searchValue - search value parameter (`string`) / 搜索值参数（`string`）
   */
  onSearchedValue(searchValue: string): void {
    if (!searchValue) {
      this.resetToDefault();
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.filteredGroups = this.initialGroups.map(g => {
      const filteredItems = new Fuse(g.items, this.fuseOptions)
        .search(searchValue)
        .map(r => r.item);

      return {
        title: g.title,
        items: filteredItems
      };
    }).filter(g => g.items.length);

    this.setAllItems(this.filteredGroups);
    this.selectedItemIndex = 0;

    this.changeDetectorRef.markForCheck();
  }

  /**
   * Executes `onSelectNextItem` to handle on select next item.
   * @zh 执行 `onSelectNextItem`，用于当下拉选择下一个条目。
   */
  onSelectNextItem(): void {
    this.selectedItemIndex++;
    if (this.selectedItemIndex > this.allFilteredItems.length - 1) {
      this.selectedItemIndex = 0;
    }
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Executes `onSelectPreviousItem` to handle on select previous item.
   * @zh 执行 `onSelectPreviousItem`，用于当下拉选择上一个条目。
   */
  onSelectPreviousItem(): void {
    this.selectedItemIndex--;
    if (this.selectedItemIndex < 0) {
      this.selectedItemIndex = this.allFilteredItems.length - 1;
    }
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Executes `onSelectItem` to handle on select item.
   * @zh 执行 `onSelectItem`，用于当下拉选择条目。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   */
  onSelectItem(index: number): void {
    this.selectedItemIndex = index;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Executes `onCallCallbackItem` to handle on call callback item.
   * @zh 执行 `onCallCallbackItem`，用于当调用回调函数条目。
   * @param itemIndex - item index parameter (`number`) / 条目索引参数（`number`）
   */
  onCallCallbackItem(itemIndex?: number): void {
    const selectedItem = this.allFilteredItems[itemIndex ?? this.selectedItemIndex];
    if (!selectedItem) {
      return;
    }

    if (selectedItem.callback) {
      selectedItem.callback();
    } else if (selectedItem.href) {
      window.open(selectedItem.href, "_self");
    }

    this.commandPaletteCreatorService.destroy();
  }

  /**
   * Executes `observeGroups` to handle observe groups.
   * @zh 执行 `observeGroups`，用于观察分组。
   */
  private observeGroups(): void {
    this.commandPaletteGroupStorageService
        .select()
        .pipe(
          takeUntil(this.onDestroy$)
        )
        .subscribe((groups: CommandItemGroup[]) => {
          this.initialGroups = groups;
          this.filteredGroups = groups;
          this.setAllItems(groups);
          this.selectedItemIndex = 0;
          this.changeDetectorRef.markForCheck();
        });

  }

  /**
   * Executes `setAllItems` to handle set all items.
   * @zh 执行 `setAllItems`，用于集合全部条目列表。
   * @param groups - groups parameter (`CommandItemGroup[]`) / 分组参数（`CommandItemGroup[]`）
   */
  private setAllItems(groups: CommandItemGroup[]): void {
    this.allFilteredItems = groups.map(g => g.items).flat();
  }

  /**
   * Executes `resetToDefault` to handle reset to default.
   * @zh 执行 `resetToDefault`，用于重置转换为默认。
   */
  private resetToDefault(): void {
    this.filteredGroups = [...this.initialGroups];
    this.setAllItems(this.filteredGroups);
    this.selectedItemIndex = 0;
  }

}
