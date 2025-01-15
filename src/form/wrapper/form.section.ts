import { Component, Inject, Optional, Input, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@dotos/dui/core/form';
import { FormBuilder, FieldConfig, FORM_CONFIG } from '@dotos/dui/core/form';
import { CollapseAnimation } from '@dotos/dui/common/animations';
import { isUndefined } from '@dotos/dui/base';

@Component({
  selector: 'form-section',
  templateUrl: './form-section.html',
  styleUrls: ['./form-section.scss'],
  animations: [CollapseAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class FormSection<F extends FieldConfig = FieldConfig> extends FieldType<F>  {


  @Input() collapsed: boolean = false;

  @Input() style: any;

  @Input() styleClass: string;

  public layout = 'row';

  override defaultOptions: any = {
    defaultValue: [],
  };
  constructor(private el: ElementRef, @Inject(FORM_CONFIG) @Optional() builder?: FormBuilder) {
    super();
    if (builder instanceof FormBuilder) {
      console.warn(`NgxFormly: passing 'FormlyFormBuilder' to '${this.constructor.name}' type is not required anymore, you may remove it!`);
    }
  }
  override init(config) {
    super.init(config);
    if (!isUndefined(config) && !isUndefined(config.collapsed)) {
      this.collapsed = config.collapsed;
    }
  }

  toggle() {
    this.collapsed = !this.collapsed;
  }
}
