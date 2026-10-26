/**
 * @fileoverview Module `src/common/colorpicker/components/github/github-swatch.component.ts` providing github swatch component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/github/github-swatch.component.ts`，提供githubswatch组件相关的定义与实现。
 */

import {  ChangeDetectionStrategy,  Component,  EventEmitter,  Input,  Output,} from '@angular/core';

/**
 * Angular component `GithubSwatchComponent` (selector: 'color-github-swatch') providing github swatch component presentation and interaction in `src/common/colorpicker/components/github`.
 * @zh Angular 组件 `GithubSwatchComponent`（selector: 'color-github-swatch'），提供GithubSwatch组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/github`）。
 */
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
  /**
   * Input property `color` (`string`) configuring color.
   * @zh 该色块代表的颜色值。
   * @zh 该色块代表的颜色值。
   */
  @Input() color: string;
  /**
   * Output event emitter `onClick` (`EventEmitter`) firing when on click occurs.
   * @zh 色块被点击时发出。
   * @zh 色块被点击时发出。
   */
  @Output() onClick = new EventEmitter();
  /**
   * Output event emitter `onSwatchHover` (`EventEmitter`) firing when on swatch hover occurs.
   * @zh 鼠标悬停在色块上时发出。
   * @zh 鼠标悬停在色块上时发出。
   */
  @Output() onSwatchHover = new EventEmitter();
  /**
   * Property `swatchStyle` (`{ [key: string]: string }`) storing swatch style.
   * @zh 色块的内联样式。
   * @zh 色块的内联样式。
   */
  swatchStyle: { [key: string]: string };

  /**
   * Creates an instance of `GithubSwatchComponent` and initializes its dependencies and internal state.
   * @zh 创建 `GithubSwatchComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {}

  /**
   * @hidden Emits `onClick` with the swatch's color.
   * @zh 内部使用，携带色块颜色发出 `onClick`。
   */
  handleClick({ hex, $event }) {
    this.onClick.emit({ hex, $event });
  }
}
