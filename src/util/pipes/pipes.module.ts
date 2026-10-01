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
  constructor(
    translateService: TranslationService) {
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
