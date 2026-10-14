import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'sanitizeHtml' })
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {
  }
  transform(v: string): SafeHtml {
    if (!v) {
      return '';
    }
    const cleaned = String(v)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/\s(href|xlink:href|src)\s*=\s*(['"]?)\s*(?:javascript|vbscript):[^>\s'"]*\2/gi, '');
    return this._sanitizer.bypassSecurityTrustHtml(cleaned);
  }
}
