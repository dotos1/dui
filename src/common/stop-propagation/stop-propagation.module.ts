import { NgModule, ModuleWithProviders } from '@angular/core';
import { StopDropPropagationDirective } from './stop-drop-propagation.directive';
import { StopPropagationDirective } from './stop-propagation.directive';

@NgModule({
  imports: [],
  declarations: [StopDropPropagationDirective, StopPropagationDirective],
  exports: [StopDropPropagationDirective, StopPropagationDirective]
})
export class StopPropagationModule {
  static forRoot(): ModuleWithProviders<StopPropagationModule> {
    return {
      ngModule: StopPropagationModule,
      providers: []
    };
  }
}
