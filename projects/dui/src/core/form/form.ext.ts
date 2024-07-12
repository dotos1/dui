import { FieldConfig } from './models/field.config';
import { DuiBase } from '@dotos/dui/base';
import * as _ from 'lodash';
import { getKeyPath2 } from './utils';

export class FormExt {
  public static getFieldId(formId: string, field: FieldConfig, index: string | number) {
    if (field.id) return field.id;
    let type = field.xtype;
    if (!type && field.template) type = 'template';
    return [formId, type, field.name, index].join('_');
  }

  public static getFieldModel(model: any, field: FieldConfig, constructEmptyObjects: boolean): any {
    const keyPath: (string | number)[] = getKeyPath2(field);
    let value: any = model;
    for (let i = 0; i < keyPath.length; i++) {
      const path = keyPath[i];
      const pathValue = value[path];
      if (_.isNil(pathValue) && constructEmptyObjects) {
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

  public static getFieldValue(field: FieldConfig): any {
    const paths = getKeyPath2(field);
    let model = field.parent.model;
    while (model && paths.length > 0) {
      const e = paths.shift();
      model = model[e];
    }
    return model;
  }

  public static initFieldValue(value: any, field: FieldConfig): void {
    const items: any[] = field['items'];
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const name = items[i]['name'];
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
