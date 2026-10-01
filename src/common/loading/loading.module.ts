
import { ComponentFactoryResolver, Type } from '@angular/core';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LOADING_PROVIDER } from './services/loading.service';
import { LOADING_FACTORY_PROVIDER } from './services/loading.factory';
import { LoadingDirective } from './directives/loading.directive';
import { LoadingComponent } from './loading.component';
import { Dui } from '@dotos/dui/core';

const TD_LOADING: Type<any>[] = [LoadingComponent, LoadingDirective];
const EXT_LOADING_ENTRY_COMPONENTS: Type<any>[] = [
  LoadingComponent
];
@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    OverlayModule,
    PortalModule,
  ],
  declarations: [TD_LOADING],
  exports: [TD_LOADING],
  providers: [LOADING_FACTORY_PROVIDER, LOADING_PROVIDER],
})
export class LoadingModule {
  entryComponents = EXT_LOADING_ENTRY_COMPONENTS;
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
