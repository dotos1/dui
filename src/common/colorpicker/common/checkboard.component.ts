import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnInit,
} from '@angular/core';

import { getCheckerboard } from './helpers/checkboard';

@Component({
  selector: 'color-checkboard',
  template: `<div class="grid" [ngStyle]="gridStyles"></div>`,
  styles: [
    `
  .grid {
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    position: absolute;
  }
  `,
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
/**
 * Renders a checkerboard background pattern, used behind transparent color swatches.
 * @zh 渲染棋盘格背景图案，用于在透明色块下方作为背景。
 */
export class CheckboardComponent implements OnInit {
  /** @zh 棋盘格"白色"方块的颜色。 */
  @Input() white = 'transparent';
  /** @zh 每个棋盘格方块的像素尺寸。 */
  @Input() size = 8;
  /** @zh 棋盘格"灰色"方块的颜色。 */
  @Input() grey = 'rgba(0,0,0,.08)';
  /** @zh 应用到棋盘格上的阴影样式。 */
  @Input() boxShadow: string;
  /** @zh 棋盘格的圆角半径。 */
  @Input() borderRadius: string;
  /** @zh 根据输入计算出的棋盘格背景样式。 */
  gridStyles: { [key: string]: string };

  ngOnInit() {
    const background = getCheckerboard(this.white, this.grey, this.size);
    this.gridStyles = {
      borderRadius: this.borderRadius,
      boxShadow: this.boxShadow,
      background: `url(${background}) center left`,
    };
  }
}

@NgModule({
  declarations: [CheckboardComponent],
  exports: [CheckboardComponent],
  imports: [CommonModule],
})
export class CheckboardModule { }
