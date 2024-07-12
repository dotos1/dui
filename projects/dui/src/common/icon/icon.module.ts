

import { NgModule } from '@angular/core';
import { IconComponent } from './icon.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  declarations: [
    IconComponent
  ],
  exports: [
    IconComponent
  ]
})
export class IconModule { }
