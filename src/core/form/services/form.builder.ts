/**
 * @fileoverview Module `src/core/form/services/form.builder.ts` providing form builder definitions and implementation.
 * @zh 模块文件 `src/core/form/services/form.builder.ts`，提供表单构建器相关的定义与实现。
 */

import { Injectable, ComponentFactoryResolver, Injector , Optional } from '@angular/core';
import { FormGroup, FormArray, FormGroupDirective } from '@angular/forms';
import { FormConfig } from './form.config';
import {
  FieldConfig, FormOptions, FieldConfigCache
} from '../models';
import { defineHiddenProp, reduceFormUpdateValidityCalls, observe } from '../utils';
/**
 * Injectable Angular service `FormBuilder` managing form builder state and operations in `src/core/form/services`.
 * @zh 可注入的 Angular 服务 `FormBuilder`，管理 `src/core/form/services` 中的表单构建器状态与业务操作。
 */
@Injectable({ providedIn: 'root' })
export class FormBuilder {
  /**
   * Creates an instance of `FormBuilder` and initializes its dependencies and internal state.
   * @zh 创建 `FormBuilder` 实例，并初始化其依赖项与内部状态。
   * @param config - Injected or initial config (`FormConfig`) / 注入或传入的配置（`FormConfig`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param parentForm - Injected or initial parent form (`FormGroupDirective`) / 注入或传入的父级表单（`FormGroupDirective`）
   */
  constructor(
    private config: FormConfig,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    @Optional() private parentForm: FormGroupDirective,
  ) { }

  /**
   * Executes `buildForm` to handle build form.
   * @zh 执行 `buildForm`，用于构建表单。
   * @param form - form parameter (`FormGroup | FormArray`) / 表单参数（`FormGroup | FormArray`）
   * @param fieldGroup - field group parameter (`FieldConfig[]`) / 字段分组参数（`FieldConfig[]`）
   * @param model - model parameter (`any`) / 模型参数（`any`）
   * @param option - option parameter (`FormOptions`) / 选项参数（`FormOptions`）
   */
  buildForm(form: FormGroup | FormArray, fieldGroup: FieldConfig[] = [], model, option: FormOptions) {
    this.build({ fieldGroup, model, form, option });
  }

  /**
   * Executes `build` to handle build.
   * @zh 执行 `build`，用于构建。
   * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
   */
  build(field: FieldConfig) {
    if (!this.config.extensions['core']) {
      throw new Error('NgxFormly: missing `forRoot()` call. use `forRoot()` when registering the `FormlyModule`.');
    }
    if (!field.parent) {
      this._setOptions(field);
      reduceFormUpdateValidityCalls(field.form, () => this._build(field));
      const option = (field as FieldConfigCache).option;
      option.checkExpressions && option.checkExpressions(field, true);
      option.detectChanges && option.detectChanges(field);
    } else {
      this._build(field);
    }
  }

  /**
   * Executes `_build` to handle build.
   * @zh 执行 `_build`，用于构建。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  private _build(field: FieldConfigCache) {
    if (!field) {
      return;
    }
    this.getExtensions().forEach((extension) => extension.prePopulate && extension.prePopulate(field));
    this.getExtensions().forEach((extension) => extension.onPopulate && extension.onPopulate(field));
    if (field.fieldGroup) {
      field.fieldGroup.forEach((f) => this._build(f));
    }
    this.getExtensions().forEach((extension) => extension.postPopulate && extension.postPopulate(field));
  }

  /**
   * Executes `getExtensions` to handle get extensions.
   * @zh 执行 `getExtensions`，用于获取Extensions。
   */
  private getExtensions() {
    return Object.keys(this.config.extensions).map((name) => this.config.extensions[name]);
  }

  /**
   * Executes `_setOptions` to handle set options.
   * @zh 执行 `_setOptions`，用于集合配置选项。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  private _setOptions(field: FieldConfigCache) {
    field.form = field.form || new FormGroup({});
    field.model = field.model || {};
    field.option = field.option || {};
    const option = field.option;

    if (!option._resolver) {
      defineHiddenProp(option, '_resolver', this.resolver);
    }

    if (!option._injector) {
      defineHiddenProp(option, '_injector', this.injector);
    }

    if (!option.build) {
      option._buildForm = () => {
        this.build(field);
      };
      option.build = (f: FieldConfig) => {
        this.build(f);
        return f;
      };
    }
    if (!option.parentForm && this.parentForm) {
      defineHiddenProp(option, 'parentForm', this.parentForm);
      observe(option as never, ['parentForm', 'submitted'], ({ firstChange }) => {
        if (!firstChange) {
          option.checkExpressions(field);
          option.detectChanges(field);
        }
      });
    }
  }
}
