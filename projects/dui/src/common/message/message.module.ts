import { Type } from '@angular/core';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import {
  MessageComponent,
  MessageContainerDirective,
} from './message.component';

const DUI_MESSAGE: Type<any>[] = [
  MessageComponent,
  MessageContainerDirective,
];

@NgModule({
  imports: [CommonModule, MatIconModule],
  declarations: [DUI_MESSAGE],
  exports: [DUI_MESSAGE],
})
export class MessageModule {}
