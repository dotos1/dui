
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import { TooltipPosition } from '@angular/material/tooltip';
import { ThemePalette } from '@angular/material/core';
import { ClipboardService } from './clipboard.service';
import { TranslateService } from '@dotos/dui/translator';
import { coerceBoolean } from '@dotos/dui/core/decorators';

/**
 * A ready-made icon button that copies a given string to the clipboard when clicked,
 * showing a brief "copied" tooltip state.
 * @zh 一个开箱即用的图标按钮，点击后将指定字符串复制到剪贴板，并短暂显示"已复制"提示状态。
 */
@Component({
  selector: 'copy-button',
  styleUrls: ['copy-button.component.scss'],
  templateUrl: './copy-button.component.html'
})
export class CopyButtonComponent {

  private timer;

  copied = false;

  /**
   * The text to copy to the clipboard.
   * @zh 要复制到剪贴板的文本。
   */
  @Input()
  copyText: string;

  /**
   * Disables the button.
   * @zh 禁用按钮。
   */
  @Input()
  @coerceBoolean()
  disabled = false;

  /**
   * Icon name shown on the button.
   * @zh 按钮上显示的图标名称。
   */
  @Input()
  icon: string;

  /**
   * Tooltip text shown before copying.
   * @zh 复制前显示的提示文字。
   */
  @Input()
  tooltipText: string;

  /**
   * Tooltip position, per Angular Material's `TooltipPosition`.
   * @zh 提示气泡的位置（沿用 Angular Material 的 `TooltipPosition`）。
   */
  @Input()
  tooltipPosition: TooltipPosition;

  /**
   * Inline style object applied to the button.
   * @zh 应用到按钮上的内联样式对象。
   */
  @Input()
  style: {[key: string]: any} = {};

  /**
   * Material theme color.
   * @zh Material 主题色。
   */
  @Input()
  color: ThemePalette;

  /**
   * Renders as a compact (mini) icon button.
   * @zh 是否渲染为紧凑（迷你）图标按钮。
   */
  @Input()
  @coerceBoolean()
  miniButton = true;

  /**
   * Emits the copied text after a successful copy.
   * @zh 复制成功后，发出被复制的文本。
   */
  @Output()
  successCopied = new EventEmitter<string>();

  constructor(private clipboardService: ClipboardService,
              private translate: TranslateService,
              private cd: ChangeDetectorRef) {
  }

  copy($event: Event): void {
    $event.stopPropagation();
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.clipboardService.copyContentToClipboard(this.copyText);
    this.successCopied.emit(this.copyText);
    this.copied = true;
    this.timer = setTimeout(() => {
      this.copied = false;
      this.cd.detectChanges();
    }, 1500);
  }

  get matTooltipText(): string {
    return this.copied ? this.translate.instant('ota-update.copied') : this.tooltipText;
  }

  get matTooltipPosition(): TooltipPosition {
    return this.copied ? 'below' : this.tooltipPosition;
  }

}
