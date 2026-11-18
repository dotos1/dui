/**
 * @fileoverview Module `src/common/toastr/toastr/notification.service.ts` providing notification service definitions and implementation.
 * @zh 模块文件 `src/common/toastr/toastr/notification.service.ts`，提供通知服务相关的定义与实现。
 */


import { Injectable, Injector } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@dotos1/dui/translator';
import { Subject } from 'rxjs';
import { NotificationModel } from '../notification.model';

/**
 * Injectable Angular service `NotificationService` managing notification service state and operations in `src/common/toastr/toastr`.
 * @zh 可注入的 Angular 服务 `NotificationService`，管理 `src/common/toastr/toastr` 中的通知服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  /**
   * Property `DEFAULT_DURATION_MESSAGE` (`number`) storing default duration message (default: `5000`).
   * @zh 未指定时长时使用的默认提示消息展示时长（毫秒）。
   * @zh 未指定时长时使用的默认提示消息展示时长（毫秒）。
   */
  DEFAULT_DURATION_MESSAGE: number = 5000;

  /**
   * Property `messages` (`Subject<NotificationModel>`) storing messages (default: `new Subject()`).
   * @zh 每次显示提示消息时发出（含消息文本与时间戳）。
   * @zh 每次显示提示消息时发出（含消息文本与时间戳）。
   */
  messages: Subject<NotificationModel> = new Subject();

  /**
   * Creates an instance of `NotificationService` and initializes its dependencies and internal state.
   * @zh 创建 `NotificationService` 实例，并初始化其依赖项与内部状态。
   * @param snackBar - Injected or initial snack bar (`MatSnackBar`) / 注入或传入的snack条（`MatSnackBar`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
  constructor(
    private snackBar: MatSnackBar,
        private injector: Injector,

  ) {

  }


  /**
   * Shows a translated message in a Material snack bar (auto-dismissing).
   * @zh 在 Material snack bar 中显示一条已翻译的消息（自动消失）。
   */
  openSnackMessage(message: string, config?: number | MatSnackBarConfig) {
    if (!config) {
      config = this.DEFAULT_DURATION_MESSAGE;
    }
    let translateService: TranslateService=this.injector.get(TranslateService);
    const translatedMessage = translateService.instant(message);
    if (typeof config === 'number') {
      config = {
        duration: config
      };
    }
    this.messages.next({ message: translatedMessage, dateTime: new Date });
    return this.snackBar.open(translatedMessage, null, config);
  }

  /**
   * Shows a translated message with an action button in a Material snack bar.
   * @zh 在 Material snack bar 中显示一条带操作按钮的已翻译消息。
   */
  openSnackMessageAction(message: string, action: string, config?: number | MatSnackBarConfig) {
    if (!config) {
      config = this.DEFAULT_DURATION_MESSAGE;
    }
        let translateService: TranslateService=this.injector.get(TranslateService);
    const translatedMessage = translateService.instant(message);
    if (typeof config === 'number') {
      config = {
        duration: config
      };
    }
    this.messages.next({ message: translatedMessage, dateTime: new Date });
    return this.snackBar.open(translatedMessage, action, config);
  }


  /**
   * Dismisses the currently-shown snack bar, if any.
   * @zh 关闭当前正在显示的 snack bar（如果有）。
   */
  dismissSnackMessageAction() {
    return this.snackBar.dismiss();
  }

  /**
   * Executes `showMessage` to handle show message.
   * @zh 执行 `showMessage`，用于显示消息。
   * @param message - message parameter (`string`) / 消息参数（`string`）
   * @param panelClass - panel class parameter (`string`) / 面板类名参数（`string`）
   * @param action - action parameter (`string`) / 动作参数（`string`）
   * @returns Result of type `MatSnackBarRef<TextOnlySnackBar>` / 类型为 `MatSnackBarRef<TextOnlySnackBar>` 的返回值
   */
  protected showMessage(message: string, panelClass: string, action?: string) {
    let translateService: TranslateService=this.injector.get(TranslateService);
    message = translateService.instant(message);

    this.messages.next({ message: message, dateTime: new Date });

    return this.snackBar.open(message, action, {
      duration: this.DEFAULT_DURATION_MESSAGE,
      panelClass
    });
  }

  /**
   * Shows a translated error-styled snack bar message.
   * @zh 显示一条错误样式的已翻译 snack bar 消息。
   */
  showError(message: string, action?: string) {
    return this.showMessage(message, 'dui-error-snackbar', action);
  }


  /**
   * Shows a translated info-styled snack bar message.
   * @zh 显示一条提示样式的已翻译 snack bar 消息。
   */
  showInfo(message: string, action?: string) {
    return this.showMessage(message, 'dui-info-snackbar', action);
  }

  /**
   * Shows a translated warning-styled snack bar message.
   * @zh 显示一条警告样式的已翻译 snack bar 消息。
   */
  showWarning(message: string, action?: string) {
    return this.showMessage(message, 'dui-warning-snackbar', action);
  }
}
