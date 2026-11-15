/**
 * @fileoverview Module `src/util/pipes/filter.pipe.ts` providing filter pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/filter.pipe.ts`，提供过滤管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';
import { Dui } from '@dotos1/dui/core';

/**
 * Angular pipe `FilterPipe` (name: 'filter') transforming values for filter pipe display in templates.
 * @zh Angular 管道 `FilterPipe`（name: 'filter'），在模板中转换数据以用于过滤管道展示。
 */
@Pipe({ name: 'filter', standalone: false })
export class FilterPipe implements PipeTransform {

  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param mainArr - main arr parameter (`any`) / 主Arr参数（`any`）
   * @param searchText - search text parameter (`string`) / 搜索文本参数（`string`）
   * @returns Result of type `unknown[]` / 类型为 `unknown[]` 的返回值
   */
  transform(mainArr, searchText: string) {
    return Dui.filterArrayByString(mainArr, searchText);
  }
}
