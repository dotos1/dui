import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { ColorPickerModule } from '@dotos/dui/common/matcolorpicker';

import { ThemeSettingsComponent } from './theme-settings.component';

@NgModule({
  declarations: [ThemeSettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    ColorPickerModule,
  ],
  exports: [ThemeSettingsComponent],
})
export class ThemeSettingsModule {}
