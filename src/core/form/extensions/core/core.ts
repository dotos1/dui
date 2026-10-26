/**
 * @fileoverview Module `src/core/form/extensions/core/core.ts` providing core definitions and implementation.
 * @zh 模块文件 `src/core/form/extensions/core/core.ts`，提供核心相关的定义与实现。
 */

import { ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import {  FormConfig } from '../../services/form.config';
import { FieldConfigCache,  ValueChangeEvent, FormExtension } from '../../models';
import { getFieldId,  isUndefined, getFieldValue, reverseDeepMerge,   defineHiddenProp,
  clone,
  assignFieldValue, } from '../../utils';


/**
 * Class `CoreExtension` encapsulating core extension data structures and logic in `src/core/form/extensions/core`.
 * @experimental
 * @zh 类 `CoreExtension`，封装 `src/core/form/extensions/core` 中的核心Extension数据结构与处理逻辑。
 */
export class CoreExtension implements FormExtension {
  /**
   * Property `formId` (`number`) storing form id (default: `0`).
   * @zh 属性 `formId`（类型：`number`），用于存储或配置表单唯一标识（默认值：`0`）。
   */
  private formId = 0;
  /**
   * Creates an instance of `CoreExtension` and initializes its dependencies and internal state.
   * @zh 创建 `CoreExtension` 实例，并初始化其依赖项与内部状态。
   * @param config - Injected or initial config (`FormConfig`) / 注入或传入的配置（`FormConfig`）
   */
  constructor(private config: FormConfig) { }

  /**
   * Executes `prePopulate` to handle pre populate.
   * @zh 执行 `prePopulate`，用于prePopulate。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  prePopulate(field: FieldConfigCache) {
    const root = field.parent;
    this.initRootOptions(field);
    if (root) {
      Object.defineProperty(field, 'option', { get: () => root.option, configurable: true });
      Object.defineProperty(field, 'model', {
        get: () => (field.name && field.fieldGroup ? getFieldValue(field) : root.model),
        configurable: true,
      });
    }
    this.getFieldComponentInstance(field).prePopulate();
  }

  /**
   * Executes `onPopulate` to handle on populate.
   * @zh 执行 `onPopulate`，用于当Populate。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  onPopulate(field: FieldConfigCache) {
    this.initFieldOptions(field);
    this.getFieldComponentInstance(field).onPopulate();
    if (field.fieldGroup) {
      field.fieldGroup.forEach((f, index) => {
        if (f) {
          Object.defineProperty(f, 'parent', { get: () => field, configurable: true });
          Object.defineProperty(f, 'index', { get: () => index, configurable: true });
        }
        this.formId++;
      });
    }
  }

  /**
   * Executes `postPopulate` to handle post populate.
   * @zh 执行 `postPopulate`，用于提交Populate。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  postPopulate(field: FieldConfigCache) {
    this.getFieldComponentInstance(field).postPopulate();
  }

  /**
   * Executes `initRootOptions` to handle init root options.
   * @zh 执行 `initRootOptions`，用于初始化根节点配置选项。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  private initRootOptions(field: FieldConfigCache) {
    if (field.parent) {
      return;
    }

    const option = field.option;
    field.option.formState = field.option.formState || {};
    if (!option.showError) {
      option.showError = this.config.extras.showError;
    }

    if (!option.fieldChanges) {
      defineHiddenProp(option, 'fieldChanges', new Subject<ValueChangeEvent>());
    }

    if (!option._hiddenFieldsForCheck) {
      option._hiddenFieldsForCheck = [];
    }

    option._markForCheck = (f) => {
      option.detectChanges(f);
    };

    option.detectChanges = (f: FieldConfigCache) => {
      if (f._componentRefs) {
        f._componentRefs.forEach((ref) => {
          const changeDetectorRef = ref.injector.get(ChangeDetectorRef);
          changeDetectorRef.markForCheck();
        });
      }
      if (f.fieldGroup) {
        f.fieldGroup.forEach((f) => f && option.detectChanges(f));
      }
    };

    option.resetModel = (model?) => {
      model = clone(model ?? option._initialModel);
      if (field.model) {
        Object.keys(field.model).forEach((k) => delete field.model[k]);
        Object.assign(field.model, model || {});
      }

      option.build(field);
      field.form.reset(model);
      if (option.parentForm && option.parentForm.control === field.formControl) {
        (option.parentForm as { submitted: boolean }).submitted = false;
      }
    };

    option.updateInitialValue = () => (option._initialModel = clone(field.model));
    field.option.updateInitialValue();
  }

  /**
   * Executes `initFieldOptions` to handle init field options.
   * @zh 执行 `initFieldOptions`，用于初始化字段配置选项。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  private initFieldOptions(field: FieldConfigCache) {
    let config={
      id: getFieldId(`form_${this.formId}`, field, field['index'] as string | number),
      hooks: {},
      modelOptions: {}
    }
    if( !field.xtype || !field.name){
      config['label']= '';
      config['placeholder']= '';
      config['focused']= false;
      config['disabled']= false;
    }
    reverseDeepMerge(field,config );
    if (this.config.extras.resetFieldOnHide) {
      field['autoClear'] = true;
    }
    if (
      field.xtype !== 'form-template' &&
      (field.template || (field.expressionProperties && field.expressionProperties['template']))
    ) {
      field.xtype = 'form-template';
    }

    if (!field.xtype && field.fieldGroup) {
      field.xtype = 'form-group';
    }

    if (field.xtype) {
      this.config.getMergedField(field);
    }

    if (!isUndefined(field.name) && !isUndefined(field.defaultValue) && isUndefined(getFieldValue(field))) {
      let setDefaultValue = !field['autoClear'] || !(field.hide || field.hideExpression);
      if (setDefaultValue && field['autoClear']) {
        let parent = field.parent;
        while (parent && !parent.hideExpression && !parent.hide) {
          parent = parent.parent;
        }
        setDefaultValue = !parent || !(parent.hideExpression || parent.hide);
      }

      if (setDefaultValue) {
        assignFieldValue(field, field.defaultValue);
      }
    }
    field.wrappers = field.wrappers || [];
  }
  /**
   * Executes `getFieldComponentInstance` to handle get field component instance.
   * @zh 执行 `getFieldComponentInstance`，用于获取字段组件实例。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  private getFieldComponentInstance(field: FieldConfigCache) {
    const componentRef = this.config.resolveFieldTypeRef(field);
    const instance: FormExtension = componentRef ? (componentRef.instance as unknown) : {};
    return {
      prePopulate: () => instance.prePopulate && instance.prePopulate(field),
      onPopulate: () => instance.onPopulate && instance.onPopulate(field),
      postPopulate: () => instance.postPopulate && instance.postPopulate(field),
    };
  }
}
