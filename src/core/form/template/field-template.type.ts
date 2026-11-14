/**
 * @fileoverview Module `src/core/form/template/field-template.type.ts` providing field template type definitions and implementation.
 * @zh 模块文件 `src/core/form/template/field-template.type.ts`，提供字段模板类型相关的定义与实现。
 */

import { Component, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FieldType } from './field.type';

/**
 * Angular component `FormTemplateType` (selector: 'form-template') providing form template type presentation and interaction in `src/core/form/template`.
 * @zh Angular 组件 `FormTemplateType`（selector: 'form-template'），提供表单模板类型的视图渲染与交互逻辑（位于 `src/core/form/template`）。
 */
@Component({
  selector: 'form-template',
  template: `<div  [ngClass]="field.htmlClass"  [innerHtml]="template"></div>`,
  encapsulation: ViewEncapsulation.None,
  host: {
    hostID: 'dui-form-template' + Math.random().toString(36).substring(2, 15)
  },
  standalone: false
})
export class FormTemplateType extends FieldType {
  /**
   * Gets the current template (`template: any`).
   * @zh 获取当前模板（`template: any`）。
   */
  get template() {
    if (this.field && (this.field.template !== this.innerHtml.template)) {
      this.innerHtml = {
        template: this.field.template,
        content:  this.field.safeHtml
          ? this.sanitizer.bypassSecurityTrustHtml(this.field.template)
         : this.field.template,
      };
    }
    return this.innerHtml.content;
  }

  /**
   * Property `innerHtml` (`{ content: any; template: any; }`) storing inner html (default: `{ content: null, template: null }`).
   * @zh 属性 `innerHtml`（类型：`{ content: any; template: any; }`），用于存储或配置内部HTML内容（默认值：`{ content: null, template: null }`）。
   */
  private innerHtml = { content: null, template: null };
  /**
   * Creates an instance of `FormTemplateType` and initializes its dependencies and internal state.
   * @zh 创建 `FormTemplateType` 实例，并初始化其依赖项与内部状态。
   * @param sanitizer - Injected or initial sanitizer (`DomSanitizer`) / 注入或传入的安全清理器（`DomSanitizer`）
   */
  constructor(private sanitizer: DomSanitizer) {
    super();
  }
}
