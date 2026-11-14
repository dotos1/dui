/**
 * @fileoverview Module `src/common/print/print.directive.ts` providing print directive definitions and implementation.
 * @zh 模块文件 `src/common/print/print.directive.ts`，提供打印指令相关的定义与实现。
 */

import { Directive, HostListener, Input } from '@angular/core';
/**
 * Attach to a clickable element to print the contents of another element (identified by
 * `printSectionId`) in a new popup window, optionally with custom styles/stylesheets.
 * @zh 附加到可点击元素上，点击后在新弹出窗口中打印指定元素（由 `printSectionId` 标识）的内容，
 * 可选附带自定义样式/样式表。
 */
@Directive({
  selector: "button[duiPrint]",
  standalone: false
})
export class PrintDirective {

  /**
   * Property `_printStyle` (`any[]`) storing print style (default: `[]`).
   * @zh 属性 `_printStyle`（类型：`any[]`），用于存储或配置打印样式（默认值：`[]`）。
   */
  public _printStyle = [];

  /**
   * The `id` of the element whose contents should be printed.
   * @zh 需要打印其内容的元素的 `id`。
   */
  @Input() printSectionId: string;

  /**
   * The title shown in the print popup window.
   * @zh 打印弹出窗口中显示的标题。
   */
  @Input() printTitle: string;

  /**
   * Whether to copy the current page's existing `<style>`/`<link>` tags into the print window.
   * @zh 是否将当前页面已有的 `<style>`/`<link>` 标签复制到打印窗口中。
   */
  @Input() useExistingCss = false;

  /**
   * A delay in milliseconds to force the print dialog to wait before opened. Default: 0
   *
   * @memberof NgxPrintDirective

   * @zh 输入属性 `printDelay`（类型：`number`），用于配置打印延迟（默认值：`0`）。
   */
  @Input() printDelay: number = 0;

  /**
   * CSS rules to inject into the print window, keyed by selector
   * (e.g. `{'.foo': {color: 'red'}}`).
   * @zh 注入到打印窗口中的 CSS 规则，按选择器分组（如 `{'.foo': {color: 'red'}}`）。
   */
  @Input()
  set printStyle(values: { [key: string]: { [key: string]: string } }) {
    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        this._printStyle.push((key + JSON.stringify(values[key])).replace(/['"]+/g, ''));
      }
    }
    this.returnStyleValues();
  }

  /**
   * Builds the `<style>` tag markup from the accumulated `printStyle` rules.
   * @zh 根据累积的 `printStyle` 规则构建 `<style>` 标签标记。
   */
  public returnStyleValues() {
    return `<style> ${this._printStyle.join(' ').replace(/,/g, ';')} </style>`;
  }

  /**
   *
   *
   * @returns html for the given tag
   *
   * @memberof NgxPrintDirective

   * @zh 属性 `_styleSheetFile`（类型：`string`），用于存储或配置样式Sheet文件（默认值：`''`）。
   */
  private _styleSheetFile = '';

  /**
   * One or more comma-separated external stylesheet URLs to `<link>` into the print window.
   * @zh 一个或多个以逗号分隔的外部样式表 URL，会以 `<link>` 形式注入打印窗口。
   */
  @Input()
  set styleSheetFile(cssList: string) {
    let linkTagFn = function (cssFileName) {
      return `<link rel="stylesheet" type="text/css" href="${cssFileName}">`;
    }
    if (cssList.indexOf(',') !== -1) {
      const valueArr = cssList.split(',');
      for (let val of valueArr) {
        this._styleSheetFile = this._styleSheetFile + linkTagFn(val);
      }
    } else {
      this._styleSheetFile = linkTagFn(cssList);
    }
  }

  /**
   * @returns string which contains the link tags containing the css which will
   * be injected later within <head></head> tag.
   *

   * @zh 执行 `returnStyleSheetLinkTags`，用于return样式Sheet链接标签。
   */
  private returnStyleSheetLinkTags() {
    return this._styleSheetFile;
  }
  /**
   * Executes `getElementTag` to handle get element tag.
   * @zh 执行 `getElementTag`，用于获取元素标签。
   * @param tag - tag parameter (`keyof HTMLElementTagNameMap`) / 标签参数（`keyof HTMLElementTagNameMap`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private getElementTag(tag: keyof HTMLElementTagNameMap): string {
    const html: string[] = [];
    const elements = document.getElementsByTagName(tag);
    for (let index = 0; index < elements.length; index++) {
      html.push(elements[index].outerHTML);
    }
    return html.join('\r\n');
  }

  /**
   * @returns html section to be printed along with some associated inputs
   *

   * @zh 执行 `getHtmlContents`，用于获取HTML内容内容。
   */
  private getHtmlContents() {
    let printContents = document.getElementById(this.printSectionId);
    if (!printContents) {
      return '';
    }
    const clonedContents = printContents.cloneNode(true) as HTMLElement;
    const origInputs = printContents.getElementsByTagName('input');
    const clonedInputs = clonedContents.getElementsByTagName('input');
    for (let i = 0; i < origInputs.length; i++) {
      clonedInputs[i].defaultValue = origInputs[i].value;
    }
    const origTextareas = printContents.getElementsByTagName('textarea');
    const clonedTextareas = clonedContents.getElementsByTagName('textarea');
    for (let i = 0; i < origTextareas.length; i++) {
      clonedTextareas[i].textContent = origTextareas[i].value;
    }
    return clonedContents.innerHTML;
  }

  /**
   * @hidden Handles a click on the host element by opening a popup window and printing
   * the target section's contents.
   * @zh 内部使用，处理宿主元素上的点击事件：打开弹出窗口并打印目标区域的内容。
   */
  @HostListener('click')
  public print(): void {
    let printContents, popupWin, styles = '', links = '';

    if (this.useExistingCss) {
      styles = this.getElementTag('style');
      links = this.getElementTag('link');
    }

    printContents = this.getHtmlContents();
    popupWin = window.open("", "_blank", "top=0,left=0,height=auto,width=auto");
    if (!popupWin) {
      return;
    }
    const escapedTitle = (this.printTitle ? this.printTitle : "")
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>${escapedTitle}</title>
          ${this.returnStyleValues()}
          ${this.returnStyleSheetLinkTags()}
          ${styles}
          ${links}
        </head>
        <body>
          ${printContents}
          <script defer>
            function triggerPrint(event) {
              window.removeEventListener('load', triggerPrint, false);
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 0);
              }, ${Number(this.printDelay) || 0});
            }
            window.addEventListener('load', triggerPrint, false);
          </script>
        </body>
      </html>`);
    popupWin.document.close();
  }
}
