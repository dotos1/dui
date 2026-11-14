/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/gradient-fields.component.ts` providing gradient fields component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/gradient-fields.component.ts`，提供渐变字段列表组件相关的定义与实现。
 */

import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  Output,
} from '@angular/core';
import { isValidHex, HSLA, RGBA } from '@dotos/dui/common/colorpicker/common';
import { TinyColor } from '@dotos/dui/core/color';

/**
 * Angular component `GradientFieldsComponent` (selector: 'color-gradient-fields') providing gradient fields component presentation and interaction in `src/common/colorpicker/components/gradient`.
 * @zh Angular 组件 `GradientFieldsComponent`（selector: 'color-gradient-fields'），提供渐变字段列表组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/gradient`）。
 */
@Component({
  selector: 'color-gradient-fields',
  templateUrl: './gradient-fields.component.html',
  styleUrls: ['./gradient-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  standalone: false,
  
})
export class GradientFieldsComponent {
  /**
   * Input property `hsl` (`HSLA`) configuring hsl.
   * @zh 输入属性 `hsl`（类型：`HSLA`），用于配置HSL颜色。
   */
  @Input() hsl: HSLA;
  /**
   * Input property `rgb` (`RGBA`) configuring rgb.
   * @zh 输入属性 `rgb`（类型：`RGBA`），用于配置RGB颜色。
   */
  @Input() rgb: RGBA;
  /**
   * Input property `hex` (`string`) configuring hex.
   * @zh 输入属性 `hex`（类型：`string`），用于配置十六进制颜色。
   */
  @Input() hex: string;
  /**
   * Input property `disableAlpha` (`boolean`) configuring disable alpha (default: `false`).
   * @zh 输入属性 `disableAlpha`（类型：`boolean`），用于配置禁用透明度（默认值：`false`）。
   */
  @Input() disableAlpha = false;
  /**
   * Output event emitter `onChange` (`EventEmitter<any>`) firing when on change occurs.
   * @zh 输出事件 `onChange`（类型：`EventEmitter<any>`），当触发当变更时向外发出事件。
   */
  @Output() onChange = new EventEmitter();
  /**
   * Property `input` (`{ [key: string]: string; }`) storing input.
   * @zh 属性 `input`（类型：`{ [key: string]: string; }`），用于存储或配置输入属性。
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
   * @zh 属性 `label`（类型：`{ [key: string]: string; }`），用于存储或配置标签。
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
   * Executes `round` to handle round.
   * @zh 执行 `round`，用于四舍五入。
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  round(value) {
    return Math.round(value);
  }
  /**
   * Executes `handleChange` to handle handle change.
   * @zh 执行 `handleChange`，用于连接手柄变更。
   * @param options - { data, event } parameter (`any`) / {data,事件}参数（`any`）
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
