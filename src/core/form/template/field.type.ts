/**
 * @fileoverview Module `src/core/form/template/field.type.ts` providing field type definitions and implementation.
 * @zh 模块文件 `src/core/form/template/field.type.ts`，提供字段类型相关的定义与实现。
 */

import { Input, Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {FieldConfig } from '../models/field.config';

/**
 * Angular directive `FieldType` attaching field type behavior to host DOM elements.
 * @zh Angular 指令 `FieldType`，为宿主 DOM 元素附加字段类型行为。
 */
@Directive()
export abstract class FieldType<F extends FieldConfig = FieldConfig> {

  /**
   * Property `defaultOptions` (`F`) storing default options.
   * @zh 属性 `defaultOptions`（类型：`F`），用于存储或配置默认配置选项。
   */
  defaultOptions?;

  /**
   * Input setter `field` updating field.
   * @zh 输入属性 `field` 的设置器，用于更新字段。
   * @param f - New field value (`F | any`) / 新的字段值（`F | any`）
   */
  @Input()
  set field (f) {
    this._field = f;
  }
  /**
   * Gets the current field (`field: any`).
   * @zh 获取当前字段（`field: any`）。
   */
  get field() {
    return this._field || {};
  }
  /**
   * Property `_field` (`F`) storing field.
   * @zh 属性 `_field`（类型：`F`），用于存储或配置字段。
   */
  protected _field;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param conf - conf parameter (`any`) / conf参数（`any`）
   */
  public init (conf?): void {}

  /**
   * Getter for input property `model` (`any`) returning model.
   * @zh 输入属性 `model`（类型：`any`）的读取器，返回当前模型。
   */
  @Input()
  get model() { return this.field.model; }

  /**
   * Getter for input property `form` (`any`) returning form.
   * @zh 输入属性 `form`（类型：`any`）的读取器，返回当前表单。
   */
  @Input()
  get form() { return <FormGroup> this.field.parent.formControl; }

  /**
   * Getter for input property `option` (`any`) returning option.
   * @zh 输入属性 `option`（类型：`any`）的读取器，返回当前选项。
   */
  @Input()
  get option() { return this.field.option; }

  /**
   * Gets the current name (`name: any`).
   * @zh 获取当前名称（`name: any`）。
   */
  get name() { return this.field.name; }

  /**
   * Gets the current form control (`formControl: any`).
   * @zh 获取当前表单表单控件（`formControl: any`）。
   */
  get formControl() { return this.field.formControl; }

  /**
   * Gets the current show error (`showError: boolean`).
   * @zh 获取当前显示错误（`showError: boolean`）。
   */
  get showError(): boolean { return this.option.showError(this); }

  /**
   * Gets the current id (`id: string`).
   * @zh 获取当前唯一标识（`id: string`）。
   */
  get id(): string { return this.field.id; }

  /**
   * Gets the current form state (`formState: any`).
   * @zh 获取当前表单状态（`formState: any`）。
   */
  get formState() { return this.option.formState || {}; }
}
