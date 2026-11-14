/**
 * @fileoverview Module `src/common/colorpicker/components/sketch/sketch-preset-colors.component.ts` providing sketch preset colors component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/sketch/sketch-preset-colors.component.ts`，提供sketchpreset颜色列表组件相关的定义与实现。
 */

import {
  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  Output,
} from '@angular/core';
import { Shape } from '@dotos/dui/common/colorpicker/common';

/**
 * Angular component `SketchPresetColorsComponent` (selector: 'color-sketch-preset-colors') providing sketch preset colors component presentation and interaction in `src/common/colorpicker/components/sketch`.
 * @zh Angular 组件 `SketchPresetColorsComponent`（selector: 'color-sketch-preset-colors'），提供SketchPreset颜色列表组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/sketch`）。
 */
@Component({
  selector: 'color-sketch-preset-colors',
  template: `
  <div class="sketch-swatches">
    <div class="sketch-wrap" *ngFor="let c of colors">
      <color-swatch
        [color]="normalizeValue(c).color"
        [style]="swatchStyle"
        [focusStyle]="focusStyle(c)"
        (onClick)="handleClick($event)"
        (onHover)="onSwatchHover.emit($event)"
        class="swatch"
      ></color-swatch>
    </div>
  </div>
  `,
  styles: [
    `
    .sketch-swatches {
      margin: 0px -10px;
      padding: 10px 0px 0px 10px;
      border-top: 1px solid rgb(238, 238, 238);
      display: flex;
      flex-wrap: wrap;
      position: relative;
    }
    .sketch-wrap {
      width: 16px;
      height: 16px;
      margin: 3px;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    'hostID': 'sketch-preset-colors-' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false,
})
/**
 * A row of preset color swatches shown beneath {@link SketchComponent}'s main controls.
 * @zh 显示在 {@link SketchComponent} 主控件下方的一排预设色块。
 */
export class SketchPresetColorsComponent {
  /**
   * Input property `colors` (`any[]`) configuring colors (default: `[]`).
   * @zh 预设颜色列表，每项可以是颜色字符串或 `Shape` 对象。
   * @zh 预设颜色列表，每项可以是颜色字符串或 `Shape` 对象。
   */
  @Input() colors =[];
  /**
   * Output event emitter `onClick` (`EventEmitter<any>`) firing when on click occurs.
   * @zh 色块被点击时发出。
   * @zh 色块被点击时发出。
   */
  @Output() onClick = new EventEmitter();
  /**
   * Output event emitter `onSwatchHover` (`EventEmitter<any>`) firing when on swatch hover occurs.
   * @zh 鼠标悬停在色块上时发出。
   * @zh 鼠标悬停在色块上时发出。
   */
  @Output() onSwatchHover = new EventEmitter();
  /**
   * Property `swatchStyle` (`{ borderRadius: string; boxShadow: string; }`) storing swatch style.
   * @zh 每个色块的内联样式。
   * @zh 每个色块的内联样式。
   */
  swatchStyle = {
    borderRadius: '3px',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)',
  };

  /**
   * @hidden Emits `onClick` with the swatch's color.
   * @zh 内部使用，携带色块颜色发出 `onClick`。
   */
  handleClick({ hex, $event }) {
    this.onClick.emit({ hex, $event });
  }
  /**
   * Normalizes a preset color entry (string or `Shape` object) into a `Shape`-like object.
   * @zh 将预设颜色条目（字符串或 `Shape` 对象）归一化为类 `Shape` 对象。
   */
  normalizeValue(val: string | Shape) {
    if (typeof val === 'string') {
      return { color: val };
    }
    return val;
  }
  /**
   * Computes the focus-state box-shadow style for a given preset color entry.
   * @zh 计算给定预设颜色条目在聚焦状态下的阴影样式。
   */
  focusStyle(val: string | Shape) {
    const c = this.normalizeValue(val);
    return {
      boxShadow: `inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px ${c.color}`,
    };
  }
}
