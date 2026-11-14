/**
 * @fileoverview Module `projects/testdui/src/app/docs/shell/nav-tree/nav-tree.component.ts` providing nav tree component definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/shell/nav-tree/nav-tree.component.ts`，提供nav树形控件组件相关的定义与实现。
 */

import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { DocsDataService } from '../../services/docs-data.service';
import { DocsManifest, DocsManifestCategory } from '../../models/docs-manifest.model';
import { getCategoryMeta } from '../../models/category-meta';

/**
 * Angular component `NavTreeComponent` (selector: 'app-nav-tree') providing nav tree component presentation and interaction in `projects/testdui/src/app/docs/shell/nav-tree`.
 * @zh Angular 组件 `NavTreeComponent`（selector: 'app-nav-tree'），提供Nav树形控件组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/shell/nav-tree`）。
 */
@Component({
  selector: 'app-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.scss'],
  standalone: false,
})
export class NavTreeComponent {
  /**
   * Property `manifest$` (`Observable<DocsManifest>`) storing manifest.
   * @zh 属性 `manifest$`（类型：`Observable<DocsManifest>`），用于存储或配置manifest。
   */
  manifest$: Observable<DocsManifest>;

  /**
   * Property `searchQuery` (`string`) storing the current sidebar filter keyword.
   * @zh 属性 `searchQuery`（类型：`string`），用于存储侧边栏实时搜索过滤关键字。
   */
  searchQuery = '';

  /**
   * Property `categoryIcon` (`(id: string) => string`) resolving category icon.
   * @zh 属性 `categoryIcon`（类型：`(id: string) => string`），用于获取分类图标。
   */
  readonly categoryIcon = (id: string) => getCategoryMeta(id).icon;

  /**
   * Property `categoryTagline` (`(id: string) => string`) resolving category tagline.
   * @zh 属性 `categoryTagline`（类型：`(id: string) => string`），用于获取分类简介。
   */
  readonly categoryTagline = (id: string) => getCategoryMeta(id).tagline;

  /**
   * Creates an instance of `NavTreeComponent` and initializes its dependencies and internal state.
   * @zh 创建 `NavTreeComponent` 实例，并初始化其依赖项与内部状态。
   * @param docsData - Injected or initial docs data (`DocsDataService`) / 注入或传入的文档数据（`DocsDataService`）
   */
  constructor(private docsData: DocsDataService) {
    this.manifest$ = this.docsData.getManifest();
  }

  /**
   * Updates `searchQuery` from input event.
   * @zh 处理搜索框输入变更事件并更新过滤关键字。
   * @param event - DOM input event (`Event`) / DOM 输入事件（`Event`）
   */
  onSearchInput(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement)?.value ?? '';
  }

  /**
   * Clears the current search query.
   * @zh 清空当前搜索过滤关键字。
   */
  clearSearch(): void {
    this.searchQuery = '';
  }

  /**
   * Filters manifest categories and their modules by `searchQuery`.
   * @zh 根据 `searchQuery` 关键字实时过滤分类与二级入口模块列表。
   * @param categories - Full list of manifest categories (`DocsManifestCategory[]`) / 完整分类列表（`DocsManifestCategory[]`）
   * @returns Filtered categories (`DocsManifestCategory[]`) / 过滤后的分类列表（`DocsManifestCategory[]`）
   */
  filterCategories(categories: DocsManifestCategory[]): DocsManifestCategory[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return categories;
    }

    const result: DocsManifestCategory[] = [];
    for (const cat of categories) {
      const catMatch =
        cat.id.toLowerCase().includes(q) ||
        cat.importPath.toLowerCase().includes(q) ||
        this.categoryTagline(cat.id).toLowerCase().includes(q);
      const matchedModules = cat.modules.filter(
        (m) => m.id.toLowerCase().includes(q) || m.importPath.toLowerCase().includes(q)
      );

      if (matchedModules.length > 0) {
        result.push({
          ...cat,
          moduleCount: matchedModules.length,
          modules: matchedModules,
        });
      } else if (catMatch) {
        result.push(cat);
      }
    }
    return result;
  }
}
