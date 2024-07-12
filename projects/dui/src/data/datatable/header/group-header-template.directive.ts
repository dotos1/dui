import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dui-datatable-group-header-template]'
})
export class DatatableGroupHeaderTemplateDirective {
  constructor(public template: TemplateRef<any>) { }
}

