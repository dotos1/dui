/**
 * @fileoverview Module `src/ux/editor/modules/menu/menu.service.ts` providing menu service definitions and implementation.
 * @zh 模块文件 `src/ux/editor/modules/menu/menu.service.ts`，提供菜单服务相关的定义与实现。
 */

import { Injectable, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

import { Editor } from '../../Editor';

/**
 * Injectable Angular service `MenuService` managing menu service state and operations in `src/ux/editor/modules/menu`.
 * @zh 可注入的 Angular 服务 `MenuService`，管理 `src/ux/editor/modules/menu` 中的菜单服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root',
})
export class MenuService {
  /**
   * Property `editor` (`Editor`) storing editor.
   * @zh 属性 `editor`（类型：`Editor`），用于存储或配置编辑器。
   */
  editor: Editor;
  /**
   * Property `customMenuRefChange` (`Subject<TemplateRef<unknown>>`) storing custom menu ref change (default: `new Subject<TemplateRef<any>>()`).
   * @zh 属性 `customMenuRefChange`（类型：`Subject<TemplateRef<unknown>>`），用于存储或配置自定义菜单引用变更（默认值：`new Subject<TemplateRef<any>>()`）。
   */
  customMenuRefChange = new Subject<TemplateRef<unknown>>();

  /**
   * Executes `setCustomMenuRef` to handle set custom menu ref.
   * @zh 执行 `setCustomMenuRef`，用于集合自定义菜单引用。
   * @param c - c parameter (`TemplateRef<unknown>`) / c参数（`TemplateRef<unknown>`）
   */
  setCustomMenuRef(c: TemplateRef<unknown>): void {
    this.customMenuRefChange.next(c);
  }
}
