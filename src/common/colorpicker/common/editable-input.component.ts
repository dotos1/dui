/**
 * @fileoverview Module `src/common/colorpicker/common/editable-input.component.ts` providing editable input component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/common/editable-input.component.ts`，提供是否可编辑输入属性组件相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  NgModule,  OnChanges,  OnDestroy,  OnInit, Output,
} from '@angular/core';
import { TranslateModule } from '@dotos/dui/translator';
import { fromEvent, Subscription } from 'rxjs';

/**
 * Angular component `EditableInputComponent` (selector: 'color-editable-input') providing editable input component presentation and interaction in `src/common/colorpicker/common`.
 * @zh Angular 组件 `EditableInputComponent`（selector: 'color-editable-input'），提供是否可编辑输入属性组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/common`）。
 */
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
  /**
   * Input property `style` (`{ wrap?: { [key: string]: string }; input: { [key: string]: string };...`) configuring style.
   * @zh 包裹层/输入框/标签各自的内联样式。
   * @zh 包裹层/输入框/标签各自的内联样式。
   */
  @Input() style: {
    wrap?: { [key: string]: string };
    input: { [key: string]: string };
    label: { [key: string]: string };
  };
  /**
   * Input property `label` (`string`) configuring label.
   * @zh 字段标签文字（也用作 `onChange` 发出数据对象的键名）。
   * @zh 字段标签文字（也用作 `onChange` 发出数据对象的键名）。
   */
  @Input() label: string;
  /**
   * Input property `value` (`string | number`) configuring value.
   * @zh 当前字段值。
   * @zh 当前字段值。
   */
  @Input() value: string | number;
  /**
   * Input property `arrowOffset` (`number`) configuring arrow offset.
   * @zh 使用方向键调整数值时的步进量。
   * @zh 使用方向键调整数值时的步进量。
   */
  @Input() arrowOffset: number;
  /**
   * Input property `dragLabel` (`boolean`) configuring drag label.
   * @zh 是否允许通过拖拽标签调整数值。
   * @zh 是否允许通过拖拽标签调整数值。
   */
  @Input() dragLabel: boolean;
  /**
   * Input property `dragMax` (`number`) configuring drag max.
   * @zh 通过拖拽标签调整数值时允许的最大值。
   * @zh 通过拖拽标签调整数值时允许的最大值。
   */
  @Input() dragMax: number;
  /**
   * Input property `placeholder` (`string`) configuring placeholder (default: `''`).
   * @zh 输入框占位提示文字。
   * @zh 输入框占位提示文字。
   */
  @Input() placeholder = '';
  /**
   * Output event emitter `onChange` (`EventEmitter`) firing when on change occurs.
   * @zh 字段值变化时发出。
   * @zh 字段值变化时发出。
   */
  @Output() onChange = new EventEmitter();
  /**
   * Property `currentValue` (`string | number`) storing current value.
   * @zh 输入框当前显示的值。
   * @zh 输入框当前显示的值。
   */
  currentValue: string | number;
  /**
   * Property `blurValue` (`string`) storing blur value.
   * @zh 失焦时应恢复显示的值。
   * @zh 失焦时应恢复显示的值。
   */
  blurValue: string;
  /**
   * Property `wrapStyle` (`{ [key: string]: string }`) storing wrap style.
   * @zh 包裹层的内联样式。
   * @zh 包裹层的内联样式。
   */
  wrapStyle: { [key: string]: string };
  /**
   * Property `inputStyle` (`{ [key: string]: string }`) storing input style.
   * @zh 输入框的内联样式。
   * @zh 输入框的内联样式。
   */
  inputStyle: { [key: string]: string };
  /**
   * Property `labelStyle` (`{ [key: string]: string }`) storing label style.
   * @zh 标签的内联样式。
   * @zh 标签的内联样式。
   */
  labelStyle: { [key: string]: string };
  /**
   * Property `focus` (`boolean`) storing focus (default: `false`).
   * @zh 输入框当前是否处于聚焦状态。
   * @zh 输入框当前是否处于聚焦状态。
   */
  focus = false;
  /**
   * Property `mousemove` (`Subscription`) storing mousemove.
   * @zh 内部使用，拖拽标签调整数值时的鼠标移动订阅。
   * @zh 内部使用，拖拽标签调整数值时的鼠标移动订阅。
   */
  mousemove: Subscription;
  /**
   * Property `mouseup` (`Subscription`) storing mouseup.
   * @zh 内部使用，拖拽标签调整数值时的鼠标抬起订阅。
   * @zh 内部使用，拖拽标签调整数值时的鼠标抬起订阅。
   */
  mouseup: Subscription;

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
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
  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
  ngOnChanges() {
    if (!this.focus) {
      this.currentValue = String(this.value).toUpperCase();
      this.blurValue = String(this.value).toUpperCase();
    } else {
      this.blurValue = String(this.value).toUpperCase();
    }
  }
  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
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

/**
 * Angular module `EditableInputModule` declaring and exporting editable input module components, directives, pipes, and providers.
 * @zh Angular 模块 `EditableInputModule`，声明并导出是否可编辑输入属性模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [EditableInputComponent],
  exports: [EditableInputComponent],
  imports: [CommonModule,TranslateModule],
})
export class EditableInputModule {}
