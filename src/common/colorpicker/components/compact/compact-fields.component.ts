/**
 * @fileoverview Module `src/common/colorpicker/components/compact/compact-fields.component.ts` providing compact fields component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/compact/compact-fields.component.ts`，提供紧凑字段列表组件相关的定义与实现。
 */

import {
  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  Output,
} from '@angular/core';
import { isValidHex, RGBA } from '@dotos/dui/common/colorpicker/common';

/**
 * Angular component `CompactFieldsComponent` (selector: 'color-compact-fields') providing compact fields component presentation and interaction in `src/common/colorpicker/components/compact`.
 * @zh Angular 组件 `CompactFieldsComponent`（selector: 'color-compact-fields'），提供紧凑字段列表组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/compact`）。
 */
@Component({
  selector: 'color-compact-fields',
  template: `
  <div class="compact-fields">
    <div class="compact-active" [style.background]="hex"></div>
    <div style="flex: 6 1 0%;">
      <color-editable-input
        [style]="{ wrap: HEXWrap, input: HEXinput, label: HEXlabel }"
        label="hex"
        [value]="hex"
        (onChange)="handleChange($event)"
      ></color-editable-input>
    </div>
    <div style="flex: 3 1 0%">
      <color-editable-input
        [style]="{ wrap: RGBwrap, input: RGBinput, label: RGBlabel }"
        label="r"
        [value]="rgb.r"
        (onChange)="handleChange($event)"
      ></color-editable-input>
    </div>
    <div style="flex: 3 1 0%">
      <color-editable-input
        [style]="{ wrap: RGBwrap, input: RGBinput, label: RGBlabel }"
        label="g"
        [value]="rgb.g"
        (onChange)="handleChange($event)"
      ></color-editable-input>
    </div>
    <div style="flex: 3 1 0%">
      <color-editable-input
        [style]="{ wrap: RGBwrap, input: RGBinput, label: RGBlabel }"
        label="b"
        [value]="rgb.b"
        (onChange)="handleChange($event)"
      ></color-editable-input>
    </div>
  </div>
  `,
  styles: [
    `
  .compact-fields {
    display: flex;
    padding-bottom: 6px;
    padding-right: 5px;
    position: relative;
  }
  .compact-active {
    position: absolute;
    top: 6px;
    left: 5px;
    height: 9px;
    width: 9px;
  }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: { 'hostID': 'compact-fields-' + Math.random().toString(36).substring(2, 15) } 
})
/**
 * Editable hex/rgb input fields used by {@link CompactComponent}.
 * @zh {@link CompactComponent} 使用的十六进制/RGB 可编辑输入字段。
 */
export class CompactFieldsComponent {
  /**
   * Input property `hex` (`string`) configuring hex.
   * @zh 当前颜色的十六进制表示。
   * @zh 当前颜色的十六进制表示。
   */
  @Input() hex: string;
  /**
   * @zh 当前颜色的 RGB 表示。
   * @zh 当前颜色的 RGB 表示。
   */
  @Input() rgb: RGBA;
  /**
   * Output event emitter `onChange` (`EventEmitter`) firing when on change occurs.
   * @zh 字段值变化时发出。
   * @zh 字段值变化时发出。
   */
  @Output() onChange = new EventEmitter();


  /**
   * Property `HEXWrap` (`{ [key: string]: string }`) storing hex wrap.
   * @zh 十六进制字段包裹层的内联样式。
   * @zh 十六进制字段包裹层的内联样式。
   */
  HEXWrap: { [key: string]: string } = {
    marginTop: '-3px',
    marginBottom: '-3px',
    // flex: '6 1 0%',
    position: 'relative',
  };
  /**
   * Property `HEXinput` (`{ [key: string]: string }`) storing he xinput.
   * @zh 十六进制字段输入框的内联样式。
   * @zh 十六进制字段输入框的内联样式。
   */
  HEXinput: { [key: string]: string } = {
    width: '80%',
    padding: '0px',
    paddingLeft: '20%',
    border: 'none',
    outline: 'none',
    background: 'none',
    fontSize: '12px',
    color: '#333',
    height: '16px',
  };
  /**
   * Property `HEXlabel` (`{ [key: string]: string }`) storing he xlabel (default: `{ display: 'none', }`).
   * @zh 十六进制字段标签的内联样式（默认隐藏）。
   * @zh 十六进制字段标签的内联样式（默认隐藏）。
   */
  HEXlabel: { [key: string]: string } = {
    display: 'none',
  };
  /**
   * @zh RGB 字段包裹层的内联样式。
   * @zh RGB 字段包裹层的内联样式。
   */
  RGBwrap: { [key: string]: string } = {
    marginTop: '-3px',
    marginBottom: '-3px',
    // flex: '3 1 0%',
    position: 'relative',
  };
  /**
   * @zh RGB 字段输入框的内联样式。
   * @zh RGB 字段输入框的内联样式。
   */
  RGBinput: { [key: string]: string } = {
    width: '80%',
    padding: '0px',
    paddingLeft: '30%',
    border: 'none',
    outline: 'none',
    background: 'none',
    fontSize: '12px',
    color: '#333',
    height: '16px',
  };
  /**
   * @zh RGB 字段标签的内联样式。
   * @zh RGB 字段标签的内联样式。
   */
  RGBlabel: { [key: string]: string } = {
    position: 'absolute',
    top: '6px',
    left: '0px',
    'line-height': '16px',
    'text-transform': 'uppercase',
    fontSize: '12px',
    color: '#999',
  };

  /**
   * Normalizes and emits a field change (hex or individual RGB channel) as `onChange`.
   * @zh 归一化字段变化（十六进制或单个 RGB 通道）并以 `onChange` 发出。
   */
  handleChange({ data, $event }) {
    if (data.hex) {
      if (isValidHex(data.hex)) {
        this.onChange.emit({
          data: {
            hex: data.hex,
            source: 'hex',
          },
          $event,
        });
      }
    } else {
      this.onChange.emit({
        data: {
          r: data.r || this.rgb.r,
          g: data.g || this.rgb.g,
          b: data.b || this.rgb.b,
          source: 'rgb',
        },
        $event,
      });
    }
  }
}
