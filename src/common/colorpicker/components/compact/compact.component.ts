
import {
  ChangeDetectionStrategy,  Component,  Input,
} from '@angular/core';

import {
  ColorWrap,
  isValidHex,
  zDepth,
} from '@dotos/dui/common/colorpicker/common';
import { TriggerPopup } from '@dotos/dui/common/trigger';

/**
 * Compact color picker: a dense grid of square swatches plus hex/rgb fields, in a small
 * raised card footprint.
 * @zh 紧凑型颜色选择器：密集排列的方形色块网格加十六进制/RGB 输入框，
 * 呈现为一个小型浮起卡片。
 */
@Component({
  selector: 'color-compact',
  template: `
  <color-raised class="color-compact" [zDepth]="zDepth" [background]="background" [radius]="radius">
    <div class="compact-picker {{ className }}">
     <div>
        <color-compact-color
          *ngFor="let color of colors" [color]="color"
          [active]="color.toLowerCase() === hex.toLowerCase()"
          (onClick)="handleBlockChange($event)"
        ></color-compact-color>
        <div class="compact-clear"></div>
      </div>
      <color-compact-fields
        [hex]="hex"
        [rgb]="rgb"
        (onChange)="handleValueChange($event)"
      ></color-compact-fields>
    </div>
  </color-raised>
  `,
  styles: [
    `
    .color-compact {
      background: #f6f6f6;
      radius: 4px;
    }
    .compact-picker {
      padding-top: 5px;
      padding-left: 5px;
      box-sizing: border-box;
      width: 245px;
    }
    .compact-clear {
      clear: both;
    }
  `,
  ],
  host: {
    '(keydown)': '_handleKeydown($event)',
    hostID: 'compact-picker-' + Math.random().toString(36).substring(2, 15)
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,

})
export class CompactComponent extends ColorWrap implements TriggerPopup {
  /** Color squares to display */
  @Input() colors = [
    '#4D4D4D',
    '#999999',
    '#FFFFFF',
    '#F44E3B',
    '#FE9200',
    '#FCDC00',
    '#DBDF00',
    '#A4DD00',
    '#68CCCA',
    '#73D8FF',
    '#AEA1FF',
    '#FDA1FF',
    '#333333',
    '#808080',
    '#cccccc',
    '#D33115',
    '#E27300',
    '#FCC400',
    '#B0BC00',
    '#68BC00',
    '#16A5A5',
    '#009CE0',
    '#7B64FF',
    '#FA28FF',
    '#000000',
    '#666666',
    '#B3B3B3',
    '#9F0500',
    '#C45100',
    '#FB9E00',
    '#808900',
    '#194D33',
    '#0C797D',
    '#0062B1',
    '#653294',
    '#AB149E',
  ];
  /** @zh 外层卡片的阴影层级。 */
  @Input() zDepth: zDepth = 1;
  /** @zh 外层卡片的圆角半径。 */
  @Input() radius = 1;
  /** @zh 外层卡片的背景颜色。 */
  @Input() background = '#fff';

  constructor() {
    super();
  }
  /**
   * @hidden Applies a swatch click as the new color, if it's a valid hex.
   * @zh 内部使用，若色块点击的颜色是有效的十六进制值，则应用为新颜色。
   */
  handleBlockChange({ hex, $event }) {
    if (isValidHex(hex)) {
      this.handleChange({ hex, source: 'hex' }, $event);
    }
  }
  /**
   * @hidden Forwards a child component's change to `handleChange`.
   * @zh 内部使用，将子组件的变化转发给 `handleChange`。
   */
  handleValueChange({ data, $event }) {
    this.handleChange(data, $event);
  }
}
