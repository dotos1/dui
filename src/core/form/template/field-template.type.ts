import { Component, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FieldType } from './field.type';

@Component({
  selector: 'form-template',
  template: `<div  [ngClass]="field.htmlClass"  [innerHtml]="template"></div>`,
  encapsulation: ViewEncapsulation.None,
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class FormTemplateType extends FieldType {
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

  private innerHtml = { content: null, template: null };
  constructor(private sanitizer: DomSanitizer) {
    super();
  }
}
