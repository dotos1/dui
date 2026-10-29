/**
 * @fileoverview Module `src/common/colorpicker/components/sketch/sketch-fields.component.ts` providing sketch fields component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/sketch/sketch-fields.component.ts`，提供sketch字段列表组件相关的定义与实现。
 */

import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  Output,
} from '@angular/core';
import { isValidHex, HSLA, RGBA } from '@dotos/dui/common/colorpicker/common';
import { TinyColor } from '@dotos/dui/core/color';

/**
 * Angular component `SketchFieldsComponent` (selector: 'color-sketch-fields') providing sketch fields component presentation and interaction in `src/common/colorpicker/components/sketch`.
 * @zh Angular 组件 `SketchFieldsComponent`（selector: 'color-sketch-fields'），提供Sketch字段列表组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/sketch`）。
 */
@Component({
  selector: 'color-sketch-fields',
  template: `
  <div class="sketch-fields">
    <div class="sketch-double">
      <color-editable-input
        [style]="{ input: input, label: label }"
        label="hex"
        [value]="hex.replace('#', '')"
        (onChange)="handleChange($event)"
      ></color-editable-input>
    </div>
    <div class="sketch-single">
      <color-editable-input
        [style]="{ input: input, label: label }"
        label="r"
        [value]="rgb.r"
        (onChange)="handleChange($event)"
        [dragLabel]="true"
        [dragMax]="255"
      ></color-editable-input>
    </div>
    <div class="sketch-single">
      <color-editable-input
        [style]="{ input: input, label: label }"
        label="g"
        [value]="rgb.g"
        (onChange)="handleChange($event)"
        [dragLabel]="true"
        [dragMax]="255"
      ></color-editable-input>
    </div>
    <div class="sketch-single">
      <color-editable-input
        [style]="{ input: input, label: label }"
        label="b"
        [value]="rgb.b"
        (onChange)="handleChange($event)"
        [dragLabel]="true"
        [dragMax]="255"
      ></color-editable-input>
    </div>
    <div class="sketch-alpha" *ngIf="disableAlpha === false">
      <color-editable-input
        [style]="{ input: input, label: label }"
        label="a"
        [value]="round(rgb.a * 100)"
        (onChange)="handleChange($event)"
        [dragLabel]="true"
        [dragMax]="100"
      ></color-editable-input>
    </div>
  </div>
  `,
  styles: [
    `
    .sketch-fields {
      display: flex;
      padding-top: 4px;
    }
    .sketch-double {
      -webkit-box-flex: 2;
      flex: 2 1 0%;
    }
    .sketch-single {
      flex: 1 1 0%;
      padding-left: 6px;
    }
    .sketch-alpha {
      -webkit-box-flex: 1;
      flex: 1 1 0%;
      padding-left: 6px;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    'hostID': 'sketch-fields-' + Math.random().toString(36).substring(2, 15),
  },
})
/**
 * Editable hex/rgb/alpha input fields used by {@link SketchComponent}.
 * @zh {@link SketchComponent} 使用的十六进制/RGB/透明度可编辑输入字段。
 */
export class SketchFieldsComponent {
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
   * Input property `disableAlpha` (`boolean`) configuring disable alpha (default: `false`).
   * @zh 是否禁用透明度字段。
   * @zh 是否禁用透明度字段。
   */
  @Input() disableAlpha = false;
  /**
   * Output event emitter `onChange` (`EventEmitter<any>`) firing when on change occurs.
   * @zh 字段值变化时发出。
   * @zh 字段值变化时发出。
   */
  @Output() onChange = new EventEmitter();
  /**
   * Property `input` (`{ [key: string]: string; }`) storing input.
   * @zh 输入框的内联样式。
   * @zh 输入框的内联样式。
   */
  input: { [key: string]: string } = {
    width: '100%',
    padding: '4px 10% 3px',
    border: 'none',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 0 0 1px #ccc',
    fontSize: '11px',
  };
  /**
   * Property `label` (`{ [key: string]: string; }`) storing label.
   * @zh 标签的内联样式。
   * @zh 标签的内联样式。
   */
  label: { [key: string]: string } = {
    display: 'block',
    textAlign: 'center',
    fontSize: '11px',
    paddingTop: '3px',
    paddingBottom: '4px',
    textTransform: 'capitalize',
  };

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
      } else if (data.a > 100) {
        data.a = 100;
      }
      data.a /= 100;

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
      this.onChange.emit({
        data: {
          h: data.h || this.hsl.h,
          s: Number((data.s && data.s) || this.hsl.s),
          l: Number((data.l && data.l) || this.hsl.l),
          source: 'hsl',
        },
        $event,
      });
    }
  }
}
