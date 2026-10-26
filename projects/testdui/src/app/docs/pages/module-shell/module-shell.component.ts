/**
 * @fileoverview Module `projects/testdui/src/app/docs/pages/module-shell/module-shell.component.ts` providing module shell component definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/pages/module-shell/module-shell.component.ts`，提供模块shell组件相关的定义与实现。
 */

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { DocsDataService } from '../../services/docs-data.service';
import { DocsManifestModule } from '../../models/docs-manifest.model';

/**
 * Angular component `ModuleShellComponent` (selector: 'app-module-shell') providing module shell component presentation and interaction in `projects/testdui/src/app/docs/pages/module-shell`.
 * @zh Angular 组件 `ModuleShellComponent`（selector: 'app-module-shell'），提供模块Shell组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/pages/module-shell`）。
 */
@Component({
  selector: 'app-module-shell',
  templateUrl: './module-shell.component.html',
  styleUrls: ['./module-shell.component.scss'],
})
export class ModuleShellComponent {
  /**
   * Property `categoryId$` (`Observable<string>`) storing category id.
   * @zh 属性 `categoryId$`（类型：`Observable<string>`），用于存储或配置分类唯一标识。
   */
  categoryId$: Observable<string>;
  /**
   * Property `moduleId$` (`Observable<string>`) storing module id.
   * @zh 属性 `moduleId$`（类型：`Observable<string>`），用于存储或配置模块唯一标识。
   */
  moduleId$: Observable<string>;
  /**
   * Property `module$` (`Observable<DocsManifestModule | undefined>`) storing module.
   * @zh 属性 `module$`（类型：`Observable<DocsManifestModule | undefined>`），用于存储或配置模块。
   */
  module$: Observable<DocsManifestModule | undefined>;

  /**
   * Creates an instance of `ModuleShellComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ModuleShellComponent` 实例，并初始化其依赖项与内部状态。
   * @param route - Injected or initial route (`ActivatedRoute`) / 注入或传入的route（`ActivatedRoute`）
   * @param docsData - Injected or initial docs data (`DocsDataService`) / 注入或传入的文档数据（`DocsDataService`）
   */
  constructor(private route: ActivatedRoute, private docsData: DocsDataService) {
    this.categoryId$ = this.route.paramMap.pipe(map((params) => params.get('category') as string));
    this.moduleId$ = this.route.paramMap.pipe(map((params) => params.get('module') as string));

    this.module$ = combineLatest([this.categoryId$, this.moduleId$, this.docsData.getManifest()]).pipe(
      map(([categoryId, moduleId, manifest]) => {
        const category = manifest.categories.find((c) => c.id === categoryId);
        return category?.modules.find((m) => m.id === moduleId);
      })
    );
  }
}
