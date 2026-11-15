/**
 * @fileoverview Module `projects/testdui/src/app/docs/pages/api-reference-page/api-reference-page.component.ts` providing api reference page component definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/pages/api-reference-page/api-reference-page.component.ts`，提供API接口引用页面组件相关的定义与实现。
 */

import { Component, Optional, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TranslationService } from '@dotos/dui/translator';

import { DocsDataService } from '../../services/docs-data.service';
import { ApiExport, ApiInput, ApiMethod, ApiOutput, ApiProperty, ModuleApiFile } from '../../models/api-record.model';
import { preferZh } from '../../util/i18n-text';

/**
 * Angular component `ApiReferencePageComponent` (selector: 'app-api-reference-page') providing api reference page component presentation and interaction in `projects/testdui/src/app/docs/pages/api-reference-page`.
 * @zh Angular 组件 `ApiReferencePageComponent`（selector: 'app-api-reference-page'），提供API接口引用页面组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/pages/api-reference-page`）。
 */
@Component({
  selector: 'app-api-reference-page',
  templateUrl: './api-reference-page.component.html',
  styleUrls: ['./api-reference-page.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ApiReferencePageComponent {
  /**
   * Property `api$` (`Observable<ModuleApiFile | null>`) storing api.
   * @zh 属性 `api$`（类型：`Observable<ModuleApiFile | null>`），用于存储或配置API接口。
   */
  api$: Observable<ModuleApiFile | null>;

  /**
   * Creates an instance of `ApiReferencePageComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ApiReferencePageComponent` 实例，并初始化其依赖项与内部状态。
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
   * Executes `formatParams` to handle format params.
   * @zh 执行 `formatParams`，用于格式化参数集合。
   * @param method - method parameter (`ApiMethod`) / 方法参数（`ApiMethod`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  formatParams(method: ApiMethod): string {
    return method.params.map((p) => `${p.name}: ${p.type}`).join(', ');
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

  /**
   * Executes `descriptionOf` to handle description of.
   * @zh 执行 `descriptionOf`，根据当前激活语言返回成员的中英双语说明。
   * @param item - item parameter (`ApiInput | ApiOutput | ApiMethod | ApiProperty`) / 条目参数（`ApiInput | ApiOutput | ApiMethod | ApiProperty`）
   * @returns Result of type `string | null` / 类型为 `string | null` 的返回值
   */
  descriptionOf(item: ApiInput | ApiOutput | ApiMethod | ApiProperty): string | null {
    return preferZh(item.descriptionZh, item.description, this.translation?.userLang);
  }
}
