/**
 * @fileoverview Module `projects/testdui/src/app/docs/pages/category-page/category-page.component.ts` providing category page component definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/pages/category-page/category-page.component.ts`，提供分类页面组件相关的定义与实现。
 */

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { DocsDataService } from '../../services/docs-data.service';
import { DocsManifestCategory } from '../../models/docs-manifest.model';
import { getCategoryMeta } from '../../models/category-meta';

/**
 * Angular component `CategoryPageComponent` (selector: 'app-category-page') providing category page component presentation and interaction in `projects/testdui/src/app/docs/pages/category-page`.
 * @zh Angular 组件 `CategoryPageComponent`（selector: 'app-category-page'），提供分类页面组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/pages/category-page`）。
 */
@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss'],
  standalone: false,
})
export class CategoryPageComponent {
  /**
   * Property `categoryId$` (`Observable<string>`) storing category id.
   * @zh 属性 `categoryId$`（类型：`Observable<string>`），用于存储或配置分类唯一标识。
   */
  categoryId$: Observable<string>;
  /**
   * Property `category$` (`Observable<DocsManifestCategory | undefined>`) storing category.
   * @zh 属性 `category$`（类型：`Observable<DocsManifestCategory | undefined>`），用于存储或配置分类。
   */
  category$: Observable<DocsManifestCategory | undefined>;
  /**
   * Property `markdown$` (`Observable<string>`) storing markdown.
   * @zh 属性 `markdown$`（类型：`Observable<string>`），用于存储或配置Markdown文档。
   */
  markdown$: Observable<string>;
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
   * Creates an instance of `CategoryPageComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CategoryPageComponent` 实例，并初始化其依赖项与内部状态。
   * @param route - Injected or initial route (`ActivatedRoute`) / 注入或传入的route（`ActivatedRoute`）
   * @param docsData - Injected or initial docs data (`DocsDataService`) / 注入或传入的文档数据（`DocsDataService`）
   */
  constructor(private route: ActivatedRoute, private docsData: DocsDataService) {
    this.categoryId$ = this.route.paramMap.pipe(map((params) => params.get('category') as string));

    this.category$ = this.categoryId$.pipe(
      switchMap((categoryId) =>
        this.docsData
          .getManifest()
          .pipe(map((manifest) => manifest.categories.find((c) => c.id === categoryId)))
      )
    );

    this.markdown$ = this.categoryId$.pipe(
      switchMap((categoryId) => this.docsData.getCategoryMarkdown(categoryId))
    );
  }
}
