import { Type } from '@angular/core';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { NotificationCountComponent } from './notification-count.component';

const TD_NOTIFICATIONS: Type<any>[] = [
  NotificationCountComponent
];

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
