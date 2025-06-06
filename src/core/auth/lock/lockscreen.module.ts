import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClickOutsideModule } from '@dotos/dui/common/clickout'
import { TranslateModule, TranslationService } from '@dotos/dui/translator';
import { LockscreenDialog } from './lockscreen.dialog';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { encrypt } from '@dotos/dui/core/crypt';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
const routes = [
  {
    path: '',
    component: LockscreenDialog
  }
];

@NgModule({
  declarations: [
    LockscreenDialog
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ClickOutsideModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    encrypt
  ],
})

export class LockscreenSaverModule {
  constructor(
    translateService: TranslationService) {
    translateService.addTranslationFolder('dotos/home', 'i18n');
  }
}
