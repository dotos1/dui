/**
 * @fileoverview Module `src/common/colorpicker/components/chrome/chrome.component.ts` providing chrome component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/chrome/chrome.component.ts`，提供chrome组件相关的定义与实现。
 */


import {  ChangeDetectionStrategy,  Component,  Input,} from '@angular/core';
import { ColorWrap } from '@dotos/dui/common/colorpicker/common';
import { TriggerPopup } from '@dotos/dui/common/trigger';

/**
 * "Chrome"-style color picker: saturation panel + hue/alpha sliders + hex/rgb/hsl fields,
 * modeled after Google Chrome's native color picker.
 * @zh "Chrome" 风格的颜色选择器：饱和度面板 + 色相/透明度滑块 + 十六进制/RGB/HSL 输入框，
 * 仿照 Google Chrome 原生颜色选择器样式。
 */
@Component({
  selector: 'color-chrome',
  template: `
  <div class="chrome-picker {{ className }}">
    <div class="saturation">
      <color-saturation
        [hsl]="hsl"
        [hsv]="hsv"
        [circle]="circle"
        (onChange)="handleValueChange($event)"
      ></color-saturation>
    </div>
    <div class="chrome-body">
      <div class="chrome-controls">
        <div class="chrome-color">
          <div class="chrome-swatch">
            <div class="chrome-active"
              [style.background]="activeBackground"
            ></div>
            <color-checkboard></color-checkboard>
          </div>
        </div>
        <div class="chrome-toggles">
          <div class="chrome-hue">
            <color-hue
              [radius]="2"
              [hsl]="hsl"
              [pointer]="pointer"
              (onChange)="handleValueChange($event)"
            ></color-hue>
          </div>
          <div class="chrome-alpha" *ngIf="!disableAlpha">
            <color-alpha
              [radius]="2" [rgb]="rgb" [hsl]="hsl"
              [pointer]="pointer" (onChange)="handleValueChange($event)"
            ></color-alpha>
          </div>
        </div>
      </div>
      <color-chrome-fields
        [rgb]="rgb" [hsl]="hsl" [hex]="hex"
        [disableAlpha]="disableAlpha"
        (onChange)="handleValueChange($event)"
      ></color-chrome-fields>
    </div>
  </div>
  `,
  styles: [
    `
      .chrome-picker {
        border-radius: 2px;
        box-sizing: initial;
        width: 225px;
        font-family: 'Menlo';
      }
      .chrome-controls {
        display: flex;
      }
      .chrome-color {
        width: 42px;
      }
      .chrome-body {
        padding: 14px 14px 12px;
      }
      .chrome-active {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: 20px;
        z-index: 2;
      }
      .chrome-swatch {
        width: 28px;
        height: 28px;
        border-radius: 15px;
        position: relative;
        overflow: hidden;
      }
      .saturation {
        width: 100%;
        padding-bottom: 55%;
        position: relative;
        border-radius: 2px 2px 0 0;
        overflow: hidden;
      }
      .chrome-toggles {
        flex: 1;
      }
      .chrome-hue {
        height: 10px;
        position: relative;
        margin-bottom: 8px;
      }
      .chrome-alpha {
        height: 10px;
        position: relative;
      }
    `,
  ],
  host: {
    '(keydown)': '_handleKeydown($event)',
    'hostID': 'color-chrome-' + Math.random().toString(36).substring(2, 15) 
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,

})
export class ChromeComponent extends ColorWrap implements TriggerPopup {
  /**
   * Remove alpha slider and options from picker
   * @zh 输入属性 `disableAlpha`（类型：`boolean`），用于配置禁用透明度（默认值：`false`）。
   */
  @Input() disableAlpha = false;
  /**
   * Property `circle` (`{ [key: string]: string }`) storing circle.
   * @zh 饱和度面板指示圆点的内联样式。
   * @zh 饱和度面板指示圆点的内联样式。
   */
  circle: { [key: string]: string } = {
    width: '12px',
    height: '12px',
    borderRadius: '6px',
    boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 1px inset',
    transform: 'translate(-6px, -8px)',
  };
  /**
   * Property `pointer` (`{ [key: string]: string }`) storing pointer.
   * @zh 色相/透明度滑块手柄的内联样式。
   * @zh 色相/透明度滑块手柄的内联样式。
   */
  pointer: { [key: string]: string } = {
    width: '12px',
    height: '12px',
    borderRadius: '6px',
    transform: 'translate(-6px, -2px)',
    backgroundColor: 'rgb(248, 248, 248)',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)',
  };
  /**
   * Property `activeBackground` (`string`) storing active background.
   * @zh 当前颜色预览色块的背景色（含透明度）。
   * @zh 当前颜色预览色块的背景色（含透明度）。
   */
  activeBackground: string;

  /**
   * Creates an instance of `ChromeComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ChromeComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    super();
  }

  /**
   * @hidden Recomputes the preview swatch's background whenever the color changes.
   * @zh 内部使用，每当颜色变化时重新计算预览色块的背景色。
   */
  override afterValidChange() {
    const alpha = this.disableAlpha ? 1 : this.rgb.a;
    this.activeBackground = `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${alpha})`;
  }
  /**
   * @hidden Forwards a child component's change to `handleChange`.
   * @zh 内部使用，将子组件的变化转发给 `handleChange`。
   */
  handleValueChange({ data, $event }) {
    this.handleChange(data, $event);
  }
}

