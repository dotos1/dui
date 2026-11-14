/**
 * @fileoverview Module `projects/testdui/src/app/docs/pages/docs-home/docs-home.component.ts` providing docs home component definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/pages/docs-home/docs-home.component.ts`，提供文档home组件相关的定义与实现。
 */

import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { DocsDataService } from '../../services/docs-data.service';
import { DocsManifest } from '../../models/docs-manifest.model';
import { getCategoryMeta } from '../../models/category-meta';

/**
 * Angular component `DocsHomeComponent` (selector: 'app-docs-home') providing docs home component presentation and interaction in `projects/testdui/src/app/docs/pages/docs-home`.
 * @zh Angular 组件 `DocsHomeComponent`（selector: 'app-docs-home'），提供文档Home组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/pages/docs-home`）。
 */
@Component({
  selector: 'app-docs-home',
  templateUrl: './docs-home.component.html',
  styleUrls: ['./docs-home.component.scss'],
  standalone: false,
})
export class DocsHomeComponent {
  /**
   * Property `manifest$` (`Observable<DocsManifest>`) storing manifest.
   * @zh 属性 `manifest$`（类型：`Observable<DocsManifest>`），用于存储或配置manifest。
   */
  manifest$: Observable<DocsManifest>;
  /**
   * Property `categoryIcon` (`any`) storing category icon.
   * @zh 属性 `categoryIcon`（类型：`any`），用于存储或配置分类图标。
   */
  readonly categoryIcon = (id: string) => getCategoryMeta(id).icon;
  /**
   * Property `categoryTagline` (`any`) storing category tagline.
   * @zh 属性 `categoryTagline`（类型：`any`），用于存储或配置分类Tagline。
   */
  readonly categoryTagline = (id: string) => getCategoryMeta(id).tagline;

  /**
   * Creates an instance of `DocsHomeComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DocsHomeComponent` 实例，并初始化其依赖项与内部状态。
   * @param docsData - Injected or initial docs data (`DocsDataService`) / 注入或传入的文档数据（`DocsDataService`）
   */
  constructor(private docsData: DocsDataService) {
    this.manifest$ = this.docsData.getManifest();
  }
}
