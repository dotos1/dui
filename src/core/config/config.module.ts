
import { APP_INITIALIZER, Inject, InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfigLoader, ConfigStaticLoader } from './config.loader';
import { ConfigPipe } from './config.pipe';
import { ConfigService } from './config.service';
import { FeatureDirective } from './feature.directive';


export const configFactory = () =>{ 
  return new ConfigStaticLoader()
};

export const initializerFactory = (config: ConfigService) => {
  const res = () => config.init();
  return res;
};

export const CONFIG_FORROOT_GUARD = new InjectionToken('CONFIG_FORROOT_GUARD');

export function provideForRootGuard(config?: ConfigService): any {
  if (config) {
    throw new Error(`ConfigModule.forRoot() called twice. Lazy loaded modules should use ConfigModule.forChild() instead.`);
  }
  return 'guarded';
}
@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  declarations: [ConfigPipe, FeatureDirective],
  exports: [ConfigPipe, FeatureDirective]
})
export class ConfigModule {
  static forRoot(
    configuredProvider: any = {
      provide: ConfigLoader,
      useFactory: configFactory
    }
  ): ModuleWithProviders<ConfigModule> {
    return {
      ngModule: ConfigModule,
      providers: [
        configuredProvider,
        ConfigService,
        {
          provide: APP_INITIALIZER,
          useFactory: initializerFactory,
          deps: [ConfigService],
          multi: true
        },
        {
          provide: CONFIG_FORROOT_GUARD,
          useFactory: provideForRootGuard,
          deps: [[ConfigService, new Optional(), new SkipSelf()]]
        }
      ]
    };
  }
  static forChild(): ModuleWithProviders<ConfigModule> {
    return {
      ngModule: ConfigModule
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(@Optional() @Inject(CONFIG_FORROOT_GUARD) guard: any) {}
}
