/**
 * @fileoverview Module `src/form/wrapper/fieldset.ts` providing fieldset definitions and implementation.
 * @zh 模块文件 `src/form/wrapper/fieldset.ts`，提供fieldset相关的定义与实现。
 */

import { Component, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

/**
 * Angular component `Fieldset` (selector: 'dui-fieldset') providing fieldset presentation and interaction in `src/form/wrapper`.
 * @zh Angular 组件 `Fieldset`（selector: 'dui-fieldset'），提供Fieldset的视图渲染与交互逻辑（位于 `src/form/wrapper`）。
 */
@Component({
  selector: 'dui-fieldset',
  template: `
        <fieldset [ngClass]="{'dui-fieldset widget widget-content dui-corner-all': true, 'dui-fieldset-toggleable': toggleable}" [ngStyle]="style" [class]="styleClass">
            <legend class="dui-fieldset-legend dui-corner-all dui-state-default dui-unselectable-text" (click)="toggle($event)">
                <span *ngIf="toggleable" class="dui-fieldset-toggler fa fa-w" [ngClass]="{'fa-minus': !collapsed,'fa-plus':collapsed}"></span>
                {{legend|translate}}
                <ng-content select="p-header"></ng-content>
            </legend>
            <div class="dui-fieldset-content-wrapper" [@fieldsetContent]="collapsed ? 'hidden' : 'visible'"
                        [ngClass]="{'dui-fieldset-content-wrapper-overflown': collapsed||animating}"
                         (@fieldsetContent.done)="onToggleDone($event)">
                <div class="dui-fieldset-content">
                    <ng-content></ng-content>
                </div>
            </div>
        </fieldset>
    `,
  animations: [
    trigger('fieldsetContent', [
      state('hidden', style({
        height: '0px'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'dui-fieldset' + Math.random().toString(36).substring(2, 15),
  }
})
export class Fieldset {

  /**
   * Input property `legend` (`string`) configuring legend.
   * @zh 输入属性 `legend`（类型：`string`），用于配置图例。
   */
  @Input() legend: string;

  /**
   * Input property `toggleable` (`boolean`) configuring toggleable.
   * @zh 输入属性 `toggleable`（类型：`boolean`），用于配置toggleable。
   */
  @Input() toggleable: boolean;

  /**
   * Input property `collapsed` (`boolean`) configuring collapsed (default: `false`).
   * @zh 输入属性 `collapsed`（类型：`boolean`），用于配置已折叠（默认值：`false`）。
   */
  @Input() collapsed: boolean = false;

  /**
   * Output event emitter `onBeforeToggle` (`EventEmitter<any>`) firing when on before toggle occurs.
   * @zh 输出事件 `onBeforeToggle`（类型：`EventEmitter<any>`），当触发当之前开关时向外发出事件。
   */
  @Output() onBeforeToggle = new EventEmitter();

  /**
   * Output event emitter `onAfterToggle` (`EventEmitter<any>`) firing when on after toggle occurs.
   * @zh 输出事件 `onAfterToggle`（类型：`EventEmitter<any>`），当触发当之后开关时向外发出事件。
   */
  @Output() onAfterToggle = new EventEmitter();

  /**
   * Input property `style` (`any`) configuring style.
   * @zh 输入属性 `style`（类型：`any`），用于配置样式。
   */
  @Input() style;

  /**
   * Input property `styleClass` (`string`) configuring style class.
   * @zh 输入属性 `styleClass`（类型：`string`），用于配置样式类名。
   */
  @Input() styleClass: string;

  /**
   * Property `animating` (`boolean`) storing animating.
   * @zh 属性 `animating`（类型：`boolean`），用于存储或配置动画执行中。
   */
  public animating: boolean;

  /**
   * Creates an instance of `Fieldset` and initializes its dependencies and internal state.
   * @zh 创建 `Fieldset` 实例，并初始化其依赖项与内部状态。
   * @param el - Injected or initial el (`ElementRef`) / 注入或传入的DOM元素（`ElementRef`）
   */
  constructor(private el: ElementRef) { }

  /**
   * Executes `toggle` to handle toggle.
   * @zh 执行 `toggle`，用于开关。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  toggle(event) {
    if (this.toggleable) {
      if (this.animating) {
        return ;
      }

      this.animating = true;
      this.onBeforeToggle.emit({ originalEvent: event, collapsed: this.collapsed });

      if (this.collapsed) {
        this.expand(event);
      } else {
        this.collapse(event);
      }

      this.onAfterToggle.emit({ originalEvent: event, collapsed: this.collapsed });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `expand` to handle expand.
   * @zh 执行 `expand`，用于展开。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  expand(event) {
    this.collapsed = false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `collapse` to handle collapse.
   * @zh 执行 `collapse`，用于折叠。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  collapse(event) {
    this.collapsed = true;
  }
  /**
   * Executes `getBlockableElement` to handle get blockable element.
   * @zh 执行 `getBlockableElement`，用于获取Blockable元素。
   * @returns Result of type `HTMLElement` / 类型为 `HTMLElement` 的返回值
   */
  getBlockableElement(): HTMLElement {
    return this.el.nativeElement.children[0];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `onToggleDone` to handle on toggle done.
   * @zh 执行 `onToggleDone`，用于当开关完成。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  onToggleDone(event) {
    this.animating = false;
  }
}
