import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { DOTOS_CONFIG } from './config.service';
import { LocalStorageService } from '@dotos/dui/core/storage';

@NgModule()
export class DotosConfigModule {
  constructor(@Optional() @SkipSelf() parentModule: DotosConfigModule) {
    if (parentModule) {
      throw new Error('DotosModule is already loaded. Import it in the AppModule only!');
    }
  }
  static forRoot(config): ModuleWithProviders<DotosConfigModule> {
    return {
      ngModule: DotosConfigModule,
      providers: [
        LocalStorageService,
        {
          provide: 'LOCAL_STORAGE_SERVICE_CONFIG',
          useValue: {
            prefix: 'dotos',
            storageType: 'localStorage'
          }
        },
        {
          provide: DOTOS_CONFIG,
          useValue: config
        }
      ]
    };
  }
}
