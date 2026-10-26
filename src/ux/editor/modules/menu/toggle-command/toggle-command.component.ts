/**
 * @fileoverview Module `src/ux/editor/modules/menu/toggle-command/toggle-command.component.ts` providing toggle command component definitions and implementation.
 * @zh 模块文件 `src/ux/editor/modules/menu/toggle-command/toggle-command.component.ts`，提供开关命令组件相关的定义与实现。
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EditorView } from 'prosemirror-view';
import { Subscription } from 'rxjs';

import Icon from '../../../icons';
import { ToggleCommands } from '../MenuCommands';
import { EditorService } from '../../../editor.service';
import { MenuService } from '../menu.service';
import { TBItems, ToolbarItem } from '../../../types';

/**
 * Angular component `ToggleCommandComponent` (selector: 'ux-toggle-command') providing toggle command component presentation and interaction in `src/ux/editor/modules/menu/toggle-command`.
 * @zh Angular 组件 `ToggleCommandComponent`（selector: 'ux-toggle-command'），提供开关命令组件的视图渲染与交互逻辑（位于 `src/ux/editor/modules/menu/toggle-command`）。
 */
@Component({
  selector: 'ux-toggle-command',
  templateUrl: './toggle-command.component.html'
})

export class ToggleCommandComponent implements OnInit, OnDestroy {
  /**
   * Input property `toolbarItem` (`ToolbarItem`) configuring toolbar item.
   * @zh 输入属性 `toolbarItem`（类型：`ToolbarItem`），用于配置工具栏条目。
   */
  @Input() toolbarItem: ToolbarItem;

  /**
   * Gets the current name (`name: TBItems`).
   * @zh 获取当前名称（`name: TBItems`）。
   */
  get name(): TBItems {
    return this.toolbarItem as TBItems;
  }

  /**
   * Property `html` (`string`) storing html.
   * @zh 属性 `html`（类型：`string`），用于存储或配置HTML内容。
   */
  html: string;
  /**
   * Property `editorView` (`EditorView`) storing editor view.
   * @zh 属性 `editorView`（类型：`EditorView`），用于存储或配置编辑器视图。
   */
  editorView: EditorView;
  /**
   * Property `isActive` (`boolean`) storing is active (default: `false`).
   * @zh 属性 `isActive`（类型：`boolean`），用于存储或配置是否为激活（默认值：`false`）。
   */
  isActive = false;
  /**
   * Property `disabled` (`boolean`) storing disabled (default: `false`).
   * @zh 属性 `disabled`（类型：`boolean`），用于存储或配置已禁用（默认值：`false`）。
   */
  disabled = false;
  /**
   * Property `updateSubscription` (`Subscription`) storing update subscription.
   * @zh 属性 `updateSubscription`（类型：`Subscription`），用于存储或配置更新订阅对象。
   */
  private updateSubscription: Subscription;

  /**
   * Creates an instance of `ToggleCommandComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ToggleCommandComponent` 实例，并初始化其依赖项与内部状态。
   * @param uxeService - Injected or initial uxe service (`EditorService`) / 注入或传入的uxe服务（`EditorService`）
   * @param menuService - Injected or initial menu service (`MenuService`) / 注入或传入的菜单服务（`MenuService`）
   */
  constructor(
    private uxeService: EditorService,
    private menuService: MenuService,
  ) { }

  /**
   * Executes `toggle` to handle toggle.
   * @zh 执行 `toggle`，用于开关。
   * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
   */
  toggle(e: MouseEvent): void {
    e.preventDefault();

    if (e.button !== 0) {
      return;
    }

    const { state, dispatch } = this.editorView;
    const command = ToggleCommands[this.name];
    command.toggle()(state, dispatch);
  }

  /**
   * Property `update` (`any`) storing update.
   * @zh 属性 `update`（类型：`any`），用于存储或配置更新。
   */
  update = (view: EditorView): void => {
    const { state } = view;
    const command = ToggleCommands[this.name];
    this.isActive = command.isActive(state);
    this.disabled = !command.canExecute(state);
  };

  /**
   * Executes `getTitle` to handle get title.
   * @zh 执行 `getTitle`，用于获取标题。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getTitle(name: string): string {
    return this.uxeService.locals.get(name);
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.html = Icon.get(this.name);

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
