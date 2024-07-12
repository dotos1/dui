

import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/i18n';
import { CommonServicesModule } from '@dotos/dui/core/services';
import { ToastrModule } from '@dotos/dui/common/toastr';
import { ClipboardDirective } from './clipboard.directive';
import { ClipboardComponent } from './clipboard.component';
import { ClipboardService } from './clipboard.service';

@NgModule({
  imports: [
    CommonModule,
    ToastrModule,
    CommonServicesModule,
    TranslateModule
  ],
  providers: [
    ClipboardService
  ],
  declarations: [
    ClipboardDirective,
    ClipboardComponent
  ],
  exports: [
    ClipboardDirective
  ]
})
export class ClipboardModule {
  entryComponents = [ClipboardComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
