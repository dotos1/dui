
import { AfterViewInit, Component, ElementRef } from '@angular/core';

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

  private input: HTMLInputElement = null;

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

  ngAfterViewInit() {
    this.input = this.hostElement.nativeElement.closest('mat-form-field').querySelector('input[type="password"]');
    if (this.input === null) {
      this.hideToggle = true;
    }
  }
}
