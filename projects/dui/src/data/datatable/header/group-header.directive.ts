import { Input, Output, EventEmitter, Directive, TemplateRef, ContentChild } from '@angular/core';
import { DatatableGroupHeaderTemplateDirective } from './group-header-template.directive';

@Directive({ selector: 'dui-datatable-group-header' })
export class DatatableGroupHeaderDirective {

  @Input() rowHeight: number | ((group?: any, index?: number) => number) = 0;

  @Input('template')
  _templateInput: TemplateRef<any>;

  @ContentChild(DatatableGroupHeaderTemplateDirective, { read: TemplateRef, static: true })
  _templateQuery: TemplateRef<any>;

  get template(): TemplateRef<any> {
    return this._templateInput || this._templateQuery;
  }

  /**
   * Track toggling of group visibility
   */
  @Output() toggle: EventEmitter<any> = new EventEmitter();

  /**
   * Toggle the expansion of a group
   */
  toggleExpandGroup(group: any): void {
    this.toggle.emit({
      type: 'group',
      value: group
    });
  }

  /**
   * Expand all groups
   */
  expandAllGroups(): void {
    this.toggle.emit({
      type: 'all',
      value: true
    });
  }

  /**
   * Collapse all groups
   */
  collapseAllGroups(): void {
    this.toggle.emit({
      type: 'all',
      value: false
    });
  }
}
