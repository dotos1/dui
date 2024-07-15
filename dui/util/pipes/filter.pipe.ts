import { Pipe, PipeTransform } from '@angular/core';
import { Dui } from '@dotos/dui/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {

  transform(mainArr: any[], searchText: string): any {
    return Dui.filterArrayByString(mainArr, searchText);
  }
}
