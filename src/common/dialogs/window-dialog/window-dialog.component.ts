/**
 * @fileoverview Module `src/common/dialogs/window-dialog/window-dialog.component.ts` providing window dialog component definitions and implementation.
 * @zh 模块文件 `src/common/dialogs/window-dialog/window-dialog.component.ts`，提供窗口对话框组件相关的定义与实现。
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';

/**
 * Window-chrome dialog wrapper with a title bar offering dock/undock and close controls.
 * @zh 带窗口外观的对话框封装，标题栏提供停靠/取消停靠和关闭控件。
 */
@Component({
  selector: 'window-dialog',
  templateUrl: './window-dialog.component.html',
  styleUrls: ['./window-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,

})
export class WindowDialogComponent {
  /**
   * @zh 标题栏的 Material 主题色。
   * @zh 标题栏的 Material 主题色。
   */
  @Input() toolbarColor?: ThemePalette;
  /**
   * Input property `docked` (`boolean`) configuring docked (default: `false`).
   * @zh 窗口当前是否处于停靠状态。
   * @zh 窗口当前是否处于停靠状态。
   */
  @Input() docked? = false;

  /**
   * Input property `title` (`string`) configuring title.
   * @zh 窗口标题。
   * @zh 窗口标题。
   */
  @Input() title?: string;
  /**
   * Input property `toggleDockedStateLabel` (`string`) configuring toggle docked state label.
   * @zh "切换停靠状态"按钮的无障碍标签文字。
   * @zh "切换停靠状态"按钮的无障碍标签文字。
   */
  @Input() toggleDockedStateLabel?: string;
  /**
   * Input property `closeLabel` (`string`) configuring close label.
   * @zh 关闭按钮的无障碍标签文字。
   * @zh 关闭按钮的无障碍标签文字。
   */
  @Input() closeLabel?: string;

  /**
   * Output event emitter `dockToggled` (`EventEmitter<boolean>`) firing when dock toggled occurs.
   * @zh 停靠状态切换时发出新的停靠状态。
   * @zh 停靠状态切换时发出新的停靠状态。
   */
  @Output() dockToggled: EventEmitter<boolean> = new EventEmitter();
  /**
   * Output event emitter `closed` (`EventEmitter<void>`) firing when closed occurs.
   * @zh 关闭按钮被点击时发出。
   * @zh 关闭按钮被点击时发出。
   */
  @Output() closed: EventEmitter<void> = new EventEmitter();

  /**
   * Property `toolbarHeight` (`number`) storing toolbar height (default: `56`).
   * @zh 标题栏的高度（像素）。
   * @zh 标题栏的高度（像素）。
   */
  toolbarHeight = 56;

  /**
   * Toggles the docked state and emits `dockToggled`.
   * @zh 切换停靠状态并发出 `dockToggled`。
   */
  toggleDockedState(): void {
    this.docked = !this.docked;
    this.dockToggled.emit(this.docked);
  }
}
