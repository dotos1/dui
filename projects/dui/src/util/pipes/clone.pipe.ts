import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clone'
})
export class ClonePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, args?: any): any {
    if (value === undefined) {
      return value;
    }

    if (value instanceof Array) {
      return value.map(obj => Object.assign(Object.create(obj), obj));
    } else {
      return Object.assign(Object.create(value), value);
    }
  }
}
