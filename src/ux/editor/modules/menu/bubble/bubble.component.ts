/**
 * @fileoverview Module `src/ux/editor/modules/menu/bubble/bubble.component.ts` providing bubble component definitions and implementation.
 * @zh 模块文件 `src/ux/editor/modules/menu/bubble/bubble.component.ts`，提供bubble组件相关的定义与实现。
 */

import { Component, Input, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { EditorView } from 'prosemirror-view';
import { Subscription } from 'rxjs';

import { Editor } from '../../../Editor';
import Icon from '../../../icons';
import { TBItems } from '../../../types';
import { SanitizeHtmlPipe } from '../../../pipes/sanitize/sanitize-html.pipe';
import { ToggleCommands } from '../MenuCommands';
import { EditorService } from '../../../editor.service';

/**
 * Angular component `BubbleComponent` (selector: 'ux-bubble') providing bubble component presentation and interaction in `src/ux/editor/modules/menu/bubble`.
 * @zh Angular 组件 `BubbleComponent`（selector: 'ux-bubble'），提供Bubble组件的视图渲染与交互逻辑（位于 `src/ux/editor/modules/menu/bubble`）。
 */
@Component({
  selector: 'ux-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  
})
export class BubbleComponent implements OnInit, OnDestroy {
  /**
   * Creates an instance of `BubbleComponent` and initializes its dependencies and internal state.
   * @zh 创建 `BubbleComponent` 实例，并初始化其依赖项与内部状态。
   * @param sanitizeHTML - Injected or initial sanitize html (`SanitizeHtmlPipe`) / 注入或传入的sanitizeHTML内容（`SanitizeHtmlPipe`）
   * @param uxeService - Injected or initial uxe service (`EditorService`) / 注入或传入的uxe服务（`EditorService`）
   */
  constructor(private sanitizeHTML: SanitizeHtmlPipe, private uxeService: EditorService) { }

  /**
   * Gets the current view (`view: EditorView`).
   * @zh 获取当前视图（`view: EditorView`）。
   */
  private get view(): EditorView {
    return this.editor.view;
  }

  /**
   * Input property `editor` (`Editor`) configuring editor.
   * @zh 输入属性 `editor`（类型：`Editor`），用于配置编辑器。
   */
  @Input() editor: Editor;

  /**
   * Property `updateSubscription` (`Subscription`) storing update subscription.
   * @zh 属性 `updateSubscription`（类型：`Subscription`），用于存储或配置更新订阅对象。
   */
  private updateSubscription: Subscription;
  /**
   * Property `execulableItems` (`TBItems[]`) storing execulable items (default: `[]`).
   * @zh 属性 `execulableItems`（类型：`TBItems[]`），用于存储或配置execulable条目列表（默认值：`[]`）。
   */
  execulableItems: TBItems[] = [];
  /**
   * Property `activeItems` (`TBItems[]`) storing active items (default: `[]`).
   * @zh 属性 `activeItems`（类型：`TBItems[]`），用于存储或配置激活条目列表（默认值：`[]`）。
   */
  activeItems: TBItems[] = [];

  /**
   * Property `toolbar` (`TBItems[][]`) storing toolbar.
   * @zh 属性 `toolbar`（类型：`TBItems[][]`），用于存储或配置工具栏。
   */
  toolbar: TBItems[][] = [
    ['bold', 'italic', 'underline', 'strike'],
    ['ordered_list', 'bullet_list', 'blockquote', 'code'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  /**
   * Property `toggleCommands` (`TBItems[]`) storing toggle commands.
   * @zh 属性 `toggleCommands`（类型：`TBItems[]`），用于存储或配置开关命令。
   */
  toggleCommands: TBItems[] = [
    'bold',
    'italic',
    'underline',
    'strike',
    'ordered_list',
    'bullet_list',
    'blockquote',
    'code',
    'align_left',
    'align_center',
    'align_right',
    'align_justify',
  ];

  /**
   * Executes `getIcon` to handle get icon.
   * @zh 执行 `getIcon`，用于获取图标。
   * @param name - name parameter (`TBItems`) / 名称参数（`TBItems`）
   * @returns Result of type `SafeHtml` / 类型为 `SafeHtml` 的返回值
   */
  getIcon(name: TBItems): SafeHtml {
    const icon = Icon.get(name);
    return this.sanitizeHTML.transform(icon);
  }

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
   * @param commandName - command name parameter (`TBItems`) / 命令名称参数（`TBItems`）
   */
  onClick(e: MouseEvent, commandName: TBItems): void {
    e.preventDefault();
    e.stopPropagation();

    if (e.button !== 0) {
      return;
    }

    const { state, dispatch } = this.view;

    const command = ToggleCommands[commandName];
    command.toggle()(state, dispatch);
  }

  /**
   * Executes `update` to handle update.
   * @zh 执行 `update`，用于更新。
   * @param view - view parameter (`EditorView`) / 视图参数（`EditorView`）
   */
  private update(view: EditorView): void {
    this.activeItems = [];
    this.execulableItems = [];
    const { state } = view;

    this.toggleCommands.forEach((toolbarItem) => {
      const command = ToggleCommands[toolbarItem];

      const isActive = command.isActive(state);
      if (isActive) {
        this.activeItems.push(toolbarItem);
      }

      const canExecute = command.canExecute(state);

      if (canExecute) {
        this.execulableItems.push(toolbarItem);
      }
    });
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.updateSubscription = this.editor.update
      .subscribe((view) => {
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
