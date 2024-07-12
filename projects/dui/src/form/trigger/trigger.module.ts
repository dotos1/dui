import { ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormModule } from '../components/form.module';

import { TriggerField } from './trigger.field';
import { Dui, StyleModule } from '@dotos/dui/core';
import { TreeModule } from '@dotos/dui/tree';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@dotos/dui/i18n';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
     
    OverlayModule,
    MatTooltipModule,
    ReactiveFormsModule,//.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    PortalModule,
    StyleModule,
    MatIconModule,
    A11yModule,
    TreeModule,
    TranslateModule,
    FlexLayoutModule,
    FormModule
  ],
  exports: [
    MatInputModule,
     
    TriggerField,
  ],
  declarations: [
    TriggerField,
  ],
  providers: [],
})
export class TriggerModule {
  entryComponents = [TriggerField];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
