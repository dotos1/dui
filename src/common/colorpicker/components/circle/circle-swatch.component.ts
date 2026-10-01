import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  OnChanges,  Output,
} from '@angular/core';
import { uuid } from '@dotos/dui/util';

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
   host: { 'hostID': 'circle-swatch-' + uuid() }
})
/**
 * A single round color swatch used by {@link CircleComponent}'s palette grid.
 * @zh {@link CircleComponent} 调色板网格中使用的单个圆形色块。
 */
export class CircleSwatchComponent implements OnChanges {
  /** @zh 该色块代表的颜色值。 */
  @Input() color: string;
  /** @zh 色块直径（像素）。 */
  @Input() circleSize = 28;
  /** @zh 色块之间的间距（像素）。 */
  @Input() circleSpacing = 14;
  /** @zh 是否强制以聚焦样式渲染。 */
  @Input() focus = false;
  /** @zh 色块被点击时发出。 */
  @Output() onClick = new EventEmitter<any>();
  /** @zh 鼠标悬停在色块上时发出。 */
  @Output() onSwatchHover = new EventEmitter<any>();
  /** @zh 聚焦时叠加的内联样式。 */
  focusStyle: { [key: string]: string } = {};
  /** @zh 色块的基础内联样式。 */
  swatchStyle: { [key: string]: string } = {
    borderRadius: '50%',
    background: 'transparent',
    transition: '100ms box-shadow ease 0s',
  };

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
