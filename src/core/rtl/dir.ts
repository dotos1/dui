/**
 * @fileoverview Module `src/core/rtl/dir.ts` providing dir definitions and implementation.
 * @zh 模块文件 `src/core/rtl/dir.ts`，提供目录相关的定义与实现。
 */

import {
  NgModule,
  Directive,
  HostBinding,
  Output,
  Input,
  EventEmitter
} from '@angular/core';

/**
 * Type alias `LayoutDirection` representing layout direction (`'ltr' | 'rtl'`).
 * @zh 类型别名 `LayoutDirection`，表示布局方向（`'ltr' | 'rtl'`）。
 */
export type LayoutDirection = 'ltr' | 'rtl';


/**
 * Angular directive `Dir` (selector: '[dir]') attaching dir behavior to host DOM elements.
 * @zh Angular 指令 `Dir`（selector: '[dir]'），为宿主 DOM 元素附加目录行为。
 */
@Directive({
  selector: '[dir]',
  // TODO(hansl): maybe `$implicit` isn't the best option here, but for now that's the best we got.
  exportAs: '$implicit'
})
export class Dir {
  /**
   * Layout direction of the element.
   * @zh 输入属性 `dir`（类型：`LayoutDirection`），用于配置目录（默认值：`'ltr'`）。
   */
  @Input('dir') _dir: LayoutDirection = 'ltr';

  /**
   * Event emitted when the direction changes.
   * @zh 输出事件 `dirChange`（类型：`EventEmitter`），当触发目录变更时向外发出事件。
   */
  @Output() dirChange = new EventEmitter<void>();

  /**
   * @docs-private
   * @zh 宿主绑定读取器 `dir`（绑定至 `attr.dir`），计算并返回目录。
   */
  @HostBinding('attr.dir')
  get dir(): LayoutDirection {
    return this._dir;
  }
  /**
   * Sets the dir (`dir`).
   * @zh 设置目录（`dir`）。
   * @param v - New dir value (`LayoutDirection`) / 新的目录值（`LayoutDirection`）
   */
  set dir(v: LayoutDirection) {
    const old = this._dir;
    this._dir = v;
    if (old !== this._dir) {
      this.dirChange.emit();
    }
  }

  /**
   * Current layout direction of the element.
   * @zh 获取当前值（`value: LayoutDirection`）。
   */
  get value(): LayoutDirection { return this.dir; }
  /**
   * Sets the value (`value`).
   * @zh 设置值（`value`）。
   * @param v - New value value (`LayoutDirection`) / 新的值值（`LayoutDirection`）
   */
  set value(v: LayoutDirection) { this.dir = v; }
}


/**
 * Angular module `RtlModule` declaring and exporting rtl module components, directives, pipes, and providers.
 * @zh Angular 模块 `RtlModule`，声明并导出Rtl模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  exports: [Dir],
  declarations: [Dir]
})
export class RtlModule {}
