/**
 * @fileoverview Module `src/util/pipes/text-highlight.pipe.ts` providing text highlight pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/text-highlight.pipe.ts`，提供文本highlight管道相关的定义与实现。
 */



import { Pipe, PipeTransform } from '@angular/core';
import { HighlightTransformService, HighlightTransformResult } from '@dotos1/dui/core/services';

/**
 * Angular pipe `HighlightPipe` (name: 'highlight') transforming values for highlight pipe display in templates.
 * @zh Angular 管道 `HighlightPipe`（name: 'highlight'），在模板中转换数据以用于Highlight管道展示。
 */
@Pipe({
  name: 'highlight',
  standalone: false
})
export class HighlightPipe implements PipeTransform {

  /**
   * Creates an instance of `HighlightPipe` and initializes its dependencies and internal state.
   * @zh 创建 `HighlightPipe` 实例，并初始化其依赖项与内部状态。
   * @param highlightTransformService - Injected or initial highlight transform service (`HighlightTransformService`) / 注入或传入的highlight转换服务（`HighlightTransformService`）
   */
  constructor(private highlightTransformService: HighlightTransformService) { }

  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param text - text parameter (`string`) / 文本参数（`string`）
   * @param search - search parameter (`string`) / 搜索参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  transform(text: string, search: string): string {
    const highlightTransformResult: HighlightTransformResult = this.highlightTransformService.highlight(text, search);
    return highlightTransformResult.text;
  }
}
