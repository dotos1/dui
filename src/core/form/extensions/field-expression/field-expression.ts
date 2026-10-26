/**
 * @fileoverview Module `src/core/form/extensions/field-expression/field-expression.ts` providing field expression definitions and implementation.
 * @zh 模块文件 `src/core/form/extensions/field-expression/field-expression.ts`，提供字段表达式相关的定义与实现。
 */

import { FormArray } from '@angular/forms';
import { FieldConfig, ValueChangeEvent, FieldConfigCache } from '../../models';
import {
  isObject, isNil,   isUndefined,
  isFunction,
  defineHiddenProp,
  observe,
  reduceFormUpdateValidityCalls,
  getFieldValue,
  assignFieldValue,
} from '../../utils';
import { evalExpression, evalStringExpression } from './utils';
import { Observable,Subscription } from 'rxjs';
import { FormExtension } from '../../models';
import { unregisterControl, registerControl, updateValidity } from '../field-form/utils';


/**
 * Class `FieldExpressionExtension` encapsulating field expression extension data structures and logic in `src/core/form/extensions/field-expression`.
 * @zh 类 `FieldExpressionExtension`，封装 `src/core/form/extensions/field-expression` 中的字段表达式Extension数据结构与处理逻辑。
 */
export class FieldExpressionExtension implements FormExtension {
  /**
   * Executes `onPopulate` to handle on populate.
   * @zh 执行 `onPopulate`，用于当Populate。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  onPopulate(field: FieldConfigCache) {
    if (field._expressions) {
      return;
    }
    // cache built expression
    defineHiddenProp(field, '_expressions', {});
    field.expressionProperties = field.expressionProperties || {};

    observe(field, ['hide'], ({ currentValue, firstChange }) => {
      defineHiddenProp(field, '_hide', !!currentValue);
      if (!firstChange || (firstChange && currentValue === true)) {
        field.hidden = currentValue as boolean;
        field.option._hiddenFieldsForCheck.push(field);
      }
    });

    if (field.hideExpression) {
      observe(field, ['hideExpression'], ({ currentValue: expr }) => {
        field._expressions['hide'] = this.parseExpressions(field, 'hide', typeof expr === 'boolean' ? () => expr : expr);
      });
    }

    for (const key of Object.keys(field.expressionProperties)) {
      observe(field, ['expressionProperties', key], ({ currentValue: expr }) => {
        if (typeof expr === 'string' || isFunction(expr)) {
          field._expressions[key] = this.parseExpressions(field, key, expr);
        } else if (expr instanceof Observable) {
          const subscribe = () =>
            (expr as Observable<unknown>).subscribe((v) => {
              this.evalExpr(field, key, v);
            });

          let subscription: Subscription = null;
          const onInit = field.hooks.onInit;
          field.hooks.onInit = () => {
            if (subscription === null) {
              subscription = subscribe();
            }
            return onInit && onInit(field);
          };

          const onDestroy = field.hooks.onDestroy;
          field.hooks.onDestroy = () => {
            onDestroy && onDestroy(field);
            subscription.unsubscribe();
            subscription = null;
          };
        }
      });
    }
  }

  /**
   * Executes `postPopulate` to handle post populate.
   * @zh 执行 `postPopulate`，用于提交Populate。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  postPopulate(field: FieldConfigCache) {
    if (field.parent) {
      return;
    }

    if (!field.option.checkExpressions) {
      let checkLocked = false;
      field.option.checkExpressions = (f, ignoreCache) => {
        if (checkLocked) {
          return;
        }
        checkLocked = true;
        let form;
        if(f.form){
          form=f.form;
        }else{
          form=f.formControl;
        }
        reduceFormUpdateValidityCalls(form, () => this.checkExpressions(f, ignoreCache));
        const option = field.option;
        option._hiddenFieldsForCheck
          .sort((f) => (f.hide ? -1 : 1))
          .forEach((f) => this.changeHideState(f, f.hide, !ignoreCache));
        option._hiddenFieldsForCheck = [];
        checkLocked = false;
      };
      field.option._checkField = (f, ignoreCache) => {
        // console.warn(`Form: 'option._checkField' is deprecated since v6.0, use 'option.checkExpressions' instead.`);
        field.option.checkExpressions(f, ignoreCache);
      };
    }
  }

  /**
   * Executes `parseExpressions` to handle parse expressions.
   * @zh 执行 `parseExpressions`，用于解析表达式。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   * @param path - path parameter (`string`) / 路径参数（`string`）
   * @param expr - expr parameter (`any`) / expr参数（`any`）
   */
  private parseExpressions(field: FieldConfigCache, path: string, expr) {
    let parentExpression;
    if (field.parent && ['hide', 'disabled'].includes(path)) {
      const rootValue = (f) => {
        return path === 'hide' ? f.hide : f.disabled;
      };

      parentExpression = () => {
        let root = field.parent;
        while (root.parent && !rootValue(root)) {
          root = root.parent;
        }
        return rootValue(root);
      };
    }

    expr = expr || (() => false);
    if (typeof expr === 'string') {
      expr = evalStringExpression(expr, ['model', 'formState', 'field']);
    }

    let currentValue;

    return (ignoreCache?: boolean) => {
      try {
        const exprValue = evalExpression(
          parentExpression ? (...args) => parentExpression(field) || expr(...args) : expr,
          { field },
          [field.model, field.option.formState, field],
        );
        if (
          ignoreCache ||
          (currentValue !== exprValue &&
            (!isObject(exprValue) || JSON.stringify(exprValue) !== JSON.stringify(currentValue)))
        ) {
          currentValue = exprValue;
          this.evalExpr(field, path, exprValue);
          return true;
        }
        return false;
      } catch (error) {
        error.message = `[Form Error] [Expression "${path}"] ${error.message}`;
        throw error;
      }
    };
  }

