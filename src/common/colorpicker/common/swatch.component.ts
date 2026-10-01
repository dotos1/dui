import { CommonModule } from '@angular/common';
import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  NgModule,  OnInit,  Output,
} from '@angular/core';
import { TranslateModule } from '@dotos/dui/translator';
import { CheckboardModule } from './checkboard.component';

@Component({
  selector: 'color-swatch',
  template: `
    <div
      class="swatch"
      [ngStyle]="currentStyles()"
      [attr.title]="color|translate"
      (click)="handleClick(color, $event)"
      (keydown.enter)="handleClick(color, $event)"
      (focus)="handleFocus()"
      (blur)="handleFocusOut()"
      (mouseover)="handleHover(color, $event)"
      tabindex="0"
    >
      <ng-content></ng-content>
      <color-checkboard
        *ngIf="color === 'transparent'"
        boxShadow="inset 0 0 0 1px rgba(0,0,0,0.1)"
      ></color-checkboard>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
/**
 * A single clickable color swatch, used to build preset-color grids in the `color-*`
 * picker style variants.
 * @zh 单个可点击的颜色色块，用于在 `color-*` 颜色选择器样式变体中构建预设色块网格。
 */
export class SwatchComponent implements OnInit {
  /** @zh 该色块代表的颜色值。 */
  @Input() color;
  /** @zh 应用到色块上的内联样式。 */
  @Input() style: { [key: string]: string } = {};
  /** @zh 获得焦点时叠加的内联样式。 */
  @Input() focusStyle: { [key: string]: string } = {};
  /** @zh 是否强制以聚焦样式渲染。 */
  @Input() focus: boolean;
  /** @zh 色块被点击/回车确认时发出。 */
  @Output() onClick = new EventEmitter<{ hex: string; $event: Event }>();
  /** @zh 鼠标悬停在色块上时发出。 */
  @Output() onHover = new EventEmitter<{ hex: string; $event: Event }>();
  /** @zh 色块的基础样式。 */
  divStyles: { [key: string]: string } = {};
  /** @zh 色块的聚焦样式（基础样式与 `focusStyle` 合并后的结果）。 */
  focusStyles: { [key: string]: string } = {};
  /** @zh 色块当前是否处于聚焦状态。 */
  inFocus = false;

  ngOnInit() {
    this.divStyles = {
      background: this.color,
      height: '100%',
      width: '100%',
      cursor: 'pointer',
      position: 'relative',
      outline: 'none',
      ...this.style,
    };
  }
  /**
   * Returns the style object to apply, based on whether the swatch is focused.
   * @zh 返回应应用的样式对象，取决于色块当前是否处于聚焦状态。
   */
  currentStyles() {
    this.focusStyles = {
      ...this.divStyles,
      ...this.focusStyle,
    };
    return this.focus || this.inFocus ? this.focusStyles : this.divStyles;
  }
  /**
   * @hidden Marks the swatch as no longer focused.
   * @zh 内部使用，标记色块不再处于聚焦状态。
   */
  handleFocusOut() {
    this.inFocus = false;
  }
  /**
   * @hidden Marks the swatch as focused.
   * @zh 内部使用，标记色块处于聚焦状态。
   */
  handleFocus() {
    this.inFocus = true;
  }
  /**
   * @hidden Emits `onHover` with the swatch's color.
   * @zh 内部使用，携带色块颜色发出 `onHover`。
   */
  handleHover(hex, $event) {
    this.onHover.emit({ hex, $event });
  }
  /**
   * @hidden Emits `onClick` with the swatch's color.
   * @zh 内部使用，携带色块颜色发出 `onClick`。
   */
  handleClick(hex, $event) {
    this.onClick.emit({ hex, $event });
  }
}

@NgModule({
  declarations: [SwatchComponent],
  exports: [SwatchComponent],
  imports: [CommonModule, CheckboardModule,TranslateModule],
})
export class SwatchModule {}
