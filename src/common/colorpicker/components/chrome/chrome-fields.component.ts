/**
 * @fileoverview Module `src/common/colorpicker/components/chrome/chrome-fields.component.ts` providing chrome fields component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/chrome/chrome-fields.component.ts`，提供chrome字段列表组件相关的定义与实现。
 */

import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  OnInit,  Output,
} from '@angular/core';
import { isValidHex, HSLA, RGBA } from '@dotos/dui/common/colorpicker/common';
import { TinyColor } from '@dotos/dui/core/color';

/**
 * Angular component `ChromeFieldsComponent` (selector: 'color-chrome-fields') providing chrome fields component presentation and interaction in `src/common/colorpicker/components/chrome`.
 * @zh Angular 组件 `ChromeFieldsComponent`（selector: 'color-chrome-fields'），提供Chrome字段列表组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/chrome`）。
 */
@Component({
  selector: 'color-chrome-fields',
  template: `
    <div class="chrome-wrap">
      <div class="chrome-fields">
        <ng-template [ngIf]="view === 'hex'">
          <div class="chrome-field">
            <color-editable-input
              [style]="{ input: input, label: label }"
              label="hex" [value]="hex"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
        </ng-template>
        <ng-template [ngIf]="view === 'rgb'">
          <div class="chrome-field">
            <color-editable-input
              [style]="{ input: input, label: label }"
              label="r" [value]="rgb.r"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
          <div class="chrome-field">
            <color-editable-input
              [style]="{ input: input, label: label }"
              label="g" [value]="rgb.g"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
          <div class="chrome-field">
            <color-editable-input
              [style]="{ input: input, label: label }"
              label="b" [value]="rgb.b"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
          <div class="chrome-field">
            <color-editable-input *ngIf="!disableAlpha"
              [style]="{ input: input, label: label }"
              label="a" [value]="rgb.a"
              [arrowOffset]="0.01"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
        </ng-template>
        <ng-template [ngIf]="view === 'hsl'">
          <div class="chrome-field">
            <color-editable-input
              [style]="{ input: input, label: label }"
              label="h"
              [value]="round(hsl.h)"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
          <div class="chrome-field">
            <color-editable-input
              [style]="{ input: input, label: label }"
              label="s" [value]="round(hsl.s * 100) + '%'"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
          <div class="chrome-field">
            <color-editable-input
              [style]="{ input: input, label: label }"
              label="l" [value]="round(hsl.l * 100) + '%'"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
          <div class="chrome-field">
            <color-editable-input *ngIf="!disableAlpha"
              [style]="{ input: input, label: label }"
              label="a" [value]="hsl.a"
              [arrowOffset]="0.01"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
        </ng-template>
      </div>

      <div class="chrome-toggle">
        <div class="chrome-icon" (click)="toggleViews()" #icon>
          <svg class="chrome-toggle-svg" viewBox="0 0 24 24">
            <path #iconUp fill="#333"
              d="M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"
            />
            <path #iconDown fill="#333"
              d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15Z"
            />
          </svg>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .chrome-wrap {
        padding-top: 16px;
        display: flex;
      }
      .chrome-fields {
        flex: 1;
        display: flex;
        margin-left: -6px;
      }
      .chrome-field {
        padding-left: 6px;
        width: 100%;
      }
      .chrome-toggle {
        width: 32px;
        text-align: right;
        position: relative;
      }
      .chrome-icon {
        margin-right: -4px;
        margin-top: 12px;
        cursor: pointer;
        position: relative;
      }
      .chrome-toggle-svg {
        width: 24px;
        height: 24px;
        border: 1px transparent solid;
        border-radius: 5px;
      }
      .chrome-toggle-svg:hover {
        background: #eee;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
    host: { 'hostID': 'color-chrome-fields-' + Math.random().toString(36).substring(2, 15) },
  standalone: false
})
/**
 * Editable hex/rgb/hsl input fields with a view toggle, used by {@link ChromeComponent}.
 * @zh 带视图切换的十六进制/RGB/HSL 可编辑输入字段，供 {@link ChromeComponent} 使用。
 */
export class ChromeFieldsComponent implements OnInit {
  /**
   * Input property `disableAlpha` (`boolean`) configuring disable alpha.
   * @zh 是否禁用透明度字段。
   * @zh 是否禁用透明度字段。
   */
  @Input() disableAlpha: boolean;
  /**
   * @zh 当前颜色的 HSL 表示。
   * @zh 当前颜色的 HSL 表示。
   */
  @Input() hsl: HSLA;
  /**
   * @zh 当前颜色的 RGB 表示。
   * @zh 当前颜色的 RGB 表示。
   */
  @Input() rgb: RGBA;
  /**
   * Input property `hex` (`string`) configuring hex.
   * @zh 当前颜色的十六进制表示。
   * @zh 当前颜色的十六进制表示。
   */
  @Input() hex: string;
  /**
   * Output event emitter `onChange` (`EventEmitter<any>`) firing when on change occurs.
   * @zh 字段值变化时发出。
   * @zh 字段值变化时发出。
   */
  @Output() onChange = new EventEmitter();
  /**
   * Property `view` (`string`) storing view (default: `''`).
   * @zh 当前显示的字段视图：`'hex'`、`'rgb'` 或 `'hsl'`。
   * @zh 当前显示的字段视图：`'hex'`、`'rgb'` 或 `'hsl'`。
   */
  view = '';
  /**
   * Property `input` (`{ [key: string]: string; }`) storing input.
   * @zh 输入框的内联样式。
   * @zh 输入框的内联样式。
   */
  input: { [key: string]: string } = {
    fontSize: '11px',
    color: '#333',
    width: '100%',
    borderRadius: '2px',
    border: 'none',
    boxShadow: 'inset 0 0 0 1px #dadada',
    height: '21px',
    'text-align': 'center',
  };
  /**
   * Property `label` (`{ [key: string]: string; }`) storing label.
   * @zh 标签的内联样式。
   * @zh 标签的内联样式。
   */
  label: { [key: string]: string } = {
    'text-transform': 'uppercase',
    fontSize: '11px',
    'line-height': '11px',
    color: '#969696',
    'text-align': 'center',
    display: 'block',
    marginTop: '12px',
  };

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    if (this.hsl.a === 1 && this.view !== 'hex') {
      this.view = 'hex';
    } else if (this.view !== 'rgb' && this.view !== 'hsl') {
      this.view = 'rgb';
    }
  }
  /**
   * Cycles the displayed field view: hex → rgb → hsl → (hex or rgb, depending on alpha).
   * @zh 循环切换显示的字段视图：hex → rgb → hsl →（根据透明度回到 hex 或 rgb）。
   */
  toggleViews() {
    if (this.view === 'hex') {
      this.view = 'rgb';
    } else if (this.view === 'rgb') {
      this.view = 'hsl';
    } else if (this.view === 'hsl') {
      if (this.hsl.a === 1) {
        this.view = 'hex';
      } else {
        this.view = 'rgb';
      }
    }
  }
  /**
   * Rounds a number to the nearest integer.
   * @zh 将数字四舍五入为最接近的整数。
   */
  round(value) {
    return Math.round(value);
  }
  /**
   * Normalizes and emits a field change as `onChange`, based on which field(s) changed.
   * @zh 根据发生变化的字段，归一化后以 `onChange` 发出。
   */
  handleChange({ data, $event }) {
    if (data.hex) {
      if (isValidHex(data.hex)) {
        const color = new TinyColor(data.hex);
        this.onChange.emit({
          data: {
            hex: this.disableAlpha ? color.toHex() : color.toHex8(),
            source: 'hex',
          },
          $event,
        });
      }
    } else if (data.r || data.g || data.b) {
      this.onChange.emit({
        data: {
          r: data.r || this.rgb.r,
          g: data.g || this.rgb.g,
          b: data.b || this.rgb.b,
          source: 'rgb',
        },
        $event,
      });
    } else if (data.a) {
      if (data.a < 0) {
        data.a = 0;
      } else if (data.a > 1) {
        data.a = 1;
      }

      if (this.disableAlpha) {
        data.a = 1;
      }

      this.onChange.emit({
        data: {
          h: this.hsl.h,
          s: this.hsl.s,
          l: this.hsl.l,
          a: Math.round(data.a * 100) / 100,
          source: 'rgb',
        },
        $event,
      });
    } else if (data.h || data.s || data.l) {
      const s = data.s && data.s.replace('%', '');
      const l = data.l && data.l.replace('%', '');
      this.onChange.emit({
        data: {
          h: data.h || this.hsl.h,
          s: Number(s || this.hsl.s),
          l: Number(l || this.hsl.l),
          source: 'hsl',
        },
        $event,
      });
    }
  }
}