  /**
   * Executes `checkExpressions` to handle check expressions.
   * @zh 执行 `checkExpressions`，用于检查表达式。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   * @param ignoreCache - ignore cache parameter (`any`) / 忽略缓存参数（`any`）
   */
  private checkExpressions(field: FieldConfigCache, ignoreCache = false) {
    if (!field) {
      return;
    }
    if (field._expressions) {
      for (const key of Object.keys(field._expressions)) {
        field._expressions[key](ignoreCache);
      }
    }
    if (field.fieldGroup) {
      field.fieldGroup.forEach((f) => this.checkExpressions(f, ignoreCache));
    }
  }

  /**
   * Executes `changeDisabledState` to handle change disabled state.
   * @zh 执行 `changeDisabledState`，用于变更已禁用状态。
   * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
   * @param value - value parameter (`boolean`) / 值参数（`boolean`）
   */
  private changeDisabledState(field: FieldConfig, value: boolean) {
    if (field.fieldGroup) {
      field.fieldGroup
        .filter((f) => !f.expressionProperties || !f.expressionProperties.hasOwnProperty('disabled'))
        .forEach((f) => this.changeDisabledState(f, value));
    }
    if (field.name && field.disabled !== value) {
      field.disabled = value;
    }
  }

  /**
   * Executes `changeHideState` to handle change hide state.
   * @zh 执行 `changeHideState`，用于变更隐藏状态。
   * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
   * @param hide - hide parameter (`boolean`) / 隐藏参数（`boolean`）
   * @param resetOnHide - reset on hide parameter (`boolean`) / 重置当隐藏参数（`boolean`）
   */
  private changeHideState(field: FieldConfig, hide: boolean, resetOnHide: boolean) {
    if (field.formControl && field.name) {
      defineHiddenProp(field, '_hide', !!(hide || field.hide));
      const c = field.formControl;
      if (c['_fields'].length > 1) {
        updateValidity(c);
      }
      if (hide === true && c['_fields'].every((f) => !!f._hide)) {
        unregisterControl(field);
        if (resetOnHide && field['autoClear']) {
          field.formControl.reset({ value: undefined, disabled: field.formControl.disabled });
          if (field.fieldGroup) {
            assignFieldValue(field, undefined);
            if (field.formControl instanceof FormArray) {
              field.fieldGroup.length = 0;
            }
          }
        }
      } else if (hide === false) {
        if (field['autoClear'] && !isUndefined(field.defaultValue) && isUndefined(getFieldValue(field))) {
          assignFieldValue(field, field.defaultValue);
        }
        registerControl(field);
        if (field['autoClear'] && field.fieldArray && (field.fieldGroup || []).length !== (field.model || []).length) {
          field.option.build(field);
        }
      }
    }
    if (field.fieldGroup) {
      field.fieldGroup.filter((f) => !f.hideExpression).forEach((f) => this.changeHideState(f, hide, resetOnHide));
    }
    if (field.option.fieldChanges) {
      field.option.fieldChanges.next(<ValueChangeEvent>{ field, type: 'hidden', value: hide });
    }
  }
  /**
   * Executes `evalExpr` to handle eval expr.
   * @zh 执行 `evalExpr`，用于evalExpr。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   * @param prop - prop parameter (`string`) / 属性参数（`string`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  private evalExpr(field: FieldConfigCache, prop: string, value) {
    try {
      let target = field;
      const paths = (prop.indexOf('[') === -1 ? prop : prop.replace(/\[(\w+)\]/g, '.$1')).split('.');
      if (paths.some((p) => p === '__proto__' || p === 'constructor' || p === 'prototype')) {
        return;
      }
      const lastIndex = paths.length - 1;
      for (let i = 0; i < lastIndex; i++) {
        target = target[paths[i]] as FieldConfigCache;
      }
      target[paths[lastIndex]] = value;
    } catch (error) {
      error.message = `[Form Error] [Expression "${prop}"] ${error.message}`;
      throw error;
    }
    if (prop === 'disabled' && field.name) {
      this.changeDisabledState(field, value);
    }
    if (prop.indexOf('model.') === 0) {
      const key = prop.replace(/^model\./, ''),
        control = field.name && field.name === key ? field.formControl : field.form.get(key);
      if (control && !(isNil(control.value) && isNil(value)) && control.value !== value) {
        control.patchValue(value, { emitEvent: false });
      }
    }
    this.emitExpressionChanges(field, prop, value);
  }
  /**
   * Executes `emitExpressionChanges` to handle emit expression changes.
   * @zh 执行 `emitExpressionChanges`，用于发出表达式变更集合。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   * @param property - property parameter (`string`) / 属性参数（`string`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  private emitExpressionChanges(field: FieldConfigCache, property: string, value) {
    if (!field.option.fieldChanges) {
      return;
    }
    field.option.fieldChanges.next({
      field,
      type: 'expressionChanges',
      property,
      value,
    });
  }
}
