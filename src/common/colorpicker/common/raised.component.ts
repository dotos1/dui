/**
 * @fileoverview Module `src/common/colorpicker/common/raised.component.ts` providing raised component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/common/raised.component.ts`，提供raised组件相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';

/**
 * Type alias `zDepth` representing z depth (`0 | 1 | 2 | 3 | 4 | 5`).
 * @zh 类型别名 `zDepth`，表示Z坐标Depth（`0 | 1 | 2 | 3 | 4 | 5`）。
 */
export type zDepth = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Angular component `RaisedComponent` (selector: 'color-raised') providing raised component presentation and interaction in `src/common/colorpicker/common`.
 * @zh Angular 组件 `RaisedComponent`（selector: 'color-raised'），提供Raised组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/common`）。
 */
@Component({
  selector: 'color-raised',
  template: `
  <div class="raised-wrap">
    <div class="raised-bg zDepth-{{zDepth}}" [style.background]="background"></div>
    <div class="raised-content">
      <ng-content></ng-content>
    </div>
  </div>
  `,
  styles: [`
    .raised-wrap {
      position: relative;
      display: inline-block;
    }
    .raised-bg {
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
    }
    .raised-content {
      position: relative;
    }
    .zDepth-0 {
      box-shadow: none;
    }
    .zDepth-1 {
      box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);
    }
    .zDepth-2 {
      box-shadow: 0 6px 20px rgba(0,0,0,.19), 0 8px 17px rgba(0,0,0,.2);
    }
    .zDepth-3 {
      box-shadow: 0 17px 50px rgba(0,0,0,.19), 0 12px 15px rgba(0,0,0,.24);
    }
    .zDepth-4 {
      box-shadow: 0 25px 55px rgba(0,0,0,.21), 0 16px 28px rgba(0,0,0,.22);
    }
    .zDepth-5 {
      box-shadow: 0 40px 77px rgba(0,0,0,.22), 0 27px 24px rgba(0,0,0,.2);
    }
  `],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  
})
/**
 * Wraps projected content in a card-like container with a Material "elevation" (zDepth) shadow.
 * @zh 将投影内容包裹在带有 Material "层级"（zDepth）阴影的卡片式容器中。
 */
export class RaisedComponent {
  /**
   * Input property `zDepth` (`zDepth`) configuring z depth (default: `1`).
   * @zh 阴影层级（0-5），层级越高阴影越明显。
   * @zh 阴影层级（0-5），层级越高阴影越明显。
   */
  @Input() zDepth: zDepth = 1;
  /**
   * Input property `radius` (`number`) configuring radius (default: `1`).
   * @zh 圆角半径。
   * @zh 圆角半径。
   */
  @Input() radius = 1;
  /**
   * Input property `background` (`string`) configuring background (default: `'#fff'`).
   * @zh 背景颜色。
   * @zh 背景颜色。
   */
  @Input() background = '#fff';
}

/**
 * Angular module `RaisedModule` declaring and exporting raised module components, directives, pipes, and providers.
 * @zh Angular 模块 `RaisedModule`，声明并导出Raised模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [RaisedComponent],
  exports: [RaisedComponent],
  imports: [CommonModule],
})
export class RaisedModule { }
