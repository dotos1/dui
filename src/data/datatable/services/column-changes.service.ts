/**
 * @fileoverview Module `src/data/datatable/services/column-changes.service.ts` providing column changes service definitions and implementation.
 * @zh 模块文件 `src/data/datatable/services/column-changes.service.ts`，提供列变更集合服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

/**
 * Injectable Angular service `ColumnChangesService` managing column changes service state and operations in `src/data/datatable/services`.
 * @zh 可注入的 Angular 服务 `ColumnChangesService`，管理 `src/data/datatable/services` 中的列变更集合服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class ColumnChangesService {
  /**
   * Property `columnInputChanges` (`Subject`) storing column input changes (default: `new Subject<void>()`).
   * @zh 属性 `columnInputChanges`（类型：`Subject`），用于存储或配置列输入属性变更集合（默认值：`new Subject<void>()`）。
   */
  private columnInputChanges = new Subject<void>();

  /**
   * Gets the current column input changes (`columnInputChanges$: Observable<void>`).
   * @zh 获取当前列输入属性变更集合（`columnInputChanges$: Observable<void>`）。
   */
  get columnInputChanges$(): Observable<void> {
    return this.columnInputChanges.asObservable();
  }

  /**
   * Executes `onInputChange` to handle on input change.
   * @zh 执行 `onInputChange`，用于当输入属性变更。
   */
  onInputChange(): void {
    this.columnInputChanges.next();
  }
}
