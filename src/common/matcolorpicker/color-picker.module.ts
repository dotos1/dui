import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DuiPipesModule } from '@dotos/dui/util/pipes';

import { ColorPickerComponent } from './color-picker.component';
import { PerfectScrollbarModule } from '@dotos/dui/common/perfect-scroll';
import { TranslateModule } from '@dotos/dui/translator';

@NgModule({
  declarations: [
    ColorPickerComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    PerfectScrollbarModule,
    TranslateModule,
    DuiPipesModule
  ],
  exports: [
    ColorPickerComponent
  ],
})
export class ColorPickerModule {
}
