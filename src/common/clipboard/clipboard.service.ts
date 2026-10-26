/**
 * @fileoverview Module `src/common/clipboard/clipboard.service.ts` providing clipboard service definitions and implementation.
 * @zh 模块文件 `src/common/clipboard/clipboard.service.ts`，提供clipboard服务相关的定义与实现。
 */


import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LogService } from '@dotos/dui/core/services';
import { ToastrService } from "@dotos/dui/common/toastr";

/**
 * Copies text from an input/textarea element, or arbitrary content, to the system clipboard.
 * Optionally shows a toast notification (via {@link ToastrService}) on success.
 * @zh 将输入框/文本域中的文本，或任意内容，复制到系统剪贴板。可选地在复制成功后显示提示（通过 {@link ToastrService}）。
 */
@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  /**
   * Property `data` (`any`) storing data.
   * @zh 最近一次通过 `copyContentToClipboard` 复制的数据。
   * @zh 最近一次通过 `copyContentToClipboard` 复制的数据。
   */
  data;

  /**
   * Creates an instance of `ClipboardService` and initializes its dependencies and internal state.
   * @zh 创建 `ClipboardService` 实例，并初始化其依赖项与内部状态。
   * @param document - Injected or initial document (`any`) / 注入或传入的文档对象（`any`）
   * @param logService - Injected or initial log service (`LogService`) / 注入或传入的日志服务（`LogService`）
   * @param notificationService - Injected or initial notification service (`ToastrService`) / 注入或传入的通知服务（`ToastrService`）
   */
  constructor(
    @Inject(DOCUMENT) private document,
    private logService: LogService,
    private notificationService: ToastrService) { }


  /**
   * Checks whether the given element can be copied from (must be an enabled input/textarea).
   * @zh 判断目标元素是否可以被复制（必须是未禁用的 input/textarea）。
   */
  isTargetValid(target: HTMLInputElement | HTMLTextAreaElement) {
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      return !target.hasAttribute('disabled');
    }
    return false;
  }


  /**
   * Selects the full text of an input/textarea element and copies it to the clipboard.
   * @zh 选中 input/textarea 元素的全部文本并复制到剪贴板。
   */
  copyToClipboard(target: HTMLInputElement | HTMLTextAreaElement, message?: string) {
    if (this.isTargetValid(target)) {
      try {
        target.select();
        target.setSelectionRange(0, target.value.length);
        this.document.execCommand('copy');
        this.notify(message);
      } catch (error) {
        this.logService.error(error);
      }
    }
  }


  /**
   * Copies arbitrary content (string or object, which is JSON-stringified) to the clipboard,
   * without requiring a source input/textarea element.
   * @zh 将任意内容（字符串或对象，对象会被 JSON 序列化）复制到剪贴板，无需依赖某个 input/textarea 元素。
   */
  copyContentToClipboard(content, message?: string) {
    const handler = (e: ClipboardEvent) => {
      if(typeof(content)!='string'){
        content=JSON.stringify(content);
      }
      e.clipboardData.setData('text/plain', (content));
      e.preventDefault();
    };
    try {
      this.data= content;
      document.addEventListener('copy', handler, { once: true });
      document.execCommand('copy');
      if(message){
        this.notify(message);
      }
    } catch (error) {
      this.logService.error(error);
      document.removeEventListener('copy', handler);
    }
  }

  /**
   * Executes `notify` to handle notify.
   * @zh 执行 `notify`，用于通知。
   * @param message - message parameter (`any`) / 消息参数（`any`）
   */
  private notify(message) {
    if (message) {
      this.notificationService.success(message);
    }
  }

    /**
     * Returns the last data stored via `set`/`copyContentToClipboard`.
     * @zh 返回最近一次通过 `set`/`copyContentToClipboard` 存储的数据。
     */
    get() {
        return this.data;
    }

    /**
     * Stores arbitrary data for later retrieval via `get` (does not touch the system clipboard).
     * @zh 存储任意数据以供之后通过 `get` 读取（不会操作系统剪贴板）。
     */
    set(data) {
        this.data = data;
    }

    /**
     * Clears the internally stored data.
     * @zh 清空内部存储的数据。
     */
    clear() {
        this.data = undefined;
        return this.data;
    }

    /**
     * Whether there is currently no data stored.
     * @zh 当前是否没有存储任何数据。
     */
    isEmpty(): boolean {
        return !this.data;
    }
}
