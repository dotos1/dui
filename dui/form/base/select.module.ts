import { NgModule } from '@angular/core';
import { TranslateModule } from '@dotos/dui/translator';
import { SelectOptionsPipe } from './select-options.pipe';

@NgModule({
  imports: [
     TranslateModule,
  ],
  declarations: [SelectOptionsPipe],
  exports: [SelectOptionsPipe],
})
export class SelectPipeModule {


}
