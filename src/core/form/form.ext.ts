/**
 * @fileoverview Module `src/core/form/form.ext.ts` providing form ext definitions and implementation.
 * @zh 模块文件 `src/core/form/form.ext.ts`，提供表单ext相关的定义与实现。
 */

import {isNil}  from 'lodash-es';
import { FieldConfig } from './models/field.config';
import { getKeyPath2 } from './utils';

/**
 * Class `FormExt` encapsulating form ext data structures and logic in `src/core/form`.
 * @zh 类 `FormExt`，封装 `src/core/form` 中的表单Ext数据结构与处理逻辑。
 */
export class FormExt {
  /**
   * Executes `getFieldId` to handle get field id.
   * @zh 执行 `getFieldId`，用于获取字段唯一标识。
   * @param formId - form id parameter (`string`) / 表单唯一标识参数（`string`）
   * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
   * @param index - index parameter (`string | number`) / 索引参数（`string | number`）
   */
  public static getFieldId(formId: string, field: FieldConfig, index: string | number) {
    if (field.id) return field.id;
    let type = field.xtype;
    if (!type && field.template) type = 'template';
    return [formId, type, field.name, index].join('_');
  }

  /**
   * Executes `getFieldModel` to handle get field model.
   * @zh 执行 `getFieldModel`，用于获取字段模型。
   * @param model - model parameter (`any`) / 模型参数（`any`）
   * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
   * @param constructEmptyObjects - construct empty objects parameter (`boolean`) / construct空对象参数（`boolean`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public static getFieldModel(model, field: FieldConfig, constructEmptyObjects: boolean) {
    const keyPath: (string | number)[] = getKeyPath2(field);
    let value = model;
    for (let i = 0; i < keyPath.length; i++) {
      const path = keyPath[i];
      const pathValue = value[path];
      if (isNil(pathValue) && constructEmptyObjects) {
        if (i < keyPath.length - 1) {
          value[path] = typeof keyPath[i + 1] === 'number' ? [] : {};
        } else if (field.fieldGroup) {
          value[path] = {};
        } else if (field.fieldArray) {
          value[path] = [];
        }
      }
      value = value[path];
      if (!value) {
        break;
      }
    }
    return value;
  }

  /**
   * Executes `getFieldValue` to handle get field value.
   * @zh 执行 `getFieldValue`，用于获取字段值。
   * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public static getFieldValue(field: FieldConfig) {
    const paths = getKeyPath2(field);
    let model = field.parent.model;
    while (model && paths.length > 0) {
      const e = paths.shift();
      model = model[e];
    }
    return model;
  }

  /**
   * Executes `initFieldValue` to handle init field value.
   * @zh 执行 `initFieldValue`，用于初始化字段值。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
   */
  public static initFieldValue(value, field: FieldConfig): void {
    const items = field['items'];
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const name = items[i]['name'] as string;
        const subItems = items[i]['items'];
        const v = items[i]['value'];
        if (subItems) {
          FormExt.initFieldValue(value, items[i]);
        } else {
          if (v) {
            value[name] = v;
          } else {
            value[name] = '';
          }
        }
      }
    }
  }
}
