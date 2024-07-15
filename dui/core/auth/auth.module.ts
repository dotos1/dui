import { ModuleWithProviders, NgModule } from '@angular/core';
import { Inject, InjectionToken, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient,  HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { TranslateModule } from '@dotos/dui/i18n';
import { ConfigService } from '@dotos/dui/core/config';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { JwtHelperService } from './jwt-helper.service';
import { AuthenticatedGuard } from './authenticated.guard';
import { RegisterGuard } from './register.guard';
import { AuthLoader } from './auth.loader';
import { AuthStaticLoader } from './auth.loader';
import { AuthBearerInterceptor } from './auth-bearer.interceptor';

export function authFactory(): AuthLoader {
  return new AuthStaticLoader();
}

export const AUTH_FORROOT_GUARD = new InjectionToken('AUTH_FORROOT_GUARD');

export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthBearerInterceptor,
    multi: true
  }
];
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule
  ],
  providers: [
    AuthGuard,
    HttpClient,
    AuthService,
    ConfigService,
    JwtHelperService,
    httpInterceptorProviders,
    RegisterGuard,
    AuthenticatedGuard,
    {
      provide: AuthLoader,
      useFactory: (authFactory)
    },
  ]
})
export class AuthModule {
  static forRoot(configuredProvider: any = {
    provide: AuthLoader,
    useFactory: (authFactory)
  }): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        configuredProvider,
      ]
    };
  }
  static forChild(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(@Optional() @Inject(AUTH_FORROOT_GUARD) guard: any) {
  }
}
