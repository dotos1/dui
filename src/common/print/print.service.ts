/**
 * @fileoverview Module `src/common/print/print.service.ts` providing print service definitions and implementation.
 * @zh 模块文件 `src/common/print/print.service.ts`，提供打印服务相关的定义与实现。
 */

import { Input, Output, EventEmitter, Injectable } from '@angular/core';
import { t as i18nT } from '@dotos1/dui/translator';

/**
 * Prints arbitrary HTML content (a string or element) via a hidden iframe or a popup window,
 * with configurable doctype standard and injected stylesheets.
 * @zh 通过隐藏 iframe 或弹出窗口打印任意 HTML 内容（字符串或元素），
 * 可配置文档类型标准（doctype）及注入的样式表。
 */
@Injectable()
export class PrintService {
  /**
   * @zh 打印模式：`'iframe'`（隐藏 iframe）或 `'popup'`（弹出窗口）。
   * @zh 打印模式：`'iframe'`（隐藏 iframe）或 `'popup'`（弹出窗口）。
   */
  @Input() mode: string;
  /**
   * Input property `standard` (`string`) configuring standard.
   * @zh 文档类型标准：`'strict'`、`'loose'` 或 `'html5'`。
   * @zh 文档类型标准：`'strict'`、`'loose'` 或 `'html5'`。
   */
  @Input() standard: string;
  /**
   * Input property `popTitle` (`string`) configuring pop title.
   * @zh 打印窗口的标题。
   * @zh 打印窗口的标题。
   */
  @Input() popTitle: string;
  /**
   * @zh 待打印的 HTML 内容，可以是元素或 HTML 字符串。
   * @zh 待打印的 HTML 内容，可以是元素或 HTML 字符串。
   */
  @Input() printHTML;
  /**
   * @zh 注入打印文档 `<head>` 的内联 CSS 文本。
   * @zh 注入打印文档 `<head>` 的内联 CSS 文本。
   */
  @Input() printStyle: string;
  /**
   * @zh 注入打印文档 `<head>` 的外部样式表 URL 列表。
   * @zh 注入打印文档 `<head>` 的外部样式表 URL 列表。
   */
  @Input() printCSS: string[];
  /**
   * Output event emitter `printComplete` (`any`) firing when print complete occurs.
   * @zh 打印流程完成时发出。
   * @zh 打印流程完成时发出。
   */
  @Output() printComplete;

  /**
   * Property `modes` (`any`) storing modes.
   * @zh 属性 `modes`（类型：`any`），用于存储或配置模式。
   */
  private modes;
  /**
   * Property `standards` (`any`) storing standards.
   * @zh 属性 `standards`（类型：`any`），用于存储或配置standards。
   */
  private standards;
  /**
   * Property `printWindow` (`Window`) storing print window.
   * @zh 属性 `printWindow`（类型：`Window`），用于存储或配置打印窗口。
   */
  private printWindow: Window;
  /**
   * Property `printDoc` (`Document`) storing print doc.
   * @zh 属性 `printDoc`（类型：`Document`），用于存储或配置打印文档。
   */
  private printDoc: Document;

  /**
   * Creates an instance of `PrintService` and initializes its dependencies and internal state.
   * @zh 创建 `PrintService` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    this.modes = {
      iframe: 'iframe',
      popup: 'popup'
    };
    this.standards = {
      strict: 'strict',
      loose: 'loose',
      html5: 'html5'
    };
    this.mode = this.modes.iframe;
    this.standard = this.standards.html5;
    this.popTitle = i18nT('COMMON.PRINT_WINDOW');
    this.printComplete = new EventEmitter(false);
  }

	/**
	 * Executes `write` to handle write.
	 * 写入文档

	 * @zh 写入文档
	 */
  private write() {
    this.printDoc.open();
    this.printDoc.write(`${this.docType()}${this.getHead()}${this.getBody()}`);
    this.printDoc.close();
  }

