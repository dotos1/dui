import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { FieldConfig } from '@dotos/dui/core/form';
import { getOptionDisabled, getOptionGroup, getOptionLabel, getOptionValue } from './select-option-props';

@Pipe({ name: 'selectOptionsPipe' })
export class SelectOptionsPipe implements PipeTransform {

  transform(options, field?: FieldConfig) {
    if (!(options instanceof Observable)) {
      options = observableOf(options);
    }
    return (options as Observable<any>).pipe(
      map(value => this.toOptions(value, field || {})),
    );
  }

  private toOptions(options, field: FieldConfig) {
    const gOptions: any[] = [],
      groups: { [key: string]: any[] } = {},
      to = field || {};
    if (options != undefined) {
      options.map((option: any) => {
        if (!this.getGroupProp(option, to)) {
          gOptions.push(this.toOption(option, to));
        } else {
          if (!groups[this.getGroupProp(option, to)]) {
            groups[this.getGroupProp(option, to)] = [];
            gOptions.push({
              label: this.getGroupProp(option, to),
              group: groups[this.getGroupProp(option, to)],
            });
          }
          groups[this.getGroupProp(option, to)].push(this.toOption(option, to));
        }
      });
    }
    return gOptions;
  }

  private toOption(item, to) {
    return {
      ...item,
      label: this.getLabelProp(item, to),
      value: this.getValueProp(item, to),
      disabled: this.getDisabledProp(item, to) || false,
    };
  }

  private getLabelProp(item, to): string {
    return getOptionLabel(item, to);
  }

  private getValueProp(item, to): string {
    return getOptionValue(item, to);
  }

  private getDisabledProp(item, to): string {
    return getOptionDisabled(item, to);
  }

  private getGroupProp(item, to): string {
    return getOptionGroup(item, to);
  }
}
