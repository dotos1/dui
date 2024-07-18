import { NgModule, ModuleWithProviders } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CollapseDirective } from './collapse.directive';
import { CollapsibleComponent } from './collapsible.component';
import { TranslateModule } from '@dotos/dui/translator';
@NgModule({
  imports: [MatIconModule, MatListModule,TranslateModule],
  declarations: [CollapsibleComponent, CollapseDirective],
  exports: [CollapsibleComponent, CollapseDirective]
})
export class CollapsibleModule {
  static forRoot(): ModuleWithProviders<CollapsibleModule> {
    return {
      ngModule: CollapsibleModule,
      providers: []
    };
  }
}
