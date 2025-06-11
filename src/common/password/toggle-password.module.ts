

import { CommonModule } from '@angular/common';
import {  NgModule } from '@angular/core';
import { TranslateModule } from '@dotos/dui/translator';
import { CommonServicesModule } from '@dotos/dui/core/services';
import { ToastrModule } from '@dotos/dui/common/toastr';
import { TogglePasswordComponent } from './toggle-password.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    ToastrModule,
    MatButtonModule,
    CommonServicesModule,
    TranslateModule
  ],
  providers: [
    TogglePasswordComponent
  ],
  declarations: [
    TogglePasswordComponent
  ],
  exports: [
    TogglePasswordComponent
  ]
})
export class TogglePasswordModule {

}
