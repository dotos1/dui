/**
 * @fileoverview Module `src/common/colorpicker/components/sketch/sketch.component.ts` providing sketch component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/sketch/sketch.component.ts`，提供sketch组件相关的定义与实现。
 */

import {
  ChangeDetectionStrategy,  Component,  Input,
} from '@angular/core';
import { ColorWrap, isValidHex } from '@dotos/dui/common/colorpicker/common';
import { TriggerPopup } from '@dotos/dui/common/trigger';

/**
 * "Sketch"-style color picker: saturation panel + hue/alpha sliders + hex/rgb fields +
 * a row of preset swatch colors, modeled after the Sketch design tool's color picker.
 * @zh "Sketch" 风格的颜色选择器：饱和度面板 + 色相/透明度滑块 + 十六进制/RGB 输入框 +
 * 一排预设色块，仿照 Sketch 设计工具的颜色选择器样式。
 */
@Component({
  selector: 'color-sketch',
  template: `
  <div class="sketch-picker {{ className }}" [style.width]="width">
    <div class="sketch-saturation">
      <color-saturation [hsl]="hsl" [hsv]="hsv"
        (onChange)="handleValueChange($event)"
      >
      </color-saturation>
    </div>
    <div class="sketch-controls">
      <div class="sketch-sliders">
        <div class="sketch-hue">
          <color-hue [hsl]="hsl"
            (onChange)="handleValueChange($event)"
          ></color-hue>
        </div>
        <div class="sketch-alpha" *ngIf="disableAlpha === false">
          <color-alpha
            [radius]=2 [rgb]="rgb" [hsl]="hsl"
            (onChange)="handleValueChange($event)"
          ></color-alpha>
        </div>
      </div>
      <div class="sketch-color">
        <color-checkboard></color-checkboard>
        <div class="sketch-active" [style.background]="activeBackground"></div>
      </div>
    </div>
    <div class="sketch-controls">
      <color-sketch-fields
        [rgb]="rgb" [hsl]="hsl" [hex]="hex"
        [disableAlpha]="disableAlpha"
        (onChange)="handleValueChange($event)"
      ></color-sketch-fields>
    </div>
    <div class="sketch-controls">
      <color-sketch-preset-colors
        [colors]="presetColors"
        (onClick)="handleBlockChange($event)"
        (onSwatchHover)="onSwatchHover.emit($event)"
      ></color-sketch-preset-colors>
    </div>
  </div>
  `,
  styles: [
    `
    .sketch-picker {
      padding: 10px 10px 0;
      box-sizing: initial;
      border-radius: 4px;
    }
    .sketch-saturation {
      width: 100%;
      padding-bottom: 75%;
      position: relative;
      overflow: hidden;
    }
    .sketch-controls {
      display: flex;
    }
    .sketch-sliders {
      padding: 4px 0px;
      -webkit-box-flex: 1;
      flex: 1 1 0%;
    }
    .sketch-hue {
      position: relative;
      height: 10px;
      overflow: hidden;
    }
    .sketch-alpha {
      position: relative;
      height: 10px;
      margin-top: 4px;
      overflow: hidden;
    }
    .sketch-color {
      width: 24px;
      height: 24px;
      position: relative;
      margin-top: 4px;
      margin-left: 4px;
      border-radius: 3px;
    }
    .sketch-active {
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      border-radius: 2px;
    }
  `,
  ],
  host: {
    style: 'width:220px',
    '(keydown)': '_handleKeydown($event)',
     'hostID': 'color-sketch-' + Math.random().toString(36).substring(2, 15)
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  standalone: false,

})
export class SketchComponent extends ColorWrap implements TriggerPopup {
  /**
   * Remove alpha slider and options from picker
   * @zh 输入属性 `disableAlpha`（类型：`boolean`），用于配置禁用透明度（默认值：`false`）。
   */
  @Input() disableAlpha = false;
  /**
   * Hex strings for default colors at bottom of picker
   * @zh 输入属性 `presetColors`（类型：`string[]`），用于配置preset颜色列表。
   */
  @Input() presetColors = [
    '#D0021B',
    '#F5A623',
    '#F8E71C',
    '#8B572A',
    '#7ED321',
    '#417505',
    '#BD10E0',
    '#9013FE',
    '#4A90E2',
    '#50E3C2',
    '#B8E986',
    '#000000',
    '#4A4A4A',
    '#9B9B9B',
    '#FFFFFF',
  ];
  /**
   * Width of picker
   * @zh 输入属性 `width`（类型：`number`），用于配置宽度（默认值：`200`）。
   */
  @Input() width = 200;
  /**
   * Property `activeBackground` (`string`) storing active background.
   * @zh 当前颜色预览色块的背景色（含透明度）。
   * @zh 当前颜色预览色块的背景色（含透明度）。
   */
  activeBackground: string;
  /**
   * Creates an instance of `SketchComponent` and initializes its dependencies and internal state.
   * @zh 创建 `SketchComponent` 实例，并初始化其依赖项与内部状态。
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
  /**
   * @hidden Applies a preset swatch click as the new color, if it's a valid hex.
   * @zh 内部使用，若预设色块点击的颜色是有效的十六进制值，则应用为新颜色。
   */
  handleBlockChange({ hex, $event }) {
    if (isValidHex(hex)) {
      // this.hex = hex;
      this.handleChange(
        {
          hex,
          source: 'hex',
        },
        $event,
      );
    }
  }
}

