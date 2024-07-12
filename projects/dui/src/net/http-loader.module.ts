
import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, ModuleWithProviders, NgModule } from '@angular/core';
import { HttpLoaderComponent } from './components/http-loader.component';
import { PendingRequestsInterceptorProvider } from './services/pending-requests-interceptor.service';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { Dui } from '@dotos/dui/core';

@NgModule({
  declarations: [
    HttpLoaderComponent,
  ],
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
  ],
  exports: [
    HttpLoaderComponent,
  ],
})
export class HttpLoaderModule {
  entryComponents = [MatSpinner];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
  public static forRoot(): ModuleWithProviders<HttpLoaderModule> {
    return {
      ngModule: HttpLoaderModule,
      providers: [
        PendingRequestsInterceptorProvider,
      ],
    };
  }
}
