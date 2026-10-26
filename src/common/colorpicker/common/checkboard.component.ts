/**
 * @fileoverview Module `src/common/colorpicker/common/checkboard.component.ts` providing checkboard component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/common/checkboard.component.ts`，提供checkboard组件相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnInit,
} from '@angular/core';

import { getCheckerboard } from './helpers/checkboard';

/**
 * Angular component `CheckboardComponent` (selector: 'color-checkboard') providing checkboard component presentation and interaction in `src/common/colorpicker/common`.
 * @zh Angular 组件 `CheckboardComponent`（selector: 'color-checkboard'），提供Checkboard组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/common`）。
 */
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
  /**
   * Input property `white` (`string`) configuring white (default: `'transparent'`).
   * @zh 棋盘格"白色"方块的颜色。
   * @zh 棋盘格"白色"方块的颜色。
   */
  @Input() white = 'transparent';
  /**
   * Input property `size` (`number`) configuring size (default: `8`).
   * @zh 每个棋盘格方块的像素尺寸。
   * @zh 每个棋盘格方块的像素尺寸。
   */
  @Input() size = 8;
  /**
   * Input property `grey` (`string`) configuring grey (default: `'rgba(0,0,0,.08)'`).
   * @zh 棋盘格"灰色"方块的颜色。
   * @zh 棋盘格"灰色"方块的颜色。
   */
  @Input() grey = 'rgba(0,0,0,.08)';
  /**
   * Input property `boxShadow` (`string`) configuring box shadow.
   * @zh 应用到棋盘格上的阴影样式。
   * @zh 应用到棋盘格上的阴影样式。
   */
  @Input() boxShadow: string;
  /**
   * Input property `borderRadius` (`string`) configuring border radius.
   * @zh 棋盘格的圆角半径。
   * @zh 棋盘格的圆角半径。
   */
  @Input() borderRadius: string;
  /**
   * Property `gridStyles` (`{ [key: string]: string }`) storing grid styles.
   * @zh 根据输入计算出的棋盘格背景样式。
   * @zh 根据输入计算出的棋盘格背景样式。
   */
  gridStyles: { [key: string]: string };

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    const background = getCheckerboard(this.white, this.grey, this.size);
    this.gridStyles = {
      borderRadius: this.borderRadius,
      boxShadow: this.boxShadow,
      background: `url(${background}) center left`,
    };
  }
}

/**
 * Angular module `CheckboardModule` declaring and exporting checkboard module components, directives, pipes, and providers.
 * @zh Angular 模块 `CheckboardModule`，声明并导出Checkboard模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [CheckboardComponent],
  exports: [CheckboardComponent],
  imports: [CommonModule],
})
export class CheckboardModule { }
