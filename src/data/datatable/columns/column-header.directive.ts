import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[dui-datatable-header-template]' })
export class DataTableColumnHeaderDirective {
  constructor(public template: TemplateRef<any>) { }
}
