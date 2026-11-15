/**
 * @fileoverview Module `src/common/clipboard/copy-button.component.ts` providing copy button component definitions and implementation.
 * @zh 模块文件 `src/common/clipboard/copy-button.component.ts`，提供复制按钮组件相关的定义与实现。
 */


import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

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
  templateUrl: './copy-button.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CopyButtonComponent {

  /**
   * Property `timer` (`any`) storing timer.
   * @zh 属性 `timer`（类型：`any`），用于存储或配置定时器。
   */
  private timer;

  /**
   * Property `copied` (`boolean`) storing copied (default: `false`).
   * @zh 是否刚完成一次复制（用于短暂显示"已复制"状态）。
   * @zh 是否刚完成一次复制（用于短暂显示"已复制"状态）。
   */
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
  style: {[key: string]: unknown} = {};

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

  /**
   * Creates an instance of `CopyButtonComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CopyButtonComponent` 实例，并初始化其依赖项与内部状态。
   * @param clipboardService - Injected or initial clipboard service (`ClipboardService`) / 注入或传入的clipboard服务（`ClipboardService`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param cd - Injected or initial cd (`ChangeDetectorRef`) / 注入或传入的cd（`ChangeDetectorRef`）
   */
  constructor(private clipboardService: ClipboardService,
              private translate: TranslateService,
              private cd: ChangeDetectorRef) {
  }

  /**
   * Copies `copyText` to the clipboard, emits `successCopied`, and briefly shows the
   * "copied" tooltip state.
   * @zh 将 `copyText` 复制到剪贴板，发出 `successCopied`，并短暂显示"已复制"提示状态。
   */
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

  /**
   * The tooltip text currently shown: a translated "copied" message right after copying,
   * else `tooltipText`.
   * @zh 当前显示的提示文字：刚复制完成时显示已翻译的"已复制"提示，否则显示 `tooltipText`。
   */
  get matTooltipText(): string {
    return this.copied ? this.translate.instant('ota-update.copied') : this.tooltipText;
  }

  /**
   * The tooltip position currently used: `'below'` right after copying, else `tooltipPosition`.
   * @zh 当前使用的提示气泡位置：刚复制完成时为 `'below'`，否则为 `tooltipPosition`。
   */
  get matTooltipPosition(): TooltipPosition {
    return this.copied ? 'below' : this.tooltipPosition;
  }

}
