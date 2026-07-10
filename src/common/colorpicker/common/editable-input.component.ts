import { CommonModule } from '@angular/common';
import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  NgModule,  OnChanges,  OnDestroy,  OnInit, Output,
} from '@angular/core';
import { TranslateModule } from '@dotos/dui/translator';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'color-editable-input',
  template: `
  <div class="wrap" [ngStyle]="wrapStyle">
    <input [ngStyle]="inputStyle" spellCheck="false"
      [value]="currentValue" [placeholder]="placeholder|translate"
      (keydown)="handleKeydown($event)" (keyup)="handleKeyup($event)"
      (focus)="handleFocus()" (focusout)="handleFocusOut()" />
    <span *ngIf="label" class="color-input-label" [ngStyle]="labelStyle" (mousedown)="handleMousedown($event)">
      {{ label|translate }}
    </span>
  </div>
  `,
  styles: [
    `
    :host {
      display: flex;
    }
    .wrap {
      position: relative;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
/**
 * A labeled numeric/text input field (e.g. R/G/B/hex fields) used by the `color-*` picker
 * style variants, with arrow-key increment/decrement and optional drag-to-adjust via the label.
 * @zh 带标签的数字/文本输入字段（如 R/G/B/十六进制字段），供 `color-*` 颜色选择器样式变体使用，
 * 支持方向键增减，以及可选的通过拖拽标签调整数值。
 */
export class EditableInputComponent implements OnInit, OnChanges, OnDestroy {
  /** @zh 包裹层/输入框/标签各自的内联样式。 */
  @Input() style: {
    wrap?: { [key: string]: string };
    input: { [key: string]: string };
    label: { [key: string]: string };
  };
  /** @zh 字段标签文字（也用作 `onChange` 发出数据对象的键名）。 */
  @Input() label: string;
  /** @zh 当前字段值。 */
  @Input() value: string | number;
  /** @zh 使用方向键调整数值时的步进量。 */
  @Input() arrowOffset: number;
  /** @zh 是否允许通过拖拽标签调整数值。 */
  @Input() dragLabel: boolean;
  /** @zh 通过拖拽标签调整数值时允许的最大值。 */
  @Input() dragMax: number;
  /** @zh 输入框占位提示文字。 */
  @Input() placeholder = '';
  /** @zh 字段值变化时发出。 */
  @Output() onChange = new EventEmitter();
  /** @zh 输入框当前显示的值。 */
  currentValue: string | number;
  /** @zh 失焦时应恢复显示的值。 */
  blurValue: string;
  /** @zh 包裹层的内联样式。 */
  wrapStyle: { [key: string]: string };
  /** @zh 输入框的内联样式。 */
  inputStyle: { [key: string]: string };
  /** @zh 标签的内联样式。 */
  labelStyle: { [key: string]: string };
  /** @zh 输入框当前是否处于聚焦状态。 */
  focus = false;
  /** @zh 内部使用，拖拽标签调整数值时的鼠标移动订阅。 */
  mousemove: Subscription;
  /** @zh 内部使用，拖拽标签调整数值时的鼠标抬起订阅。 */
  mouseup: Subscription;

  ngOnInit() {
    this.wrapStyle = this.style && this.style.wrap ? this.style.wrap : {};
    this.inputStyle = this.style && this.style.input ? this.style.input : {};
    this.labelStyle = this.style && this.style.label ? this.style.label : {};
    if (this.dragLabel) {
      this.labelStyle['cursor'] = 'ew-resize';
    }
  }
  /**
   * @hidden Marks the input as focused.
   * @zh 内部使用，标记输入框处于聚焦状态。
   */
  handleFocus() {
    this.focus = true;
  }
  /**
   * @hidden Marks the input as no longer focused, restoring the last blur value.
   * @zh 内部使用，标记输入框不再聚焦，并恢复上次失焦时的值。
   */
  handleFocusOut() {
    this.focus = false;
    this.currentValue = this.blurValue;
  }
  /**
   * @hidden Handles arrow-key increment/decrement of a numeric value.
   * @zh 内部使用，处理方向键对数值的增减。
   */
  handleKeydown($event) {
    const stringValue = String($event.target.value);
    const isPercentage = stringValue.indexOf('%') > -1;
    const num = Number(stringValue.replace(/%/g, ''));
    if (!isNaN(num)) {
      const amount = this.arrowOffset || 1;

      // Up
      if ($event.keyCode === 38) {
        if (this.label) {
          this.onChange.emit({
            data: { [this.label]: num + amount },
            $event,
          });
        } else {
          this.onChange.emit({ data: num + amount, $event });
        }

        if (isPercentage) {
          this.currentValue = `${num + amount}%`;
        } else {
          this.currentValue = num + amount;
        }
      }

      // Down
      if ($event.keyCode === 40) {
        if (this.label) {
          this.onChange.emit({
            data: { [this.label]: num - amount },
            $event,
          });
        } else {
          this.onChange.emit({ data: num - amount, $event });
        }

        if (isPercentage) {
          this.currentValue = `${num - amount}%`;
        } else {
          this.currentValue = num - amount;
        }
      }
    }
  }
  /**
   * @hidden Emits `onChange` with the current input value on key release (except arrow keys).
   * @zh 内部使用，除方向键外，松开按键时携带当前输入值发出 `onChange`。
   */
  handleKeyup($event) {
    if ($event.keyCode === 40 || $event.keyCode === 38) {
      return;
    }
    if (this.label) {
      this.onChange.emit({
        data: { [this.label]: $event.target.value },
        $event,
      });
    } else {
      this.onChange.emit({ data: $event.target.value, $event });
    }
  }
  ngOnChanges() {
    if (!this.focus) {
      this.currentValue = String(this.value).toUpperCase();
      this.blurValue = String(this.value).toUpperCase();
    } else {
      this.blurValue = String(this.value).toUpperCase();
    }
  }
  ngOnDestroy() {
    this.unsubscribe();
  }
  /**
   * Subscribes to document-level mousemove/mouseup to support drag-to-adjust via the label.
   * @zh 订阅文档级别的鼠标移动/抬起事件，以支持通过拖拽标签调整数值。
   */
  subscribe() {
    this.mousemove = fromEvent(document, 'mousemove').subscribe((ev: Event) =>
      this.handleDrag(ev),
    );
    this.mouseup = fromEvent(document, 'mouseup').subscribe(() =>
      this.unsubscribe(),
    );
  }
  /**
   * Unsubscribes from the document-level mousemove/mouseup drag listeners.
   * @zh 取消订阅文档级别的鼠标移动/抬起拖拽监听器。
   */
  unsubscribe() {
    if (this.mousemove) {
      this.mousemove.unsubscribe();
    }
    if (this.mouseup) {
      this.mouseup.unsubscribe();
    }
  }
  /**
   * @hidden Starts a label-drag adjustment when `dragLabel` is enabled.
   * @zh 内部使用，当启用 `dragLabel` 时开始一次标签拖拽调整。
   */
  handleMousedown($event: Event) {
    if (this.dragLabel) {
      $event.preventDefault();
      this.handleDrag($event);
      this.subscribe();
    }
  }
  /**
   * @hidden Adjusts the value based on horizontal drag movement, emitting `onChange`.
   * @zh 内部使用，根据水平拖拽移动量调整数值并发出 `onChange`。
   */
  handleDrag($event) {
    if (this.dragLabel) {
      const newValue = Math.round(this.value + $event.movementX);
      if (newValue >= 0 && newValue <= this.dragMax) {
        this.onChange.emit({ data: { [this.label]: newValue }, $event });
      }
    }
  }
}

@NgModule({
  declarations: [EditableInputComponent],
  exports: [EditableInputComponent],
  imports: [CommonModule,TranslateModule],
})
export class EditableInputModule {}
