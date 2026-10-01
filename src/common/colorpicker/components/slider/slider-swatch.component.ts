import {  
  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  OnChanges,  Output,
} from '@angular/core';
import { HSL } from '@dotos/dui/core/color';

@Component({
  selector: 'color-slider-swatch',
  template: `
  <div class="slider-swatch" [style.background]="background"
    [class.first]="first" [class.last]="last" [class.active]="active"
    (click)="handleClick($event)"
  ></div>
  `,
  styles: [
    `
    .slider-swatch {
      height: 12px;
      background: rgb(121, 211, 166);
      cursor: pointer;
    }
    .slider-swatch.active {
      transform: scaleY(1.8);
      border-top-right-radius: 3.6px 2px;
      border-top-left-radius: 3.6px 2px;
      border-bottom-right-radius: 3.6px 2px;
      border-bottom-left-radius: 3.6px 2px;
    }
    .slider-swatch.first {
      border-radius: 2px 0px 0px 2px;
    }
    .slider-swatch.last {
      border-radius: 0px 2px 2px 0px;
    }

  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
    host: {
    'hostID': 'slider-swatch-' + Math.random().toString(36).substring(2, 15),
  },
})
/**
 * A single lightness-preset swatch used by {@link SliderSwatchesComponent}.
 * @zh {@link SliderSwatchesComponent} 使用的单个明度预设色块。
 */
export class SliderSwatchComponent implements OnChanges {
  /** @zh 当前颜色的 HSL 表示（用于取色相 h）。 */
  @Input() hsl: HSL;
  /** @zh 该色块当前是否为选中状态。 */
  @Input() active: boolean;
  /** @zh 该色块对应的明度（lightness）偏移量。 */
  @Input() offset: number;
  /** @zh 该色块是否为列表第一个（应用左侧圆角）。 */
  @Input() first = false;
  /** @zh 该色块是否为列表最后一个（应用右侧圆角）。 */
  @Input() last = false;
  /** @zh 色块被点击时发出。 */
  @Output() onClick = new EventEmitter<any>();
  /** @zh 根据当前色相和明度偏移计算出的背景色。 */
  background: string;

  ngOnChanges() {
    this.background = `hsl(${this.hsl.h}, 50%, ${this.offset * 100}%)`;
  }
  /**
   * @hidden Emits `onClick` with the resulting HSL color for this swatch's lightness.
   * @zh 内部使用，携带该色块明度对应的 HSL 颜色发出 `onClick`。
   */
  handleClick($event) {
    this.onClick.emit({
      data: {
        h: this.hsl.h,
        s: 0.5,
        l: this.offset,
        source: 'hsl',
      },
      $event,
    });
  }
}
