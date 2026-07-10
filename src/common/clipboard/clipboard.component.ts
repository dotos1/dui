import { Component, ViewEncapsulation, OnInit } from '@angular/core';

/**
 * Internal tooltip shown by {@link ClipboardDirective} while hovering over a copyable element.
 * @zh {@link ClipboardDirective} 在悬停可复制元素时显示的内部提示气泡。
 */
@Component({
  selector: 'dui-copy-content-tooltip',
  template: `
        <span class='dui-copy-tooltip'>{{ placeholder|translate }} </span>
        `,
  styleUrls: ['./clipboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClipboardComponent implements OnInit {
  /** @zh 提示气泡显示的翻译键/文本，默认为 `'CLIPBOARD.CLICK_TO_COPY'`。 */
  placeholder: string;

  ngOnInit() {
    this.placeholder = this.placeholder || 'CLIPBOARD.CLICK_TO_COPY';
  }
}
