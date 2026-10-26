/**
 * @fileoverview Module `src/core/form/template/form.validation-message.ts` providing form validation message definitions and implementation.
 * @zh 模块文件 `src/core/form/template/form.validation-message.ts`，提供表单校验消息相关的定义与实现。
 */

import { Component, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { FormConfig } from '../services/form.config';
import {  FieldConfig } from '../models/field.config';
import { isObject } from '../utils';
import { Observable, isObservable, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { TranslateService } from '@dotos/dui/translator';


/**
 * Angular component `ValidationMessage` (selector: 'validation-message') providing validation message presentation and interaction in `src/core/form/template`.
 * @zh Angular 组件 `ValidationMessage`（selector: 'validation-message'），提供校验消息的视图渲染与交互逻辑（位于 `src/core/form/template`）。
 */
@Component({
  selector: 'validation-message',
  template: `{{ errorMessage$ | async }}`,
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    hostID: 'dui-validation-message' + Math.random().toString(36).substring(2, 15)
  }
})
export class ValidationMessage implements OnChanges {
  /**
   * Input property `field` (`FieldConfig`) configuring field.
   * @zh 输入属性 `field`（类型：`FieldConfig`），用于配置字段。
   */
  @Input() field: FieldConfig;
  /**
   * Property `errorMessage$` (`Observable<any>`) storing error message.
   * @zh 属性 `errorMessage$`（类型：`Observable<any>`），用于存储或配置错误消息。
   */
  errorMessage$;

  /**
   * Creates an instance of `ValidationMessage` and initializes its dependencies and internal state.
   * @zh 创建 `ValidationMessage` 实例，并初始化其依赖项与内部状态。
   * @param formConfig - Injected or initial form config (`FormConfig`) / 注入或传入的表单配置（`FormConfig`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   */
  constructor(private formConfig: FormConfig,
    protected translate: TranslateService) {}

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
  ngOnChanges() {
    this.errorMessage$ = this.field.formControl.statusChanges.pipe(
      startWith(null),
      switchMap(() => (isObservable(this.errorMessage) ? this.errorMessage : of(this.errorMessage))),
    );
  }

  // eslint-disable-next-line getter-return
  /**
   * Gets the current error message (`errorMessage: any`).
   * @zh 获取当前错误消息（`errorMessage: any`）。
   */
  get errorMessage() {
    const fieldForm = this.field.formControl;
    for (const error in fieldForm.errors) {
      if (fieldForm.errors.hasOwnProperty(error)) {
        let message = this.formConfig.getValidatorMessage(error);
        if (isObject(fieldForm.errors[error])) {
          if (fieldForm.errors[error].errorPath) {
            // eslint-disable-next-line getter-return
            return ;
          }
          if (fieldForm.errors[error].message) {
            message = fieldForm.errors[error].message;
          }
        }

        if (this.field.validation && this.field.validation.messages && this.field.validation.messages[error]) {
          message = this.field.validation.messages[error];
        }

        if (this.field.validators && this.field.validators[error] && this.field.validators[error].message) {
          message = this.field.validators[error].message;
        }

        if (
          this.field.asyncValidators &&
          this.field.asyncValidators[error] &&
          this.field.asyncValidators[error].message
        ) {
          message = this.field.asyncValidators[error].message;
        }
        if (typeof message === 'function') {
          return message(fieldForm.errors[error], this.field);
        }
        return message?this.translate.instant(message):'';
      }
    }
  }
}
