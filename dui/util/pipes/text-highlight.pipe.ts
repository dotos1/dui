

import { Pipe, PipeTransform } from '@angular/core';
import { HighlightTransformService, HighlightTransformResult } from '@dotos/dui/core/services';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor(private highlightTransformService: HighlightTransformService) { }

  transform(text: string, search: string): string {
    const highlightTransformResult: HighlightTransformResult = this.highlightTransformService.highlight(text, search);
    return highlightTransformResult.text;
  }
}
