/**
 * @fileoverview Module `src/form/checkbox/checkbox.component.ts` providing checkbox component definitions and implementation.
 * @zh 模块文件 `src/form/checkbox/checkbox.component.ts`，提供复选框组件相关的定义与实现。
 */

import { Component, ViewChild, AfterViewInit,  ChangeDetectionStrategy, Renderer2, OnDestroy } from '@angular/core';
import { MatField } from '../base/mat.field';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { TranslateService } from '@dotos/dui/translator';

/**
 * Angular component `CheckboxField` (selector: 'checkbox-field') providing checkbox field presentation and interaction in `src/form/checkbox`.
 * @zh Angular 组件 `CheckboxField`（selector: 'checkbox-field'），提供复选框字段的视图渲染与交互逻辑（位于 `src/form/checkbox`）。
 */
@Component({
  selector: 'checkbox-field',
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'checkbox-field' + Math.random().toString(36).substring(2, 15),
  }
})
export class CheckboxField extends MatField implements AfterViewInit,OnDestroy {

  /**
   * Template/content query reference `checkbox` (`MatCheckbox`) targeting checkbox.
   * @zh 模板/内容视图查询引用 `checkbox`（`@ViewChild`），指向复选框。
   */
  @ViewChild(MatCheckbox, { static: true }) checkbox!: MatCheckbox;

  /**
   * Property `defaultOptions` (`{…}`) storing default options.
   * @zh 属性 `defaultOptions`（类型：`{…}`），用于存储或配置默认配置选项。
   */
  override defaultOptions = {
    hideFieldUnderline: true,
    indeterminate: true,
    floatLabel: 'always',
    hideLabel: true,
    align: 'start',
    color: 'accent',  // start or end
  };
  /**
   * Property `_required` (`boolean`) storing required.
   * @zh 属性 `_required`（类型：`boolean`），用于存储或配置必填。
   */
  private _required!: boolean;
  /**
   * Creates an instance of `CheckboxField` and initializes its dependencies and internal state.
   * @zh 创建 `CheckboxField` 实例，并初始化其依赖项与内部状态。
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   */
  constructor(
    private renderer: Renderer2,
    protected override translate: TranslateService ) {
    super(translate);
  }

  /**
   * Executes `onContainerClick` to handle on container click.
   * @zh 执行 `onContainerClick`，用于当容器点击。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  override onContainerClick(event: MouseEvent): void {
    this.checkbox.focus();
    super.onContainerClick(event);
  }

  /**
   * Executes `change` to handle change.
   * @zh 执行 `change`，用于变更。
   * @param $event - event parameter (`MatCheckboxChange`) / 事件参数（`MatCheckboxChange`）
   */
  change($event: MatCheckboxChange) {
    if (this.field.change) {
      // this.field.value=this.field.formControl.value;
      this.field.change(this.field, $event);
    }
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  override ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.required !== this._required && this.checkbox && this.checkbox._inputElement) {
      this._required = this.required;
      const inputElement = this.checkbox._inputElement.nativeElement;
      if (this.required) {
        this.renderer.setAttribute(inputElement, 'required', 'required');
      } else {
        this.renderer.removeAttribute(inputElement, 'required');
      }
    }
  }
  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
