/**
 * @fileoverview Module `src/common/clipboard/clipboard.component.ts` providing clipboard component definitions and implementation.
 * @zh 模块文件 `src/common/clipboard/clipboard.component.ts`，提供clipboard组件相关的定义与实现。
 */

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
  /**
   * Property `placeholder` (`string`) storing placeholder.
   * @zh 提示气泡显示的翻译键/文本，默认为 `'CLIPBOARD.CLICK_TO_COPY'`。
   * @zh 提示气泡显示的翻译键/文本，默认为 `'CLIPBOARD.CLICK_TO_COPY'`。
   */
  placeholder: string;

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.placeholder = this.placeholder || 'CLIPBOARD.CLICK_TO_COPY';
  }
}
