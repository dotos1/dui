
import { Injectable, Injector } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@dotos/dui/translator';
import { Subject } from 'rxjs';
import { NotificationModel } from '../notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  /** @zh 未指定时长时使用的默认提示消息展示时长（毫秒）。 */
  DEFAULT_DURATION_MESSAGE: number = 5000;

  /** @zh 每次显示提示消息时发出（含消息文本与时间戳）。 */
  messages: Subject<NotificationModel> = new Subject();

  constructor(
    private snackBar: MatSnackBar,
        private injector: Injector,

  ) {

  }


  /**
   * Shows a translated message in a Material snack bar (auto-dismissing).
   * @zh 在 Material snack bar 中显示一条已翻译的消息（自动消失）。
   */
  openSnackMessage(message: string, config?: number | MatSnackBarConfig): MatSnackBarRef<any> {
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
  openSnackMessageAction(message: string, action: string, config?: number | MatSnackBarConfig): MatSnackBarRef<any> {
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

  protected showMessage(message: string, panelClass: string, action?: string): MatSnackBarRef<any> {
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
  showError(message: string, action?: string): MatSnackBarRef<any> {
    return this.showMessage(message, 'dui-error-snackbar', action);
  }


  /**
   * Shows a translated info-styled snack bar message.
   * @zh 显示一条提示样式的已翻译 snack bar 消息。
   */
  showInfo(message: string, action?: string): MatSnackBarRef<any> {
    return this.showMessage(message, 'dui-info-snackbar', action);
  }

  /**
   * Shows a translated warning-styled snack bar message.
   * @zh 显示一条警告样式的已翻译 snack bar 消息。
   */
  showWarning(message: string, action?: string): MatSnackBarRef<any> {
    return this.showMessage(message, 'dui-warning-snackbar', action);
  }
}
