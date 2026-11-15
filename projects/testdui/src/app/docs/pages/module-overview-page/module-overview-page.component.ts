/**
 * @fileoverview Module `projects/testdui/src/app/docs/pages/module-overview-page/module-overview-page.component.ts` providing module overview page component definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/pages/module-overview-page/module-overview-page.component.ts`，提供模块overview页面组件相关的定义与实现。
 */

import { Component, Optional, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TranslationService } from '@dotos/dui/translator';

import { DocsDataService } from '../../services/docs-data.service';
import { ApiExport, ModuleApiFile } from '../../models/api-record.model';
import { preferZh } from '../../util/i18n-text';

/**
 * Angular component `ModuleOverviewPageComponent` (selector: 'app-module-overview-page') providing module overview page component presentation and interaction in `projects/testdui/src/app/docs/pages/module-overview-page`.
 * @zh Angular 组件 `ModuleOverviewPageComponent`（selector: 'app-module-overview-page'），提供模块Overview页面组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/pages/module-overview-page`）。
 */
@Component({
  selector: 'app-module-overview-page',
  templateUrl: './module-overview-page.component.html',
  styleUrls: ['./module-overview-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ModuleOverviewPageComponent {
  /**
   * Property `api$` (`Observable<ModuleApiFile | null>`) storing api.
   * @zh 属性 `api$`（类型：`Observable<ModuleApiFile | null>`），用于存储或配置API接口。
   */
  api$: Observable<ModuleApiFile | null>;

  /**
   * Creates an instance of `ModuleOverviewPageComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ModuleOverviewPageComponent` 实例，并初始化其依赖项与内部状态。
   * @param route - Injected or initial route (`ActivatedRoute`) / 注入或传入的route（`ActivatedRoute`）
   * @param docsData - Injected or initial docs data (`DocsDataService`) / 注入或传入的文档数据（`DocsDataService`）
   * @param translation - Optional injected translation service (`TranslationService`) / 可选注入的国际化翻译服务（`TranslationService`）
   */
  constructor(
    private route: ActivatedRoute,
    private docsData: DocsDataService,
    @Optional() private translation?: TranslationService
  ) {
    this.api$ = this.route.parent!.paramMap.pipe(
      switchMap((params) =>
        this.docsData.getModuleApi(params.get('category') as string, params.get('module') as string)
      )
    );
  }

  /**
   * Executes `summaryOf` to handle summary of.
   * @zh 执行 `summaryOf`，根据当前激活语言返回导出项的中英双语摘要。
   * @param item - item parameter (`ApiExport`) / 条目参数（`ApiExport`）
   * @returns Result of type `string | null` / 类型为 `string | null` 的返回值
   */
  summaryOf(item: ApiExport): string | null {
    return preferZh(item.summaryZh, item.summary, this.translation?.userLang);
  }
}
