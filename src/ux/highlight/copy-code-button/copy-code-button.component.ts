/**
 * @fileoverview Module `src/ux/highlight/copy-code-button/copy-code-button.component.ts` providing copy code button component definitions and implementation.
 * @zh 模块文件 `src/ux/highlight/copy-code-button/copy-code-button.component.ts`，提供复制编码按钮组件相关的定义与实现。
 */

import { Component,  Input, ViewChild, HostListener } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

/**
 * Interface `ICopyCodeTooltips` defining the contract and properties for i copy code tooltips.
 * @zh 接口 `ICopyCodeTooltips`，定义I复制编码悬浮提示的数据结构契约与属性规范。
 */
export interface ICopyCodeTooltips {
  /**
   * Property `copy` (`string`) storing copy.
   * @zh 属性 `copy`（类型：`string`），用于存储或配置复制。
   */
  copy?: string;
  /**
   * Property `copied` (`string`) storing copied.
   * @zh 属性 `copied`（类型：`string`），用于存储或配置copied。
   */
  copied?: string;
}
/**
 * Angular component `CopyCodeButtonComponent` (selector: 'copy-code-button') providing copy code button component presentation and interaction in `src/ux/highlight/copy-code-button`.
 * @zh Angular 组件 `CopyCodeButtonComponent`（selector: 'copy-code-button'），提供复制编码按钮组件的视图渲染与交互逻辑（位于 `src/ux/highlight/copy-code-button`）。
 */
@Component({
  selector: 'copy-code-button',
  templateUrl: './copy-code-button.component.html',
  
})
export class CopyCodeButtonComponent {

  /**
   * Input property `copiedContent` (`string`) configuring copied content.
   * @zh 输入属性 `copiedContent`（类型：`string`），用于配置copied内容。
   */
  @Input() copiedContent: string;

  /**
   * Input property `copyCodeToClipboard` (`boolean`) configuring copy code to clipboard (default: `false`).
   * @zh 输入属性 `copyCodeToClipboard`（类型：`boolean`），用于配置复制编码转换为Clipboard（默认值：`false`）。
   */
  @Input() copyCodeToClipboard: boolean = false;
  /**
   * copyCodeTooltips?: ICopyCodeTooltips
   *
   * Tooltips for copy button to copy and upon copying.

   * @zh 输入属性 `copyCodeTooltips`（类型：`ICopyCodeTooltips`），用于配置复制编码悬浮提示（默认值：`{}`）。
   */
  @Input() copyCodeTooltips: ICopyCodeTooltips = {};

  /**
   * Gets the current copy tooltip (`copyTooltip: string`).
   * @zh 获取当前复制悬浮提示（`copyTooltip: string`）。
   */
  get copyTooltip(): string {
    return (this.copyCodeTooltips && this.copyCodeTooltips.copy) || 'Copy';
  }

  /**
   * Gets the current copied tooltip (`copiedTooltip: string`).
   * @zh 获取当前copied悬浮提示（`copiedTooltip: string`）。
   */
  get copiedTooltip(): string {
    return (this.copyCodeTooltips && this.copyCodeTooltips.copied) || 'Copied';
  }

  /**
   * Template/content query reference `tooltip` (`MatTooltip`) targeting tooltip.
   * @zh 模板/内容视图查询引用 `tooltip`（`@ViewChild`），指向悬浮提示。
   */
  @ViewChild('tooltip') tooltip: MatTooltip;

  /**
   * Executes `textCopied` to handle text copied.
   * @zh 执行 `textCopied`，用于文本Copied。
   * @param event - event parameter (`boolean`) / 事件参数（`boolean`）
   */
  textCopied(event: boolean): void {
    if (event) {
      this.tooltip.hide();
      this.tooltip.message = this.copiedTooltip;
      this.tooltip.show();
    }
  }
  /**
   * Host event listener `initializeTooltip` handling `mouseleave` events for initialize tooltip.
   * @zh 宿主事件监听方法 `initializeTooltip`，响应 `mouseleave` 事件以处理初始化悬浮提示。
   */
  @HostListener('mouseleave')
  initializeTooltip(): void {
    setTimeout(() => {
      this.tooltip.message = this.copyTooltip;
    }, 200);
  }
}
