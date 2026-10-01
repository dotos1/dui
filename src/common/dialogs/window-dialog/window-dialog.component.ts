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

})
export class WindowDialogComponent {
  /** @zh 标题栏的 Material 主题色。 */
  @Input() toolbarColor?: ThemePalette;
  /** @zh 窗口当前是否处于停靠状态。 */
  @Input() docked? = false;

  /** @zh 窗口标题。 */
  @Input() title?: string;
  /** @zh "切换停靠状态"按钮的无障碍标签文字。 */
  @Input() toggleDockedStateLabel?: string;
  /** @zh 关闭按钮的无障碍标签文字。 */
  @Input() closeLabel?: string;

  /** @zh 停靠状态切换时发出新的停靠状态。 */
  @Output() dockToggled: EventEmitter<boolean> = new EventEmitter();
  /** @zh 关闭按钮被点击时发出。 */
  @Output() closed: EventEmitter<void> = new EventEmitter();

  /** @zh 标题栏的高度（像素）。 */
  toolbarHeight = 56;

  /**
   * Toggles the docked state and emits `dockToggled`.
   * @zh 切换停靠状态并发出 `dockToggled`。
   */
  toggleDockedState(): void {
    this.dockToggled.emit(this.docked);
  }
}
