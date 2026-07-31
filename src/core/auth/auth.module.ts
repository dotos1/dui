import { ModuleWithProviders, NgModule } from '@angular/core';
import { Inject, InjectionToken, Optional, SkipSelf } from '@angular/core';
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
        { provide: AUTH_FORROOT_GUARD, useValue: true },
      ]
    };
  }
  static forChild(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule
    };
  }
  constructor(@Optional() @SkipSelf() @Inject(AUTH_FORROOT_GUARD) guard: any) {
    // 该 token 只由 forRoot() 提供。若在父注入器中已能取到，说明 forRoot() 被调用了多次，
    // 会产生互相覆盖的 AuthService/拦截器实例。
    if (guard) {
      throw new Error(
        'AuthModule.forRoot() 只能在根模块调用一次，子模块请改用 AuthModule.forChild()。'
      );
    }
  }
}
