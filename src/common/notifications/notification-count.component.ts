import {
  Component, Input, HostBinding, ChangeDetectionStrategy,
  ViewChild, ElementRef, AfterContentInit
} from '@angular/core';

export enum NotificationCountPositionY {
  Top = 'top',
  Bottom = 'bottom',
  Center = 'center',
}

export enum NotificationCountPositionX {
  Before = 'before',
  After = 'after',
  Center = 'center',
}

export const DEFAULT_NOTIFICATION_LIMIT: number = 99;

/**
 * Small badge overlay (typically on an icon/avatar) showing a notification count or a plain
 * dot indicator, positioned via `positionX`/`positionY`.
 * @zh 小型徽标覆层（通常叠加在图标/头像上），显示通知数量或纯圆点提示，
 * 通过 `positionX`/`positionY` 控制位置。
 */
@Component({
  selector: 'dui-notification-count',
  styleUrls: ['./notification-count.component.scss'],
  templateUrl: './notification-count.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCountComponent implements AfterContentInit {

  private _notifications: number | boolean = 0;
  private _positionY: NotificationCountPositionY;
  private _positionX: NotificationCountPositionX;
  private _limit: number = DEFAULT_NOTIFICATION_LIMIT;

  /**
   * Div content wrapper of `ng-content`.
   */
  @ViewChild('content') content: ElementRef;

  /**
   * color?: "primary" | "accent" | "warn"
   * Sets the theme color of the notification tip. Defaults to "warn"
   */
  @Input() color: 'primary' | 'accent' | 'warn' = 'warn';

  /**
   * positionX?: NotificationCountPositionX or "before" | "after" | "center"
   * Sets the X position of the notification tip.
   * Defaults to "after" if it has content, else 'center'.
   */
  @Input()
  set positionX(positionX: NotificationCountPositionX) {
    this._positionX = positionX;
  }
  /**
   * The current X position of the notification tip.
   * @zh 通知提示的当前 X 轴位置。
   */
  get positionX(): NotificationCountPositionX {
    return this._positionX;
  }

  /**
   * positionY?: NotificationCountPositionY or "top" | "bottom" | "center"
   * Sets the Y position of the notification tip.
   * Defaults to "top" if it has content, else 'center'.
   */
  @Input()
  set positionY(positionY: NotificationCountPositionY) {
    this._positionY = positionY;
  }
  /**
   * The current Y position of the notification tip.
   * @zh 通知提示的当前 Y 轴位置。
   */
  get positionY(): NotificationCountPositionY {
    return this._positionY;
  }

  /**
   * notifications?: number | boolean
   * Number for the notification count. Shows component only if the input is a positive number or 'true'
   */
  @Input()
  set notifications(notifications: number | boolean) {
    this._notifications = notifications;
  }

  /**
   * limit?: number
   * Limit for notification count. If the number of notifications is greater than limit, then + will be added. Defaults to 99.
   */
  @Input()
  set limit(limit: number) {
    this._limit = limit;
  }

  /** @zh 内部使用，当通知提示不显示且无投影内容时隐藏宿主元素。 */
  @HostBinding('class.dui-notification-hidden')
  get hideHost(): boolean {
    return !this.show && !this._hasContent();
  }

  /**
   * Sets the component in its 'noCount' state if [notifications] is a boolean 'true'.
   * Makes the notification tip show without a count.
   */
  get noCount(): string | boolean {
    return this._notifications === true;
  }

  /**
   * Notification display string when a count is available.
   * Anything over 99 gets set as 99+
   */
  get notificationsDisplay(): string {
    const notifications = this._notifications;
    if (typeof notifications === 'number') {
      if (notifications > this._limit) {
        return `${this._limit}+`;
      }
    }
    return notifications.toString();
  }

  /**
   * Shows notification tip only when [notifications] is true or a positive integer.
   */
  get show(): boolean {
    const notifications = this._notifications;
    if (notifications === true) {
      return true;
    }
    if (typeof notifications === 'number') {
      return !isNaN(notifications) && notifications > 0;
    }
    return false;
  }

  /**
   * Check if [positionX] and [positionY] have been set as inputs, else use defaults depending on component content.
   */
  ngAfterContentInit(): void {
    if (!this._positionX) {
      this.positionX = this._hasContent() ? NotificationCountPositionX.After : NotificationCountPositionX.Center;
    }
    if (!this._positionY) {
      this.positionY = this._hasContent() ? NotificationCountPositionY.Top : NotificationCountPositionY.Center;
    }
  }


  private _hasContent(): boolean {
    if (this.content) {
      let contentElement: HTMLElement = this.content.nativeElement;
      return contentElement && (contentElement.children.length > 0 || !!contentElement.textContent.trim());
    }
    return false;
  }

}