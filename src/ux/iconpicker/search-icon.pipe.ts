/**
 * @fileoverview Module `src/ux/iconpicker/search-icon.pipe.ts` providing search icon pipe definitions and implementation.
 * @zh 模块文件 `src/ux/iconpicker/search-icon.pipe.ts`，提供搜索图标管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';
import { Icon } from '@dotos1/dui/common/icon';

/**
 * Angular pipe `SearchIconPipe` (name: 'searchIcon') transforming values for search icon pipe display in templates.
 * @zh Angular 管道 `SearchIconPipe`（name: 'searchIcon'），在模板中转换数据以用于搜索图标管道展示。
 */
@Pipe({
  name: 'searchIcon',
  standalone: false
})

export class SearchIconPipe implements PipeTransform {
  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param value - value parameter (`Icon[]`) / 值参数（`Icon[]`）
   * @param search - search parameter (`string`) / 搜索参数（`string`）
   * @returns Result of type `Icon[]` / 类型为 `Icon[]` 的返回值
   */
  transform(value: Icon[], search: string) {
    if (!search) {
      return value;
    }
    const searchValue = this.clean(search);

    return value.filter(icon => {
      let keep = false;
      if (icon.name) {
        keep = keep || this.clean(icon.name).includes(searchValue);
      }
      if (icon.id) {
        keep = keep || this.clean(icon.id).includes(searchValue);
      }
      if (icon.filter) {
        keep = keep || icon.filter.some(value => this.clean(value).includes(searchValue));
      }
      if (icon.aliases) {
        keep = keep || icon.aliases.some(value => this.clean(value).includes(searchValue));
      }
      return keep;
    });
  }
  /**
   * Executes `clean` to handle clean.
   * @zh 执行 `clean`，用于清理。
   * @param value - value parameter (`string`) / 值参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  clean(value: string): string {
    if (typeof (value) == 'string') {
      return value.trim().toLowerCase();
    } else {
      return '';
    }
  }
}
