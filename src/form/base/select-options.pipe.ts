/**
 * @fileoverview Module `src/form/base/select-options.pipe.ts` providing select options pipe definitions and implementation.
 * @zh 模块文件 `src/form/base/select-options.pipe.ts`，提供下拉选择配置选项管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { FieldConfig } from '@dotos/dui/core/form';
import { getOptionDisabled, getOptionGroup, getOptionLabel, getOptionValue } from './select-option-props';

/**
 * Angular pipe `SelectOptionsPipe` (name: 'selectOptionsPipe') transforming values for select options pipe display in templates.
 * @zh Angular 管道 `SelectOptionsPipe`（name: 'selectOptionsPipe'），在模板中转换数据以用于下拉选择配置选项管道展示。
 */
@Pipe({ name: 'selectOptionsPipe', standalone: false })
export class SelectOptionsPipe implements PipeTransform {

  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
   */
  transform(options, field?: FieldConfig) {
    if (!(options instanceof Observable)) {
      options = observableOf(options);
    }
    return (options as Observable<unknown>).pipe(
      map(value => this.toOptions(value, field || {})),
    );
  }

  /**
   * Executes `toOptions` to handle to options.
   * @zh 执行 `toOptions`，用于转换为配置选项。
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
   */
  private toOptions(options, field: FieldConfig) {
    const gOptions = [],
      groups: { [key: string]: unknown[] } = {},
      to = field || {};
    if (options != undefined) {
      options.map((option) => {
        if (!this.getGroupProp(option, to)) {
          gOptions.push(this.toOption(option, to));
        } else {
          if (!groups[this.getGroupProp(option, to)]) {
            groups[this.getGroupProp(option, to)] = [];
            gOptions.push({
              label: this.getGroupProp(option, to),
              group: groups[this.getGroupProp(option, to)],
            });
          }
          groups[this.getGroupProp(option, to)].push(this.toOption(option, to));
        }
      });
    }
    return gOptions;
  }

  /**
   * Executes `toOption` to handle to option.
   * @zh 执行 `toOption`，用于转换为选项。
   * @param item - item parameter (`any`) / 条目参数（`any`）
   * @param to - to parameter (`any`) / 转换为参数（`any`）
   */
  private toOption(item, to) {
    return {
      ...item,
      label: this.getLabelProp(item, to),
      value: this.getValueProp(item, to),
      disabled: this.getDisabledProp(item, to) || false,
    };
  }

  /**
   * Executes `getLabelProp` to handle get label prop.
   * @zh 执行 `getLabelProp`，用于获取标签属性。
   * @param item - item parameter (`any`) / 条目参数（`any`）
   * @param to - to parameter (`any`) / 转换为参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private getLabelProp(item, to): string {
    return getOptionLabel(item, to);
  }

  /**
   * Executes `getValueProp` to handle get value prop.
   * @zh 执行 `getValueProp`，用于获取值属性。
   * @param item - item parameter (`any`) / 条目参数（`any`）
   * @param to - to parameter (`any`) / 转换为参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private getValueProp(item, to): string {
    return getOptionValue(item, to);
  }

  /**
   * Executes `getDisabledProp` to handle get disabled prop.
   * @zh 执行 `getDisabledProp`，用于获取已禁用属性。
   * @param item - item parameter (`any`) / 条目参数（`any`）
   * @param to - to parameter (`any`) / 转换为参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private getDisabledProp(item, to): string {
    return getOptionDisabled(item, to);
  }

  /**
   * Executes `getGroupProp` to handle get group prop.
   * @zh 执行 `getGroupProp`，用于获取分组属性。
   * @param item - item parameter (`any`) / 条目参数（`any`）
   * @param to - to parameter (`any`) / 转换为参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private getGroupProp(item, to): string {
    return getOptionGroup(item, to);
  }
}
