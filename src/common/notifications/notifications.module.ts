/**
 * @fileoverview Module `src/common/notifications/notifications.module.ts` providing notifications module definitions and implementation.
 * @zh 模块文件 `src/common/notifications/notifications.module.ts`，提供通知模块相关的定义与实现。
 */

import { Type } from '@angular/core';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { NotificationCountComponent } from './notification-count.component';

/**
 * Constant/variable `TD_NOTIFICATIONS` defining td notifications in `src/common/notifications`.
 * @zh 常量/变量 `TD_NOTIFICATIONS`，定义 `src/common/notifications` 中的TD通知。
 */
const TD_NOTIFICATIONS = [
  NotificationCountComponent
];

/**
 * Angular module `NotificationsModule` declaring and exporting notifications module components, directives, pipes, and providers.
 * @zh Angular 模块 `NotificationsModule`，声明并导出通知模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TD_NOTIFICATIONS
  ],
  exports: [
    TD_NOTIFICATIONS
  ],
})
export class NotificationsModule {

}
