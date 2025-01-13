import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintService } from "./print.service";
import { PrintDirective } from "./print.directive";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PrintDirective],
  exports: [PrintDirective],
  providers: [
    PrintService,
  ],
})
export class PrintModule {
}
