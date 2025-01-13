import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({selector: '[queryInput]'})
export class QueryInputDirective {
  /** Unique name for query input type. */
  @Input()
  get queryInputType(): string { return this._type; }
  set queryInputType(value: string) {
    if (!value) { return; }
    this._type = value;
  }
  private _type: string;

  constructor(public template: TemplateRef<any>) {}
}
