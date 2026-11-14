/**
 * @fileoverview Module `src/ux/editor/modules/menu/dropdown/dropdown.component.ts` providing dropdown component definitions and implementation.
 * @zh 模块文件 `src/ux/editor/modules/menu/dropdown/dropdown.component.ts`，提供下拉框组件相关的定义与实现。
 */

import {
  Component, ElementRef,
  HostListener, Input, OnDestroy, OnInit,
} from '@angular/core';
import { EditorView } from 'prosemirror-view';
import { Subscription } from 'rxjs';

import { EditorService } from '../../../editor.service';
import { MenuService } from '../menu.service';
import { ToggleCommands } from '../MenuCommands';
import { TBHeadingItems } from '../../../types';

/**
 * Angular component `DropdownComponent` (selector: 'ux-dropdown') providing dropdown component presentation and interaction in `src/ux/editor/modules/menu/dropdown`.
 * @zh Angular 组件 `DropdownComponent`（selector: 'ux-dropdown'），提供下拉框组件的视图渲染与交互逻辑（位于 `src/ux/editor/modules/menu/dropdown`）。
 */
@Component({
  selector: 'ux-dropdown',
  templateUrl: './dropdown.component.html',
  standalone: false,
  
})
export class DropdownComponent implements OnInit, OnDestroy {
  /**
   * Property `editorView` (`EditorView`) storing editor view.
   * @zh 属性 `editorView`（类型：`EditorView`），用于存储或配置编辑器视图。
   */
  private editorView: EditorView;
  /**
   * Property `updateSubscription` (`Subscription`) storing update subscription.
   * @zh 属性 `updateSubscription`（类型：`Subscription`），用于存储或配置更新订阅对象。
   */
  private updateSubscription: Subscription;

  /**
   * Input property `group` (`string`) configuring group.
   * @zh 输入属性 `group`（类型：`string`），用于配置分组。
   */
  @Input() group: string;
  /**
   * Input property `items` (`TBHeadingItems[]`) configuring items.
   * @zh 输入属性 `items`（类型：`TBHeadingItems[]`），用于配置条目列表。
   */
  @Input() items: TBHeadingItems[];

  /**
   * Property `isDropdownOpen` (`boolean`) storing is dropdown open (default: `false`).
   * @zh 属性 `isDropdownOpen`（类型：`boolean`），用于存储或配置是否为下拉框打开（默认值：`false`）。
   */
  isDropdownOpen = false;

  /**
   * Property `disabledItems` (`string[]`) storing disabled items (default: `[]`).
   * @zh 属性 `disabledItems`（类型：`string[]`），用于存储或配置已禁用条目列表（默认值：`[]`）。
   */
  disabledItems: string[] = [];
  /**
   * Property `activeItem` (`string`) storing active item.
   * @zh 属性 `activeItem`（类型：`string`），用于存储或配置激活条目。
   */
  activeItem: string | null;

  /**
   * Creates an instance of `DropdownComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DropdownComponent` 实例，并初始化其依赖项与内部状态。
   * @param uxeService - Injected or initial uxe service (`EditorService`) / 注入或传入的uxe服务（`EditorService`）
   * @param menuService - Injected or initial menu service (`MenuService`) / 注入或传入的菜单服务（`MenuService`）
   * @param el - Injected or initial el (`ElementRef<any>`) / 注入或传入的DOM元素（`ElementRef<any>`）
   */
  constructor(
    private uxeService: EditorService,
    private menuService: MenuService,
    private el: ElementRef,
  ) { }

  /**
   * Gets the current is selected (`isSelected: boolean`).
   * @zh 获取当前是否为已选中（`isSelected: boolean`）。
   */
  get isSelected(): boolean {
    return Boolean(this.activeItem || this.isDropdownOpen);
  }

  /**
   * Gets the current is dropdown disabled (`isDropdownDisabled: boolean`).
   * @zh 获取当前是否为下拉框已禁用（`isDropdownDisabled: boolean`）。
   */
  get isDropdownDisabled(): boolean {
    return this.disabledItems.length === this.items.length;
  }

  /**
   * Host event listener `onDocumentClick` handling `document:mousedown` events for on document click.
   * @zh 宿主事件监听方法 `onDocumentClick`，响应 `document:mousedown` 事件以处理当文档对象点击。
   * @param target - target parameter (`Node`) / 目标参数（`Node`）
   */
  @HostListener('document:mousedown', ['$event.target']) onDocumentClick(target: Node): void {
    if (!this.el.nativeElement.contains(target) && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

  /**
   * Executes `getName` to handle get name.
   * @zh 执行 `getName`，用于获取名称。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getName(key: string): string {
    return this.uxeService.locals.get(key);
  }

  /**
   * Executes `toggleDropdown` to handle toggle dropdown.
   * @zh 执行 `toggleDropdown`，用于开关下拉框。
   * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
   */
  toggleDropdown(e: MouseEvent): void {
    e.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * Executes `trackByIndex` to handle track by index.
   * @zh 执行 `trackByIndex`，用于跟踪按索引。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  trackByIndex(index: number): number {
    return index;
  }

  /**
   * Executes `onClick` to handle on click.
   * @zh 执行 `onClick`，用于当点击。
   * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
   * @param item - item parameter (`TBHeadingItems`) / 条目参数（`TBHeadingItems`）
   */
  onClick(e: MouseEvent, item: TBHeadingItems): void {
    e.preventDefault();

    // consider only left click
    if (e.button !== 0) {
      return;
    }

    const command = ToggleCommands[item];
    const { state, dispatch } = this.editorView;
    command.toggle()(state, dispatch);
    this.isDropdownOpen = false;
  }

  /**
   * Property `update` (`(view: EditorView) => void`) storing update.
   * @zh 属性 `update`（类型：`(view: EditorView) => void`），用于存储或配置更新。
   */
  private update = (view: EditorView) => {
    const { state } = view;
    this.disabledItems = [];
    const activeItems = [];

    this.items.forEach((item: TBHeadingItems) => {
      const command = ToggleCommands[item];
      const isActive = command.isActive(state);

      if (isActive) {
        activeItems.push(item);
      }

      if (!command.canExecute(state)) {
        this.disabledItems.push(item);
      }
    });

    if (activeItems.length === 1) {
      [this.activeItem] = activeItems;
    } else {
      this.activeItem = null;
    }
  };

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.editorView = this.menuService.editor.view;

    this.updateSubscription = this.menuService.editor.update.subscribe((view: EditorView) => {
      this.update(view);
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.updateSubscription.unsubscribe();
  }
}
