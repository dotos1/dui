import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackdropComponent } from './backdrop.component';

@NgModule({
  imports: [CommonModule],
  declarations: [BackdropComponent],
  exports: [BackdropComponent]
})
export class BackdropModule {
  static forRoot(): ModuleWithProviders<BackdropModule> {
    return {
      ngModule: BackdropModule,
      providers: []
    };
  }
}