	/**
	 * 获取DOCTYPE
	 * returns {string}

	 * @zh 获取DOCTYPE
	 */
  private docType(): string {
    if (this.mode === this.modes.iframe) {
      return '';
    }
    if (this.standard === this.standards.html5) {
      return '<!DOCTYPE html>';
    }
    let transitional: string = this.standard === this.standards.loose ? 'Transitional' : '',
      dtd: string = this.standard === this.standards.loose ? 'loose' : 'strict';
    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 ${transitional}//EN" "http://www.w3.org/TR/html4/${dtd}.dtd">`;
  }

	/**
	 * 获取head
	 * returns {string}

	 * @zh 获取head
	 */
  private getHead(): string {
    let styles: string = '',
      links: string = '';
    if (this.printCSS) {
      this.printCSS.forEach((url) => {
        links += `<link href="${url}" rel="stylesheet">`;
      });
    }
    if (this.printStyle) {
      styles = `<style>${this.printStyle}</style>`;
    }
    const escapedTitle = (this.popTitle || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    return `<head><title>${escapedTitle}</title>${styles}${links}</head>`;
  }

	/**
	 * 获取body
	 * returns {string}

	 * @zh 获取body
	 */
  private getBody() {
    let html: string = '';
    if (this.printHTML) {
      if (this.printHTML.outerHTML) {
        html = this.printHTML.outerHTML;
      } else {
        html = this.printHTML;
      }
    }
    return `<body><object id="eNgxPrintWB" style="display: none;" height="0" classid="clsid:8856F961-340A-11D0-A96B-00C04FD705A2"></object>${html}</body>`;
  }

	/**
	 * Executes `startPrint` to handle start print.
	 * 开始打印

	 * @zh 开始打印
	 */
  private startPrint() {
    const timeoutId = setTimeout(() => {
      this.printWindow.focus();
      if (!!window['ActiveXObject'] || 'ActiveXObject' in window) { // IE浏览器
        try {
          this.printWindow['eNgxPrintWB'].ExecWB(7, 1); // IE下增加打印预览
        } catch (e) {
          console.error(e);
        }
      } else {
        this.printWindow.print();
      }
      if (this.mode === this.modes.popup) {
        const timeoutId2 = setTimeout(() => {
          clearTimeout(timeoutId2);
          this.printWindow.close();
        }, 500);
      }
      clearTimeout(timeoutId);
      this.printComplete.emit();
      this.setInputAndTextareaValue(true);
    }, 1000);
  }

	/**
	 * 创建iframe

	 * @zh 创建iframe
	 */
  private createIframe() {
    let oldFrame = document.getElementsByClassName('e-ngx-print-frame');
    if (oldFrame.length > 0) {
      oldFrame[0].parentNode.removeChild(oldFrame[0]);
    }
    try {
      let printIframe = document.createElement('iframe');
      document.body.appendChild(printIframe);
      printIframe.style.position = 'absolute';
      printIframe.style.border = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.left = '0';
      printIframe.style.top = '0';
      printIframe.style.zIndex = '-1';
      printIframe.className = 'e-ngx-print-frame';
      this.printWindow = printIframe.contentWindow;
      this.printDoc = printIframe.contentDocument ? printIframe.contentDocument : (printIframe.contentWindow ? printIframe.contentWindow.document : (printIframe as HTMLIFrameElement & { document?: Document }).document);
    }
    catch (e) {
      throw e + '. iframes may not be supported in this browser.';
    }

    if (!this.printWindow) {
      throw 'Cannot find window.';
    }

    if (!this.printDoc) {
      throw 'Cannot find document.';
    }
  }

	/**
	 * Executes `createPopup` to handle create popup.
	 * 创建弹出窗口

	 * @zh 创建弹出窗口
	 */
  private createPopup() {
    let windowAttr = `location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no`;
    windowAttr += `,width=${window.screen.width},height=${window.screen.height};`;
    windowAttr += ',resizable=yes,personalbar=no,scrollbars=yes';
    let newWin = window.open('', '_blank', windowAttr);
    if (!newWin) {
      return;
    }
    this.printWindow = newWin;
    this.printDoc = newWin.document;
  }


  /**
   * Executes `getPrintWindow` to handle get print window.
   * @zh 执行 `getPrintWindow`，用于获取打印窗口。
   */
  private getPrintWindow() {
    if (this.mode === this.modes.iframe) {
      this.createIframe();
    } else if (this.mode === this.modes.popup) {
      this.createPopup();
    }
  }

	/**
	 * 开始打印
	 * param printHTML 打印的HTML

	 * @zh 开始打印
	 */
  print(printHTML?) {
    this.printHTML = printHTML ? printHTML : this.printHTML;
    if (!this.printHTML.outerHTML) {
      const div: HTMLDivElement = document.createElement('div');
      div.style.position = 'absolute';
      div.style.border = '0';
      div.style.width = '100%';
      div.style.height = '100%';
      div.style.left = '0';
      div.style.top = '0';

      div.innerHTML = this.printHTML;
      this.printHTML = div;
    }
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      this.setInputAndTextareaValue();
      this.getPrintWindow();
      if (!this.printWindow || !this.printDoc) {
        this.setInputAndTextareaValue(true);
        return;
      }
      this.write();
      this.startPrint();
    }, 1000);
  }

	/**
	 * 设置打印文档中输入框和文本域的值
	 * param {boolean} isReset 是否恢复到初始状态

	 * @zh 设置打印文档中输入框和文本域的值
	 */
  setInputAndTextareaValue(isReset: boolean = false) {
    const inputs = this.printHTML.getElementsByTagName('input');
    const excludeTypes: string[] = ['hidden', 'button', 'reset', 'submit']; // 排除的 input 类型
    const textareas = this.printHTML.getElementsByTagName('textarea');
    const selects = this.printHTML.getElementsByTagName('select');
    this.toArray(inputs).forEach((input: HTMLInputElement) => {
      if (excludeTypes.indexOf(input.type) < 0) {
        if (!isReset) {
          if (input.type === 'radio' || input.type === 'checkbox') {
            if (!input.getAttribute('checked') && input.checked) {
              input.setAttribute('isSetValue', 'true'); // 标识 value 是否是打印时设置的，用于打印完之后判断是否删除
              input.setAttribute('checked', input.checked + '');
            }
          } else {
            if (!input.getAttribute('value')) {
              input.setAttribute('isSetValue', 'true'); // 标识 value 是否是打印时设置的，用于打印完之后判断是否删除
              input.setAttribute('value', input.value);
            }
          }
        } else {
          if (input.type === 'radio' || input.type === 'checkbox') {
            if (input.getAttribute('isSetValue')) {
              input.removeAttribute('checked');
              input.removeAttribute('isSetValue');
            }
          } else {
            if (input.getAttribute('isSetValue')) {
              input.removeAttribute('value');
              input.removeAttribute('isSetValue');
            }
          }
        }
      }
    });
    this.toArray(textareas).forEach((textarea: HTMLTextAreaElement) => {
      if (!isReset) {
        if (!textarea.innerHTML) {
          textarea.setAttribute('isSetHtml', 'true'); 
          textarea.textContent = textarea.value;
        }
      } else {
        if (textarea.getAttribute('isSetHtml')) {
          textarea.textContent = '';
          textarea.removeAttribute('isSetHtml');
        }
      }
    });
    this.toArray(selects).forEach((select: HTMLSelectElement) => {
      this.toArray(select.selectedOptions).forEach((option: HTMLOptionElement) => {
        if (!isReset) {
          if (!option.getAttribute('selected')) {
            option.setAttribute('isSetValue', 'true'); 
            option.setAttribute('selected', 'true');
          }
        } else {
          if (option.getAttribute('isSetValue')) {
            option.removeAttribute('selected');
            option.removeAttribute('isSetValue');
          }
        }
      });
    });
  }

	/**
	 * 将类数组转换成数组
	 * param arr
	 * returns {any[]}

	 * @zh 将类数组转换成数组
	 */
  toArray(arr) {
    return arr ? Array.prototype.slice.call(arr, 0) : [];
  }
}
