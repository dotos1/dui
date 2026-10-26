/**
 * @fileoverview Module `src/util/pipes/pipes.module.ts` providing pipes module definitions and implementation.
 * @zh 模块文件 `src/util/pipes/pipes.module.ts`，提供管道模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';

import { KeysPipe } from './keys.pipe';
import { GetByIdPipe } from './getById.pipe';
import { HtmlToPlaintextPipe } from './htmlToPlaintext.pipe';
import { FilterPipe } from './filter.pipe';
import { CamelCaseToDashPipe } from './camelCaseToDash.pipe';
import { BytesPipe } from './bytes.pipe';
import { DigitsPipe } from './digits.pipe';
import { TimeAgoPipe } from './time-ago.pipe';
import { TimeDifferencePipe } from './time-difference.pipe';
import { TruncatePipe } from './truncate.pipe';
import { DecimalNumberPipe } from './decimal-number.pipe';
import { FormatSpacePipe } from './format-space.pipe';
import { LocalizedDatePipe } from './localized-date.pipe';
import { MultiValuePipe } from './multi-value.pipe';
import { HighlightPipe } from './text-highlight.pipe';
import { ClonePipe } from './clone.pipe';
import { SecureImagePipe } from './secure-image.pipe';
import { SanitizeHtmlPipe } from './custom-html.pipe';
import { TranslationService } from '@dotos/dui/translator';
import { SecurePipe } from './secure-pipe';
/**
 * Angular module `DuiPipesModule` declaring and exporting dui pipes module components, directives, pipes, and providers.
 * @zh Angular 模块 `DuiPipesModule`，声明并导出DUI管道模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    KeysPipe,
    ClonePipe,
    GetByIdPipe,
    DecimalNumberPipe,
    HtmlToPlaintextPipe,
    FormatSpacePipe,
    LocalizedDatePipe,
    MultiValuePipe,
    HighlightPipe,
    FilterPipe,
    CamelCaseToDashPipe,
    BytesPipe,
    DigitsPipe,
    TimeAgoPipe,
    TimeDifferencePipe,
    TruncatePipe,
    SecurePipe,
    SanitizeHtmlPipe,
    SecureImagePipe
  ],
  exports:[
    KeysPipe,
    ClonePipe,
    GetByIdPipe,
    DecimalNumberPipe,
    HtmlToPlaintextPipe,
    FormatSpacePipe,
    LocalizedDatePipe,
    MultiValuePipe,
    HighlightPipe,
    FilterPipe,
    CamelCaseToDashPipe,
    BytesPipe,
    DigitsPipe,
    TimeAgoPipe,
    TimeDifferencePipe,
    TruncatePipe,
    SecurePipe,
    SanitizeHtmlPipe,
    SecureImagePipe
  ]
})
export class DuiPipesModule {
  /**
   * Creates an instance of `DuiPipesModule` and initializes its dependencies and internal state.
   * @zh 创建 `DuiPipesModule` 实例，并初始化其依赖项与内部状态。
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   */
  constructor(
    translateService: TranslationService) {
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
