import { Component, AfterViewInit, ViewChildren, QueryList,  ChangeDetectionStrategy } from '@angular/core';
import * as _ from 'lodash';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatField } from '../base/mat.field';

@Component({
  selector: 'checkbox-group',
  styleUrls: ['./checkboxgroup.component.scss'],
  templateUrl: './checkboxgroup.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckboxGroupField extends MatField implements AfterViewInit {

  @ViewChildren(MatCheckbox) checkboxes!: QueryList<MatCheckbox>;

  override defaultOptions = {
    hideFieldUnderline: true,
    floatLabel: 'always',
    options: [],
    color: 'accent',
  };

  public align = 'start';

  public labelPosition = 'after';

  public vertical = false;

  public readonly = false;

  override init() {
    super.init();
      this.field.validation.messages['required'] = this.field.blankText ?
      this.translate.instant(this.field.blankText) : this.translate.instant("FORM.LEASTSELECT")
  }

  onChange(option: any, event) {
    if (this.field.type === 'array') {
      let val = this.formControl.value || [];
      if (event.checked) {
        if (!_.includes(val, option.value)) {
          val.push(option.value);
        }
      } else {
        if (_.includes(val, option.value)) {
          _.remove(val, function (v) {
            return v === option.value;
          });
        }
      }

      this.formControl.patchValue(val);
      if (this.model) {
        this.model[this.name] = val;
      }
    } else {
      this.formControl.patchValue({ ...this.formControl.value, [option.value]: event.checked });
    }
    this.formControl.markAsTouched();
    if (this.field.aferChange) {
      option.checked = event.checked;
      this.field.aferChange(option, this);
    }
  }

  override onContainerClick(event: MouseEvent): void {
    if (this.checkboxes.length) {
      this.checkboxes.first.focus();
    }
    super.onContainerClick(event);
  }
}
