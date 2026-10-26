/**
 * @fileoverview Module `src/core/form/template/field.wrapper.ts` providing field wrapper definitions and implementation.
 * @zh 模块文件 `src/core/form/template/field.wrapper.ts`，提供字段包装器相关的定义与实现。
 */

import { ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { FieldType } from './field.type';
import { FieldConfig } from '../models/field.config';

/**
 * Angular directive `FieldWrapper` attaching field wrapper behavior to host DOM elements.
 * @zh Angular 指令 `FieldWrapper`，为宿主 DOM 元素附加字段包装器行为。
 */
@Directive()
export abstract class FieldWrapper<F extends FieldConfig = FieldConfig> extends FieldType<F> {
  /**
   * Template/content query reference `fieldComponent` (`@ViewChild`) targeting field component.
   * @zh 模板/内容视图查询引用 `fieldComponent`（`@ViewChild`），指向字段组件。
   */
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;
}
