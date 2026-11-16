/**
 * @fileoverview Module `src/ux/editor/modules/menu/color-picker/color-picker.component.ts` providing color picker component definitions and implementation.
 * @zh 模块文件 `src/ux/editor/modules/menu/color-picker/color-picker.component.ts`，提供颜色选择器组件相关的定义与实现。
 */

import {
  Component, ElementRef,
  HostListener, OnDestroy, Input, OnInit, ChangeDetectionStrategy,
} from '@angular/core';
import { EditorView } from 'prosemirror-view';
import { Subscription } from 'rxjs';

import Icon from '../../../icons';
import { EditorService } from '../../../editor.service';
import { MenuService } from '../menu.service';
import { TextColor, TextBackgroundColor } from '../MenuCommands';

/**
 * Type alias `Command` representing command (`typeof TextColor | typeof TextBackgroundColor`).
 * @zh 类型别名 `Command`，表示命令（`typeof TextColor | typeof TextBackgroundColor`）。
 */
type Command = typeof TextColor | typeof TextBackgroundColor;

/**
 * Angular component `ColorPickerComponent` (selector: 'ux-color-picker') providing color picker component presentation and interaction in `src/ux/editor/modules/menu/color-picker`.
 * @zh Angular 组件 `ColorPickerComponent`（selector: 'ux-color-picker'），提供颜色选择器组件的视图渲染与交互逻辑（位于 `src/ux/editor/modules/menu/color-picker`）。
 */
@Component({
  selector: 'ux-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  
})
export class ColorPickerComponent implements OnInit, OnDestroy {
  /**
   * Input property `presets` (`string[][]`) configuring presets.
   * @zh 输入属性 `presets`（类型：`string[][]`），用于配置presets。
   */
  @Input() presets: string[][];
  /**
   * Input property `type` (`string`) configuring type.
   * @zh 输入属性 `type`（类型：`string`），用于配置类型。
   */
  @Input() type: string;

  /**
   * Creates an instance of `ColorPickerComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ColorPickerComponent` 实例，并初始化其依赖项与内部状态。
   * @param el - Injected or initial el (`ElementRef<any>`) / 注入或传入的DOM元素（`ElementRef<any>`）
   * @param menuService - Injected or initial menu service (`MenuService`) / 注入或传入的菜单服务（`MenuService`）
   * @param uxeService - Injected or initial uxe service (`EditorService`) / 注入或传入的uxe服务（`EditorService`）
   */
  constructor(
    private el: ElementRef,
    private menuService: MenuService,
    private uxeService: EditorService,
  ) { }

  /**
   * Gets the current title (`title: string`).
   * @zh 获取当前标题（`title: string`）。
   */
  get title(): string {
    return this.getLabel(this.type === 'text_color' ? 'text_color' : 'background_color');
  }

  /**
   * Gets the current icon (`icon: string`).
   * @zh 获取当前图标（`icon: string`）。
   */
  get icon(): string {
    return Icon.get(this.type === 'text_color' ? 'text_color' : 'color_fill');
  }

  /**
   * Gets the current command (`command: Command`).
   * @zh 获取当前命令（`command: Command`）。
   */
  private get command(): Command {
    return this.type === 'text_color' ? TextColor : TextBackgroundColor;
  }

  /**
   * Property `updateSubscription` (`Subscription`) storing update subscription.
   * @zh 属性 `updateSubscription`（类型：`Subscription`），用于存储或配置更新订阅对象。
   */
  private updateSubscription: Subscription;
  /**
   * Property `editorView` (`EditorView`) storing editor view.
   * @zh 属性 `editorView`（类型：`EditorView`），用于存储或配置编辑器视图。
   */
  private editorView: EditorView;
  /**
   * Property `showPopup` (`boolean`) storing show popup (default: `false`).
   * @zh 属性 `showPopup`（类型：`boolean`），用于存储或配置显示弹窗（默认值：`false`）。
   */
  showPopup = false;
  /**
   * Property `isActive` (`boolean`) storing is active (default: `false`).
   * @zh 属性 `isActive`（类型：`boolean`），用于存储或配置是否为激活（默认值：`false`）。
   */
  isActive = false;
  /**
   * Property `activeColors` (`string[]`) storing active colors (default: `[]`).
   * @zh 属性 `activeColors`（类型：`string[]`），用于存储或配置激活颜色列表（默认值：`[]`）。
   */
  activeColors: string[] = [];
  /**
   * Property `canExecute` (`boolean`) storing can execute (default: `true`).
   * @zh 属性 `canExecute`（类型：`boolean`），用于存储或配置是否可以执行（默认值：`true`）。
   */
  canExecute = true;

  /**
   * Executes `getContrastYIQ` to handle get contrast yiq.
   * @zh 执行 `getContrastYIQ`，用于获取对比度YIQ。
   * @param hexcolor - hexcolor parameter (`string`) / hexcolor参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getContrastYIQ(hexcolor: string): string {
    const color = hexcolor.replace('#', '');
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  }

  /**
   * Host event listener `onDocumentClick` handling `document:mousedown` events for on document click.
   * @zh 宿主事件监听方法 `onDocumentClick`，响应 `document:mousedown` 事件以处理当文档对象点击。
   * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
   */
  @HostListener('document:mousedown', ['$event']) onDocumentClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target) && this.showPopup) {
      this.hidePopup();
    }
  }

  /**
   * Executes `hidePopup` to handle hide popup.
   * @zh 执行 `hidePopup`，用于隐藏弹窗。
   */
  private hidePopup(): void {
    this.showPopup = false;
  }

  /**
   * Executes `togglePopup` to handle toggle popup.
   * @zh 执行 `togglePopup`，用于开关弹窗。
   * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
   */
  togglePopup(e: MouseEvent): void {
    e.preventDefault();

    if (e.button !== 0) {
      return;
    }

    this.showPopup = !this.showPopup;
  }

  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
   */
  remove(e: MouseEvent): void {
    e.preventDefault();
    const { state, dispatch } = this.editorView;

    this.command.remove()(state, dispatch);
    this.hidePopup();
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
   * Executes `onColorSelect` to handle on color select.
   * @zh 执行 `onColorSelect`，用于当颜色下拉选择。
   * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
   * @param color - color parameter (`string`) / 颜色参数（`string`）
   */
  onColorSelect(e: MouseEvent, color: string): void {
    e.preventDefault();

    if (e.button !== 0) {
      return;
    }

    const { state, dispatch } = this.editorView;

    if (this.type === 'text_color') {
      const attrs = { color };
      this.command.apply(attrs)(state, dispatch);
    } else {
      const attrs = { backgroundColor: color };
      this.command.apply(attrs)(state, dispatch);
    }

    if (!this.editorView.hasFocus()) {
      this.editorView.focus();
    }

    this.hidePopup();
  }

  /**
   * Property `update` (`(view: EditorView) => void`) storing update.
   * @zh 属性 `update`（类型：`(view: EditorView) => void`），用于存储或配置更新。
   */
  private update = (view: EditorView) => {
    const { state } = view;
    this.canExecute = this.command.canExecute(state);
    this.isActive = this.command.isActive(state);
    this.activeColors = [];

    if (this.isActive) {
      this.activeColors = this.command.getActiveColors(state);
    }
  };

  /**
   * Executes `getLabel` to handle get label.
   * @zh 执行 `getLabel`，用于获取标签。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getLabel(key: string): string {
    return this.uxeService.locals.get(key);
  }

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
