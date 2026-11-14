/**
 * @fileoverview Module `src/ui/speeddial/speed-dial-trigger.ts` providing speed dial trigger definitions and implementation.
 * @zh 模块文件 `src/ui/speeddial/speed-dial-trigger.ts`，提供速度dial触发相关的定义与实现。
 */

import { Component, HostBinding, HostListener, Injector, Input, } from '@angular/core';
import { SpeedDialComponent } from './speed-dial';

/**
 * Angular component `SpeedDialTriggerComponent` (selector: 'speed-dial-trigger') providing speed dial trigger component presentation and interaction in `src/ui/speeddial`.
 * @zh Angular 组件 `SpeedDialTriggerComponent`（selector: 'speed-dial-trigger'），提供速度Dial触发组件的视图渲染与交互逻辑（位于 `src/ui/speeddial`）。
 */
@Component({
  selector: 'speed-dial-trigger',
  template: `
        <ng-content  *ngIf="type==='mat-fab'" select="[mat-fab]"></ng-content>
        <ng-content *ngIf="type==='mat-mini-fab'" select="[mat-mini-fab]"></ng-content>`,
  host: {
    hostID: 'speed-dial-trigger' + Math.random().toString(36).substring(2, 15)
  },
  standalone: false
})
export class SpeedDialTriggerComponent {

  /**
   * Property `_parent` (`SpeedDialComponent`) storing parent.
   * @zh 属性 `_parent`（类型：`SpeedDialComponent`），用于存储或配置父级。
   */
  private _parent: SpeedDialComponent;

  /**
   * Input property `disabled` (`boolean`) configuring disabled (default: `false`).
   * @zh 输入属性 `disabled`（类型：`boolean`），用于配置已禁用（默认值：`false`）。
   */
  @Input() disabled: boolean = false;

  /**
   * Host-bound getter `sp` (`boolean`) computing sp.
   * @zh 宿主绑定读取器 `sp`（绑定至 `class.eco-spin`），计算并返回sp。
   */
  @HostBinding('class.eco-spin') get sp() {
    return this.spin;
  }

  /**
   * Input property `spin` (`boolean`) configuring spin (default: `false`).
   * @zh 输入属性 `spin`（类型：`boolean`），用于配置spin（默认值：`false`）。
   */
  @Input() spin = false;

  /**
   * Input property `type` (`string`) configuring type (default: `"mat-fab"`).
   * @zh 输入属性 `type`（类型：`string`），用于配置类型（默认值：`"mat-fab"`）。
   */
  @Input() type = "mat-fab";

  /**
   * Creates an instance of `SpeedDialTriggerComponent` and initializes its dependencies and internal state.
   * @zh 创建 `SpeedDialTriggerComponent` 实例，并初始化其依赖项与内部状态。
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
  constructor(injector: Injector) {
    this._parent = injector.get(SpeedDialComponent);
  }

  /**
   * Host event listener `_onClick` handling `click` events for on click.
   * @zh 宿主事件监听方法 `_onClick`，响应 `click` 事件以处理当点击。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  @HostListener('click', ['$event'])
  _onClick(event: Event): void {
    if (!this._parent.fixed&&!this.disabled) {
      this._parent.toggle();
      event.stopPropagation();
    }
  }
}
