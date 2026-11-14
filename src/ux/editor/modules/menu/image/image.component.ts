/**
 * @fileoverview Module `src/ux/editor/modules/menu/image/image.component.ts` providing image component definitions and implementation.
 * @zh 模块文件 `src/ux/editor/modules/menu/image/image.component.ts`，提供图像组件相关的定义与实现。
 */

import {
  Component, ElementRef,
  HostListener, OnDestroy, OnInit,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NodeSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Subscription } from 'rxjs';

import { EditorService } from '../../../editor.service';
import { MenuService } from '../menu.service';
import Icon from '../../../icons';
import { Image as ImageCommand } from '../MenuCommands';

/**
 * Angular component `ImageComponent` (selector: 'ux-image') providing image component presentation and interaction in `src/ux/editor/modules/menu/image`.
 * @zh Angular 组件 `ImageComponent`（selector: 'ux-image'），提供图像组件的视图渲染与交互逻辑（位于 `src/ux/editor/modules/menu/image`）。
 */
@Component({
  selector: 'ux-image',
  templateUrl: './image.component.html',
  standalone: false,
  
})
export class ImageComponent implements OnInit, OnDestroy {
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
   * Property `updateSubscription` (`Subscription`) storing update subscription.
   * @zh 属性 `updateSubscription`（类型：`Subscription`），用于存储或配置更新订阅对象。
   */
  private updateSubscription: Subscription;

  /**
   * Property `form` (`FormGroup<{…}>`) storing form.
   * @zh 属性 `form`（类型：`FormGroup<{…}>`），用于存储或配置表单。
   */
  form = new FormGroup({
    src: new FormControl('', [
      Validators.required,
      Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/??([^#\n\r]*)?#?([^\n\r]*)'),
    ]),
    alt: new FormControl(''),
    title: new FormControl(''),
  });

  /**
   * Property `editorView` (`EditorView`) storing editor view.
   * @zh 属性 `editorView`（类型：`EditorView`），用于存储或配置编辑器视图。
   */
  private editorView: EditorView;

  /**
   * Creates an instance of `ImageComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ImageComponent` 实例，并初始化其依赖项与内部状态。
   * @param el - Injected or initial el (`ElementRef<any>`) / 注入或传入的DOM元素（`ElementRef<any>`）
   * @param uxeService - Injected or initial uxe service (`EditorService`) / 注入或传入的uxe服务（`EditorService`）
   * @param menuService - Injected or initial menu service (`MenuService`) / 注入或传入的菜单服务（`MenuService`）
   */
  constructor(
    private el: ElementRef,
    private uxeService: EditorService,
    private menuService: MenuService,
  ) { }

  /**
   * Gets the current icon (`icon: string`).
   * @zh 获取当前图标（`icon: string`）。
   */
  get icon(): string {
    return Icon.get('image');
  }

  /**
   * Gets the current src (`src: AbstractControl`).
   * @zh 获取当前源路径（`src: AbstractControl`）。
   */
  get src(): AbstractControl {
    return this.form.get('src');
  }

  /**
   * Host event listener `onDocumentClick` handling `document:mousedown` events for on document click.
   * @zh 宿主事件监听方法 `onDocumentClick`，响应 `document:mousedown` 事件以处理当文档对象点击。
   * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
   */
  @HostListener('document:mousedown', ['$event']) onDocumentClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target) && this.showPopup) {
      this.hideForm();
    }
  }

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
   * Executes `hideForm` to handle hide form.
   * @zh 执行 `hideForm`，用于隐藏表单。
   */
  private hideForm(): void {
    this.showPopup = false;
    this.form.reset({
      src: '',
      alt: '',
      title: '',
    });
  }

  /**
   * Executes `onMouseDown` to handle on mouse down.
   * @zh 执行 `onMouseDown`，用于当鼠标向下。
   * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
   */
  onMouseDown(e: MouseEvent): void {
    if (e.button !== 0) {
      return;
    }

    this.showPopup = !this.showPopup;

    if (this.showPopup) {
      this.fillForm();
    }
  }

  /**
   * Executes `fillForm` to handle fill form.
   * @zh 执行 `fillForm`，用于填充表单。
   */
  private fillForm(): void {
    const { state } = this.editorView;
    const { selection } = state;
    if (selection instanceof NodeSelection && this.isActive) {
      const { src, alt = '', title = '' } = selection.node.attrs;

      this.form.setValue({
        src,
        alt,
        title,
      });
    }
  }

  /**
   * Property `update` (`(view: EditorView) => void`) storing update.
   * @zh 属性 `update`（类型：`(view: EditorView) => void`），用于存储或配置更新。
   */
  private update = (view: EditorView) => {
    const { state } = view;
    this.isActive = ImageCommand.isActive(state);
  };

  /**
   * Executes `insertLink` to handle insert link.
   * @zh 执行 `insertLink`，用于插入链接。
   * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
   */
  insertLink(e: MouseEvent): void {
    e.preventDefault();
    const { src, alt, title } = this.form.getRawValue();
    const { dispatch, state } = this.editorView;

    const attrs = {
      alt,
      title,
    };

    ImageCommand.insert(src, attrs)(state, dispatch);
    this.editorView.focus();
    this.hideForm();
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
