import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml',
})

export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string): SafeHtml {
    if (!value) {
      return '';
    }
    const cleaned = String(value)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/\s(href|xlink:href|src)\s*=\s*(['"]?)\s*(?:javascript|vbscript):[^>\s'"]*\2/gi, '');
    return this.sanitizer.bypassSecurityTrustHtml(cleaned);
  }
}
