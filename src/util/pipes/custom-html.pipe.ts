import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { sanitizeHtmlString } from '@dotos/dui/base';

@Pipe({ name: 'sanitizeHtml' })
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {
  }
  transform(v: string): SafeHtml {
    if (!v) {
      return '';
    }
    // 在 DOM 上净化,不用正则(b8c5e5c 复核,原因见 sanitize-dom.ts):
    // 正则会把正文里的 `onset = 5` 当成事件属性删掉,也拦不住带空白/实体的
    // javascript: 链接。style 保留 —— 这里放行的是可信的富文本,不走 Angular
    // 的默认净化正是为了留住 style。
    return this._sanitizer.bypassSecurityTrustHtml(sanitizeHtmlString(String(v)));
  }
}
