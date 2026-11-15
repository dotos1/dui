/**
 * @fileoverview Module `src/common/password/toggle-password.component.ts` providing toggle password component definitions and implementation.
 * @zh 模块文件 `src/common/password/toggle-password.component.ts`，提供开关密码组件相关的定义与实现。
 */


import { AfterViewInit, Component, ElementRef, ChangeDetectionStrategy } from '@angular/core';

/**
 * Toggle button placed inside a `mat-form-field` that switches its sibling
 * `input[type="password"]` between masked and plain text.
 * @zh 放置在 `mat-form-field` 内的切换按钮，用于将同级的 `input[type="password"]`
 * 在密文与明文之间切换显示。
 */
@Component({
  selector: 'toggle-password',
  templateUrl: 'toggle-password.component.html',
  styleUrls: [],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})

export class TogglePasswordComponent implements AfterViewInit {
  /**
   * Whether the sibling password input currently shows plain text (`true`) or is masked (`false`).
   * @zh 同级密码输入框当前是否显示为明文（`true`）还是密文（`false`）。
   */
  showPassword = false;
  /**
   * Whether to hide the toggle button entirely (set when no sibling `input[type="password"]` is found).
   * @zh 是否完全隐藏切换按钮（当未找到同级 `input[type="password"]` 时设置为 `true`）。
   */
  hideToggle = false;

  /**
   * Property `input` (`HTMLInputElement`) storing input (default: `null`).
   * @zh 属性 `input`（类型：`HTMLInputElement`），用于存储或配置输入属性（默认值：`null`）。
   */
  private input: HTMLInputElement = null;

  /**
   * Creates an instance of `TogglePasswordComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TogglePasswordComponent` 实例，并初始化其依赖项与内部状态。
   * @param hostElement - Injected or initial host element (`ElementRef<any>`) / 注入或传入的宿主元素（`ElementRef<any>`）
   */
  constructor(private hostElement: ElementRef) { }

  /**
   * Toggles the sibling input between password and plain-text display.
   * @zh 切换同级输入框在密码与明文显示之间的状态。
   */
  togglePassword($event: Event) {
    $event.stopPropagation();
    this.showPassword = !this.showPassword;
    this.input.type = this.showPassword ? 'text' : 'password';
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit() {
    this.input = this.hostElement.nativeElement.closest('mat-form-field').querySelector('input[type="password"]');
    if (this.input === null) {
      this.hideToggle = true;
    }
  }
}
