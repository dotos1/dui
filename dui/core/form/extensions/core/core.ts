import { ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import {  FormConfig } from '../../services/form.config';
import { FieldConfigCache,  ValueChangeEvent, FormExtension } from '../../models';
import { getFieldId,  isUndefined, getFieldValue, reverseDeepMerge,   defineHiddenProp,
  clone,
  assignFieldValue, } from '../../utils';


/** @experimental */
export class CoreExtension implements FormExtension {
  private formId = 0;
  constructor(private config: FormConfig) { }

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

  postPopulate(field: FieldConfigCache) {
    this.getFieldComponentInstance(field).postPopulate();
  }

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

    option.resetModel = (model?: any) => {
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

  private initFieldOptions(field: FieldConfigCache) {
    let config={
      id: getFieldId(`form_${this.formId}`, field, field['index']),
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
  private getFieldComponentInstance(field: FieldConfigCache) {
    const componentRef = this.config.resolveFieldTypeRef(field);
    const instance: FormExtension = componentRef ? (componentRef.instance as any) : {};
    return {
      prePopulate: () => instance.prePopulate && instance.prePopulate(field),
      onPopulate: () => instance.onPopulate && instance.onPopulate(field),
      postPopulate: () => instance.postPopulate && instance.postPopulate(field),
    };
  }
}
