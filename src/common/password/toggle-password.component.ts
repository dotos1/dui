
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
  showPassword = false;
  hideToggle = false;

  private input: HTMLInputElement = null;

  constructor(private hostElement: ElementRef) { }

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
