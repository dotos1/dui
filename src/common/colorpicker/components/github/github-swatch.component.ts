import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  Output,} from '@angular/core';

@Component({
  selector: 'color-github-swatch',
  template: `
  <div class="github-swatch">
    <color-swatch
      [color]="color"
      [style]="swatchStyle"
      (onClick)="handleClick($event)"
      (onHover)="onSwatchHover.emit($event)"
      class="swatch"
    ></color-swatch>
    <div class="clear"></div>
  </div>
  `,
  styles: [
    `
    .github-swatch {
      width: 25px;
      height: 25px;
      font-size: 0;
    }
    .github-swatch:hover {
      position: relative;
      z-index: 2;
      outline: 2px solid #fff;
      box-shadow: 0 0 5px 2px rgba(0,0,0,0.25);
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    'hostID': 'github-swatch-' + Math.random().toString(36).substring(2, 15),
  }
})
/**
 * A single square color swatch used by {@link GithubComponent}'s palette grid.
 * @zh {@link GithubComponent} 调色板网格中使用的单个方形色块。
 */
export class GithubSwatchComponent {
  /** @zh 该色块代表的颜色值。 */
  @Input() color: string;
  /** @zh 色块被点击时发出。 */
  @Output() onClick = new EventEmitter<any>();
  /** @zh 鼠标悬停在色块上时发出。 */
  @Output() onSwatchHover = new EventEmitter<any>();
  /** @zh 色块的内联样式。 */
  swatchStyle: { [key: string]: string };

  constructor() {}

  /**
   * @hidden Emits `onClick` with the swatch's color.
   * @zh 内部使用，携带色块颜色发出 `onClick`。
   */
  handleClick({ hex, $event }) {
    this.onClick.emit({ hex, $event });
  }
}
