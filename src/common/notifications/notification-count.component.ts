/**
 * @fileoverview Module `src/common/notifications/notification-count.component.ts` providing notification count component definitions and implementation.
 * @zh 模块文件 `src/common/notifications/notification-count.component.ts`，提供通知计数组件相关的定义与实现。
 */

import {
  Component, Input, HostBinding, ChangeDetectionStrategy,
  ViewChild, ElementRef, AfterContentInit
} from '@angular/core';

/**
 * Enumeration `NotificationCountPositionY` defining supported notification count position y constants.
 * @zh 枚举 `NotificationCountPositionY`，定义支持的通知计数位置Y坐标常量集合。
 */
export enum NotificationCountPositionY {
  /**
   * Enum member `NotificationCountPositionY.Top` = 'top' representing top.
   * @zh 枚举项 `NotificationCountPositionY.Top` = 'top'，表示顶部位置。
   */
  Top = 'top',
  /**
   * Enum member `NotificationCountPositionY.Bottom` = 'bottom' representing bottom.
   * @zh 枚举项 `NotificationCountPositionY.Bottom` = 'bottom'，表示底部位置。
   */
  Bottom = 'bottom',
  /**
   * Enum member `NotificationCountPositionY.Center` = 'center' representing center.
   * @zh 枚举项 `NotificationCountPositionY.Center` = 'center'，表示居中。
   */
  Center = 'center',
}

/**
 * Enumeration `NotificationCountPositionX` defining supported notification count position x constants.
 * @zh 枚举 `NotificationCountPositionX`，定义支持的通知计数位置X坐标常量集合。
 */
export enum NotificationCountPositionX {
  /**
   * Enum member `NotificationCountPositionX.Before` = 'before' representing before.
   * @zh 枚举项 `NotificationCountPositionX.Before` = 'before'，表示之前。
   */
  Before = 'before',
  /**
   * Enum member `NotificationCountPositionX.After` = 'after' representing after.
   * @zh 枚举项 `NotificationCountPositionX.After` = 'after'，表示之后。
   */
  After = 'after',
  /**
   * Enum member `NotificationCountPositionX.Center` = 'center' representing center.
   * @zh 枚举项 `NotificationCountPositionX.Center` = 'center'，表示居中。
   */
  Center = 'center',
}

/**
 * Constant/variable `DEFAULT_NOTIFICATION_LIMIT` defining default notification limit in `src/common/notifications`.
 * @zh 常量/变量 `DEFAULT_NOTIFICATION_LIMIT`，定义 `src/common/notifications` 中的默认通知限制。
 */
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
  standalone: false,
})
export class NotificationCountComponent implements AfterContentInit {

  /**
   * Property `_notifications` (`number | boolean`) storing notifications (default: `0`).
   * @zh 属性 `_notifications`（类型：`number | boolean`），用于存储或配置通知（默认值：`0`）。
   */
  private _notifications: number | boolean = 0;
  /**
   * Property `_positionY` (`NotificationCountPositionY`) storing position y.
   * @zh 属性 `_positionY`（类型：`NotificationCountPositionY`），用于存储或配置位置Y坐标。
   */
  private _positionY: NotificationCountPositionY;
  /**
   * Property `_positionX` (`NotificationCountPositionX`) storing position x.
   * @zh 属性 `_positionX`（类型：`NotificationCountPositionX`），用于存储或配置位置X坐标。
   */
  private _positionX: NotificationCountPositionX;
  /**
   * Property `_limit` (`number`) storing limit (default: `DEFAULT_NOTIFICATION_LIMIT`).
   * @zh 属性 `_limit`（类型：`number`），用于存储或配置限制（默认值：`DEFAULT_NOTIFICATION_LIMIT`）。
   */
  private _limit: number = DEFAULT_NOTIFICATION_LIMIT;

  /**
   * Div content wrapper of `ng-content`.

   * @zh 模板/内容视图查询引用 `content`（`@ViewChild`），指向内容。
   */
  @ViewChild('content') content: ElementRef;

  /**
   * color?: "primary" | "accent" | "warn"
   * Sets the theme color of the notification tip. Defaults to "warn"

   * @zh 输入属性 `color`（类型：`"primary" | "accent" | "warn"`），用于配置颜色（默认值：`'warn'`）。
   */
  @Input() color: 'primary' | 'accent' | 'warn' = 'warn';

  /**
   * positionX?: NotificationCountPositionX or "before" | "after" | "center"
   * Sets the X position of the notification tip.
   * Defaults to "after" if it has content, else 'center'.

   * @zh 输入属性 `positionX` 的设置器，用于更新位置X坐标。
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

   * @zh 输入属性 `positionY` 的设置器，用于更新位置Y坐标。
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

   * @zh 输入属性 `notifications` 的设置器，用于更新通知。
   */
  @Input()
  set notifications(notifications: number | boolean) {
    this._notifications = notifications;
  }

  /**
   * limit?: number
   * Limit for notification count. If the number of notifications is greater than limit, then + will be added. Defaults to 99.

   * @zh 输入属性 `limit` 的设置器，用于更新限制。
   */
  @Input()
  set limit(limit: number) {
    this._limit = limit;
  }

  /**
   * Host-bound getter `hideHost` (`boolean`) computing hide host.
   * @zh 内部使用，当通知提示不显示且无投影内容时隐藏宿主元素。
   * @zh 内部使用，当通知提示不显示且无投影内容时隐藏宿主元素。
   */
  @HostBinding('class.dui-notification-hidden')
  get hideHost(): boolean {
    return !this.show && !this._hasContent();
  }

  /**
   * Sets the component in its 'noCount' state if [notifications] is a boolean 'true'.
   * Makes the notification tip show without a count.

   * @zh 获取当前no计数（`noCount: string | boolean`）。
   */
  get noCount(): string | boolean {
    return this._notifications === true;
  }

  /**
   * Notification display string when a count is available.
   * Anything over 99 gets set as 99+

   * @zh 获取当前通知Display（`notificationsDisplay: string`）。
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

   * @zh 获取当前显示（`show: boolean`）。
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

   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit(): void {
    if (!this._positionX) {
      this.positionX = this._hasContent() ? NotificationCountPositionX.After : NotificationCountPositionX.Center;
    }
    if (!this._positionY) {
      this.positionY = this._hasContent() ? NotificationCountPositionY.Top : NotificationCountPositionY.Center;
    }
  }


  /**
   * Executes `_hasContent` to handle has content.
   * @zh 执行 `_hasContent`，用于是否包含内容。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private _hasContent(): boolean {
    if (this.content) {
      let contentElement: HTMLElement = this.content.nativeElement;
      return contentElement && (contentElement.children.length > 0 || !!contentElement.textContent.trim());
    }
    return false;
  }

}