import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clone'
})
export class ClonePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, args?: any): any {
    if (value === undefined || value === null || typeof value !== 'object') {
      return value;
    }

    if (value instanceof Array) {
      return value.map(obj =>
        obj !== null && typeof obj === 'object'
          ? Object.assign(Object.create(Object.getPrototypeOf(obj)), obj)
          : obj
      );
    } else {
      return Object.assign(Object.create(Object.getPrototypeOf(value)), value);
    }
  }
}
