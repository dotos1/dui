import { ModuleWithProviders, NgModule } from '@angular/core';
import { Inject, InjectionToken, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient,  HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { TranslateModule } from '@dotos/dui/translator';
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
export const AuthInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthBearerInterceptor,
    multi: true
  }
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  providers: [

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
        AuthGuard,
        HttpClient,
        AuthService,
        ConfigService,
        JwtHelperService,
        RegisterGuard,
        AuthenticatedGuard,
        configuredProvider,
        provideHttpClient(
          withInterceptorsFromDi(),
        ),
        AuthInterceptorProviders,
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
