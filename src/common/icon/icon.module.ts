

import { NgModule } from '@angular/core';
import { IconComponent } from './icon.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { IconPickerService } from './icon-picker.service';
import { FontLoaderService } from './font-loader.service';
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
  ],
  providers: [
    FontLoaderService,
    IconPickerService
  ]
})
export class IconModule { }
