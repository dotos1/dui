

import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';
import { CommonServicesModule } from '@dotos/dui/core/services';
import { ToastrModule } from '@dotos/dui/common/toastr';
import { ClipboardDirective } from './clipboard.directive';
import { ClipboardComponent } from './clipboard.component';
import { ClipboardService } from './clipboard.service';
import { CopyButtonComponent } from './copy-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    ToastrModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    CommonServicesModule,
    TranslateModule
  ],
  providers: [
    ClipboardService
  ],
  declarations: [
    CopyButtonComponent,
    ClipboardDirective,
    ClipboardComponent
  ],
  exports: [
    CopyButtonComponent,
    ClipboardDirective
  ]
})
export class ClipboardModule {
  entryComponents = [ClipboardComponent];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
