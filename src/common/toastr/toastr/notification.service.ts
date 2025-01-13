
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@dotos/dui/translator';
import { Subject } from 'rxjs';
import { NotificationModel } from '../notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  DEFAULT_DURATION_MESSAGE: number = 5000;

  messages: Subject<NotificationModel> = new Subject();

  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
  ) {
   
  }


  openSnackMessage(message: string, config?: number | MatSnackBarConfig): MatSnackBarRef<any> {
    if (!config) {
      config = this.DEFAULT_DURATION_MESSAGE;
    }
    const translatedMessage = this.translateService.instant(message);
    if (typeof config === 'number') {
      config = {
        duration: config
      };
    }
    this.messages.next({ message: translatedMessage, dateTime: new Date });
    return this.snackBar.open(translatedMessage, null, config);
  }

  openSnackMessageAction(message: string, action: string, config?: number | MatSnackBarConfig): MatSnackBarRef<any> {
    if (!config) {
      config = this.DEFAULT_DURATION_MESSAGE;
    }
    const translatedMessage = this.translateService.instant(message);
    if (typeof config === 'number') {
      config = {
        duration: config
      };
    }
    this.messages.next({ message: translatedMessage, dateTime: new Date });
    return this.snackBar.open(translatedMessage, action, config);
  }


  dismissSnackMessageAction() {
    return this.snackBar.dismiss();
  }

  protected showMessage(message: string, panelClass: string, action?: string): MatSnackBarRef<any> {
    message = this.translateService.instant(message);

    this.messages.next({ message: message, dateTime: new Date });

    return this.snackBar.open(message, action, {
      duration: this.DEFAULT_DURATION_MESSAGE,
      panelClass
    });
  }

  showError(message: string, action?: string): MatSnackBarRef<any> {
    return this.showMessage(message, 'dui-error-snackbar', action);
  }


  showInfo(message: string, action?: string): MatSnackBarRef<any> {
    return this.showMessage(message, 'dui-info-snackbar', action);
  }

  showWarning(message: string, action?: string): MatSnackBarRef<any> {
    return this.showMessage(message, 'dui-warning-snackbar', action);
  }
}
