/**
 * @fileoverview Module `src/common/colorpicker/components/circle/circle-swatch.component.ts` providing circle swatch component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/circle/circle-swatch.component.ts`，提供圆形swatch组件相关的定义与实现。
 */

import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  OnChanges,  Output,
} from '@angular/core';
import { uuid } from '@dotos1/dui/util';

/**
 * Angular component `CircleSwatchComponent` (selector: 'color-circle-swatch') providing circle swatch component presentation and interaction in `src/common/colorpicker/components/circle`.
 * @zh Angular 组件 `CircleSwatchComponent`（selector: 'color-circle-swatch'），提供圆形Swatch组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/circle`）。
 */
@Component({
  selector: 'color-circle-swatch',
  template: `
  <div class="circle-swatch"
    [style.width.px]="circleSize" [style.height.px]="circleSize"
    [style.margin-right.px]="circleSpacing" [style.margin-bottom.px]="circleSpacing"
    >
    <color-swatch
      [color]="color" [style]="swatchStyle" [focus]="focus" [focusStyle]="focusStyle"
      (onClick)="handleClick($event)" (onHover)="onSwatchHover.emit($event)">
    </color-swatch>
    <div class="clear"></div>
  </div>
  `,
  styles: [
    `
  .circle-swatch {
    transform: scale(1);
    transition: transform 100ms ease;
  }
  .circle-swatch:hover {
    transform: scale(1.2);
  }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
   host: { 'hostID': 'circle-swatch-' + uuid() },
  standalone: false
})
/**
 * A single round color swatch used by {@link CircleComponent}'s palette grid.
 * @zh {@link CircleComponent} 调色板网格中使用的单个圆形色块。
 */
export class CircleSwatchComponent implements OnChanges {
  /**
   * Input property `color` (`string`) configuring color.
   * @zh 该色块代表的颜色值。
   * @zh 该色块代表的颜色值。
   */
  @Input() color: string;
  /**
   * Input property `circleSize` (`number`) configuring circle size (default: `28`).
   * @zh 色块直径（像素）。
   * @zh 色块直径（像素）。
   */
  @Input() circleSize = 28;
  /**
   * Input property `circleSpacing` (`number`) configuring circle spacing (default: `14`).
   * @zh 色块之间的间距（像素）。
   * @zh 色块之间的间距（像素）。
   */
  @Input() circleSpacing = 14;
  /**
   * Input property `focus` (`boolean`) configuring focus (default: `false`).
   * @zh 是否强制以聚焦样式渲染。
   * @zh 是否强制以聚焦样式渲染。
   */
  @Input() focus = false;
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
   * Property `focusStyle` (`{ [key: string]: string; }`) storing focus style (default: `{}`).
   * @zh 聚焦时叠加的内联样式。
   * @zh 聚焦时叠加的内联样式。
   */
  focusStyle: { [key: string]: string } = {};
  /**
   * Property `swatchStyle` (`{ [key: string]: string; }`) storing swatch style.
   * @zh 色块的基础内联样式。
   * @zh 色块的基础内联样式。
   */
  swatchStyle: { [key: string]: string } = {
    borderRadius: '50%',
    background: 'transparent',
    transition: '100ms box-shadow ease 0s',
  };

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
  ngOnChanges() {
    this.swatchStyle['boxShadow'] = `inset 0 0 0 ${this.circleSize / 2}px ${this.color}`;
    this.focusStyle['boxShadow'] = `inset 0 0 0 ${ this.circleSize / 2 }px ${ this.color }, 0 0 5px ${ this.color }`;
    if (this.focus) {
      this.focusStyle['boxShadow'] = `inset 0 0 0 3px ${ this.color }, 0 0 5px ${ this.color }`;
    }
  }
  /**
   * @hidden Emits `onClick` with the swatch's color.
   * @zh 内部使用，携带色块颜色发出 `onClick`。
   */
  handleClick({ hex, $event }) {
    this.onClick.emit({ hex, $event });
  }
}
