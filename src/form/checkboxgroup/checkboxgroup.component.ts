/**
 * @fileoverview Module `src/form/checkboxgroup/checkboxgroup.component.ts` providing checkboxgroup component definitions and implementation.
 * @zh 模块文件 `src/form/checkboxgroup/checkboxgroup.component.ts`，提供checkboxgroup组件相关的定义与实现。
 */

import { AfterViewInit, ChangeDetectionStrategy, Component, QueryList, ViewChildren } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import {includes,remove}  from 'lodash-es';
import { MatField } from '../base/mat.field';

/**
 * Angular component `CheckboxGroupField` (selector: 'checkbox-group') providing checkbox group field presentation and interaction in `src/form/checkboxgroup`.
 * @zh Angular 组件 `CheckboxGroupField`（selector: 'checkbox-group'），提供复选框分组字段的视图渲染与交互逻辑（位于 `src/form/checkboxgroup`）。
 */
@Component({
  selector: 'checkbox-group',
  styleUrls: ['./checkboxgroup.component.scss'],
  templateUrl: './checkboxgroup.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    hostID: 'checkbox-group-field' + Math.random().toString(36).substring(2, 15)
  }
})
export class CheckboxGroupField extends MatField implements AfterViewInit {

  /**
   * Template/content query reference `checkboxes` (`@ViewChildren`) targeting checkboxes.
   * @zh 模板/内容视图查询引用 `checkboxes`（`@ViewChildren`），指向复选框。
   */
  @ViewChildren(MatCheckbox) checkboxes!: QueryList<MatCheckbox>;

  /**
   * Property `defaultOptions` (`any`) storing default options.
   * @zh 属性 `defaultOptions`（类型：`any`），用于存储或配置默认配置选项。
   */
  override defaultOptions = {
    hideFieldUnderline: true,
    floatLabel: 'always',
    options: [],
    color: 'accent',
  };

  /**
   * Property `align` (`string`) storing align (default: `'start'`).
   * @zh 属性 `align`（类型：`string`），用于存储或配置对齐（默认值：`'start'`）。
   */
  public align = 'start';

  /**
   * Property `labelPosition` (`string`) storing label position (default: `'after'`).
   * @zh 属性 `labelPosition`（类型：`string`），用于存储或配置标签位置（默认值：`'after'`）。
   */
  public labelPosition = 'after';

  /**
   * Property `vertical` (`boolean`) storing vertical (default: `false`).
   * @zh 属性 `vertical`（类型：`boolean`），用于存储或配置垂直（默认值：`false`）。
   */
  public vertical = false;

  /**
   * Property `readonly` (`boolean`) storing readonly (default: `false`).
   * @zh 属性 `readonly`（类型：`boolean`），用于存储或配置是否只读（默认值：`false`）。
   */
  public readonly = false;

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   */
  override init() {
    super.init();
      this.field.validation.messages['required'] = this.field.blankText ?
      this.translate.instant(this.field.blankText) : this.translate.instant("FORM.LEASTSELECT")
  }

  /**
   * Executes `onChange` to handle on change.
   * @zh 执行 `onChange`，用于当变更。
   * @param option - option parameter (`any`) / 选项参数（`any`）
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  onChange(option, event) {
    if (this.field.type === 'array') {
      let val = this.formControl.value || [];
      if (event.checked) {
        if (!includes(val, option.value)) {
          val.push(option.value);
        }
      } else {
        if (includes(val, option.value)) {
          remove(val, function (v) {
            return v === option.value;
          });
        }
      }

      this.formControl.patchValue(val);
      if (this.model) {
        this.model[this.name] = val;
      }
    } else {
      this.formControl.patchValue({ ...this.formControl.value, [option.value]: event.checked });
    }
    this.formControl.markAsTouched();
    if (this.field.aferChange) {
      option.checked = event.checked;
      this.field.aferChange(option, this);
    }
  }

  /**
   * Executes `onContainerClick` to handle on container click.
   * @zh 执行 `onContainerClick`，用于当容器点击。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  override onContainerClick(event: MouseEvent): void {
    if (this.checkboxes.length) {
      this.checkboxes.first.focus();
    }
    super.onContainerClick(event);
  }

  /**
   * Executes `trackByOption` to handle track by option.
   * @zh 执行 `trackByOption`，用于track按选项。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @param option - option parameter (`any`) / 选项参数（`any`）
   */
  trackByOption(index: number, option) {
    return option ? option.value : index;
  }
}
