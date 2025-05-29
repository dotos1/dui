import {  ChangeDetectionStrategy,  Component,  Input,} from '@angular/core';
import { MatColors } from '@dotos/dui/core/color';

export const amber = MatColors.getColorName('amber');
export const blue = MatColors.getColorName('blue');
export const blueGrey = MatColors.getColorName('blue-grey');
export const brown = MatColors.getColorName('brown');
export const cyan = MatColors.getColorName('cyan');
export const deepOrange = MatColors.getColorName('deep-orange');
export const deepPurple = MatColors.getColorName('deep-purple');
export const green = MatColors.getColorName('green');
export const indigo = MatColors.getColorName('indigo');
export const lightBlue = MatColors.getColorName('light-blue');
export const lightGreen = MatColors.getColorName('light-green');
export const lime = MatColors.getColorName('lime');
export const orange = MatColors.getColorName('orange');
export const pink = MatColors.getColorName('pink');
export const purple = MatColors.getColorName('purple');
export const red = MatColors.getColorName('red');
export const teal = MatColors.getColorName('teal');
export const yellow = MatColors.getColorName('yellow');

import { ColorWrap, isValidHex } from '@dotos/dui/common/colorpicker/common';
import { TriggerPopup } from '@dotos/dui/common/trigger';

@Component({
  selector: 'color-circle',
  template: `
    <div
      class="circle-picker {{ className }}"
      [style.width.px]="width"
      [style.margin-right.px]="-circleSpacing"
      [style.margin-bottom.px]="-circleSpacing"
    >
      <color-circle-swatch
        *ngFor="let color of colors"
        [circleSize]="circleSize"
        [circleSpacing]="circleSpacing"
        [color]="color"
        [focus]="isActive(color)"
        (onClick)="handleBlockChange($event)"
        (onSwatchHover)="onSwatchHover.emit($event)"
      ></color-circle-swatch>
    </div>
  `,
  styles: [
    `
      .circle-picker {
        display: flex;
        flex-wrap: wrap;
      }
    `,
  ],
  host: {
    '(keydown)': '_handleKeydown($event)',
    hostId: 'circle-picker-' + Math.random().toString(36).substring(2, 15)
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,

})
export class CircleComponent extends ColorWrap implements TriggerPopup {
  /** Pixel value for picker width */
  @Input() width: string | number = 252;
  /** Color squares to display */
  @Input()
  colors: string[] = [
    red['500'],
    pink['500'],
    purple['500'],
    deepPurple['500'],
    indigo['500'],
    blue['500'],
    lightBlue['500'],
    cyan['500'],
    teal['500'],
    green['500'],
    lightGreen['500'],
    lime['500'],
    yellow['500'],
    amber['500'],
    orange['500'],
    deepOrange['500'],
    brown['500'],
    blueGrey['500'],
  ];
  /** Value for circle size */
  @Input() circleSize = 28;
  /** Value for spacing between circles */
  @Input() circleSpacing = 14;

  constructor() {
    super();
  }
  isActive(color) {
    return this.hex === color;
  }
  handleBlockChange({ hex, $event }) {
    if (isValidHex(hex)) {
      this.handleChange({ hex, source: 'hex' }, $event);
    }
  }
  handleValueChange({ data, $event }) {
    this.handleChange(data, $event);
  }

}
