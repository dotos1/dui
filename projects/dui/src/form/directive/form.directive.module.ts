import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoTrimDirective } from './auto-trim.directive'

@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  declarations: [
    AutoTrimDirective
  ],
  exports: [
    AutoTrimDirective
  ]
})
export class DuiFormDirectiveModule {

}
